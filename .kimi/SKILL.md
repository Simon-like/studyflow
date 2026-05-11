# StudyFlow — AI 全栈协作开发工作流

> **版本**：v1.0  
> **更新日期**：2026-05-11  
> **用途**：定义 AI 在 StudyFlow 项目中的标准协作开发工作流，确保人机协作高效、一致、可验证。  
> **面向读者**：所有参与 StudyFlow 开发的 AI 大模型（Claude、Kimi、GPT 等）  
> **核心心法**：把 AI 当成一个有无限耐心、能执行命令、但需要明确指令的资深全栈工程师。**你负责决策和验收，AI 负责实现和验证。**

---

## 1. 工作流总览：「TDD 式对话开发」

```
需求描述 → 架构设计 → 契约定义 → 并行实现 → 自动测试 → 联调修复 → 提交代码
   ↑                                                                              ↓
   └──────────────────── 上下文循环（一个 Session 尽量做完一个完整功能）────────────┘
```

### 关键原则

| 原则 | 说明 |
|------|------|
| **一个 Session 一个功能点** | 不要跨 Session 做上下文不连续的事。每个 Session 聚焦一个可交付的功能（如"完成社区模块的帖子发布 API + 前端发布页面"） |
| **契约先行** | 先写类型/接口/Entity，再写实现。让 AI 有明确的验证标准 |
| **测试驱动验证** | 每完成一层（后端 API / 前端页面），立即执行命令验证（curl / build / lint） |
| **让 AI 操作文件系统** | 多用 WriteFile/StrReplaceFile 和 Shell 工具，少让 AI 只给代码块 |
| **保持技术栈纯净** | 不引入与现有技术栈冲突的新依赖。如不确定，先询问用户确认 |

---

## 2. 技术栈速查（本项目专用）

在开发任何功能前，AI 必须确认自己使用了正确的技术栈：

| 层级 | 技术 | 版本 | 备注 |
|------|------|------|------|
| **Web 前端** | React + Vite + Tailwind CSS | React 19 | 函数式组件 + Hooks |
| **Mobile 前端** | React Native + Expo | Expo 55 | 复用 `@studyflow/api` |
| **状态管理** | TanStack Query + Zustand | v5 / v4 | Query 管服务端，Zustand 管客户端 |
| **后端** | Spring Boot | 3.2 + Java 21 | 分层架构：Controller → Service → Repository |
| **数据库** | PostgreSQL | 16 | 主数据库 |
| **缓存** | Redis | 7 | Token / 热点数据 / Feeds 缓存 |
| **ORM** | Spring Data JPA (Hibernate) | 6.4 | Entity 注解映射 |
| **安全** | Spring Security + JWT | 6.2 | 自定义 JwtAuthenticationFilter |
| **Monorepo** | pnpm workspace + Turbo | 10.16 / 1.13 | `workspace:*` 协议 |
| **API 文档** | SpringDoc OpenAPI | 2.3 | Swagger 自动生成 |

**技术栈红线**：禁止引入 Vue/Angular/NestJS/Prisma/MyBatis 等与当前技术栈冲突的框架或工具。

---

## 3. 标准 Session 开场白

每次开新 Session 时，用户应使用以下模板快速建立上下文。AI 收到后应按顺序执行：

```
我现在在做 StudyFlow 全栈开发，技术栈 React 19 + RN/Expo + Spring Boot 3.2 + PostgreSQL。

当前 Session 目标：实现【具体功能，如：社区模块的帖子发布功能（后端 API + Web/Mobile 前端发布页）】。

请先阅读项目上下文：
1. `.kimi/AI_CONTEXT.md` —— 了解项目全局
2. `.kimi/PROJECT_STATUS.md` —— 了解当前进度
3. 【如开发特定模块】`.kimi/MODULE_SPEC_*.md` —— 了解模块设计
4. `.kimi/BACKEND_GUIDE.md` 或 `.kimi/FRONTEND_GUIDE.md` —— 了解代码规范

相关文件（请读取以了解现有风格）：
- 后端实体/Controller/Service：【文件路径】
- 前端 API Service：【文件路径】
- 前端页面：【文件路径】
- 共享类型：【文件路径】

请按以下顺序执行：
1. 读取上述文件和上下文文档，了解现有代码风格
2. 给出实现方案（先不执行，给我看设计思路：涉及哪些文件、接口定义、关键逻辑）
3. 我确认后，再创建/修改文件
4. 执行 lint/build/test 验证
5. 给我变更摘要和下一步建议
```

