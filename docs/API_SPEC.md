# StudyFlow API 接口规范

> **版本**: 3.0.0  
> **日期**: 2026-03-15  
> **基础路径**: `/api/v1`  
> **协议**: REST + JSON  

---

## 1. 通用规范

### 1.1 请求格式

- **Content-Type**: `application/json`
- **编码**: UTF-8
- **时间格式**: ISO 8601 (`2026-03-15T10:30:00Z`)
- **日期格式**: `YYYY-MM-DD`

### 1.2 响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1710000000000
}
```

### 1.3 状态码

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 200 | 成功 | 请求处理成功 |
| 400 | 请求参数错误 | 参数校验失败 |
| 401 | 未授权 | Token缺失或无效 |
| 403 | 禁止访问 | 无权限访问该资源 |
| 404 | 资源不存在 | 任务/记录不存在 |
| 409 | 冲突 | 业务逻辑冲突（如已有进行中的番茄钟） |
| 422 | 业务校验失败 | 业务规则不满足 |
| 429 | 请求过于频繁 | 限流触发 |
| 500 | 服务器错误 | 服务器内部错误 |

### 1.4 认证方式

使用 JWT Token，在请求头中携带：

```
Authorization: Bearer <access_token>
```

---

## 2. 认证模块

### 2.1 用户注册

```http
POST /auth/register
```

**请求体:**
```json
{
  "username": "string",      // 必填，3-50字符
  "password": "string",      // 必填，6-100字符
  "nickname": "string",      // 可选
  "email": "string",         // 可选，邮箱格式
  "phone": "string"          // 可选
}
```

**响应:**
```json
{
  "code": 200,
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "expiresIn": 7200,
    "user": {
      "id": "string",
      "username": "string",
      "nickname": "string",
      "avatar": "string"
    }
  }
}
```

### 2.2 用户登录

```http
POST /auth/login
```

**请求体:**
```json
{
  "username": "string",      // 用户名/邮箱/手机号
  "password": "string"
}
```

### 2.3 刷新Token

```http
POST /auth/refresh
```

**请求体:**
```json
{
  "refreshToken": "string"
}
```

### 2.4 用户登出

```http
POST /auth/logout
Authorization: Bearer <token>
```

### 2.5 获取当前用户

```http
GET /auth/me
Authorization: Bearer <token>
```

---

## 3. 用户模块 (User)

### 3.1 获取用户完整资料

获取当前登录用户的完整资料，包括个人信息、设置和统计数据。

```http
GET /api/v1/users/profile
Authorization: Bearer <token>
```

**响应:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "string",
    "username": "string",
    "nickname": "string",
    "email": "string",
    "phone": "string",
    "avatar": "string",
    "studyGoal": "string",
    "focusDuration": 1500,
    "shortBreakDuration": 300,
    "longBreakDuration": 900,
    "theme": "light",
    "notificationEnabled": true,
    "soundEnabled": true,
    "vibrationEnabled": true,
    "language": "zh-CN",
    "createdAt": "2026-03-15T10:00:00Z",
    "updatedAt": "2026-03-15T10:00:00Z",
    "stats": {
      "totalFocusMinutes": 1200,
      "totalPomodoros": 48,
      "totalTasks": 25,
      "completedTasks": 20,
      "currentStreak": 7,
      "longestStreak": 15,
      "studyDays": 30,
      "todayFocusMinutes": 75,
      "todayPomodoros": 3,
      "todayTasks": 1
    }
  },
  "timestamp": 1710000000000
}
```

### 3.2 更新用户资料

更新用户的基本信息资料。

```http
PUT /api/v1/users/profile
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体:**
```json
{
  "nickname": "string",          // 昵称，可选，1-50字符
  "avatar": "string",            // 头像URL，可选
  "studyGoal": "string",         // 学习目标，可选，0-200字符
  "email": "string",             // 邮箱，可选，需符合邮箱格式
  "phone": "string"              // 手机号，可选
}
```

**响应:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "string",
    "username": "string",
    "nickname": "string",
    "avatar": "string",
    "studyGoal": "string",
    "email": "string",
    "phone": "string",
    "updatedAt": "2026-03-15T10:00:00Z"
  },
  "timestamp": 1710000000000
}
```

**重要说明:**
- 响应应返回更新后的完整用户资料（或至少包含所有可能被前端使用的字段）
- 前端会使用返回的数据更新全局状态，确保各页面数据同步
- 同时更新 `updatedAt` 字段

### 3.3 上传头像

上传用户头像，支持 JPG、PNG 格式，最大 5MB。

