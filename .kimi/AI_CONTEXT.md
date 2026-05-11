# StudyFlow — AI 项目上下文索引

> **版本**：v1.0  
> **更新日期**：2026-05-11  
> **用途**：本文件是 AI 进入本项目的第一份必读文档。它定义了项目的全局上下文、文档阅读顺序和协作规范。  
> **面向读者**：所有协助 StudyFlow 毕设项目的 AI 大模型（Claude、Kimi、GPT 等）

---

## 1. 项目一句话定义

**StudyFlow** 是一款面向学生群体的智能学习陪伴应用，采用**番茄钟任务管理 + AI 学习助手 + 学习社区**三位一体的设计。本项目是本科毕业设计，题目为《基于 Spring Boot 的智能学习计划系统设计与实现》。

## 2. 当前状态一句话

**后端 NestJS → Spring Boot 4.0.6 迁移已完成，统计 API 和番茄钟 API 已通过测试，WebSocket 多端同步已实现；前端 UI 已搭建完毕；AI 数字人模块和社区模块尚未开发，这是当前最大痛点。**

## 3. 技术栈速查

| 层级 | 技术 | 版本 |
|------|------|------|
| **Web 前端** | React + Vite + Tailwind CSS | React 19 |
| **Mobile 前端** | React Native + Expo | Expo 55 |
| **状态管理** | TanStack Query + Zustand | v5 / v4 |
| **后端** | Spring Boot | 4.0.6 + Java 21 |
| **数据库** | PostgreSQL | 16 |
| **缓存** | Redis | 7 |
| **ORM** | Spring Data JPA (Hibernate) | 7.x |
| **安全** | Spring Security + JWT | 7.x / jjwt 0.12 |
| **实时通信** | Spring WebSocket | 4.x |
| **Monorepo** | pnpm workspace + Turbo | 10.16 / 1.13 |

## 4. 项目结构速览

```
studyflow/
├── apps/
│   ├── web/                    # Web 应用 (React 19 + Vite)
│   └── mobile/                 # 移动应用 (React Native + Expo)
├── packages/
│   ├── shared/                 # 共享类型、常量、工具 (@studyflow/shared)
│   ├── api/                    # API 客户端 + React Query hooks (@studyflow/api)
│   ├── theme/                  # 主题 tokens + 平台适配器 (@studyflow/theme)
│   └── ui/                     # 跨平台通用 UI 组件 (@studyflow/ui)
├── docs/                       # 人类文档（论文、答辩指南、迁移指南等）
├── skills/                     # 前端开发 Skill 规范
└── .kimi/                      # ← 你在这里：AI 项目规范文档
```

## 5. 文档阅读顺序（重要！）

**不要一次性阅读所有文档。** 根据你当前的任务，按以下顺序选择阅读：

### 5.1 首次进入项目（必看）

按顺序阅读以下 4 份文档，总计约 20 分钟：

| 顺序 | 文档 | 文件 | 阅读时长 | 说明 |
|------|------|------|----------|------|
| 1 | **本文档** | `AI_CONTEXT.md` | 5 min | 了解项目全局和文档体系 |
| 2 | **项目状态** | `PROJECT_STATUS.md` | 5 min | 了解当前进度、痛点、待办 |
| 3 | **架构摘要** | `ARCHITECTURE_SUMMARY.md` | 5 min | 了解系统架构和代码组织 |
| 4 | **开发工作流** | `SKILL.md` | 5 min | 了解 AI 协作开发的标准流程、Prompt 模板和行为规范 |

### 5.2 开发具体功能时（按需阅读）