---

## 4. 阶段详解

### 阶段 1：契约先行（API 契约是前后端联调的生命线）

这是全栈开发最省时间的技巧：**先让 AI 生成前后端共享的契约，再并行实现。**

#### 执行顺序

```
[1] 定义共享类型（packages/shared/src/types/）
    │
    ▼
[2] 定义后端 Entity + DTO（Spring Boot）
    │
    ▼
[3] 定义后端 Controller 接口（Swagger 注解）
    │
    ▼
[4] 定义前端 API Service（packages/api/src/services/）
    │
    ▼
[5] 定义前端 TanStack Query Hooks（packages/api/src/hooks/）
    │
    ▼
[6] 我确认契约无误后，AI 再填充 Service 实现和前端 UI
```

#### Prompt 模板（契约定义）

```
我要实现【功能名称】，请按以下顺序定义契约：

1. 在 `packages/shared/src/types/index.ts` 中补充类型：
   - 【类型名】：{ 字段说明 }

2. 在 `packages/api/src/services/` 中创建/更新 Service 接口：
   - 【方法名】(参数) => 返回类型

3. 在后端创建 Entity（如需要新表）：
   - 表名：【表名】
   - 字段：【字段列表】
   - 索引：【索引设计】

4. 在后端创建 Request/Response DTO：
   - 请求 DTO：字段 + Validation 注解
   - 响应 DTO：字段

5. 在后端创建 Controller 接口定义：
   - HTTP 方法 + 路径
   - Swagger @Operation 描述
   - 参数和响应类型

请只输出这些契约定义（类型、接口签名、Entity 结构），不要写实现逻辑。
我确认后，你再继续实现。
```

#### AI 操作要求

- 使用 `@` 引用文件路径，如 `@packages/shared/src/types/index.ts`，让 AI 读取现有风格
- 后端 Controller 必须同时生成 Swagger `@Operation` + `@Tag` 注解
- 共享类型一旦定义，前后端必须从同一源导入，禁止各自重新定义

---

### 阶段 2：后端实现（Spring Boot）

#### 2.1 新增模块的标准文件顺序

```
[1] Entity（entity/Xxx.java）
    - @Entity, @Table, 索引, 关联关系
[2] Repository（repository/XxxRepository.java）
    - 继承 JpaRepository，定义查询方法
[3] DTO（dto/xxx/）
    - Request: @Valid 校验注解
    - Response: 纯数据字段
[4] Service（service/XxxService.java）
    - @Service, @Transactional, 业务逻辑
[5] Controller（controller/XxxController.java）
    - @RestController, @RequestMapping("/api/v1/xxx"), Swagger 注解
[6] ErrorCode 补充（如需要新错误码）
[7] application.yml 配置补充（如有新配置项）
```

#### 2.2 Prompt 模板（后端接口开发）

```
我要给 Spring Boot 后端添加【功能名称】。

契约已确认（参考上面的定义），请实现：

1. 创建/修改以下文件：
   - 【Entity 路径】
   - 【Repository 路径】
   - 【Service 路径】
   - 【Controller 路径】

2. 要求：
   - 使用构造函数注入（@RequiredArgsConstructor），禁止字段注入
   - Service 类标记 @Transactional(readOnly = true)，写操作方法单独标记 @Transactional
   - 统一返回 ApiResponse 包装
   - 复杂查询使用 @Query 注解
   - 为每个方法添加合适的日志（log.info / log.debug）
   -  Swagger 注解完整（@Tag, @Operation, @Schema）

3. 实现后：
   - 启动后端（或确认已有服务运行）
   - 用 curl 测试关键接口
   - 访问 http://localhost:8080/swagger-ui.html 确认文档生成

请先告诉我文件清单，确认后执行。
```

#### 2.3 后端调试标准 SOP

