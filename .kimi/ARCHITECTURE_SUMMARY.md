# StudyFlow — 架构精简摘要

> **版本**：v1.0  
> **更新日期**：2026-05-11  
> **用途**：快速了解系统架构、数据流、代码组织和关键技术决策。  
> **阅读时长**：约 10 分钟

---

## 1. 系统架构图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              客户端层 (Client Layer)                      │
├─────────────────────────────┬───────────────────────────────────────────┤
│      Web 应用 (@studyflow/web)           │   Mobile 应用 (@studyflow/mobile)  │
│  ┌───────────────────────┐  │  ┌─────────────────────────────────────┐  │
│  │  React 19 + Vite      │  │  │  React Native + Expo                │  │
│  │  Tailwind CSS         │  │  │  复用 @studyflow/api 客户端         │  │
│  │  TanStack Query       │  │  │  自定义导航                         │  │
│  │  Zustand              │  │  │  Reanimated 动画                    │  │
│  └───────────────────────┘  │  └─────────────────────────────────────┘  │
└─────────────────────────────┴───────────────────────────────────────────┘
                                      │ HTTP / REST API (localhost:8080)
                                      │ WebSocket /ws/sync (实时同步)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            共享包层 (Shared Packages)                     │
├──────────────┬──────────────┬────────────────┬──────────────────────────┤
│ @studyflow/  │ @studyflow/  │ @studyflow/    │ @studyflow/              │
│ shared       │ api          │ theme          │ ui                       │
├──────────────┼──────────────┼────────────────┼──────────────────────────┤
│ 类型定义     │ HTTP 客户端  │ 主题 tokens    │ 通用组件（仅 Web）       │
│ 常量         │ 服务封装     │ 适配器         │ Button, Card, Input      │
│ 工具函数     │ React Query  │                │ Timer                    │
│ 验证器       │ hooks        │                │                          │
└──────────────┴──────────────┴────────────────┴──────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         服务端层 (Server Layer)                           │
│                      Spring Boot 4.0.6 + Java 21                          │
├─────────────────────────────────────────────────────────────────────────┤
│  Controller → Service → Repository → Entity → PostgreSQL 16              │
│  JWT Filter → Spring Security 7                                          │
│  Redis 7 (Token / 缓存 / 热点数据)                                        │
│  Aliyun OSS / MinIO (头像 / 图片上传)                                     │
│  WebSocket /ws/sync (多端实时同步 + JWT 握手认证)                          │
│  PomodoroSyncService (番茄钟状态广播 + 设置变更通知)                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 前端架构

### 2.1 Web 应用 (`apps/web`)

```
web/src/
├── pages/              # 顶层页面路由组件
│   ├── Dashboard.tsx
│   ├── Tasks.tsx
│   ├── Stats.tsx
│   ├── Community.tsx      # ← 社区模块（UI 占位）
│   ├── Companion.tsx      # ← AI 数字人（UI 占位）
│   ├── Profile.tsx
│   └── ...
├── features/           # 功能模块（按领域组织）
│   ├── auth/
│   ├── tasks/
│   ├── stats/
│   ├── profile/
│   ├── community/         # ← UI 组件已搭建
│   └── companion/         # ← UI 组件已搭建
├── components/
│   ├── ui/             # 基础 UI 组件
│   ├── business/       # 业务组件（PomodoroTimer, TaskCard 等）
│   └── providers/      # 全局 Provider
├── stores/             # Zustand 状态管理
├── hooks/              # 自定义 Hooks
├── router/             # React Router 配置
└── lib/                # 工具函数
```

**技术决策**：
- 使用 `features/` 目录按领域组织代码，而非按类型（components/hooks/stores 混在一起）
- 页面组件尽量薄，逻辑下沉到 `features/` 中的组件和 hooks
- 状态管理分层：TanStack Query 管服务端状态，Zustand 管客户端状态（如番茄钟运行时状态）

### 2.2 Mobile 应用 (`apps/mobile`)

```
mobile/src/
├── screens/            # 屏幕页面（对应 Web 的 pages + features）
│   ├── Home/
│   ├── Tasks/
│   ├── Stats/
│   ├── Community/         # ← UI 组件已搭建
│   ├── Companion/         # ← UI 组件已搭建
│   ├── Profile/
│   └── Auth/
├── components/
│   ├── ui/             # 基础 RN 组件
│   ├── business/       # 业务组件
│   └── layout/         # 布局组件（Header, ScreenContainer 等）
├── navigation/         # 导航配置
├── stores/
├── hooks/
├── theme/              # Mobile 主题配置（从 @studyflow/theme 导入）
└── api/services/       # Mobile 专属 API 封装（部分复用 packages/api）
```

