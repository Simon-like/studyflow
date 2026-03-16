# StudyFlow 数据同步规范

> **版本**: 1.0.0  
> **日期**: 2026-03-15  
> **适用范围**: Web端、Mobile端

---

## 1. 问题背景

在开发过程中发现各页面间用户数据不同步的问题：
- Dashboard 页面显示的用户名与 Profile 页面不一致
- 用户更新资料后，其他页面未实时同步
- 设置页面与用户信息页面的设置数据不一致

---

## 2. 解决方案

### 2.1 统一数据源

所有页面使用统一的 `useUser` Hook 获取用户数据：

```typescript
// 推荐使用
const { 
  user,           // 完整用户资料
  displayName,    // 显示名称（nickname > username > 默认值）
  avatarUrl,      // 头像URL
  studyGoal,      // 学习目标
  tags,           // 用户标签
  stats,          // 格式化后的统计信息
  rawStats,       // 原始统计数据
  pomodoroSettings,  // 番茄钟设置
  systemSettings,    // 系统设置
  isLoading,      // 加载状态
  refetch,        // 重新获取数据
  syncUser,       // 手动同步用户数据
  logout,         // 退出登录
} = useUser();
```

### 2.2 Query Keys 规范

统一使用以下 Query Keys，确保缓存一致性：

```typescript
// src/hooks/useUser.ts
const USER_KEYS = {
  all: ['user'] as const,
  profile: () => [...USER_KEYS.all, 'profile'] as const,
};
```

### 2.3 数据更新流程

当用户更新资料时，必须同时更新：

1. **API 调用** - 更新后端数据
2. **QueryClient 缓存** - 更新 TanStack Query 缓存
3. **AuthStore** - 更新全局状态

```typescript
// 示例：更新用户资料
const updateProfile = useMutation({
  mutationFn: async (data: UpdateProfileRequest) => {
    const response = await api.user.updateProfile(data);
    return response.data;
  },
  onSuccess: (data, variables) => {
    // 1. 更新 QueryClient 缓存
    queryClient.setQueryData(USER_KEYS.profile(), (old: UserProfile | undefined) => {
      if (!old) return old;
      return { ...old, ...data };
    });
    
    // 2. 更新 AuthStore
    setUser(data);
    
    toast.success('资料更新成功');
  },
});
```

---

## 3. 各模块数据同步要求

### 3.1 用户资料模块

| 页面/组件 | 数据源 | 关键字段 |
|-----------|--------|----------|
| Profile 页面 | `useUser()` | displayName, avatarUrl, studyGoal, tags, stats |
| EditProfile 页面 | `useUser()` | user (完整资料) |
| Dashboard Header | `useUser()` | displayName, avatarUrl |
| MainLayout Sidebar | `useUser()` | displayName, avatarUrl |

### 3.2 设置模块

设置分为两部分存储：

1. **独立设置接口** (`/api/v1/users/settings/*`)
   - 番茄钟设置
   - 系统设置

2. **完整用户资料** (`/api/v1/users/profile`)
   - 包含所有设置信息

**同步要求**：
- 更新设置时，必须同时使 `USER_KEYS.profile()` 缓存失效
- 设置页面加载时，优先使用 `useUser()` 返回的设置数据

```typescript
// 更新设置示例
const updateSettings = useMutation({
  mutationFn: updatePomodoroSettings,
  onSuccess: () => {
    // 使设置缓存失效
    queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.pomodoro });
    // 同时使用户资料缓存失效，保持数据一致性
    queryClient.invalidateQueries({ queryKey: USER_KEYS.profile() });
  },
});
```

### 3.3 Dashboard 模块

Dashboard 统计数据应独立于用户资料：

```typescript
// Dashboard 专用 Query Keys
const DASHBOARD_KEYS = {
  stats: ['dashboard', 'stats'] as const,
  tasks: ['dashboard', 'tasks'] as const,
};
```

Dashboard 只从 `useUser()` 获取 `displayName` 和 `avatarUrl`。

---

## 4. 后端接口要求

### 4.1 获取完整用户资料

```http
GET /api/v1/users/profile
```

**必须返回的字段**：
```typescript
interface UserProfile {
  id: string;
  username: string;
  nickname?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  studyGoal?: string;
  tags?: UserTag[];
  
  // 番茄钟设置
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreak: boolean;
  autoStartPomodoro: boolean;
  longBreakInterval: number;
  
  // 系统设置
  theme: 'light' | 'dark' | 'system';
  notificationEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  language: string;
  
  // 统计数据
  stats: UserStats;
}
```

### 4.2 更新用户资料

```http
PUT /api/v1/users/profile
```

**要求**：
- 返回更新后的完整用户资料（或至少包含 nickname, avatar, studyGoal, email, phone）
- 更新 `updatedAt` 字段

### 4.3 更新设置接口

```http
PUT /api/v1/users/settings/pomodoro
PUT /api/v1/users/settings/system
```

**要求**：
- 返回更新后的设置数据
- 同时更新用户资料中的对应字段（因为 `getProfile` 需要返回完整数据）

---

## 5. 移动端数据同步规范

移动端遵循与 Web 端相同的数据同步规范，确保跨平台数据一致性。

### 5.1 已修复的问题

