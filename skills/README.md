# StudyFlow 前端开发 Skills

本目录包含StudyFlow项目的前端开发专业Skill，帮助你高效地进行跨平台开发。

---

## Skill 列表

| Skill | 说明 | 适用场景 |
|-------|------|----------|
| [cross-platform-component](./cross-platform-component/) | 跨平台组件开发 | 开发Web/Mobile双端组件 |
| [monorepo-workflow](./monorepo-workflow/) | Monorepo工作流 | 日常开发、包管理、构建 |
| [api-integration](./api-integration/) | API集成与状态管理 | 对接后端API、数据获取 |
| [theme-styling](./theme-styling/) | 主题与样式开发 | 使用设计系统、保持UI一致性 |
| [performance-optimization](./performance-optimization/) | 性能优化 | 优化渲染、列表、网络性能 |

---

## 如何使用这些Skill

### 方式1: 开发前阅读（推荐）

在开始一个新功能开发前，阅读相关的Skill文档：

```
开发新功能前：
├── 涉及UI组件？ → 阅读 cross-platform-component
├── 需要调用API？ → 阅读 api-integration
├── 需要调整样式？ → 阅读 theme-styling
└── 功能涉及多包？ → 阅读 monorepo-workflow
```

### 方式2: 问题排查时查阅

遇到问题时快速定位相关Skill：

| 问题 | 查阅Skill |
|------|-----------|
| Web样式在Mobile不生效 | theme-styling |
| API数据更新UI没刷新 | api-integration |
| 列表滚动卡顿 | performance-optimization |
| 修改shared包后报错 | monorepo-workflow |
| 组件在双端表现不一致 | cross-platform-component |

### 方式3: 代码审查参考

在Code Review时使用Skill作为检查标准：

```markdown
## PR审查检查清单

- [ ] 组件是否遵循 cross-platform-component 规范？
- [ ] 状态管理是否遵循 api-integration 最佳实践？
- [ ] 样式是否使用 theme-styling 设计令牌？
- [ ] 是否有性能优化（参考 performance-optimization）？
- [ ] Monorepo变更是否遵循 monorepo-workflow？
```

---

## Skill速查表

### 跨平台组件开发

```typescript
// 快速模板
import type { Task } from '@studyflow/shared';

// 1. 在shared定义props类型
export interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
}

// 2. Web实现
export function TaskCard({ task, onToggle }: TaskCardProps) {
  return <div className="card" onClick={() => onToggle(task.id)}>{task.title}</div>;
}

// 3. Mobile实现
export function TaskCard({ task, onToggle }: TaskCardProps) {
  return <TouchableOpacity onPress={() => onToggle(task.id)}><Text>{task.title}</Text></TouchableOpacity>;
}
```

### API集成

```typescript
// 快速模板
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@studyflow/api';

// Query
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: api.task.getTasks,
  });
}

// Mutation
export function useToggleTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.task.toggleStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}
```

### 样式开发

```typescript
// Web - Tailwind
<div className="bg-coral-500 text-white p-4 rounded-lg shadow-md">

// Mobile - StyleSheet
<View style={{
  backgroundColor: colors.coral[500],
  padding: spacing.md,
  borderRadius: radii.lg,
  ...shadows.md,
}}>
```

---

## 扩展Skills

如果你需要创建新的Skill：

1. 创建新目录 `skills/your-skill-name/`
2. 添加 `SKILL.md` 文件
3. 遵循现有Skill的格式和风格
4. 在本README中添加条目

---

## 相关文档

- [项目PRD](../docs/PRD.md)
- [架构设计](../docs/ARCHITECTURE.md)
- [API规范](../docs/API_SPEC.md)
