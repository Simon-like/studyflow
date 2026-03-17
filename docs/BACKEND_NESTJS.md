# StudyFlow NestJS 后端架构文档

> **版本**: 1.0.0  
> **日期**: 2026-03-17  
> **技术栈**: NestJS 10.x + Prisma + PostgreSQL + Redis

---

## 1. 架构概览

### 1.1 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         StudyFlow 后端架构                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    HTTP 请求层                            │  │
│  │  - Helmet (安全头)                                        │  │
│  │  - Compression (压缩)                                     │  │
│  │  - Rate Limit (限流)                                      │  │
│  │  - CORS (跨域)                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   NestJS 应用层                           │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │  │
│  │  │  Auth    │ │  Users   │ │  Tasks   │ │ Pomodoro │   │  │
│  │  │  Module  │ │  Module  │ │  Module  │ │  Module  │   │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │  │
│  │  ┌──────────┐ ┌──────────────────────────────────────┐ │  │
│  │  │  Stats   │ │        Common (共享组件)              │ │  │
│  │  │  Module  │ │  ┌────────┐ ┌────────┐ ┌────────┐  │ │  │
│  │  └──────────┘ │  │ Guards │ │Filters │ │Pipes   │  │ │  │
│  │               │  └────────┘ └────────┘ └────────┘  │ │  │
│  │               └──────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    数据访问层                             │  │
│  │  ┌──────────────────┐    ┌──────────────────┐           │  │
│  │  │   Prisma ORM     │    │   Redis Cache    │           │  │
│  │  │   (PostgreSQL)   │    │   (Session/JWT)  │           │  │
│  │  └──────────────────┘    └──────────────────┘           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 模块依赖关系

```
AppModule (根模块)
├── ConfigModule (全局配置)
├── PrismaModule (数据库) ───────┐
├── RedisModule (缓存) ──────────┤
├── AuthModule ──────────────────┤
│   └── UsersModule              │
├── UsersModule ─────────────────┤
│   └── PrismaModule             │
├── TasksModule ─────────────────┤
│   └── PrismaModule             │
├── PomodoroModule ──────────────┤
│   ├── PrismaModule             │
│   └── RedisModule              │
└── StatsModule ─────────────────┘
    └── PrismaModule
```

---

## 2. 项目结构

```
apps/server/
├── src/
│   ├── auth/                      # 认证模块
│   │   ├── auth.controller.ts     # API 端点
│   │   ├── auth.service.ts        # 业务逻辑
│   │   ├── auth.module.ts         # 模块定义
│   │   └── dto/
│   │       └── auth.dto.ts        # 数据传输对象
│   │
│   ├── users/                     # 用户模块
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── dto/
│   │       └── user.dto.ts
│   │
│   ├── tasks/                     # 任务模块
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   ├── tasks.module.ts
│   │   └── dto/
│   │       └── task.dto.ts
│   │
│   ├── pomodoro/                  # 番茄钟模块
│   │   ├── pomodoro.controller.ts
│   │   ├── pomodoro.service.ts
│   │   ├── pomodoro.module.ts
│   │   └── dto/
│   │       └── pomodoro.dto.ts
│   │
│   ├── stats/                     # 统计模块
│   │   ├── stats.controller.ts
│   │   ├── stats.service.ts
│   │   └── stats.module.ts
│   │
│   ├── prisma/                    # Prisma 数据库模块
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── redis/                     # Redis 缓存模块
│   │   ├── redis.module.ts
│   │   └── redis.service.ts
│   │
│   ├── common/                    # 公共组件
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts
│   │   ├── validators/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── date.util.ts
│   │   └── health.controller.ts
│   │
│   ├── app.module.ts              # 根模块
│   └── main.ts                    # 入口文件
│
├── prisma/
│   ├── schema.prisma              # 数据库模型定义
│   └── seed.ts                    # 种子数据
│
├── test/                          # 测试文件
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── Dockerfile                     # Docker 构建配置
├── .dockerignore
├── .env.example                   # 环境变量示例
├── nest-cli.json                  # NestJS CLI 配置
├── tsconfig.json                  # TypeScript 配置
├── package.json
└── README.md
```

---

## 3. 核心功能实现

### 3.1 统一响应格式

所有 API 响应遵循统一格式，由 `TransformInterceptor` 自动转换：

```typescript
interface ApiResponse<T> {
  code: number;      // HTTP 状态码
  message: string;   // 响应消息
  data: T;          // 响应数据
  timestamp: number; // 时间戳
}
```

### 3.2 异常处理

全局异常过滤器 `HttpExceptionFilter` 捕获所有异常：

```typescript
// 业务异常示例
throw new NotFoundException('任务不存在');
throw new ConflictException('用户名已存在');
throw new UnauthorizedException('访问令牌已过期');
```

### 3.3 JWT 认证流程

```
登录/注册
    │
    ▼
生成 AccessToken (2h) + RefreshToken (7d)
    │
    ▼
前端存储 Token
    │
    ├── 请求 API ──▶ 验证 AccessToken ──▶ 返回数据
    │
    └── Token 过期 ──▶ 使用 RefreshToken 换取新 Token
```

### 3.4 数据库事务

使用 Prisma 的事务功能保证数据一致性：

