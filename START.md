# StudyFlow 启动指南

## 🚀 快速启动（推荐）

### 1. 启动后端服务

在项目根目录执行：

```bash
./start-server.sh
```

或者手动执行：

```bash
cd apps/server && pnpm dev
```

### 2. 启动前端（新开一个终端窗口）

在项目根目录执行：

```bash
./start-web.sh
```

或者手动执行：

```bash
cd apps/web && pnpm dev
```

---

## 📋 常用命令

### 后端命令（在 apps/server 目录下执行）

```bash
cd apps/server

# 开发模式（自动构建并启动）
pnpm dev

# 只构建
pnpm build

# 只启动（需要先构建）
pnpm start

# 数据库管理
pnpm db:migrate      # 运行迁移
pnpm db:studio       # 打开 Prisma Studio
```

### 前端命令（在 apps/web 目录下执行）

```bash
cd apps/web

# 开发模式
pnpm dev

# 构建
pnpm build
```

---

## 🔧 如果提示命令不存在

安装 pnpm（如果还没装）：

```bash
npm install -g pnpm
```

安装项目依赖：

```bash
# 在项目根目录执行
pnpm install
```

---

## ✅ 启动成功标志

### 后端启动成功
```
✅ OSS 服务已初始化
[Nest] 12345  - 03/18/2024, 10:00:00 PM     LOG [NestApplication] Nest application successfully started +10ms
```

### 前端启动成功
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

---

## 🌐 访问地址

- **前端页面**：http://localhost:5173
- **后端 API**：http://localhost:3001
- **API 文档**（Swagger）：http://localhost:3001/api/docs