```http
POST /api/v1/users/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**请求体:**
```
------WebKitFormBoundary
Content-Disposition: form-data; name="avatar"; filename="avatar.jpg"
Content-Type: image/jpeg

[二进制文件数据]
------WebKitFormBoundary--
```

**响应:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "avatarUrl": "https://cdn.example.com/avatars/user-123.jpg"
  },
  "timestamp": 1710000000000
}
```

**错误码:**
- `400`: 文件格式不支持或文件过大
- `413`: 文件超过5MB限制

### 3.4 获取番茄钟设置

```http
GET /api/v1/users/settings/pomodoro
Authorization: Bearer <token>
```

**响应:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "focusDuration": 1500,           // 专注时长（秒）
    "shortBreakDuration": 300,       // 短休息时长（秒）
    "longBreakDuration": 900,        // 长休息时长（秒）
    "autoStartBreak": false,         // 是否自动开始休息
    "autoStartPomodoro": false,      // 是否自动开始下一个番茄
    "longBreakInterval": 4           // 几个番茄后长休息
  },
  "timestamp": 1710000000000
}
```

### 3.5 更新番茄钟设置

```http
PUT /api/v1/users/settings/pomodoro
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体:**
```json
{
  "focusDuration": 1500,           // 必填，秒，范围：60-3600
  "shortBreakDuration": 300,       // 必填，秒，范围：60-1800
  "longBreakDuration": 900,        // 必填，秒，范围：60-3600
  "autoStartBreak": false,         // 可选，默认false
  "autoStartPomodoro": false,      // 可选，默认false
  "longBreakInterval": 4           // 可选，默认4，范围：1-10
}
```

**字段验证规则:**
| 字段 | 类型 | 必填 | 范围 | 说明 |
|------|------|------|------|------|
| focusDuration | integer | 是 | 60-3600 | 专注时长（秒） |
| shortBreakDuration | integer | 是 | 60-1800 | 短休息时长（秒） |
| longBreakDuration | integer | 是 | 60-3600 | 长休息时长（秒） |
| autoStartBreak | boolean | 否 | - | 是否自动开始休息 |
| autoStartPomodoro | boolean | 否 | - | 是否自动开始下一个番茄 |
| longBreakInterval | integer | 否 | 1-10 | 几个番茄后长休息 |

**数据同步说明:**
- 后端更新设置后，应同时更新 `users/profile` 接口返回的数据（因为该接口也包含设置信息）
- 前端会在更新成功后同时使设置缓存和用户资料缓存失效

### 3.6 获取系统设置

```http
GET /api/v1/users/settings/system
Authorization: Bearer <token>
```

**响应:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "theme": "light",                // light | dark | system
    "notificationEnabled": true,     // 通知开关
    "soundEnabled": true,            // 提示音开关
    "vibrationEnabled": true,        // 震动开关
    "language": "zh-CN"              // 语言代码
  },
  "timestamp": 1710000000000
}
```

### 3.7 更新系统设置

```http
PUT /api/v1/users/settings/system
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体:**
```json
{
  "theme": "light",                // 可选，light | dark | system
  "notificationEnabled": true,     // 可选
  "soundEnabled": true,            // 可选
  "vibrationEnabled": true,        // 可选
  "language": "zh-CN"              // 可选，语言代码
}
```

**数据同步说明:**
- 后端更新设置后，应同时更新 `users/profile` 接口返回的数据
- 前端会在更新成功后同时使设置缓存和用户资料缓存失效

### 3.8 获取用户统计数据

获取用户的累计统计数据。

```http
GET /api/v1/users/stats
Authorization: Bearer <token>
```

**响应:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "totalFocusMinutes": 1200,       // 累计专注分钟
    "totalPomodoros": 48,            // 累计番茄数
    "totalTasks": 25,                // 累计任务数
    "completedTasks": 20,            // 已完成任务数
    "currentStreak": 7,              // 当前连续天数
    "longestStreak": 15,             // 最长连续天数
    "studyDays": 30,                 // 有学习记录的天数
    "todayFocusMinutes": 75,         // 今日专注分钟
    "todayPomodoros": 3,             // 今日完成番茄数
    "todayTasks": 1                  // 今日完成任务数
  },
  "timestamp": 1710000000000
}
```

### 3.9 修改密码

```http
PUT /api/v1/users/password
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体:**
```json
{
  "currentPassword": "string",     // 必填，当前密码
  "newPassword": "string",         // 必填，新密码，6-100字符
  "confirmPassword": "string"      // 必填，确认新密码，需与newPassword一致
}
```

