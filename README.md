# StudyFlow

> 专注学习的番茄钟任务管理应用 - 智能陪伴，高效成长

---

## 项目简介

StudyFlow 是一款面向学生群体的智能学习陪伴应用，采用**番茄钟任务管理 + AI学习助手 + 学习社区**三位一体的设计，帮助用户建立高效的学习习惯。

## 核心功能

| 模块 | 功能描述 |
|------|----------|
| 🍅 **番茄钟** | 任务联动番茄钟，支持任务模式和自由模式 |
| ✅ **任务管理** | 学科分类、优先级、子任务、拖拽排序 |
| 📊 **数据统计** | 专注时长、连续天数、学科分布、学习热力图 |
| 🤖 **AI数字人** | 智能答疑、学习计划、情感陪伴 (V2.0) |
| 👥 **学习社区** | 学习打卡、同伴激励、经验分享 (V2.0) |

## 技术架构

### 前端

- **Web**: React 19 + Vite + Tailwind CSS
- **Mobile**: React Native + Expo
- **状态管理**: TanStack Query + Zustand
- **架构**: Monorepo (pnpm workspace + Turbo)

### 后端

- **框架**: Spring Boot 3.2 + Java 21
- **数据库**: PostgreSQL 16
- **缓存**: Redis 7
- **ORM**: Spring Data JPA

## 项目结构

```
studyflow/
├── apps/
│   ├── web/                    # Web应用
│   └── mobile/                 # 移动应用
├── packages/
│   ├── shared/                 # 共享类型、常量、工具
│   ├── api/                    # API客户端
│   └── theme/                  # 主题系统
├── docs/                       # 文档
│   ├── PRD.md                  # 产品需求文档
│   ├── ARCHITECTURE.md         # 架构设计文档
│   ├── DATABASE.md             # 数据库设计文档
│   └── API_SPEC.md             # API接口规范
└── package.json
```

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8
- Java 21 (后端)
- PostgreSQL 16 (后端)

### 安装依赖

```bash
# 安装所有依赖
pnpm install

# 构建共享包
pnpm build:packages
```

### 启动开发服务器

```bash
# 同时启动 Web 和 Mobile
pnpm dev

# 仅启动 Web
pnpm dev:web

# 仅启动 Mobile
pnpm dev:mobile
```

### 构建

```bash
# 构建所有应用
pnpm build

# 构建特定应用
pnpm turbo run build --filter=@studyflow/web
```

## 文档索引

| 文档 | 路径 | 说明 |
|------|------|------|
| **PRD** | [docs/PRD.md](docs/PRD.md) | 产品需求文档，功能定义 |
| **架构设计** | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 系统架构、技术选型 |
| **数据库设计** | [docs/DATABASE.md](docs/DATABASE.md) | 表结构、索引、预留表 |
| **API规范** | [docs/API_SPEC.md](docs/API_SPEC.md) | 接口定义、状态码 |

## 开发路线图

### Phase 1: MVP (当前)
- [x] 双端登录注册
- [x] 番茄钟核心功能（任务联动）
- [x] 任务管理（CRUD、排序、状态切换）
- [x] 数据统计（今日、周、学科分布）
- [ ] 个人信息模块
- [ ] 系统设置模块

### Phase 2: 智能增强
- [ ] AI数字人基础对话
- [ ] 学习计划生成
- [ ] 智能提醒

### Phase 3: 社交激励
- [ ] 学习社区
- [ ] 小组功能
- [ ] 排行榜

## 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -am 'Add xxx'`)
4. 推送分支 (`git push origin feature/xxx`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE)

---

<p align="center">Made with ❤️ for focused learners</p>
