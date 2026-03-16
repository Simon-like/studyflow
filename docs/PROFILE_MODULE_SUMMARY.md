# 个人信息模块开发总结

> **版本**: 1.1.0  
> **日期**: 2026-03-15  
> **状态**: 前端已完成，待后端对接

## 更新记录

### v1.1.1 (2026-03-15)
- ✅ 修复标签更新后页面不生效的问题（前端mock已支持）
- ✅ Web端个人信息页去除设置入口（个人信息仅管理编辑/展示）
- ✅ 学习目标进度功能搁置（组件已隐藏）

### v1.1.0 (2026-03-15)
- ✅ 新增用户标签系统（考研上岸/数学达人等）
- ✅ 编辑资料支持标签选择（最多3个）
- ✅ 设置页面去除删除账号功能（安全考虑）
- ✅ 通知设置区域锁定，提示"即将推出"
- ✅ 番茄钟设置与主页番茄钟联动
- ✅ 主题设置与应用外观联动

---

## 1. 开发内容概览

本次开发完成了 StudyFlow 双端（Web + Mobile）的个人信息模块，包括：

| 模块 | Web端 | Mobile端 | 状态 |
|------|-------|----------|------|
| 个人资料查看 | ✅ | ✅ | 完成 |
| 个人资料编辑 | ✅ | ✅ | 完成 |
| 头像上传 | ✅ | ✅ | 完成 |
| **用户标签** | ✅ | ✅ | **新增** |
| 番茄钟设置 | ✅ | ✅ | 完成 |
| 主题设置 | ✅ | ✅ | 完成 |
| 修改密码 | ✅ | ✅ | 完成 |
| 通知设置 | 🔒 | 🔒 | 已锁定 |
| ~~账号删除~~ | ❌ | ❌ | 已移除 |

---

## 2. 前端实现清单

### 2.1 API服务层 (`packages/api`)

**新增文件:**
- `src/services/userService.ts` - 用户相关API服务

**更新文件:**
- `src/index.ts` - 导出userService并加入API门面

**提供的API方法:**
```typescript
userService.getProfile()              // 获取用户资料（含标签）
userService.updateProfile(data)       // 更新用户资料（含标签）
userService.uploadAvatar(file)        // 上传头像
userService.getPomodoroSettings()     // 获取番茄钟设置
userService.updatePomodoroSettings()  // 更新番茄钟设置
userService.getSystemSettings()       // 获取系统设置
userService.updateSystemSettings()    // 更新系统设置
userService.getUserStats()            // 获取用户统计
userService.changePassword(data)      // 修改密码
userService.getStudyCalendar()        // 获取学习日历
userService.getPresetTags()           // 获取预设标签列表 [新增]
~~userService.deleteAccount()~~       // ~~删除账号~~ [已禁用]
```

### 2.2 共享类型 (`packages/shared`)

**更新文件:**
- `src/types/index.ts` - 新增用户相关类型
- `src/constants/index.ts` - 更新API端点常量

**新增类型:**
```typescript
UserProfile           // 完整用户资料（含设置、统计、标签）
UserStats             // 用户统计数据
UserTag               // 用户标签 [新增]
UpdateProfileRequest  // 更新资料请求（含tags字段）
PomodoroSettings      // 番茄钟设置
SystemSettings        // 系统设置
ChangePasswordRequest // 修改密码请求
StudyCalendarData     // 学习日历数据
```

### 2.3 Web端 (`apps/web`)

**新增/更新文件:**
- `src/features/profile/components/EditProfileModal.tsx` - 编辑资料弹窗（含标签选择）
- `src/features/profile/components/ProfileHeader.tsx` - 动态标签展示
- `src/pages/Settings.tsx` - 设置页面（联动番茄钟/主题，锁定通知设置）

**更新文件:**
- `src/features/profile/index.tsx` - 整合编辑功能
- `src/features/profile/hooks.ts` - 添加API集成
- `src/features/profile/components/ProfileHeader.tsx` - 添加编辑入口
- `src/features/profile/components/index.ts` - 导出编辑弹窗
- `src/pages/Settings.tsx` - 完整设置页面

**功能特性:**
- 使用 TanStack Query 进行数据获取和缓存
- 使用 Zustand 保持用户状态同步
- 支持头像预览和上传
- 表单验证和错误提示
- 加载状态和骨架屏

### 2.4 Mobile端 (`apps/mobile`)

**新增/更新文件:**
- `src/screens/Profile/EditProfileScreen.tsx` - 编辑资料页面（含标签选择）
- `src/screens/Profile/SettingsScreen.tsx` - 设置页面（锁定通知设置，去除删除账号）
- `src/screens/Profile/components/ProfileHeader.tsx` - 动态标签展示

