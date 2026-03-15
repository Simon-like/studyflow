# Cross-Platform Component Development

StudyFlow跨平台组件开发指南 - 如何在Web和Mobile之间实现业务逻辑复用。

---

## 概述

StudyFlow采用Monorepo架构，同时维护Web(React)和Mobile(React Native)两个应用。本Skill提供跨平台组件开发的最佳实践。

## 核心原则

### 1. 关注点分离

```
┌─────────────────────────────────────────────────────────────┐
│                    跨平台组件架构                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 Business Logic (共享)                │   │
│  │  hooks/usePomodoro.ts  ──  番茄钟业务逻辑            │   │
│  │  hooks/useTasks.ts     ──  任务管理逻辑              │   │
│  │  utils/calculations.ts ──  通用计算逻辑              │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│            ┌───────────────┼───────────────┐                │
│            ▼               ▼               ▼                │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐       │
│  │  Web UI     │   │  Mobile UI  │   │  Shared UI  │       │
│  │  (React)    │   │  (RN)       │   │  (Types)    │       │
│  └─────────────┘   └─────────────┘   └─────────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. 代码组织规范

```typescript
// ✅ 正确：业务逻辑与UI分离
// packages/shared/src/hooks/useTaskOperations.ts
export function useTaskOperations() {
  const queryClient = useQueryClient();
  
  const toggleTask = useMutation({
    mutationFn: api.task.toggleStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
  
  return { toggleTask };
}

// apps/web/src/features/tasks/TaskCard.tsx
export function TaskCard({ task }: { task: Task }) {
  const { toggleTask } = useTaskOperations();
  
  return (
    <div onClick={() => toggleTask.mutate(task.id)}>
      {task.title}
    </div>
  );
}

// apps/mobile/src/components/TaskCard.tsx
export function TaskCard({ task }: { task: Task }) {
  const { toggleTask } = useTaskOperations();
  
  return (
    <TouchableOpacity onPress={() => toggleTask.mutate(task.id)}>
      <Text>{task.title}</Text>
    </TouchableOpacity>
  );
}
```

## 组件开发模式

### 模式1: 完全复用（仅类型和逻辑）

适用于业务逻辑复杂、UI差异大的组件。

```typescript
// packages/shared/src/hooks/usePomodoro.ts
export interface UsePomodoroOptions {
  defaultDuration?: number;
  onComplete?: () => void;
}

export function usePomodoro(options: UsePomodoroOptions = {}) {
  const [timeLeft, setTimeLeft] = useState(options.defaultDuration ?? 1500);
  const [status, setStatus] = useState<PomodoroStatus>('idle');
  
  // 业务逻辑...
  
  return {
    timeLeft,
    status,
    start: () => setStatus('running'),
    pause: () => setStatus('paused'),
    stop: () => setStatus('idle'),
  };
}

// Web使用
function WebTimer() {
  const { timeLeft, status, start } = usePomodoro();
  return <div>{timeLeft}</div>;
}

// Mobile使用
function MobileTimer() {
  const { timeLeft, status, start } = usePomodoro();
  return <Text>{timeLeft}</Text>;
}
```

### 模式2: 平台特定组件 + 共享逻辑

适用于需要定制化UI但业务逻辑相同的场景。

```typescript
// packages/shared/src/components/PomodoroTimer/types.ts
export interface PomodoroTimerProps {
  timeLeft: number;
  status: PomodoroStatus;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}

// apps/web/src/components/PomodoroTimer/index.tsx
export function PomodoroTimer(props: PomodoroTimerProps) {
  return (
    <div className="pomodoro-timer">
      <TimerRing timeLeft={props.timeLeft} />
      <button onClick={props.onStart}>开始</button>
    </div>
  );
}

// apps/mobile/src/components/PomodoroTimer/index.tsx
export function PomodoroTimer(props: PomodoroTimerProps) {
  return (
    <View style={styles.container}>
      <TimerRing timeLeft={props.timeLeft} />
      <Button onPress={props.onStart} title="开始" />
    </View>
  );
}
```

### 模式3: 条件编译（平台适配器）

适用于小差异的样式调整。

```typescript
// packages/shared/src/utils/platform.ts
export const isWeb = () => typeof window !== 'undefined' && !navigator.userAgent.includes('ReactNative');
export const isMobile = () => !isWeb();

// 使用
import { isWeb } from '@studyflow/shared';

const containerStyle = isWeb() 
  ? { display: 'flex', padding: 20 }
  : { flex: 1, padding: 16 };
```

## 文件组织规范

### Web应用 (`apps/web`)

```
src/
├── components/
│   ├── ui/                    # 基础UI组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── business/              # 业务组件
│   │   ├── PomodoroTimer/
│   │   ├── TaskCard/
│   │   └── StatsChart/
│   └── layout/                # 布局组件
│       ├── Header.tsx
│       └── Sidebar.tsx
├── features/                  # 功能模块
│   ├── dashboard/
│   ├── tasks/
│   ├── stats/
│   ├── companion/            # AI数字人
│   └── community/            # 社区
├── stores/                    # Zustand状态
└── hooks/                     # 自定义Hooks
```

### Mobile应用 (`apps/mobile`)

```
src/
├── components/
│   ├── ui/                    # 基础UI组件（RN样式）
│   ├── business/              # 业务组件
│   └── layout/                # 布局组件
├── screens/                   # 页面（对应Web的features）
│   ├── Home/                 # 对应 dashboard
│   ├── Tasks/
│   ├── Stats/
│   ├── Companion/
│   └── Community/
├── navigation/                # 导航配置
├── stores/                    # 复用packages或本地
└── hooks/                     # 自定义Hooks
```

## 命名规范

| 类型 | Web | Mobile | 示例 |
|------|-----|--------|------|
| 组件文件 | PascalCase | PascalCase | `PomodoroTimer.tsx` |
| Hook文件 | camelCase | camelCase | `usePomodoro.ts` |
| 样式文件 | `ComponentName.module.css` | 内联StyleSheet | - |
| 工具函数 | camelCase | camelCase | `formatDuration.ts` |
| 类型定义 | PascalCase | PascalCase | `PomodoroTimerProps` |

## 类型共享规范

```typescript
// ✅ 正确：在shared包定义类型
// packages/shared/src/types/components.ts
export interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onSelect?: (task: Task) => void;
  selected?: boolean;
}

// Web和Mobile都导入使用
import type { TaskCardProps } from '@studyflow/shared';
```

## 常见反模式

```typescript
// ❌ 错误：在shared包引入平台特定代码
// packages/shared/src/utils/bad-example.ts
import { View } from 'react-native'; // 错误！

// ❌ 错误：直接操作DOM而不检查平台
function badExample() {
  document.getElementById('timer'); // Mobile会崩溃！
}

// ❌ 错误：复制粘贴业务逻辑
// Web和Mobile各自实现相同的toggle逻辑

// ✅ 正确：平台无关的工具函数
function goodExample() {
  return formatDuration(seconds); // 纯函数，无平台依赖
}
```

## 开发检查清单

- [ ] 业务逻辑是否提取到shared包或hooks?
- [ ] 组件props类型是否在shared定义?
- [ ] 平台特定代码是否有条件判断?
- [ ] 是否遵循文件命名规范?
- [ ] 样式是否使用theme包的设计令牌?

## 相关链接

- [ARCHITECTURE.md](../../docs/ARCHITECTURE.md) - 系统架构
- [API_SPEC.md](../../docs/API_SPEC.md) - API接口规范
- [@studyflow/shared](../../packages/shared/) - 共享包