**响应:**
```json
{
  "code": 200,
  "message": "success",
  "data": null,
  "timestamp": 1710000000000
}
```

**错误码:**
- `400`: 密码格式不符合要求
- `401`: 当前密码错误
- `422`: 两次输入的新密码不一致

### 3.10 获取学习日历

获取指定日期范围内的学习日历数据，用于展示学习热力图。

```http
GET /api/v1/users/calendar?startDate=2026-03-01&endDate=2026-03-31
Authorization: Bearer <token>
```

**查询参数:**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| startDate | string | 是 | 开始日期，格式：YYYY-MM-DD |
| endDate | string | 是 | 结束日期，格式：YYYY-MM-DD |

**响应:**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "date": "2026-03-01",
      "focusMinutes": 75,
      "pomodoros": 3,
      "tasks": 2,
      "hasStudy": true
    },
    {
      "date": "2026-03-02",
      "focusMinutes": 0,
      "pomodoros": 0,
      "tasks": 0,
      "hasStudy": false
    }
  ],
  "timestamp": 1710000000000
}
```

### 3.11 删除账号

⚠️ **危险操作**：删除账号将永久删除所有数据，不可恢复。

```http
DELETE /api/v1/users/account
Authorization: Bearer <token>
```

**响应:**
```json
{
  "code": 200,
  "message": "success",
  "data": null,
  "timestamp": 1710000000000
}
```

**注意:**
- 删除后Token立即失效
- 数据保留30天后物理删除
- 期间可联系客服恢复

### 3.12 用户资料接口重要说明

#### 数据一致性要求

`GET /api/v1/users/profile` **必须返回完整用户资料**，包含：
- 基础用户信息（id, username, nickname, email, phone, avatar, studyGoal）
- 番茄钟设置（focusDuration, shortBreakDuration, longBreakDuration, autoStartBreak, autoStartPomodoro, longBreakInterval）
- 系统设置（theme, notificationEnabled, soundEnabled, vibrationEnabled, language）
- 统计数据（stats 对象）

#### 设置更新后的同步

当用户通过以下接口更新设置时：
- `PUT /api/v1/users/settings/pomodoro`
- `PUT /api/v1/users/settings/system`

后端必须：
1. 更新 `users` 表中的对应字段
2. 同时更新 `users` 表的 `updated_at` 字段
3. 确保 `GET /api/v1/users/profile` 返回的数据包含最新设置

#### 数据库设计说明

用户表采用**扁平化设计**，所有设置字段直接存储在 `users` 表中，不单独拆分 `user_settings` 表。这样可以：
- 避免 JOIN 查询，提高性能
- 简化数据一致性维护
- 方便缓存用户完整资料

详见 `docs/DATABASE.md` 中的 `users` 表定义。

---

## 4. 任务模块

### 4.1 获取任务列表

```http
GET /tasks?page=1&size=20&status=todo&priority=high&keyword=math
Authorization: Bearer <token>
```

**查询参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| page | int | 页码，默认1 |
| size | int | 每页数量，默认20 |
| status | string | 状态筛选 |
| priority | string | 优先级筛选 |
| keyword | string | 关键词搜索 |

**响应:**
```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "category": "string",
        "priority": "high",
        "status": "todo",
        "dueDate": "2026-03-15",
        "order": 0,
        "isToday": true,
        "createdAt": "2026-03-15T10:00:00Z",
        "updatedAt": "2026-03-15T10:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "size": 20,
    "totalPages": 5
  }
}
```

### 4.2 获取今日任务

```http
GET /tasks/today
Authorization: Bearer <token>
```

**说明:** 返回今日需要关注的任务（未完成的 + 今天刚完成的）

### 4.3 获取任务详情

```http
GET /tasks/{id}
Authorization: Bearer <token>
```

### 4.4 创建任务

```http
POST /tasks
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "title": "string",             // 必填，最大200字符
  "description": "string",
  "category": "string",
  "priority": "medium",          // low | medium | high
  "dueDate": "2026-03-15",
  "parentId": "string"
}
```

### 4.5 更新任务

```http
PUT /tasks/{id}
Authorization: Bearer <token>
```

**请求体:** (所有字段可选)
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "priority": "medium",
  "status": "todo",
  "dueDate": "2026-03-15"
}
```

### 4.6 删除任务

```http
DELETE /tasks/{id}
Authorization: Bearer <token>
```

### 4.7 切换任务状态

```http
PATCH /tasks/{id}/toggle
Authorization: Bearer <token>
```

