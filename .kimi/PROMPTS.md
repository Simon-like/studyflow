# StudyFlow — AI 使用 Prompt 模板

> **版本**：v1.0  
> **更新日期**：2026-05-11  
> **用途**：提供经过设计的 Prompt 模板，让用户可以高效地与 AI 协作完成 StudyFlow 项目中的各类任务。  
> **使用方式**：复制对应场景的 Prompt，填入 `[方括号]` 中的变量后发送给 AI。

---

## 1. 通用前置指令（推荐每次对话开头使用）

```
你现在是一位熟悉 StudyFlow 项目的全栈开发专家。

在开始工作前，请按以下顺序阅读项目上下文：
1. 先阅读 `.kimi/AI_CONTEXT.md` 了解项目全局
2. 再阅读 `.kimi/PROJECT_STATUS.md` 了解当前进度和痛点
3. 根据你的任务，选择性阅读相关规范文档

项目关键信息：
- 毕设项目，题目《基于 Spring Boot 的智能学习计划系统设计与实现》
- 技术栈：前端 React 19 + RN/Expo，后端 Spring Boot 3.2 + Java 21
- Monorepo：pnpm workspace + Turbo
- 当前状态：NestJS→SpringBoot 迁移完成，正在测试中
- 最大痛点：AI 数字人模块和社区模块尚未开发

请严格遵守项目中的代码规范和架构设计，不要引入与现有技术栈冲突的依赖。
```

---

## 2. 后端开发类 Prompt

### 2.1 开发新模块的完整后端

```
请为 StudyFlow 项目开发 [模块名称] 模块的完整后端代码。

背景：
- 参考 `.kimi/MODULE_SPEC_[AI/COMMUNITY].md` 中的数据库设计和 API 定义
- 后端采用 Spring Boot 3.2 + Java 21 + Spring Data JPA
- 遵循 `.kimi/BACKEND_GUIDE.md` 中的分层架构规范

需要交付的文件（按依赖顺序）：
1. Entity 实体类（含 JPA 注解、索引、关联关系）
2. Repository 接口（含自定义查询方法）
3. Request/Response DTO（含 Jakarta Validation 注解）
4. Service 接口和实现（含业务逻辑、@Transactional）
5. Controller（含 Swagger @Operation/@Tag 注解）
6. ErrorCode 枚举补充（如有新错误码）

具体要求：
- [补充具体业务规则，如：帖子发布需要内容审核、点赞需要防重复]
- 使用 Lombok @RequiredArgsConstructor 进行依赖注入
- 统一返回 ApiResponse 包装
- 复杂查询优先使用 @Query 注解
- 为每个方法添加合适的日志记录

请先生成文件清单，确认后逐个生成代码文件。
```

### 2.2 开发单个 API 接口

```
请在 [Controller名称] 中添加一个新的 API 接口。

接口信息：
- 方法：[GET/POST/PUT/DELETE]
- 路径：[路径]
- 功能描述：[描述]
- 请求参数：[参数列表]
- 响应数据：[响应结构]

要求：
- 参考同一 Controller 中已有接口的风格
- 参数校验使用 Jakarta Bean Validation
- 使用 @Operation 添加 Swagger 文档
- 调用已有的 Service 方法，不要直接操作 Repository
```

### 2.3 修复后端 Bug

```
StudyFlow 后端出现了一个 Bug，请帮忙修复。

问题描述：
[描述问题现象]

相关代码：
```java
[粘贴相关代码]
```

错误日志（如有）：
```
[粘贴错误日志]
```

要求：
- 只修改必要的代码，保持最小变更
- 修复后确保不影响其他功能
- 如果涉及事务或并发，请特别注意数据一致性
```

---

## 3. 前端开发类 Prompt

### 3.1 对接后端 API（前端已有 UI，需接入真实数据）

