# StudyFlow — 项目状态与进度追踪

> **版本**：v1.0  
> **更新日期**：2026-05-11  
> **用途**：记录项目当前的真实进度、已完成项、进行中和待办事项。这是 AI 了解"现在该做什么"的核心文档。  
> **更新频率**：每周或每完成一个里程碑时更新

---

## 1. 项目里程碑总览

```
[✅] Phase 0: 项目立项与环境搭建
[✅] Phase 1: MVP 核心功能开发（NestJS 后端 + 前端 UI）
[✅] Phase 1.5: NestJS → Spring Boot 后端迁移（代码层面完成）
[🔄] Phase 1.6: Spring Boot 后端全功能测试（当前进行中）
[⏳] Phase 2: AI 数字人模块开发
[🔄] Phase 3: 学习社区模块开发（Phase 1 类型契约已完成）
[⏳] Phase 4: 论文写作与答辩准备
[⏳] Phase 5: 部署与优化
```

---

## 2. 已完成模块（✅）

### 2.1 认证模块（100%）

| 功能 | 状态 | 后端 | 前端 | 说明 |
|------|------|------|------|------|
| 用户注册 | ✅ | Spring Boot | Web+Mobile | 用户名/邮箱注册，自动生成 PIN 码 |
| 用户登录 | ✅ | Spring Boot | Web+Mobile | 用户名/邮箱 + 密码登录 |
| JWT 双 Token | ✅ | Spring Boot | Web+Mobile | Access Token + Refresh Token |
| Token 自动刷新 | ✅ | Spring Boot | Web+Mobile | 客户端自动处理过期 |
| 用户登出 | ✅ | Spring Boot | Web+Mobile | 服务端注销 Refresh Token |
| 获取当前用户 | ✅ | Spring Boot | Web+Mobile | 返回当前登录用户信息 |

### 2.2 用户模块（100%）

| 功能 | 状态 | 后端 | 前端 | 说明 |
|------|------|------|------|------|
| 用户资料管理 | ✅ | Spring Boot | Web+Mobile | 头像、昵称、学习目标 |
| 头像上传 | ✅ | Spring Boot | Web+Mobile | 阿里云 OSS / 本地存储双方案 |
| 番茄钟个性化设置 | ✅ | Spring Boot | Web+Mobile | 专注时长、休息时长、自动开始 |
| 系统设置 | ✅ | Spring Boot | Web+Mobile | 主题、通知、音效、振动、语言 |
| 修改密码 | ✅ | Spring Boot | Web+Mobile | BCrypt 加密 |
| 学习日历 | ✅ | Spring Boot | Web+Mobile | 按日期范围查询学习记录 |
| 账号注销 | ✅ | Spring Boot | Web+Mobile | 软删除 |
| PIN 码系统 | ✅ | Spring Boot | Web+Mobile | 唯一用户标识码 |
| 用户标签 | ✅ | Spring Boot | Web+Mobile | JSON 存储兴趣标签 |

### 2.3 任务管理模块（100%）

| 功能 | 状态 | 后端 | 前端 | 说明 |
|------|------|------|------|------|
| 任务 CRUD | ✅ | Spring Boot | Web+Mobile | 创建、读取、更新、删除 |
| 任务状态管理 | ✅ | Spring Boot | Web+Mobile | 待办/进行中/已完成/已放弃 |
| 优先级设置 | ✅ | Spring Boot | Web+Mobile | 高/中/低枚举 |
| 学科分类 | ✅ | Spring Boot | Web+Mobile | 自定义分类标签 |
| 子任务支持 | ✅ | Spring Boot | Web+Mobile | 父子任务自关联 |
| 今日任务 | ✅ | Spring Boot | Web+Mobile | 快速筛选 |
| 拖拽排序 | ✅ | Spring Boot | Web+Mobile | 自定义显示顺序 |
| 截止日期 | ✅ | Spring Boot | Web+Mobile | 日期选择器 |
| 任务进度统计 | ✅ | Spring Boot | Web+Mobile | 周/月完成率 |