**更新文件:**
- `src/screens/Profile/index.tsx` - 页面导航状态管理
- `src/screens/Profile/hooks.ts` - 添加API集成
- `src/screens/Profile/components/ProfileHeader.tsx` - 支持动态数据
- `src/screens/Profile/components/StatsCard.tsx` - 支持动态数据
- `src/screens/Profile/components/MenuList.tsx` - 更新菜单项

**功能特性:**
- 页面间导航（主页 -> 编辑/设置）
- React Native 图片选择器预留
- Switch 开关组件
- 底部弹窗交互

---

## 3. 后端开发指导

### 3.1 需要实现的接口

根据 `docs/API_SPEC.md`，需要实现以下 **11个接口**：

| # | 方法 | 路径 | 说明 | 优先级 |
|---|------|------|------|--------|
| 1 | GET | `/api/v1/users/profile` | 获取用户完整资料（含标签） | P0 |
| 2 | PUT | `/api/v1/users/profile` | 更新用户资料（含标签） | P0 |
| 3 | POST | `/api/v1/users/avatar` | 上传头像 | P0 |
| 4 | GET | `/api/v1/users/settings/pomodoro` | 获取番茄钟设置 | P0 |
| 5 | PUT | `/api/v1/users/settings/pomodoro` | 更新番茄钟设置 | P0 |
| 6 | GET | `/api/v1/users/settings/system` | 获取系统设置 | P1 |
| 7 | PUT | `/api/v1/users/settings/system` | 更新系统设置 | P1 |
| 8 | GET | `/api/v1/users/stats` | 获取用户统计 | P0 |
| 9 | PUT | `/api/v1/users/password` | 修改密码 | P1 |
| 10 | GET | `/api/v1/users/calendar` | 学习日历 | P2 |
| ~~11~~ | ~~DELETE~~ | ~~`/api/v1/users/account`~~ | ~~删除账号~~ | ~~已禁用~~ |

### 3.1.1 用户标签接口 [新增]

| 方法 | 路径 | 说明 | 优先级 |
|------|------|------|--------|
| GET | `/api/v1/users/tags/preset` | 获取预设标签列表 | P1 |
| PUT | `/api/v1/users/tags` | 更新用户标签 | P1 |

**预设标签列表:**
```typescript
[
  { id: 'tag_kaoyan', name: '考研上岸', type: 'custom', description: '正在备战考研' },
  { id: 'tag_math', name: '数学达人', type: 'custom', description: '擅长数学学习' },
  { id: 'tag_english', name: '英语学霸', type: 'custom', description: '英语能力出众' },
  { id: 'tag_coder', name: '代码工匠', type: 'custom', description: '热爱编程学习' },
  { id: 'tag_early_bird', name: '早起鸟', type: 'custom', description: '习惯早起学习' },
  { id: 'tag_night_owl', name: '夜猫子', type: 'custom', description: '深夜学习效率更高' },
  { id: 'tag_focus', name: '专注力强', type: 'system', description: '连续专注超过1小时' },
  { id: 'tag_persist', name: '持之以恒', type: 'achievement', description: '连续打卡7天' },
  { id: 'tag_master', name: '学习大师', type: 'achievement', description: '累计学习100小时' },
  { id: 'tag_tomato', name: '番茄达人', type: 'achievement', description: '完成100个番茄钟' },
]
```

**用户标签限制:** 最多选择3个标签

### 3.2 数据库表变更

根据 `docs/DATABASE.md`，需要在 `users` 表新增/调整以下字段：

**新增字段:**
```sql
-- 用户标签表
CREATE TABLE user_tags (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    tag_id VARCHAR(50) NOT NULL,
    tag_name VARCHAR(50) NOT NULL,
    tag_type VARCHAR(20) NOT NULL, -- 'achievement' | 'custom' | 'system'
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tag_id)
);

-- 番茄钟设置
auto_start_break     BOOLEAN DEFAULT false
auto_start_pomodoro  BOOLEAN DEFAULT false
long_break_interval  INT DEFAULT 4

-- 系统设置
sound_enabled        BOOLEAN DEFAULT true
vibration_enabled    BOOLEAN DEFAULT true
language             VARCHAR(10) DEFAULT 'zh-CN'
```

**已有字段确认:**
- `focus_duration` - 默认 1500（25分钟）
- `short_break_duration` - 默认 300（5分钟）
- `long_break_duration` - 默认 900（15分钟）
- `theme` - 默认 'light'
- `notification_enabled` - 默认 true