**接口返回异常时**：

```
后端接口【METHOD 路径】返回了【状态码】，响应：【响应内容】。

请按以下步骤排查：
1. 读取 【Controller 文件】确认参数绑定和路径映射
2. 读取 【Service 文件】确认业务逻辑
3. 读取 【Entity/Repository】确认数据访问
4. 检查 GlobalExceptionHandler 是否捕获了异常
5. 查看 Spring Boot 控制台日志，定位具体异常堆栈
6. 用 curl 直接复现请求，对比预期和实际
7. 修复问题并重新验证
```

**数据库问题时**：

```
数据库查询报错：【错误信息】。

请排查：
1. 读取 【Entity 文件】确认表映射和字段类型
2. 读取 application.yml 确认 JPA 配置（ddl-auto / show-sql）
3. 执行 `docker compose exec postgres psql -U postgres -d studyflow -c "\dt"` 看现有表
4. 执行 `docker compose exec postgres psql -U postgres -d studyflow -c "\d 【表名】"` 看表结构
5. 如果表结构不匹配，检查 Entity 变更后是否重启了服务（JPA 自动同步）
6. 修复后重新验证
```

---

### 阶段 3：前端实现（Web + Mobile）

#### 3.1 前端实现标准顺序

```
[1] 确认共享类型（packages/shared/src/types/）
[2] 创建/更新 API Service（packages/api/src/services/xxxService.ts）
[3] 创建/更新 Query Hooks（packages/api/src/hooks/useXxx.ts）
[4] Web 端页面/组件（apps/web/src/features/xxx/）
[5] Mobile 端页面/组件（apps/mobile/src/screens/Xxx/）
[6] 路由注册（如有新页面）
```

#### 3.2 Prompt 模板（前端组件开发）

```
我要在前端实现【功能名称】。

现有上下文：
- 后端接口【METHOD 路径】已可用，返回：【返回结构】
- 请读取 【现有 API Service 路径】了解现有封装风格
- 请读取 【现有页面路径】了解当前 UI 结构

要求：
1. Web 端：
   - 使用 React 19 函数式组件
   - 使用 Tailwind CSS，从 @studyflow/theme 导入设计令牌
   - 使用 TanStack Query 获取数据（queryKey 遵循层级命名规范）
   - 实现加载状态（Skeleton）和错误状态（ErrorState）

2. Mobile 端：
   - 使用 React Native + Expo
   - 复用 Web 端的业务逻辑 hooks（@studyflow/api）
   - UI 独立实现，使用 StyleSheet
   - 适配安全区（SafeAreaWrapper）

3. 通用：
   - 双端都从 packages/shared 导入类型
   - 使用乐观更新（Optimistic Update）提升交互体验
   - 操作成功后 toast 提示并刷新相关 queryKey

请按顺序：
1. 读取现有代码了解风格
2. 给出组件结构方案（Props、State、Hooks 设计）
3. 我确认后实现并保存文件
4. 执行 pnpm build:packages 和前端 build 验证
```

#### 3.3 前端调试标准 SOP

**页面报错/白屏时**：

```
前端【Web/Mobile】的【页面路径】出现了【现象】。

请排查：
1. 读取入口文件和该页面组件，确认依赖导入正确
2. 检查 packages/api 中的 Service 是否正确导出到 index.ts
3. 执行 pnpm build:packages 确认共享包编译通过
4. Web：执行 pnpm --filter @studyflow/web build 看完整错误日志
5. Mobile：执行 npx tsc --noEmit 在 apps/mobile 下检查类型错误
6. 检查 TanStack Query 的 queryKey 是否与 invalidateQueries 匹配
7. 修复并重新验证
```

**样式/主题问题时**：

```
【Web/Mobile】的【组件名】样式不符合预期。

请排查：
1. Web：检查是否使用了 Tailwind 类名，是否从 @studyflow/theme 导入颜色
2. Mobile：检查是否使用了 theme tokens（colors, spacing, radii）
3. 禁止硬编码颜色和魔法数字
4. 检查 dark mode 类名是否正确（如使用）
5. 修复并验证
```

---

### 阶段 4：端到端联调