### 2.4 番茄钟模块（100%）

| 功能 | 状态 | 后端 | 前端 | 说明 |
|------|------|------|------|------|
| 开始番茄钟 | ✅ | Spring Boot | Web+Mobile | 关联任务/自由模式 |
| 暂停/恢复 | ✅ | Spring Boot | Web+Mobile | 灵活控制计时 |
| 停止番茄钟 | ✅ | Spring Boot | Web+Mobile | 正常完成/提前放弃 |
| 任务联动 | ✅ | Spring Boot | Web+Mobile | 番茄钟与任务状态联动 |
| 锁屏模式 | ✅ | Spring Boot | Web+Mobile | 专注模式防干扰 |
| 休息提醒 | ✅ | Spring Boot | Web+Mobile | 短休息/长休息自动切换 |
| 放弃原因记录 | ✅ | Spring Boot | Web+Mobile | 数据化分析干扰因素 |
| 今日/周/历史统计 | ✅ | Spring Boot | Web+Mobile | 多维度数据查询 |

### 2.5 数据统计模块（100%）

| 功能 | 状态 | 后端 | 前端 | 说明 |
|------|------|------|------|------|
| 总览统计 | ✅ | Spring Boot | Web+Mobile | 总专注时长、番茄数、连续天数 |
| 每日统计 | ✅ | Spring Boot | Web+Mobile | 日度详细数据 |
| 学科分布 | ✅ | Spring Boot | Web+Mobile | 各学科时长占比 |
| 周趋势图 | ✅ | Spring Boot | Web+Mobile | 近 7 天柱状图 |
| 连续天数 | ✅ | Spring Boot | Web+Mobile | 当前/最长连续天数 |
| 学习热力图 | ✅ | Spring Boot | Web+Mobile | 日历热力图数据 |

### 2.6 前端基础设施（100%）

| 功能 | 状态 | 说明 |
|------|------|------|
| Monorepo 架构 | ✅ | pnpm workspace + Turbo |
| Web 应用骨架 | ✅ | React 19 + Vite + Tailwind + React Router |
| Mobile 应用骨架 | ✅ | React Native + Expo + 自定义导航 |
| 共享包体系 | ✅ | @studyflow/shared / api / theme / ui |
| API 客户端 | ✅ | Axios 封装，自动 Token 注入/刷新 |
| 状态管理 | ✅ | TanStack Query + Zustand |
| 主题系统 | ✅ | 设计令牌 + 双端适配器 |
| UI 组件库 | ✅ | Button、Card、Input、Avatar、Badge、Modal 等 |

### 2.7 后端基础设施（100%）

| 功能 | 状态 | 说明 |
|------|------|------|
| Spring Boot 项目骨架 | ✅ | Spring Boot 4.0.6 经典三层架构 |
| Spring Security + JWT | ✅ | 自定义 JwtAuthenticationFilter |
| Spring Data JPA | ✅ | Entity → Repository → Service → Controller |
| Redis 集成 | ✅ | Token 存储、热点数据缓存 |
| PostgreSQL 集成 | ✅ | 主数据库 |
| 全局异常处理 | ✅ | @ControllerAdvice + 统一 ApiResponse |
| Swagger/OpenAPI | ✅ | SpringDoc 自动生成 |
| 限流中间件 | ✅ | Bucket4j 15 分钟 100 请求 |
| CORS 配置 | ✅ | 支持多域名和移动端 |
| OSS 集成 | ✅ | 阿里云 OSS SDK |
| WebSocket 多端同步 | ✅ | `/ws/sync` 端点，JWT 握手认证，心跳检测，4 级降级策略 |
| Jackson 配置 | ✅ | `@ConditionalOnMissingBean` + `findAndRegisterModules()` |

---

## 3. 进行中模块（🔄）

### 3.1 Spring Boot 后端全功能测试