### 3.3 响应格式规范

所有接口必须遵循统一的响应格式：

```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "timestamp": 1710000000000
}
```

### 3.4 关键实现建议

#### 3.4.1 用户资料接口 (GET /api/v1/users/profile) [更新]

**响应包含标签:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "user-123",
    "username": "studyuser",
    "nickname": "学习达人",
    "avatar": "https://example.com/avatar.jpg",
    "studyGoal": "考研上岸，冲击985！",
    "tags": [
      { "id": "tag_kaoyan", "name": "考研上岸", "type": "custom" },
      { "id": "tag_math", "name": "数学达人", "type": "custom" },
      { "id": "tag_focus", "name": "专注力强", "type": "system" }
    ],
    "focusDuration": 1500,
    "shortBreakDuration": 300,
    "longBreakDuration": 900,
    "theme": "light",
    "notificationEnabled": true,
    "stats": { ... }
  }
}
```

**建议实现方式:**
- 从 JWT Token 获取 userId
- 查询 users 表获取基本信息和设置
- 查询统计表或实时计算统计数据
- 组装成 UserProfile 返回

**统计计算方式（可选）:**
```java
// 方案1：实时计算（简单但性能差）
// 查询 pomodoro_records 和 tasks 表实时统计

// 方案2：预聚合表（推荐）
// 查询 pomodoro_daily_stats 和 user_streaks 表
// 需要配合定时任务或触发器更新统计表
```

#### 3.4.2 头像上传接口 (POST /api/v1/users/avatar)

**建议实现方式:**
1. 接收 multipart/form-data 文件
2. 验证文件类型（jpg, png, gif）和大小（< 5MB）
3. 生成唯一文件名
4. 上传到对象存储（MinIO/阿里云OSS/七牛云）
5. 返回文件的 URL

**文件命名规范:**
```
avatars/{userId}/{timestamp}_{random}.jpg
```

#### 3.4.3 番茄钟设置验证

```java
// 字段验证规则
focusDuration:      60-3600 秒 (1-60分钟)
shortBreakDuration: 60-1800 秒 (1-30分钟)
longBreakDuration:  60-3600 秒 (1-60分钟)
longBreakInterval:  1-10
```

#### 3.4.4 修改密码安全

```java
// 验证流程
1. 验证 currentPassword 是否正确（bcrypt 比对）
2. 验证 newPassword 长度 >= 6
3. 验证 newPassword == confirmPassword
4. 使用 bcrypt 加密 newPassword
5. 更新 password_hash 字段
```

#### 3.4.5 删除账号功能 [已禁用]

**说明**: 出于安全考虑，前端已移除删除账号功能。如用户确需删除账号，请联系客服处理。

前端调用删除账号接口将返回:
```json
{
  "code": 403,
  "message": "账号删除功能已禁用，如需删除账号请联系客服"
}
```

### 3.5 错误码定义

| 错误码 | 场景 |
|--------|------|
| 400 | 参数格式错误、文件格式不支持 |
| 401 | Token 无效或过期 |
| 403 | 无权访问 |
| 413 | 文件过大 |
| 422 | 业务校验失败（密码不一致等） |
| 500 | 服务器内部错误 |

---

## 4. 接口 Mock 数据

在前端开发阶段，可以使用以下 Mock 数据进行测试：

```typescript
// Mock 用户资料
const mockUserProfile = {
  id: "user-123",
  username: "studyuser",
  nickname: "学习达人",
  email: "user@example.com",
  phone: "13800138000",
  avatar: "https://example.com/avatar.jpg",
  studyGoal: "考研上岸，冲击985！",
  tags: [  // 用户标签 [新增]
    { id: "tag_kaoyan", name: "考研上岸", type: "custom", unlockedAt: "2026-01-01T00:00:00Z" },
    { id: "tag_math", name: "数学达人", type: "custom", unlockedAt: "2026-01-01T00:00:00Z" },
    { id: "tag_focus", name: "专注力强", type: "system", unlockedAt: "2026-02-15T10:00:00Z" }
  ],
  focusDuration: 1500,
  shortBreakDuration: 300,
  longBreakDuration: 900,
  autoStartBreak: false,
  autoStartPomodoro: false,
  longBreakInterval: 4,
  theme: "light",
  notificationEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  language: "zh-CN",
  stats: {
    totalFocusMinutes: 3600,
    totalPomodoros: 144,
    totalTasks: 50,
    completedTasks: 42,
    currentStreak: 7,
    longestStreak: 15,
    studyDays: 30,
    todayFocusMinutes: 75,
    todayPomodoros: 3,
    todayTasks: 2
  },
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-03-15T10:00:00Z"
};
```

---

## 5. 前后端对接检查清单

### 5.1 对接前准备

- [ ] 后端完成所有接口开发
- [ ] 后端提供 Swagger/OpenAPI 文档
- [ ] 后端部署到测试环境
- [ ] 数据库表结构同步

### 5.2 对接验证

- [ ] GET /api/v1/users/profile 返回正确格式
- [ ] PUT /api/v1/users/profile 更新成功并同步到资料页
- [ ] POST /api/v1/users/avatar 上传成功并返回URL
- [ ] 番茄钟设置更新后立即生效
- [ ] 主题切换在Web端正确应用
- [ ] 修改密码后旧密码失效
- [ ] 所有接口包含正确的 Authorization Header

### 5.3 切换生产环境

前端切换生产环境只需修改 `packages/api/src/index.ts`：

```typescript
// 开发阶段（使用 Mock）
export const api = createApi(true);