前后端都实现后，必须进行端到端验证。

#### 联调检查清单

| 检查项 | Web 验证 | Mobile 验证 | 后端验证 |
|--------|----------|-------------|----------|
| API 调用成功 | ✅ 浏览器 Network 面板 | ✅ 日志/调试器 | ✅ curl / Swagger |
| 数据正确显示 | ✅ UI 渲染 | ✅ UI 渲染 | ✅ 数据库查询 |
| 错误状态处理 | ✅ 断网/500 模拟 | ✅ 断网/500 模拟 | ✅ 异常日志 |
| 加载状态 | ✅ Skeleton | ✅ ActivityIndicator | - |
| 空状态 | ✅ EmptyState | ✅ EmptyState | - |
| 操作反馈 | ✅ Toast | ✅ Toast | ✅ 响应格式 |
| Token 失效 | ✅ 跳转登录 | ✅ 跳转登录 | ✅ 401 响应 |

#### Prompt 模板（联调）

```
【功能名称】的前后端都已实现，请帮我做端到端联调。

需要验证的链路：
1. 前端发起请求 → 后端接收 → 处理 → 返回 → 前端渲染
2. 异常场景：参数错误、未登录、服务器错误

请执行：
1. 启动后端（确认端口 8080）
2. 启动 Web 前端（确认端口 5173）
3. 用 curl 测试后端接口的边界情况
4. 在浏览器中操作 Web 前端，验证完整流程
5. 检查浏览器 Network 面板确认请求/响应
6. 如有问题，定位到具体文件并修复
7. 输出联调报告（通过项 / 失败项 / 修复记录）
```

---

### 阶段 5：测试与质量保障

不要等全部写完再测试。**每完成一个 Service 或一个页面，立即补测试。**

#### 5.1 后端测试

| 测试类型 | 文件位置 | 工具 | 覆盖要求 |
|----------|----------|------|----------|
| 单元测试 | `service/XxxServiceTest.java` | JUnit 5 + Mockito | Service 核心业务逻辑 |
| Controller 测试 | `controller/XxxControllerTest.java` | @WebMvcTest | 参数校验、权限、响应格式 |
| 集成测试 | `test/.../XxxIntegrationTest.java` | @SpringBootTest | 端到端 API 链路 |

#### 5.2 前端测试

| 测试类型 | 文件位置 | 工具 | 覆盖要求 |
|----------|----------|------|----------|
| Hooks 测试 | `features/xxx/hooks.test.ts` | vitest + @testing-library/react | Query hooks、Zustand store |
| 组件测试 | `features/xxx/components/Xxx.test.tsx` | vitest + @testing-library/react | 渲染、交互、状态变化 |

#### Prompt 模板（补测试）

```
请为刚才实现的【功能名称】补全测试。

后端：
1. 在 【路径】创建 Service 单元测试：
   - 使用 @ExtendWith(MockitoExtension.class)
   - Mock Repository，测试业务逻辑分支
   - 覆盖成功场景和异常场景

2. 在 【路径】创建 Controller 测试：
   - 使用 @WebMvcTest
   - 测试参数校验失败（@Valid）
   - 测试权限控制（未登录返回 401）

前端：
3. 在 【路径】创建 Hooks 测试：
   - Mock API Service
   - 测试 Query 成功/失败/重试
   - 测试 Mutation 的乐观更新和错误回滚

4. 执行测试命令：
   - 后端：`mvn test` 或 `./mvnw test`
   - 前端：`pnpm --filter @studyflow/web test`

测试失败时修复代码直到通过。
```

---

### 阶段 6：Git 提交与代码归档

#### 提交规范

```
类型(范围): 简短描述（不超过50字）

- 详细变更点1
- 详细变更点2

关联文档: .kimi/PROJECT_STATUS.md
```

| 类型 | 用途 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新（含 .kimi/ 文档） |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具变更 |

#### Prompt 模板（Git 提交）