**状态**：代码迁移完成，正在逐模块回归测试  
**开始时间**：2026-05-01 左右  
**预计完成**：2026-05-15  
**负责人**：用户本人

| 测试项 | 状态 | 备注 |
|--------|------|------|
| 认证 API 测试 | ✅ 通过 | 登录/注册/刷新/登出 |
| 用户 API 测试 | ✅ 通过 | 资料/设置/头像/密码，tags 字段已修复（支持 JSON 数组） |
| 任务 API 测试 | 🔄 进行中 | CRUD/排序/状态切换 |
| 番茄钟 API 测试 | ✅ 通过 | 开始/暂停/停止/联动，todayStats 字段名已对齐前端 |
| 统计 API 测试 | ✅ 通过 | overview/daily/subjects/userStats，响应格式已全部对齐前端类型 |
| WebSocket 同步 | ✅ 已实现 | 多端番茄钟同步、设置变更广播、HTTP 降级端点 |
| 端到端联调 | 🔄 进行中 | 前端 + 新后端完整流程 |

**已修复问题**：
- PUT `/users/profile` 400 错误：`tags` 字段类型从 `String` 改为 `Object`，支持 JSON 数组
- 统计 API 字段名不匹配：所有统计接口响应已对齐前端 TypeScript 类型定义
- Web 端统计页显示"48h"错误数据：后端返回 `focusMinutes` 而非 `totalFocusSeconds`
- Mobile 端统计 NaN/undefined：前端增加安全解析和空值保护
- 番茄钟完成后统计不刷新：前端 TanStack Query 缓存失效策略已完善
- 设置修改后其他设备不同步：后端已通过 WebSocket 广播 DATA_CHANGED
- 番茄钟设置跨设备不同步：Web 休息时长只更新 breakDuration 未同步 shortBreakDuration，已修复
- Mobile 端 TanStack Query 缺少 focusManager 适配：app 回前台不会自动 refetch，已集成 AppState 监听
- Web Dashboard 番茄钟不读取服务端设置：Zustand store 未从后端初始化，已添加 server sync

---

## 4. 待开发模块（⏳）—— 当前痛点

### 4.1 AI 数字人对话模块（P1 优先级）

**当前状态**：UI 已搭建，使用 Mock 数据 / 固定规则模拟 AI  
**后端状态**：Entity 已设计（ChatSession、ChatMessage、AiStudyPlan），接口未实现  
**前端状态**：Web 和 Mobile 都有 companion 页面，组件齐全但无真实数据流

| 子功能 | 后端 | 前端 | 预计工时 | 阻塞项 |
|--------|------|------|----------|--------|
| 对接 LLM API | ⏳ | N/A | 2-3 天 | 需选定供应商（OpenAI/Claude/国内模型） |
| 会话管理 CRUD | ⏳ | ⏳ | 2 天 | 后端需先实现 |
| 消息历史存储 | ⏳ | ⏳ | 1 天 | 后端需先实现 |
| 上下文记忆 | ⏳ | N/A | 2 天 | 需设计上下文压缩策略 |
| 学习计划生成 | ⏳ | ⏳ | 2-3 天 | 需设计 Prompt 模板 |
| 智能提醒 | ⏳ | ⏳ | 2 天 | 需接入推送或轮询机制 |
| 语音输入（可选） | ⏳ | ⏳ | 3-4 天 | 低优先级 |
| 情感分析（可选） | ⏳ | N/A | 2-3 天 | 低优先级 |

**技术方案预研**（参考 `docs/毕业论文_第一版_大纲与详细内容.md` 第 4.4 章）：
- 意图识别：规则匹配 + LLM 轻量分类混合策略
- 上下文管理：Redis 缓存 + 数据库持久化，支持摘要压缩
- 知识增强：RAG（向量检索 + LLM 生成），预留 KnowledgeDocument 表
- 多模型路由：预留 LLMRouter 接口，支持多厂商切换

### 4.2 学习社区模块（P1 优先级）