**技术决策**：
- 不共享 React 组件（Web 和 RN 组件不兼容），但共享业务逻辑 hooks 和类型
- Mobile 也使用 TanStack Query，但持久化缓存使用 `@react-native-async-storage/async-storage`
- 动画使用 `react-native-reanimated`

### 2.3 共享包依赖关系

```
@studyflow/shared (纯 TypeScript，无框架依赖)
    ├── @studyflow/api (依赖 axios, tanstack-query, react)
    │       └── 被 web 和 mobile 引用
    ├── @studyflow/theme (纯 TypeScript)
    │       └── 被 web(tailwind) 和 mobile(stylesheet) 引用
    └── @studyflow/ui (依赖 react, tailwind-merge)
            └── 主要被 web 引用
```

**关键约束**：`@studyflow/shared` 绝对不能引入 React / React Native / DOM API。

---

## 3. 后端架构

### 3.1 Spring Boot 分层架构

```
server/src/main/java/com/studyflow/
├── StudyFlowApplication.java
├── config/                    # 配置类
│   ├── SecurityConfig.java    # Spring Security + JWT 配置
│   ├── JacksonConfig.java     # ObjectMapper 配置
│   ├── JwtConfig.java
│   ├── RedisConfig.java
│   ├── OssConfig.java
│   ├── WebConfig.java         # CORS
│   └── WebSocketConfig.java   # WebSocket 端点注册 + JWT 握手
├── controller/                # 控制层（REST API）
│   ├── AuthController.java
│   ├── UserController.java
│   ├── TaskController.java
│   ├── PomodoroController.java
│   ├── StatsController.java
│   ├── SyncStateController.java      # WebSocket HTTP 降级端点
│   └── [CommunityController.java]    # ← 待开发
│   └── [AICompanionController.java]  # ← 待开发
├── service/                   # 业务逻辑层
│   ├── AuthService.java
│   ├── UserService.java
│   ├── TaskService.java
│   ├── PomodoroService.java
│   └── StatsService.java
├── websocket/                 # 多端实时同步模块
│   ├── message/               # 消息协议（SyncAction、SyncMessage、DeviceType、DeviceSession）
│   ├── SyncSessionManager.java    # 会话管理（心跳检测、过期清理）
│   ├── SyncWebSocketHandler.java  # WebSocket 消息路由
│   └── PomodoroSyncService.java   # 番茄钟同步核心（冲突解决、状态广播）
├── repository/                # 数据访问层（JpaRepository）
│   ├── UserRepository.java
│   ├── TaskRepository.java
│   └── ...
├── entity/                    # JPA 实体类
│   ├── User.java
│   ├── Task.java
│   ├── PomodoroRecord.java
│   ├── ChatSession.java       # ← 预留（AI 模块）
│   ├── ChatMessage.java       # ← 预留（AI 模块）
│   ├── Post.java              # ← 预留（社区模块）
│   ├── Comment.java           # ← 预留（社区模块）
│   └── ...
├── dto/                       # 数据传输对象
│   ├── auth/
│   ├── user/
│   ├── task/
│   └── ...
├── security/                  # 安全相关
│   ├── JwtAuthenticationFilter.java
│   ├── JwtTokenProvider.java
│   └── CustomUserDetailsService.java
├── exception/                 # 异常处理
│   ├── GlobalExceptionHandler.java
│   ├── BusinessException.java
│   └── ErrorCode.java
├── aspect/                    # AOP 切面
│   └── LoggingAspect.java
└── util/                      # 工具类
```

### 3.2 请求处理流程

**REST API 流程：**
```
HTTP Request
  ↓
JwtAuthenticationFilter (Spring Security)
  ↓
Controller (@RestController) —— 参数校验 (@Valid)
  ↓
Service (@Service) —— 业务逻辑 + @Transactional
  ↓                ↘ PomodoroSyncService.broadcastStateChange() (广播给其他设备)
Repository          ↓
  ↓              WebSocket 推送
Entity (JPA)
  ↓
PostgreSQL / Redis
```