```
StudyFlow 的 [页面/组件名称] 当前使用 Mock 数据，请帮我对接真实后端 API。

当前状态：
- 后端 API 已就绪，路径：[API 路径]
- 前端 UI 组件已搭建，位置：[文件路径]
- 当前使用 Mock 数据：[简要描述]

需要完成的工作：
1. 在 `packages/shared/src/types/index.ts` 中补充/确认类型定义
2. 在 `packages/api/src/services/` 中创建/更新 Service 封装
3. 在 `packages/api/src/index.ts` 中导出
4. 修改前端页面/组件，替换 Mock 数据为真实 API 调用
5. 处理加载状态（Skeleton）和错误状态（ErrorBoundary/Toast）
6. 使用 TanStack Query 管理服务端状态（queryKey 遵循规范）

要求：
- Web 和 Mobile 双端都要对接（如果该功能双端都有）
- 遵循 `.kimi/FRONTEND_GUIDE.md` 中的跨平台规范
- 使用乐观更新（Optimistic Update）提升交互体验
```

### 3.2 开发新前端页面/组件

```
请为 StudyFlow 开发一个新的前端页面/组件：[名称]。

需求描述：
[功能描述]

设计参考：
- [如有设计稿或参考页面，请描述]

技术约束：
- Web 端使用 React 19 + Tailwind CSS，位置：`apps/web/src/features/[feature]/`
- Mobile 端使用 React Native + Expo，位置：`apps/mobile/src/screens/[Screen]/`
- 共享类型放在 `packages/shared/src/types/`
- API 封装放在 `packages/api/src/services/`

要求：
1. 先设计组件结构和 Props 接口
2. 实现 Web 版本
3. 实现 Mobile 版本（复用业务逻辑，UI 分别实现）
4. 接入已有的主题系统（@studyflow/theme）
5. 添加适当的加载和空状态处理
```

### 3.3 修复前端 Bug

```
StudyFlow 前端出现了一个 Bug，请帮忙修复。

问题描述：
[描述问题现象，如：点击按钮无响应 / 数据更新后 UI 未刷新 / 样式错乱]

环境：
- [Web / Mobile / 双端]
- 浏览器/模拟器：[版本]

相关代码：
```tsx
[粘贴相关代码]
```

要求：
- 只修改必要的代码
- 如果是状态管理问题，检查 TanStack Query 的 queryKey 和 invalidateQueries
- 如果是样式问题，确保使用主题令牌而非硬编码值
```

---

## 4. 全栈功能开发类 Prompt

### 4.1 端到端开发一个完整功能

```
请为 StudyFlow 端到端开发一个完整功能：[功能名称]。

功能需求：
[详细描述功能需求]

涉及范围：
- 后端：Entity + Repository + Service + Controller + DTO
- 前端：类型 + API Service + Query Hooks + Web 页面 + Mobile 页面

参考文档：
- 后端规范：`.kimi/BACKEND_GUIDE.md`
- 前端规范：`.kimi/FRONTEND_GUIDE.md`
- 模块规范（如有）：`.kimi/MODULE_SPEC_*.md`

开发顺序：
1. 后端数据库实体和 Repository
2. 后端 DTO 和 Service
3. 后端 Controller API
4. 前端共享类型
5. 前端 API Service
6. 前端 TanStack Query Hooks
7. Web 端 UI
8. Mobile 端 UI
9. 端到端联调检查

请按顺序逐个交付，每完成一步由我确认后再进行下一步。
```

---

## 5. 论文写作类 Prompt

### 5.1 撰写论文章节

```
请帮我撰写毕业论文的 [章节名称]。

论文题目：基于 Spring Boot 的智能学习计划系统设计与实现
当前章节：第 [X] 章 [章节标题]
目标字数：[XXXX] 字

已有参考资料：
- 项目架构文档：`docs/项目设计文档or指南/ARCHITECTURE.md`
- 迁移指南：`docs/项目设计文档or指南/NestJS到SpringBoot无痛迁移指南.md`
- 论文大纲：`docs/毕业论文_第一版_大纲与详细内容.md`
- 中期总结：`docs/项目设计文档or指南/MID_TERM_SUMMARY.md`

写作要求：
1. 符合本科毕业论文规范，语言学术化但不晦涩
2. 包含必要的图表占位符（如：【此处插入架构图】）
3. 代码示例要精简，只展示核心逻辑
4. 突出技术难点和解决方案
5. 与项目实际代码保持一致，不要虚构未实现的功能

请先输出章节大纲，确认后再输出完整内容。
```