**当前状态**：后端 API 已完成，Web 前端已对接真实 API  
**后端状态**：Entity + Repository + Service + Controller + DTOs 全部完成，编译通过  
**前端状态**：Web 端已对接真实 API（Feeds/发帖/点赞/评论/小组），Mobile 端待对接

| 子功能 | 后端 | 前端(Web) | 前端(Mobile) | 说明 |
|--------|------|-----------|-------------|------|
| 帖子发布（文字+标签） | ✅ | ✅ | ⏳ | 图片上传待集成 OSS |
| 帖子列表 / Feeds 流 | ✅ | ✅ | ⏳ | 分页+作者信息+点赞状态 |
| 帖子详情 | ✅ | ✅ | ⏳ | 含评论+学习数据展示 |
| 评论系统（二级回复） | ✅ | ✅ | ⏳ | 一级评论+前3条回复预加载 |
| 点赞功能 | ✅ | ✅ | ⏳ | 返回 liked+likeCount |
| 学习小组列表 | ✅ | ✅ | ⏳ | 分页+分类筛选+isJoined |
| 小组加入/退出 | ✅ | ✅ | ⏳ | |
| 创建小组 | ✅ | ⏳ UI占位 | ⏳ | 需要创建小组表单页 |

**已完成的后端改造**：
- 新增 6 个 Response DTO（PostDto, CommentDto, StudyGroupDto, LikeResponseDto, PostAuthorDto, PaginatedResponse）
- CommunityService 重构：返回 DTO 而非原始 Entity，包含作者信息、点赞状态、分页格式
- CreatePostRequest 改为接受 `List<String>` 的 images/tags（前端 JSON 数组）
- 使用 ErrorCode 枚举替代硬编码异常

**已完成的前端改造**：
- 新增 TanStack Query hooks（usePosts, usePostDetail, useToggleLike, useComments, useGroups 等）
- PostCard/GroupCard 组件重构为接受真实 API 数据类型
- 新增发帖页面（/community/create）和帖子详情页（/community/post/:id）
- 社区首页 Mock 数据已替换为真实 API 调用

---

## 5. 风险与依赖

| 风险 | 等级 | 影响 | 应对策略 |
|------|------|------|----------|
| Spring Boot 测试延期 | 中 | 阻塞后续开发 | 每日推进，优先保证核心 API |
| LLM API 成本 | 中 | AI 模块可行性 | 评估国内免费/低成本 API（如通义千问、文心一言） |
| 社区内容审核 | 中 | 合规风险 | MVP 阶段先做敏感词过滤，上线前接入正式审核 |
| 论文字数不足 | 低 | 毕业风险 | 第 4 章核心章节已完成 16000 字，大纲充足 |
| 时间紧张 | 中 | 功能削减 | 优先保证 AI 模块（论文重点），社区模块可做基础版 |

---

## 6. 近期行动计划（未来 2 周）

### Week 1（5.11 - 5.17）

- [ ] 完成 Spring Boot 后端全功能测试
- [ ] 修复测试中发现的问题
- [ ] 前端与 Spring Boot 后端完成端到端联调
- [ ] 确定 AI 模块 LLM 供应商和接入方案

### Week 2（5.18 - 5.24）

- [ ] 启动 AI 数字人模块后端开发（会话管理 + LLM 对接）
- [ ] 前端 companion 页面接入真实 API
- [ ] 启动社区模块后端开发（帖子 CRUD + Feeds）← Phase 2 下一步
- [ ] 论文第 1-3 章、第 5-6 章启动写作

---

## 7. 变更日志

| 日期 | 版本 | 变更内容 | 变更者 |
|------|------|----------|--------|
| 2026-05-11 | v1.0 | 初始创建，整合所有项目进度信息 | Kimi Code CLI |
| 2026-05-11 | v1.1 | 更新测试状态（统计/番茄钟 API 通过），添加 WebSocket 同步模块，记录已修复问题 | Claude Code |

---

**最后更新**：2026-05-11  
**版本**：v1.1