**说明:** 在 todo/in_progress 和 completed 之间切换

**响应:** 返回更新后的完整任务对象

### 4.8 开始任务

```http
POST /tasks/{id}/start
Authorization: Bearer <token>
```

**说明:** 将任务状态设为 in_progress，同时确保只有一个任务进行中

### 4.9 批量更新任务排序

```http
POST /tasks/reorder
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "taskOrders": [
    { "id": "task-1", "order": 0 },
    { "id": "task-2", "order": 1 }
  ]
}
```

### 4.10 获取任务进度统计

```http
GET /tasks/progress?period=week
Authorization: Bearer <token>
```

**查询参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| period | string | today/week/month/year |

**响应:**
```json
{
  "code": 200,
  "data": {
    "total": 12,
    "completed": 8,
    "inProgress": 3,
    "todo": 1,
    "completionRate": 66.7,
    "byCategory": [
      { "category": "高等数学", "total": 4, "completed": 3 }
    ]
  }
}
```

---

## 5. 番茄钟模块

### 5.1 开始番茄钟

```http
POST /pomodoros/start
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "taskId": "string",            // 可选，自由模式下不传
  "duration": 1500,              // 必填，秒
  "isLocked": false              // 是否锁屏模式
}
```

**响应:**
```json
{
  "code": 200,
  "data": {
    "id": "string",
    "userId": "string",
    "taskId": "string",
    "startTime": "2026-03-15T10:00:00Z",
    "plannedDuration": 1500,
    "status": "running",
    "isLocked": false
  }
}
```

### 5.2 停止番茄钟

```http
POST /pomodoros/{id}/stop
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "status": "completed",         // completed | stopped
  "abandonReason": "string"      // 放弃时可选
}
```

**响应:** (结算摘要)
```json
{
  "code": 200,
  "data": {
    "record": {
      "id": "string",
      "status": "completed",
      "actualDuration": 1500,
      "endTime": "2026-03-15T10:25:00Z"
    },
    "task": {
      "id": "string",
      "status": "in_progress"
    },
    "todayStats": {
      "focusMinutes": 75,
      "completedPomodoros": 3,
      "completedTasks": 1,
      "streakDays": 7
    }
  }
}
```

### 5.3 获取番茄钟历史

```http
GET /pomodoros/history?page=1&size=20
Authorization: Bearer <token>
```

### 5.4 获取今日统计

```http
GET /pomodoros/stats/today
Authorization: Bearer <token>
```

**响应:**
```json
{
  "code": 200,
  "data": {
    "focusMinutes": 75,
    "completedPomodoros": 3,
    "completedTasks": 1,
    "streakDays": 7
  }
}
```

### 5.5 获取周统计

```http
GET /pomodoros/stats/weekly
Authorization: Bearer <token>
```

**响应:**
```json
{
  "code": 200,
  "data": {
    "dailyStats": [
      { "date": "2026-03-09", "pomodoros": 5, "focusTime": 125 },
      { "date": "2026-03-10", "pomodoros": 3, "focusTime": 75 }
    ]
  }
}
```

---

## 6. 统计模块

### 6.1 获取总览统计

```http
GET /stats/overview?period=week
Authorization: Bearer <token>
```

**查询参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| period | string | today/week/month/year |

**响应:**
```json
{
  "code": 200,
  "data": {
    "focusMinutes": 320,
    "completedPomodoros": 12,
    "completedTasks": 5,
    "streakDays": 7,
    "compareLastPeriod": {
      "focusMinutes": "+15%",
      "pomodoros": "+20%",
      "tasks": "-5%"
    }
  }
}
```

### 6.2 获取每日统计数据

```http
GET /stats/daily?startDate=2026-03-06&endDate=2026-03-12
Authorization: Bearer <token>
```

**响应:**
```json
{
  "code": 200,
  "data": [
    { "date": "2026-03-06", "focusMinutes": 120, "pomodoros": 5, "tasks": 3 },
    { "date": "2026-03-07", "focusMinutes": 90, "pomodoros": 4, "tasks": 2 },
    { "date": "2026-03-08", "focusMinutes": 0, "pomodoros": 0, "tasks": 0 }
  ]
}
```

> 注意：后端应补全缺失日期，确保返回区间内每一天的数据

### 6.3 获取学科分布统计

```http
GET /stats/subjects?period=week
Authorization: Bearer <token>
```

**响应:**
```json
{
  "code": 200,
  "data": [
    { "category": "高等数学", "focusMinutes": 320, "percentage": 35.6 },
    { "category": "英语", "focusMinutes": 220, "percentage": 24.4 }
  ]
}
```