**WebSocket 流程：**
```
ws://localhost:8080/ws/sync?token=JWT&deviceId=xxx&deviceType=WEB
  ↓
WebSocketConfig (JWT 握手认证，提取 userId)
  ↓
SyncWebSocketHandler (消息路由)
  ↓
PomodoroSyncService (业务处理 + 冲突解决)
  ↓
广播 STATE_SYNC 给用户所有在线设备
```

### 3.3 统一响应格式

```java
@Data
public class ApiResponse<T> {
    private int code;           // 业务状态码 (200=成功)
    private String message;     // 用户友好提示
    private T data;             // 响应数据
    private long timestamp;     // 时间戳
}
```

### 3.4 API 前缀规范

```
/api/v1/{module}/{action}

示例：
/api/v1/auth/login
/api/v1/tasks
/api/v1/pomodoros/start
/api/v1/users/me
```

---

## 4. 数据库核心表

### 4.1 已实现的表

| 表名 | 实体类 | 说明 |
|------|--------|------|
| `users` | `User.java` | 用户主表 |
| `tasks` | `Task.java` | 任务表，支持自关联子任务 |
| `pomodoro_records` | `PomodoroRecord.java` | 番茄钟记录表 |
| `pomodoro_daily_stats` | `PomodoroDailyStat.java` | 番茄钟日度统计（预聚合） |
| `task_daily_stats` | `TaskDailyStat.java` | 任务日度统计（预聚合） |
| `user_streaks` | `UserStreak.java` | 用户连续学习记录 |

### 4.2 预留的表（待开发模块）

| 表名 | 实体类 | 所属模块 |
|------|--------|----------|
| `chat_sessions` | `ChatSession.java` | AI 数字人 |
| `chat_messages` | `ChatMessage.java` | AI 数字人 |
| `ai_study_plans` | `AiStudyPlan.java` | AI 数字人 |
| `knowledge_documents` | `KnowledgeDocument.java` | AI 数字人（RAG） |
| `posts` | `Post.java` | 社区 |
| `comments` | `Comment.java` | 社区 |
| `likes` | `Like.java` | 社区 |
| `study_groups` | `StudyGroup.java` | 社区 |
| `group_members` | `GroupMember.java` | 社区 |

---

## 5. 认证架构

### 5.1 JWT 双 Token 机制

```
Client                        Server
  │                             │
  ├──── Login ────────────────→ │
  │ ←──── Access Token ─────────┤ (15 分钟有效，内存存储)
  │ ←──── Refresh Token ────────┤ (7 天有效，Redis 存储)
  │                             │
  ├──── API Call (with AT) ───→ │
  │                             │
  │ ←──── 401 Unauthorized ─────┤ (AT 过期)
  │                             │
  ├──── Refresh (with RT) ────→ │
  │ ←──── New Access Token ─────┤
```

### 5.2 Token 存储

- **Access Token**：前端内存（Zustand store），不持久化
- **Refresh Token**：服务端 Redis（Spring Data Redis），支持黑名单登出

---

## 6. 关键技术决策记录

| 决策 | 选择 | 理由 |
|------|------|------|
| 后端框架 | Spring Boot 4.0.6 | 符合毕设 Java 技术栈要求，企业主流 |
| 数据库 | PostgreSQL 16 | JSONB 支持好，功能丰富 |
| 缓存 | Redis 7 | Token 存储、热点数据、Feeds 缓存 |
| ORM | Spring Data JPA | 开发效率高，代码简洁 |
| 前端框架 | React 19 + RN/Expo | 跨平台复用业务逻辑 |
| Monorepo | pnpm + Turbo | 依赖管理清晰，构建优化 |
| 状态管理 | TanStack Query + Zustand | 服务端/客户端状态分离 |
| 实时同步 | Spring WebSocket | 多端番茄钟同步 + 设置变更通知 |

---

## 7. 变更日志

| 日期 | 版本 | 变更内容 | 变更者 |
|------|------|----------|--------|
| 2026-05-11 | v1.0 | 初始创建 | Kimi Code CLI |
| 2026-05-11 | v1.1 | 更新 Spring Boot 版本为 4.0.6，添加 WebSocket 模块架构，更新请求处理流程 | Claude Code |

---

**最后更新**：2026-05-11  
**版本**：v1.1