// 生产环境（使用真实 API）
export const api = createApi(false);
```

### 5.4 功能变更说明

#### 用户标签Mock预处理
由于后端尚未配置标签接口，前端已完成mock数据预处理：

**Mock数据位置**: `packages/api/src/mock/services.ts`

```typescript
// 用户标签内存存储（模拟数据库）
let userTags: UserTag[] = [...MOCK_USER_TAGS];

// 获取用户资料时返回标签
getProfile: async () => {
  const profile: UserProfile = {
    ...user,
    tags: userTags,  // 返回当前标签
    // ...其他字段
  };
}

// 更新资料时同步更新标签
updateProfile: async (data) => {
  if (data.tags) {
    userTags = PRESET_TAGS
      .filter(tag => data.tags?.includes(tag.id))
      .map(tag => ({ ...tag, unlockedAt: new Date().toISOString() }));
  }
}
```

**前端缓存更新**: `apps/web/src/features/profile/hooks.ts` & `apps/mobile/src/screens/Profile/hooks.ts`
- 使用 `queryClient.setQueryData` 立即更新本地缓存
- 标签变更后无需刷新页面即可看到效果

#### 学习目标进度功能搁置
- **原因**: 该功能需要额外的任务时间追踪统计，暂缓开发
- **当前状态**: 组件已注释隐藏，代码保留待后续开发
- **影响文件**: 
  - `apps/web/src/features/profile/index.tsx`
  - `apps/mobile/src/screens/Profile/index.tsx`
  - `apps/mobile/src/screens/Profile/components/index.ts`

#### 通知设置锁定
- **原因**: 通知功能需要额外的服务端配置（FCM/APNs推送证书、邮件服务等）
- **状态**: 前端界面已锁定，显示"即将推出"
- **预计上线**: V2.0版本

#### 删除账号功能移除
- **原因**: 账号删除是高风险操作，需要严格的审核流程
- **替代方案**: 用户可联系客服申请删除账号
- **前端状态**: 已移除删除按钮，API返回403错误

#### 个人信息页入口调整
- **Web端**: 个人信息页（`/profile`）仅保留编辑资料功能
  - 移除设置按钮（齿轮图标）
  - 设置功能统一在独立页面（`/settings`）
- **Mobile端**: 个人信息页仅管理资料展示和编辑
  - 移除设置按钮
  - 设置通过菜单列表进入

---

## 6. 附录

### 6.1 相关文档索引

| 文档 | 路径 | 说明 |
|------|------|------|
| API 规范 | `docs/API_SPEC.md` | 详细的接口定义和请求/响应格式 |
| 数据库设计 | `docs/DATABASE.md` | 表结构和字段说明 |
| PRD | `docs/PRD.md` | 产品需求文档 |

### 6.2 前端文件索引

| 平台 | 路径 | 说明 |
|------|------|------|
| API服务 | `packages/api/src/services/userService.ts` | 用户相关API调用 |
| 共享类型 | `packages/shared/src/types/index.ts` | TypeScript类型定义（含UserTag） |
| 共享常量 | `packages/shared/src/constants/index.ts` | 预设标签常量 |
| Web Profile | `apps/web/src/features/profile/` | Web端个人资料模块 |
| Web Settings | `apps/web/src/pages/Settings.tsx` | Web端设置页面（联动、锁定） |
| Mobile Profile | `apps/mobile/src/screens/Profile/` | Mobile端个人资料模块 |
| Mobile Settings | `apps/mobile/src/screens/Profile/SettingsScreen.tsx` | Mobile端设置页面 |

---

*文档结束 - 如有问题请联系前端开发团队*
