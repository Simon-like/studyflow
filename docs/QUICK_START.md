# StudyFlow 快速启动指南

## 🎯 两种方式启动

### 方式一：使用真实后端（推荐）

#### 步骤 1: 启动数据库

```bash
# 在项目根目录
docker-compose up -d postgres redis
```

#### 步骤 2: 配置环境变量

```bash
# Web 应用已配置好，检查文件:
cat apps/web/.env.development

# 内容应该是:
# VITE_API_BASE_URL=http://localhost:3001/api/v1
# VITE_USE_MOCK=false
```

#### 步骤 3: 数据库迁移

```bash
# 安装依赖
pnpm install

# 生成 Prisma Client
pnpm db:generate

# 执行迁移
pnpm db:migrate

# 可选：填充测试数据
pnpm db:seed
```

#### 步骤 4: 启动服务

```bash
# 方式 A: 同时启动后端和前端
pnpm dev

# 方式 B: 分别启动（推荐）
# 终端 1 - 启动后端
pnpm dev:server

# 终端 2 - 启动前端
pnpm dev:web
```

#### 访问地址

| 服务 | 地址 |
|------|------|
| Web 应用 | http://localhost:5173 |
| API 服务 | http://localhost:3001 |
| API 文档 | http://localhost:3001/api/docs |
| Prisma Studio | http://localhost:5555 |

#### 测试账号

迁移后会自动创建测试账号：
- 用户名: `testuser`
- 密码: `password123`

---

### 方式二：使用 Mock 数据（无需后端）

如果你想快速预览前端界面，不需要启动后端：

```bash
# 1. 修改环境变量
echo "VITE_USE_MOCK=true" > apps/web/.env.local

# 2. 只启动前端
pnpm dev:web
```

---

## 🔧 常见问题

### 1. 端口冲突

如果 3001 或 5173 端口被占用：

```bash
# 查找占用 3001 的进程
lsof -i :3001

# 杀掉进程
kill -9 <PID>
```

### 2. 数据库连接失败

```bash
# 重启数据库
docker-compose restart postgres

# 查看日志
docker-compose logs postgres
```

### 3. 切换 Mock/后端模式

```bash
# 切换到 Mock 模式
echo "VITE_USE_MOCK=true" > apps/web/.env.local

# 切换到后端模式
echo "VITE_USE_MOCK=false" > apps/web/.env.local
```

---

## 📁 重要文件位置

| 文件 | 说明 |
|------|------|
| `apps/server/.env` | 后端环境变量 |
| `apps/web/.env.development` | Web 前端环境变量 |
| `apps/server/prisma/schema.prisma` | 数据库模型 |
| `packages/api/src/index.ts` | API 门面配置 |

---

## 🚀 一键启动脚本

```bash
# 使用提供的脚本（自动完成所有步骤）
bash scripts/start-dev.sh
```