---

## 7. Dashboard 聚合接口

### 7.1 获取Dashboard摘要

```http
GET /dashboard/summary
Authorization: Bearer <token>
```

**说明:** 聚合首页所需的所有数据，减少请求次数

**响应:**
```json
{
  "code": 200,
  "data": {
    "todayStats": {
      "focusMinutes": 75,
      "completedPomodoros": 3,
      "completedTasks": 1,
      "streakDays": 7
    },
    "weeklyStats": {
      "totalPomodoros": 36,
      "totalFocusHours": 15,
      "completionRate": 89
    },
    "todayTasks": [
      {
        "id": "string",
        "title": "高等数学 - 极限与连续",
        "status": "in_progress",
        "priority": "high"
      }
    ],
    "activePomodoro": null
  }
}
```

---

## 8. AI数字人模块（预留）

### 8.1 创建会话

```http
POST /companion/sessions
Authorization: Bearer <token>
```

### 8.2 发送消息

```http
POST /companion/sessions/{sessionId}/messages
Authorization: Bearer <token>
```

### 8.3 获取会话历史

```http
GET /companion/sessions/{sessionId}/messages
Authorization: Bearer <token>
```

### 8.4 生成学习计划

```http
POST /companion/generate-plan
Authorization: Bearer <token>
```

---

## 9. 社区模块（预留）

### 9.1 发布动态

```http
POST /community/posts
Authorization: Bearer <token>
```

### 9.2 获取动态列表

```http
GET /community/posts?page=1&size=20
Authorization: Bearer <token>
```

### 9.3 点赞动态

```http
POST /community/posts/{id}/like
Authorization: Bearer <token>
```

### 9.4 评论动态

```http
POST /community/posts/{id}/comments
Authorization: Bearer <token>
```

---

## 10. API端点常量

```typescript
export const API_ENDPOINTS = {
  // 认证模块
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
    ME: '/api/v1/auth/me',
  },
  
  // 用户模块 (新增/完善)
  USER: {
    PROFILE: '/api/v1/users/profile',
    UPDATE_PROFILE: '/api/v1/users/profile',
    AVATAR: '/api/v1/users/avatar',
    PASSWORD: '/api/v1/users/password',
    ACCOUNT: '/api/v1/users/account',
    STATS: '/api/v1/users/stats',
    CALENDAR: '/api/v1/users/calendar',
    SETTINGS: {
      POMODORO: '/api/v1/users/settings/pomodoro',
      SYSTEM: '/api/v1/users/settings/system',
    },
  },
  
  // 任务模块
  TASK: {
    LIST: '/api/v1/tasks',
    TODAY: '/api/v1/tasks/today',
    CREATE: '/api/v1/tasks',
    UPDATE: (id: string) => `/api/v1/tasks/${id}`,
    DELETE: (id: string) => `/api/v1/tasks/${id}`,
    TOGGLE: (id: string) => `/api/v1/tasks/${id}/toggle`,
    START: (id: string) => `/api/v1/tasks/${id}/start`,
    REORDER: '/api/v1/tasks/reorder',
    PROGRESS: '/api/v1/tasks/progress',
  },
  
  // 番茄钟模块
  POMODORO: {
    START: '/api/v1/pomodoros/start',
    STOP: (id: string) => `/api/v1/pomodoros/${id}/stop`,
    HISTORY: '/api/v1/pomodoros/history',
    TODAY_STATS: '/api/v1/pomodoros/stats/today',
    WEEKLY_STATS: '/api/v1/pomodoros/stats/weekly',
  },
  
  // 统计模块
  STATS: {
    OVERVIEW: '/api/v1/stats/overview',
    DAILY: '/api/v1/stats/daily',
    SUBJECTS: '/api/v1/stats/subjects',
  },
  
  // Dashboard模块
  DASHBOARD: {
    SUMMARY: '/api/v1/dashboard/summary',
  },
  
  // AI数字人模块（预留）
  COMPANION: {
    SESSIONS: '/api/v1/companion/sessions',
    MESSAGES: (sessionId: string) => `/api/v1/companion/sessions/${sessionId}/messages`,
    GENERATE_PLAN: '/api/v1/companion/generate-plan',
  },
  
  // 社区模块（预留）
  COMMUNITY: {
    POSTS: '/api/v1/community/posts',
    LIKE: (id: string) => `/api/v1/community/posts/${id}/like`,
    COMMENTS: (id: string) => `/api/v1/community/posts/${id}/comments`,
  },
} as const;
```

---

*文档结束*