```typescript
await this.prisma.$transaction([
  this.prisma.pomodoroRecord.update({...}),
  this.prisma.task.update({...}),
  this.prisma.pomodoroDailyStat.upsert({...}),
]);
```

---

## 4. API 端点一览

### 4.1 认证模块

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/v1/auth/login | 用户登录 |
| POST | /api/v1/auth/register | 用户注册 |
| POST | /api/v1/auth/refresh | 刷新令牌 |
| POST | /api/v1/auth/logout | 用户登出 |
| GET | /api/v1/auth/me | 获取当前用户 |

### 4.2 用户模块

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/v1/users/profile | 获取用户资料 |
| PUT | /api/v1/users/profile | 更新用户资料 |
| GET | /api/v1/users/settings/pomodoro | 获取番茄钟设置 |
| PUT | /api/v1/users/settings/pomodoro | 更新番茄钟设置 |
| GET | /api/v1/users/settings/system | 获取系统设置 |
| PUT | /api/v1/users/settings/system | 更新系统设置 |
| PUT | /api/v1/users/password | 修改密码 |
| GET | /api/v1/users/calendar | 获取学习日历 |
| DELETE | /api/v1/users/account | 删除账号 |

### 4.3 任务模块

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/v1/tasks | 获取任务列表 |
| GET | /api/v1/tasks/today | 获取今日任务 |
| GET | /api/v1/tasks/progress | 获取任务进度 |
| GET | /api/v1/tasks/:id | 获取任务详情 |
| POST | /api/v1/tasks | 创建任务 |
| PUT | /api/v1/tasks/:id | 更新任务 |
| DELETE | /api/v1/tasks/:id | 删除任务 |
| PATCH | /api/v1/tasks/:id/toggle | 切换任务状态 |
| POST | /api/v1/tasks/:id/start | 开始任务 |
| POST | /api/v1/tasks/reorder | 批量更新排序 |

### 4.4 番茄钟模块

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/v1/pomodoros/start | 开始番茄钟 |
| POST | /api/v1/pomodoros/:id/stop | 停止番茄钟 |
| GET | /api/v1/pomodoros/history | 获取历史记录 |
| GET | /api/v1/pomodoros/stats/today | 获取今日统计 |
| GET | /api/v1/pomodoros/stats/weekly | 获取周统计 |

### 4.5 统计模块

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/v1/stats/overview | 获取总览统计 |
| GET | /api/v1/stats/daily | 获取每日统计 |
| GET | /api/v1/stats/subjects | 获取学科分布 |

---

## 5. 与前端对接

### 5.1 CORS 配置

```typescript
// main.ts
app.enableCors({
  origin: ['http://localhost:5173', 'http://localhost:19006'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});
```

### 5.2 环境变量管理

前端 `.env`:
```env
VITE_API_URL=http://localhost:3001/api/v1
```

后端 `.env`:
```env
PORT=3001
API_PREFIX=/api/v1
CORS_ORIGIN="http://localhost:5173,http://localhost:19006"
```

### 5.3 类型共享

前后端共享 TypeScript 类型定义：

```typescript
// packages/shared/src/types/index.ts
export interface User {
  id: string;
  username: string;
  // ...
}

export interface Task {
  id: string;
  title: string;
  // ...
}
```

服务端使用：
```typescript
import { User, Task } from '@studyflow/shared';
```

---

## 6. 数据库设计

### 6.1 核心表

| 表名 | 描述 |
|------|------|
| users | 用户表（含设置） |
| tasks | 任务表 |
| pomodoro_records | 番茄钟记录表 |
| pomodoro_daily_stats | 每日番茄统计表 |
| task_daily_stats | 每日任务统计表 |
| user_streaks | 用户连续学习记录表 |

### 6.2 扩展表（预留）

| 表名 | 描述 |
|------|------|
| chat_sessions | AI 对话会话表 |
| chat_messages | AI 对话消息表 |
| ai_study_plans | AI 学习计划表 |
| posts | 社区动态表 |
| comments | 评论表 |
| likes | 点赞表 |
| study_groups | 学习小组表 |
| group_members | 小组成员表 |

---

## 7. 部署指南

### 7.1 开发环境

```bash
# 1. 启动数据库
docker-compose up -d postgres redis

# 2. 执行迁移
pnpm db:migrate

# 3. 启动开发服务器
pnpm dev:server
```

### 7.2 生产部署

```bash
# 1. 构建 Docker 镜像
docker-compose build

# 2. 启动所有服务
docker-compose up -d

# 3. 执行数据库迁移
docker-compose exec server npx prisma migrate deploy
```

---

## 8. 测试

```bash
# 单元测试
pnpm --filter @studyflow/server test

# E2E 测试
pnpm --filter @studyflow/server test:e2e

# 覆盖率报告
pnpm --filter @studyflow/server test:cov
```

---

## 9. 与 Spring Boot 对比

| 特性 | Spring Boot | NestJS |
|------|-------------|--------|
| 模块化 | @Configuration | @Module |
| 依赖注入 | @Autowired | 构造函数注入 |
| 控制器 | @RestController | @Controller |
| 服务 | @Service | @Injectable |
| DTO 校验 | Jakarta Validation | class-validator |
| ORM | JPA/Hibernate | Prisma |
| 认证 | Spring Security | Passport + JWT |
| 文档 | SpringDoc | Swagger |

---

*文档结束*
