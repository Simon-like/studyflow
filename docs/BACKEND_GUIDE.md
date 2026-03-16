# StudyFlow 后端开发指南

> **版本**: 1.0.0  
> **日期**: 2026-03-15  
> **适用**: 后端开发人员

---

## 1. 数据一致性要求

### 1.1 用户资料与设置的关系

系统中用户数据有两层：

1. **基础用户表** (`users`)
   - id, username, password, email, phone, avatar, nickname, study_goal
   
2. **用户设置表** (`user_settings`)
   - focus_duration, short_break_duration, theme, notification_enabled 等

**关键要求**：`GET /api/v1/users/profile` 必须返回完整数据，包括：
- 基础用户信息
- 番茄钟设置
- 系统设置
- 统计数据

### 1.2 设置更新后的数据同步

当用户通过以下接口更新设置时：
- `PUT /api/v1/users/settings/pomodoro`
- `PUT /api/v1/users/settings/system`

**后端必须**：
1. 更新对应的设置表
2. 同时更新 `users` 表的 `updated_at` 字段
3. 确保 `GET /api/v1/users/profile` 返回的数据包含最新设置

**示例**：
```java
// 伪代码
@Transactional
public PomodoroSettings updatePomodoroSettings(Long userId, PomodoroSettings settings) {
    // 1. 更新设置表
    settingsRepository.save(userId, settings);
    
    // 2. 更新用户表的 updated_at
    userRepository.touch(userId);
    
    return settings;
}
```

---

## 2. API 响应规范

### 2.1 更新操作的响应

**用户资料更新** (`PUT /api/v1/users/profile`)：
- 必须返回更新后的完整用户资料
- 必须包含：id, username, nickname, avatar, studyGoal, email, phone, updatedAt

**设置更新** (`PUT /api/v1/users/settings/*`)：
- 返回更新后的设置数据
- 确保与 `GET /api/v1/users/profile` 中的对应字段一致

### 2.2 统计数据

`GET /api/v1/users/profile` 返回的 `stats` 字段必须包含：

```json
{
  "stats": {
    "totalFocusMinutes": 1200,    // 累计专注分钟数
    "totalPomodoros": 48,         // 累计番茄数
    "totalTasks": 25,             // 总任务数
    "completedTasks": 20,         // 已完成任务数
    "currentStreak": 7,           // 当前连续天数
    "longestStreak": 15,          // 最长连续天数
    "studyDays": 30,              // 有学习记录的天数
    "todayFocusMinutes": 75,      // 今日专注分钟数
    "todayPomodoros": 3,          // 今日番茄数
    "todayTasks": 1               // 今日完成任务数
  }
}
```

---

## 3. 数据库设计建议

### 3.1 用户表结构（扁平化设计）

**重要**：采用扁平化设计，所有用户设置直接存储在 `users` 表中，不单独拆分 `user_settings` 表。
这样可以：
1. 避免 JOIN 查询，提高 `GET /api/v1/users/profile` 接口性能
2. 简化数据一致性维护
3. 方便缓存用户完整资料

```sql
CREATE TABLE users (
    id                  VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 登录凭证
    username            VARCHAR(50) NOT NULL UNIQUE,
    email               VARCHAR(100) UNIQUE,
    phone               VARCHAR(20) UNIQUE,
    password_hash       VARCHAR(255) NOT NULL,
    
    -- 个人资料
    nickname            VARCHAR(50),
    avatar_url          VARCHAR(500),
    study_goal          VARCHAR(200),
    
    -- 番茄钟设置（直接在用户表中）
    focus_duration      INT DEFAULT 1500,       -- 专注时长，默认25分钟
    short_break_duration INT DEFAULT 300,       -- 短休息时长，默认5分钟
    long_break_duration INT DEFAULT 900,        -- 长休息时长，默认15分钟
    auto_start_break    BOOLEAN DEFAULT false,
    auto_start_pomodoro BOOLEAN DEFAULT false,
    long_break_interval INT DEFAULT 4,
    
    -- 系统设置（直接在用户表中）
    theme               VARCHAR(20) DEFAULT 'light',
    notification_enabled BOOLEAN DEFAULT true,
    sound_enabled       BOOLEAN DEFAULT true,
    vibration_enabled   BOOLEAN DEFAULT true,
    language            VARCHAR(10) DEFAULT 'zh-CN',
    
    -- 时间戳
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP WITH TIME ZONE  -- 软删除
);

-- 索引
CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL AND email IS NOT NULL;
```

### 3.2 为什么不拆分 user_settings 表？

| 方案 | 优点 | 缺点 |
|------|------|------|
| **扁平化（推荐）** | 查询简单、性能好、易缓存 | 表字段较多 |
| **拆分表** | 表结构清晰 | 需要JOIN、一致性维护复杂 |

考虑到 `users/profile` 接口需要频繁查询完整用户资料（包含设置），扁平化设计更合适。

### 3.3 触发器（可选）

如果无法通过应用层保证数据一致性，可以使用数据库触发器：