**问题**：Home 页面显示的用户名（"应东林"）与 Profile 页面（"学习达人"）不一致。

**原因**：Home 页面的 WelcomeHeader 组件使用了硬编码的默认用户数据。

**解决方案**：
1. 创建统一的 `useUser` Hook (`apps/mobile/src/hooks/useUser.ts`)
2. WelcomeHeader 组件使用 `useUser()` 获取真实用户数据
3. Profile 页面使用相同的 Query Keys 进行缓存管理

### 5.2 Mobile 端统一数据源

```typescript
// apps/mobile/src/hooks/useUser.ts
export const USER_KEYS = {
  all: ['user'] as const,
  profile: () => [...USER_KEYS.all, 'profile'] as const,
  stats: () => [...USER_KEYS.all, 'stats'] as const,
};

export function useUser() {
  const { data: profile, isLoading, error } = useUserProfile();
  
  // 计算属性（与 Web 端保持一致）
  const displayName = profile?.nickname || profile?.username || '学习者';
  const avatarUrl = profile?.avatar;
  const studyGoal = profile?.studyGoal || '暂无学习目标';
  
  return {
    user: profile,
    isLoading,
    error,
    displayName,
    avatarUrl,
    studyGoal,
    tags: profile?.tags,
    stats: profile?.stats,
    pomodoroSettings: profile ? { /* ... */ } : null,
    systemSettings: profile ? { /* ... */ } : null,
    refetch,
    updateProfile,
    isUpdating,
  };
}
```

### 5.3 各页面使用方式

| 页面/组件 | 使用的 Hook | 数据源 |
|-----------|-------------|--------|
| WelcomeHeader | `useUser()` | `displayName`, `avatarUrl` |
| Profile 页面 | `useProfileData()` | `USER_KEYS.profile()` |
| EditProfile | `useProfileData()` | `USER_KEYS.profile()` |
| Settings | `usePomodoroSettings()`, `useSystemSettings()` | 独立 Query Keys |

### 5.4 设置更新后的同步

```typescript
// apps/mobile/src/screens/Profile/hooks.ts
export function usePomodoroSettings() {
  const mutation = useMutation({
    mutationFn: async (settings: PomodoroSettings) => {
      const response = await api.user.updatePomodoroSettings(settings);
      return response.data;
    },
    onSuccess: () => {
      // 使设置缓存失效
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.pomodoro });
      
      // 同时使统一的 user profile 缓存失效，保持数据一致性
      queryClient.invalidateQueries({ queryKey: USER_KEYS.profile() });
    },
  });
}
```

### 5.5 已解决的典型问题

#### 问题：保存信息后切换 tab 数据回退

**现象**：在 EditProfile 页面修改昵称后保存，返回 Profile 页面显示正确，但切换到 Home 页面又显示旧昵称。

**原因**：
1. `useUserProfile` 设置了 `refetchOnMount: 'always'`，每次组件挂载都强制重新获取数据
2. 这导致切换 tab 时缓存被 API 返回的数据覆盖

**解决方案**：
```typescript
// 移除 refetchOnMount: 'always'，使用默认行为
export function useUserProfile() {
  return useQuery({
    queryKey: USER_KEYS.profile(),
    queryFn: async () => {
      const response = await api.user.getProfile();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    // 不设置 refetchOnMount，缓存数据优先
  });
}
```

**教训**：
- 不要盲目设置 `refetchOnMount: 'always'`，这会破坏缓存更新机制
- 使用 `setQueryData` 更新缓存后，应该让缓存优先于重新获取

### 5.6 Mobile 端检查清单

- [ ] 所有页面使用统一的 `USER_KEYS` 进行缓存管理
- [ ] 更新用户资料时同时更新 `USER_KEYS.profile()` 缓存
- [ ] 更新设置时同时使 `USER_KEYS.profile()` 缓存失效
- [ ] Home 页面和 Profile 页面显示的用户信息一致
- [ ] 更新资料后各页面实时同步（无需手动刷新）
- [ ] 切换 tab 后数据保持一致，不会回退

---

## 6. 开发检查清单

新增页面或功能时，请检查：

- [ ] 是否使用 `useUser()` 获取用户信息？
- [ ] 更新用户数据时是否同时更新了 QueryClient 缓存？
- [ ] 更新用户数据时是否同时更新了 AuthStore？
- [ ] 设置更新时是否使 `USER_KEYS.profile()` 缓存失效？
- [ ] 是否正确处理了加载状态？

---

## 7. 常见问题

### Q1: 为什么 Dashboard 和 Profile 显示的用户名不一致？

**原因**：两个页面使用了不同的数据源。

**解决**：统一使用 `useUser()` Hook。

### Q2: 更新资料后其他页面没有同步？

**原因**：只更新了 API，没有更新本地缓存。

**解决**：确保 `onSuccess` 中调用：
```typescript
queryClient.setQueryData(USER_KEYS.profile(), ...);
setUser(data);
```

### Q3: 设置页面的数据和用户资料不一致？

**原因**：设置使用独立的 Query Keys，更新时未使 Profile 缓存失效。

**解决**：更新设置时同时调用：
```typescript
queryClient.invalidateQueries({ queryKey: USER_KEYS.profile() });
```