| 任务类型 | 阅读文档 | 说明 |
|----------|----------|------|
| **与 AI 协作开发任何功能** | `SKILL.md` | **必读。** 标准工作流、Session 开场白、调试 SOP、AI 行为规范 |
| **开发前端功能** | `FRONTEND_GUIDE.md` | 前端技术规范、组件模式、API 集成 |
| **开发后端功能** | `BACKEND_GUIDE.md` | Spring Boot 规范、分层架构、已有模块参考 |
| **开发 AI 数字人模块** | `MODULE_SPEC_AI.md` | AI 模块的详细设计、数据库、API、前端交互 |
| **开发社区模块** | `MODULE_SPEC_COMMUNITY.md` | 社区模块的详细设计、数据库、API、前端交互 |
| **写论文/技术文档** | `docs/` 目录原始文档 | 参考已有的论文大纲和迁移指南 |

### 5.3 代码级细节（运行时查阅）

需要查看具体实现时，直接阅读代码：

| 查看内容 | 路径 |
|----------|------|
| 共享类型定义 | `packages/shared/src/types/index.ts` |
| API 服务封装 | `packages/api/src/services/*.ts` |
| Web 页面 | `apps/web/src/features/` 或 `apps/web/src/pages/` |
| Mobile 页面 | `apps/mobile/src/screens/` |
| 主题 tokens | `packages/theme/src/` |

## 6. 关键约束与规范

### 6.1 代码风格（强制遵守）

- **前端**：TypeScript 严格模式，函数式组件，Hooks 命名 `useXxx`，组件命名 PascalCase
- **后端**：Spring Boot 经典三层架构（Controller → Service → Repository），Java 21 语法可用
- **Monorepo**：跨包导入必须使用 `workspace:*` 协议，禁止相对路径跨包引用
- **Git 提交**：`type(scope): subject`，如 `feat(tasks): 添加任务拖拽排序`

### 6.2 当前技术债务

1. **后端迁移验证中**：NestJS 旧代码已废弃，Spring Boot 4.0.6 新代码大部分 API 已通过测试
2. **AI 模块仅 UI 占位**：Web 和 Mobile 的 companion 页面有 UI 壳子，但无真实 AI 对接
3. **社区模块仅 UI 占位**：Web 和 Mobile 的 community 页面有 UI 壳子，但无真实后端 API
4. **API 基础路径**：前端统一调用 `http://localhost:8080/api/v1/*`（Spring Boot 端口）

### 6.3 开发优先级（用户指定）

```
P0: 完成 Spring Boot 后端全功能测试（当前进行中）
P1: 开发 AI 数字人模块（后端 API + 前端对接）
P1: 开发社区模块（后端 API + 前端对接）
P2: 论文写作与技术文档完善
P3: 性能优化与部署
```

## 7. 与 AI 协作的最佳实践

### 7.1 高效沟通原则

- **给上下文**：引用本索引中的文档名，如"参考 `MODULE_SPEC_AI.md` 设计 ChatSession Entity"
- **给范围**：明确是改前端、后端还是双端，如"只在后端添加接口，前端暂时不动"
- **给现状**：说明当前代码状态，如"这个页面现在只有 Mock 数据，需要对接真实 API"
- **给约束**：说明毕设的特殊要求，如"这个功能需要能写进论文，请保留设计说明"

### 7.2 常见任务 Prompt 模板

见 `PROMPTS.md` 文件，包含以下场景的现成 Prompt：

- 开发新后端接口
- 开发新前端页面
- 对接前后端 API
- 写论文章节
- 代码重构与 Review

## 8. 文档维护

| 文档 | 维护频率 | 维护者 |
|------|----------|--------|
| `AI_CONTEXT.md` | 每月或架构大改时 | AI + 用户 |
| `PROJECT_STATUS.md` | 每周或里程碑完成时 | 用户（AI 辅助更新） |
| `ARCHITECTURE_SUMMARY.md` | 架构变更时 | AI + 用户 |
| `FRONTEND_GUIDE.md` | 前端规范变更时 | AI + 用户 |
| `BACKEND_GUIDE.md` | 后端规范变更时 | AI + 用户 |
| `MODULE_SPEC_*.md` | 模块开发过程中持续迭代 | AI + 用户 |

**更新规则**：修改后请在文档顶部更新版本号和日期，并在末尾添加变更日志。

---

**最后更新**：2026-05-11 by Claude Code  
**版本**：v1.1