```
我要提交今天的代码，请帮我：

1. 执行 `git status` 看变更文件
2. 执行 `git diff --stat` 看变更概览
3. 对每个逻辑独立的变更组，生成 Conventional Commits 格式的 message：
   - feat(auth): 新增 JWT 刷新令牌机制
   - fix(tasks): 修复拖拽排序后顺序丢失问题
   - docs(kimi): 更新 AI 项目规范文档
4. 分批次 `git add` 和 `git commit`
5. 最后执行 `git log --oneline -5` 给我看结果

注意：不要把 .kimi/ 文档变更和功能代码混在一个 commit 里。
```

---

## 5. 场景化工作流速查

| 场景 | 推荐工作流 | 关键 Prompt 文件 |
|------|-----------|-----------------|
| **从零开发新模块**（如 AI 数字人） | 契约先行 → Entity → Repository → Service → Controller → 前端 Service → Query Hooks → Web UI → Mobile UI → 联调 | `MODULE_SPEC_AI.md` |
| **已有 UI，对接真实 API** | 读取现有 UI → 创建后端契约 → 实现后端 → 前端替换 Mock → 联调 | `FRONTEND_GUIDE.md` |
| **后端接口开发** | 定义 DTO/Entity → Controller（Swagger）→ Service → Repository → curl 测试 | `BACKEND_GUIDE.md` |
| **前端 Bug 修复** | 给现象 → AI 读源码 → 执行 build/test → 定位 → 修复 → 验证 | 本文件「前端调试 SOP」 |
| **后端 Bug 修复** | 给现象 + 日志 → AI 读源码 → curl 复现 → 定位 → 修复 → 验证 | 本文件「后端调试 SOP」 |
| **性能优化** | 分析 Lighthouse / Chrome DevTools / JVM 监控 → 定位瓶颈 → 给出优化代码 → A/B 验证 | `performance-optimization/SKILL.md` |
| **论文写作** | 确定章节 → AI 读项目文档 → 学术化表述 → 代码示例 → 格式调整 | `PROMPTS.md` |
| **跨包重构** | 分析影响范围 → 修改 shared 类型 → 同步更新 api / web / mobile → build 验证全通过 | `monorepo-workflow/SKILL.md` |

---

## 6. AI 行为规范（必须遵守）

### 6.1 文件操作规范

- **优先直接写文件**：使用 WriteFile/StrReplaceFile 工具保存代码，不要只在回复中贴代码块
- **修改前读取**：修改已有文件前，必须先 ReadFile 读取完整内容，避免覆盖未看到的代码
- **批量确认**：一次修改超过 3 个文件时，先给出文件清单和变更摘要，等用户确认后再执行
- **备份提示**：修改核心配置文件（如 `pnpm-workspace.yaml`、`turbo.json`）前，提醒用户注意影响范围

### 6.2 代码质量规范

- **不引入无关依赖**：安装新包前说明用途，得到用户确认后再执行 `pnpm add`
- **保持风格一致**：新代码必须与同一目录下已有代码的风格一致（命名、缩进、注释）
- **类型安全优先**：TypeScript 严格模式，禁止 `any`。必须 `any` 时加 `// eslint-disable-next-line @typescript-eslint/no-explicit-any` 并注释原因
- **不要写死数据**：Mock 数据必须集中管理，方便一键切换真实 API

### 6.3 调试与验证规范

- **先复现再修复**：修复 Bug 前，必须先通过命令复现问题，确认根因
- **修复后必须验证**：修改代码后，执行相关 build/test/lint 命令验证
- **不要假设环境**：执行命令前确认服务是否运行（如 "先检查端口 8080 是否被占用"）

### 6.4 沟通规范

- **方案先确认，后实现**：涉及架构调整或新增依赖时，先给出方案概要，用户确认后再写代码
- **进度可视化**：长任务（如生成 10+ 个文件）每完成 3 个文件汇报一次进度
- **上下文引用**：提及文档时使用相对路径，如 "参考 `.kimi/BACKEND_GUIDE.md` 的分层规范"

---

## 7. 变更日志

| 日期 | 版本 | 变更内容 | 变更者 |
|------|------|----------|--------|
| 2026-05-11 | v1.0 | 初始创建，基于 TDD 式对话开发模板，适配 StudyFlow 技术栈 | Kimi Code CLI |

---

**最后更新**：2026-05-11  
**版本**：v1.0
