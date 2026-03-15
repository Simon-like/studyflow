# Monorepo Development Workflow

StudyFlow Monorepo开发工作流指南 - 如何高效地在多包项目中协作开发。

---

## 概述

StudyFlow使用pnpm workspace + Turbo构建Monorepo，包含apps(web/mobile)和packages(shared/api/theme)多个包。本Skill提供标准化的开发工作流。

## 工作空间结构

```
studyflow/
├── apps/                      # 应用层
│   ├── web/                   # @studyflow/web
│   └── mobile/                # @studyflow/mobile
├── packages/                  # 共享包
│   ├── shared/                # @studyflow/shared (类型/常量/工具)
│   ├── api/                   # @studyflow/api (HTTP客户端/服务)
│   └── theme/                 # @studyflow/theme (设计令牌)
├── pnpm-workspace.yaml        # 工作空间配置
└── turbo.json                 # 构建管道配置
```

## 日常开发工作流

### 1. 启动开发环境

```bash
# 安装依赖（首次或package.json变更后）
pnpm install

# 构建所有packages（首次或shared/api变更后）
pnpm build:packages

# 启动所有应用开发服务器
pnpm dev

# 仅启动Web
pnpm dev:web

# 仅启动Mobile
pnpm dev:mobile
```

### 2. 修改shared包后的工作流

```bash
# 1. 修改 packages/shared/src/*

# 2. 重新构建shared包
pnpm turbo run build --filter=@studyflow/shared

# 或构建所有依赖包
pnpm build:packages

# 3. 应用会自动热更新（需要确认类型正确传播）
```

### 3. 添加新依赖

```bash
# 添加到根（devDependencies，如lint工具）
pnpm add -D eslint@latest -w

# 添加到特定app
pnpm add zustand --filter=@studyflow/web
pnpm add @react-navigation/native --filter=@studyflow/mobile

# 添加到package（会被apps继承）
pnpm add axios --filter=@studyflow/api

# 添加内部依赖（workspace协议）
pnpm add @studyflow/shared@workspace:* --filter=@studyflow/api
```

## 包依赖关系

```
                    ┌─────────────┐
                    │   @studyflow │
                    │   /shared    │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │ @studyflow  │ │ @studyflow  │ │ @studyflow  │
    │ /api        │ │ /theme      │ │ /web        │
    └──────┬──────┘ └─────────────┘ └──────┬──────┘
           │                               │
           └───────────────┬───────────────┘
                           ▼
                    ┌─────────────┐
                    │ @studyflow  │
                    │ /mobile     │
                    └─────────────┘
```

## 代码共享规范

### 什么应该放入shared包?

```typescript
// ✅ 应该放入shared
// packages/shared/src/types/index.ts
export interface Task { ... }
export interface User { ... }
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

// packages/shared/src/constants/index.ts
export const DEFAULT_FOCUS_DURATION = 1500;
export const API_ENDPOINTS = { ... };

// packages/shared/src/utils/index.ts
export function formatDuration(seconds: number): string { ... }
export function calculateProgress(current: number, total: number): number { ... }
```

### 什么不应该放入shared包?

```typescript
// ❌ 不应该放入shared
// - 平台特定的代码（React/React Native组件）
// - 平台特定的API（localStorage/AsyncStorage直接使用）
// - UI相关的hooks（useWindowSize等）
// - 应用特定的业务逻辑
```

## Turbo构建配置

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {}
  }
}
```

### 构建命令详解

```bash
# 构建所有包（按依赖顺序）
pnpm turbo run build

# 构建特定包及其依赖
pnpm turbo run build --filter=@studyflow/web

# 构建引用某包的所有包
pnpm turbo run build --filter=...@studyflow/shared

# 仅构建某包（不构建依赖）
pnpm turbo run build --filter=@studyflow/shared --no-deps
```

## Git工作流

### 分支命名规范

```
feature/task-management       # 新功能
debug/fix-task-toggle         # Bug修复
refactor/extract-hooks        # 重构
docs/api-documentation        # 文档
chore/update-dependencies     # 杂项
```

### 提交信息规范

```
type(scope): subject

body (optional)

footer (optional)
```

类型：
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档变更
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具变更

示例：
```
feat(tasks): 添加任务拖拽排序功能

- 集成@dnd-kit实现拖拽
- 添加reorder API调用
- 乐观更新UI

Closes #123
```

### 跨包修改的提交策略

```bash
# 场景：修改shared类型，同时更新web和mobile

# ✅ 方式1：单提交（推荐小改动）
git add .
git commit -m "feat(shared): 添加TaskPriority类型并更新双端使用"

# ✅ 方式2：多提交（推荐大改动）
git add packages/shared/
git commit -m "feat(shared): 添加TaskPriority类型"

git add apps/web/
git commit -m "feat(web): 集成TaskPriority类型"

git add apps/mobile/
git commit -m "feat(mobile): 集成TaskPriority类型"
```

## 版本管理

### 使用Changeset

```bash
# 添加变更集
pnpm changeset

# 选择受影响的包
# 选择版本类型（patch/minor/major）
# 填写变更描述

# 版本提升
pnpm version-packages

# 发布
pnpm release
```

## 故障排查

### 问题1: 类型更新不生效

```bash
# 现象：修改shared类型后，web/mobile报错

# 解决：
1. pnpm build:packages
2. 重启TypeScript服务（VSCode: Cmd+Shift+P > TypeScript: Restart）
3. 检查apps/package.json中的依赖是否为workspace:*
```

### 问题2: 循环依赖

```bash
# 检查循环依赖
pnpm mls

# 解决：
# - 提取公共代码到更底层的包
# - 使用类型导入（import type）而非值导入
```

### 问题3: 构建缓存问题

```bash
# 清除Turbo缓存
pnpm turbo run clean
rm -rf .turbo

# 完全重置
pnpm clean
pnpm install
pnpm build:packages
```

## 最佳实践

1. **优先使用workspace协议**
   ```json
   "dependencies": {
     "@studyflow/shared": "workspace:*"
   }
   ```

2. **避免相对路径导入跨包代码**
   ```typescript
   // ❌ 错误
   import { Task } from '../../../packages/shared/src/types';
   
   // ✅ 正确
   import type { Task } from '@studyflow/shared';
   ```

3. **Shared包保持纯TypeScript**
   - 不依赖React/React Native
   - 不依赖DOM API
   - 纯函数优先

4. **API包保持平台无关**
   - 使用axios而非fetch（RN和Web都支持）
   - 不直接操作localStorage/AsyncStorage

## 相关链接

- [pnpm workspaces](https://pnpm.io/workspaces)
- [Turborepo](https://turbo.build/repo)
- [Changesets](https://github.com/changesets/changesets)
