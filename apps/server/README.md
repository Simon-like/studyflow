# StudyFlow Server

StudyFlow 后端服务，基于 NestJS + Prisma + PostgreSQL 构建。

## 技术栈

- **Framework**: NestJS 10.x
- **Database**: PostgreSQL 16 + Prisma ORM
- **Cache**: Redis
- **Authentication**: JWT + Passport
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest

## 快速开始

### 环境要求

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose

### 安装依赖

```bash
# 在根目录安装所有依赖
pnpm install

# 生成 Prisma Client
pnpm db:generate
```

### 环境配置

```bash
cp apps/server/.env.example apps/server/.env
# 编辑 .env 文件，配置数据库连接等信息
```

### 启动数据库

```bash
# 使用 Docker Compose 启动 PostgreSQL 和 Redis
docker-compose up -d postgres redis
```

### 数据库迁移

```bash
# 执行迁移
pnpm db:migrate

# 可选：填充测试数据
pnpm db:seed
```

### 启动开发服务器

```bash
# 仅启动后端
pnpm dev:server

# 或启动所有服务（前后端）
pnpm dev
```

服务将运行在 http://localhost:3001

API 文档：http://localhost:3001/api/docs

## 项目结构

```
apps/server/
├── src/
│   ├── auth/           # 认证模块（登录/注册/JWT）
│   ├── users/          # 用户模块（资料/设置）
│   ├── tasks/          # 任务模块
│   ├── pomodoro/       # 番茄钟模块
│   ├── stats/          # 统计模块
│   ├── common/         # 公共组件
│   │   ├── decorators/ # 装饰器
│   │   ├── filters/    # 异常过滤器
│   │   ├── guards/     # 守卫
│   │   ├── interceptors/ # 拦截器
│   │   └── utils/      # 工具函数
│   ├── prisma/         # Prisma 模块
│   ├── redis/          # Redis 模块
│   ├── app.module.ts   # 根模块
│   └── main.ts         # 入口文件
├── prisma/
│   ├── schema.prisma   # 数据库模型
│   └── seed.ts         # 种子数据
├── test/               # 测试文件
├── Dockerfile          # Docker 构建
└── package.json
```

## 数据库管理

### 生成迁移

```bash
# 修改 schema.prisma 后执行
pnpm db:migrate
```

### 查看数据库

```bash
pnpm db:studio
# 打开 http://localhost:5555
```

### 重置数据库

```bash
pnpm db:reset
```

## API 规范

所有 API 响应遵循统一格式：

```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1710000000000
}
```

### 认证方式

在请求头中携带 JWT Token：

```
Authorization: Bearer <access_token>
```

### 主要端点

- `POST /api/v1/auth/login` - 登录
- `POST /api/v1/auth/register` - 注册
- `GET /api/v1/auth/me` - 获取当前用户
- `GET /api/v1/users/profile` - 获取用户资料
- `PUT /api/v1/users/profile` - 更新用户资料
- `GET /api/v1/tasks` - 获取任务列表
- `POST /api/v1/tasks` - 创建任务
- `POST /api/v1/pomodoros/start` - 开始番茄钟
- `POST /api/v1/pomodoros/:id/stop` - 停止番茄钟
- `GET /api/v1/stats/overview` - 获取统计概览

## Docker 部署

```bash
# 构建并启动所有服务
docker-compose up -d

# 执行数据库迁移
docker-compose exec server npx prisma migrate deploy

# 查看日志
docker-compose logs -f server
```

## 测试

```bash
# 单元测试
pnpm --filter @studyflow/server test

# E2E 测试
pnpm --filter @studyflow/server test:e2e

# 覆盖率
pnpm --filter @studyflow/server test:cov
```

## 与前端对接

### CORS 配置

后端已配置 CORS，允许前端开发服务器访问。如需修改，编辑 `apps/server/.env`：

```env
CORS_ORIGIN="http://localhost:5173,http://localhost:19006"
```

### 共享类型

前后端共享 TypeScript 类型定义，位于 `packages/shared/src/types/`。

在服务端使用时：

```typescript
import { UserProfile, Task } from '@studyflow/shared';
```

### API 客户端

前端 API 客户端位于 `packages/api/`，保持与后端接口同步。