```sql
-- 当设置更新时，自动更新 users 表的 updated_at
DELIMITER $$
CREATE TRIGGER update_user_timestamp 
AFTER UPDATE ON user_settings
FOR EACH ROW
BEGIN
    UPDATE users SET updated_at = NOW() WHERE id = NEW.user_id;
END$$
DELIMITER ;
```

---

## 4. 缓存策略

### 4.1 用户资料缓存

建议使用 Redis 缓存用户资料：

```
Key: user:profile:{userId}
TTL: 300 seconds (5分钟)
```

**缓存失效时机**：
- 用户更新资料时
- 用户更新设置时
- 统计数据更新时（可以延迟失效）

### 4.2 统计数据

统计数据可以独立缓存：

```
Key: user:stats:{userId}
TTL: 60 seconds (1分钟)
```

---

## 5. 前端查询说明

### 5.1 Web 端 Query Keys

```typescript
// 用户资料（统一数据源）
['user', 'profile']

// Dashboard 统计（独立）
['dashboard', 'stats']
['dashboard', 'tasks']

// 设置（独立但需同步到用户资料）
['settings', 'pomodoro']
['settings', 'system']
```

### 5.2 Mobile 端 Query Keys

Mobile 端使用与 Web 端一致的 Query Keys 规范：

```typescript
// 统一的用户资料 Query Keys（位于 apps/mobile/src/hooks/useUser.ts）
export const USER_KEYS = {
  all: ['user'] as const,
  profile: () => [...USER_KEYS.all, 'profile'] as const,
  stats: () => [...USER_KEYS.all, 'stats'] as const,
};

// 设置相关的独立 Query Keys
const SETTINGS_KEYS = {
  pomodoro: ['settings', 'pomodoro'] as const,
  system: ['settings', 'system'] as const,
};
```

**Mobile 端数据流**：
1. **Home 页面**（番茄钟）：使用 `useUser()` Hook 获取 `displayName` 和 `avatarUrl`
2. **Profile 页面**：使用 `useUserProfile()` Hook（内部使用 `USER_KEYS.profile()`）
3. **设置页面**：使用独立的 `SETTINGS_KEYS`，但更新时使 `USER_KEYS.profile()` 缓存失效

### 5.3 后端需要确保

1. **用户资料接口** (`GET /api/v1/users/profile`) 返回的数据包含所有设置
2. **设置更新后**，用户资料缓存应失效（通过使 `USER_KEYS.profile()` 缓存失效实现）
3. **更新用户资料** (`PUT /api/v1/users/profile`) 返回完整更新后的用户资料

---

## 6. Mobile 端数据同步特别说明

### 6.1 问题背景

Mobile 端曾出现以下数据不同步问题：
- Home 页面显示的用户名（硬编码"应东林"）与 Profile 页面（API返回"学习达人"）不一致
- 用户更新资料后，其他页面未实时同步

### 6.2 解决方案

**统一数据源**：Mobile 端创建了与 Web 端一致的 `useUser` Hook：

```typescript
// apps/mobile/src/hooks/useUser.ts
export function useUser() {
  const { data: profile, isLoading, error } = useUserProfile();
  
  // 计算属性
  const displayName = profile?.nickname || profile?.username || '学习者';
  const avatarUrl = profile?.avatar;
  const studyGoal = profile?.studyGoal || '暂无学习目标';
  
  return {
    user: profile,
    displayName,
    avatarUrl,
    studyGoal,
    // ...
  };
}
```

**所有页面统一使用**：
- **Home/WelcomeHeader**: `const { displayName, avatarUrl } = useUser();`
- **Profile 页面**: `const { profile, displayName } = useProfileData();`（内部使用 `useUserProfile`）
- **设置页面**: 更新设置时使 `USER_KEYS.profile()` 缓存失效

### 6.3 后端接口要求

**必须确保**：

1. **`GET /api/v1/users/profile`** 返回的字段完整：
```typescript
interface UserProfile {
  id: string;
  username: string;
  nickname?: string;
  avatar?: string;
  studyGoal?: string;
  email?: string;
  phone?: string;
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

2. **设置更新接口** 必须更新 `users` 表的 `updated_at` 字段：
```typescript
// PUT /api/v1/users/settings/pomodoro
// PUT /api/v1/users/settings/system
// 响应中包含 updatedAt 字段，确保前端知道数据已更新
```

## 7. 测试检查清单

开发完成后，请验证：

### 7.1 Web 端验证
- [ ] 更新用户资料后，`GET /api/v1/users/profile` 返回最新数据
- [ ] 更新番茄钟设置后，用户资料接口也返回最新设置
- [ ] 更新系统设置后，用户资料接口也返回最新设置
- [ ] 统计数据计算正确
- [ ] 并发更新时数据一致性正确（使用事务）

### 7.2 Mobile 端验证
- [ ] Home 页面 WelcomeHeader 显示的用户名与 Profile 页面一致
- [ ] 更新昵称后，Home 页面立即显示新昵称（无需刷新）
- [ ] 更新头像后，Home 页面和 Profile 页面同时更新
- [ ] 更新番茄钟/系统设置后，Profile 页面的设置数据同步更新
- [ ] 离线后重新上线，数据自动同步