### 5.2 将代码转换为论文表述

```
请将以下代码/技术方案转换为适合毕业论文的学术表述。

原始内容：
```
[粘贴代码或技术描述]
```

要求：
- 转换为第三人称、学术化的描述
- 说明设计思路、关键技术和创新点
- 补充必要的背景介绍（让读者理解为什么这样设计）
- 字数控制在 [XXX] 字左右
```

---

## 6. 代码审查与重构类 Prompt

### 6.1 代码 Review

```
请对以下代码进行 Review，按照 StudyFlow 项目规范检查。

代码文件：[文件路径]
```
[粘贴代码]
```

检查清单：
- [ ] 是否符合分层架构（Controller/Service/Repository 职责清晰）
- [ ] 是否使用构造函数注入
- [ ] 是否正确使用 @Transactional
- [ ] 是否有合适的参数校验
- [ ] 是否有日志记录
- [ ] 异常处理是否规范
- [ ] 命名是否符合项目规范
- [ ] 是否存在性能隐患（N+1、大事务等）
- [ ] 前端：是否正确使用 TanStack Query
- [ ] 前端：是否使用主题令牌而非硬编码

请逐条输出检查结果，对有问题的地方给出修改建议。
```

### 6.2 技术债务清理

```
StudyFlow 项目中有以下技术债务需要清理：

[描述技术债务，如：
- 某些接口返回格式不统一
- 前端有重复的业务逻辑
- 某些字段命名不一致
]

相关文件：
- [文件路径1]
- [文件路径2]

请提供清理方案：
1. 问题根因分析
2. 重构步骤（确保不影响现有功能）
3. 预期收益
4. 风险点

如果方案合理，请直接执行重构并展示修改后的代码。
```

---

## 7. 调试与排查类 Prompt

### 7.1 端到端问题排查

```
StudyFlow 出现了一个端到端问题，请帮忙排查。

现象：
[描述现象]

已确认的线索：
- 前端表现：[表现]
- 后端日志：[日志]
- 数据库状态：[状态]
- 网络请求：[请求/响应]

请按以下步骤排查：
1. 判断问题发生在前端、后端还是数据传输环节
2. 定位具体代码位置
3. 给出根因分析
4. 提供修复方案
```

---

## 8. 高效协作技巧

### 8.1 让 AI 快速理解上下文

**高效方式**（推荐）：
```
请基于 `.kimi/MODULE_SPEC_AI.md` 中的设计，帮我实现 ChatSession 的 Repository 层。
要求使用 Spring Data JPA，支持按 userId 分页查询和按 createdAt 排序。
```

**低效方式**（避免）：
```
帮我写一个数据库查询接口。
```

### 8.2 控制输出范围

**明确边界**：
```
请只修改后端代码，前端暂时不动。
```

**分步执行**：
```
请先生成 Entity 和 Repository，我确认后再生成 Service。
```

### 8.3 保持上下文连续性

在同一会话中开发相关功能时，使用：
```
基于刚才创建的 ChatSession Entity，继续创建 ChatMessage Entity。
要求：与 ChatSession 建立多对一关联，按 sessionId + createdAt 建立复合索引。
```

---

## 9. Prompt 自定义扩展

用户可以根据以下模板自行扩展 Prompt：

```
请 [动作] [目标]。

背景：
- 项目：[StudyFlow 毕设项目]
- 技术栈：[相关技术]
- 参考文档：[.kimi/ 下的文档路径]

约束：
- [约束1]
- [约束2]

交付物：
1. [交付物1]
2. [交付物2]

请 [先给大纲/直接生成/分步执行]。
```

---

## 10. 变更日志

| 日期 | 版本 | 变更内容 | 变更者 |
|------|------|----------|--------|
| 2026-05-11 | v1.0 | 初始创建，覆盖后端/前端/全栈/论文/Review/调试 6 大场景 | Kimi Code CLI |

---

**最后更新**：2026-05-11  
**版本**：v1.0
