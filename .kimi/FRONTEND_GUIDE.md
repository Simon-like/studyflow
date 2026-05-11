# StudyFlow — 前端开发规范

> **版本**：v1.0  
> **更新日期**：2026-05-11  
> **用途**：指导 AI 在 StudyFlow 项目中进行前端开发，确保代码风格、架构模式和跨平台复用的一致性。  
> **阅读时长**：约 10 分钟

---

## 1. 技术栈与版本

| 用途 | 库 | 版本 | 备注 |
|------|-----|------|------|
| Web 框架 | React | 19.2.x | 使用函数式组件 + Hooks |
| Mobile 框架 | React Native | 0.83.x | 通过 Expo 管理 |
| 构建工具 | Vite (Web) / Expo CLI (Mobile) | 5.x / 55.x | |
| 样式 | Tailwind CSS (Web) / StyleSheet (Mobile) | 3.4.x | 主题令牌来自 `@studyflow/theme` |
| 服务端状态 | TanStack Query | 5.17.x | 所有服务端数据获取必须用 |
| 客户端状态 | Zustand | 4.4.x | 仅用于客户端 UI 状态 |
| HTTP 客户端 | Axios | 1.6.x | 通过 `@studyflow/api` 封装 |
| 表单 | React Hook Form (Web) | 7.49.x | 需要时选用 |
| 验证 | Zod | 3.22.x | 前后端共享验证 schema |
| 动画 | Framer Motion (Web) / Reanimated (Mobile) | 10.x / 4.x | |
| 图标 | Lucide React (Web) / 自定义 Icon (Mobile) | 0.303.x | |

---

## 2. 代码组织规范

### 2.1 目录结构原则

**Web** (`apps/web/src/`)

```
features/           # 按领域组织的功能模块（推荐新增代码放这里）
│   └── [feature]/
│       ├── components/     # 该领域专用组件
│       ├── hooks.ts        # 该领域专用 hooks
│       ├── types.ts        # 该领域专用类型
│       ├── constants.ts    # 该领域常量
│       └── index.tsx       # 页面入口/主组件
components/
│   ├── ui/             # 纯展示型基础组件（Button, Card, Input）
│   ├── business/       # 跨领域业务组件（TaskCard, PomodoroTimer）
│   └── providers/      # 全局 Provider
pages/                # 路由页面组件（尽量薄，逻辑下沉到 features）
stores/               # Zustand store 定义
hooks/                # 全局通用 hooks
router/               # 路由配置
```

**Mobile** (`apps/mobile/src/`)

```
screens/              # 屏幕页面（对应 Web 的 pages + features）
│   └── [Screen]/
│       ├── components/
│       ├── hooks.ts
│       ├── types.ts
│       ├── constants.ts
│       └── index.tsx
components/
│   ├── ui/
│   ├── business/
│   └── layout/         # 布局组件（Header, SafeAreaWrapper）
navigation/           # 导航配置
stores/
hooks/
theme/                # Mobile 主题适配
```

### 2.2 命名规范

| 类型 | Web | Mobile | 示例 |
|------|-----|--------|------|
| 组件文件 | PascalCase.tsx | PascalCase.tsx | `PomodoroTimer.tsx` |
| Hook 文件 | camelCase.ts | camelCase.ts | `usePomodoro.ts` |
| 工具函数 | camelCase.ts | camelCase.ts | `formatDuration.ts` |
| 类型/接口 | PascalCase | PascalCase | `PomodoroTimerProps` |
| 样式文件 | ComponentName.module.css | 内联 StyleSheet | - |
| Zustand Store | `useXxxStore.ts` | `useXxxStore.ts` | `useAuthStore.ts` |

### 2.3 文件模板

**新 Feature 目录模板**（Web 和 Mobile 通用结构）：

```typescript
// features/[feature]/index.tsx —— 页面入口
import { useQuery } from '@tanstack/react-query';
import { api } from '@studyflow/api';

export default function FeaturePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['feature', 'list'],
    queryFn: api.feature.getList,
  });

  if (isLoading) return <FeatureSkeleton />;
  return <FeatureView data={data?.data} />;
}

// features/[feature]/hooks.ts —— 领域 hooks
export function useFeatureList() {
  return useQuery({
    queryKey: ['feature', 'list'],
    queryFn: api.feature.getList,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.feature.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature'] });
    },
  });
}

// features/[feature]/types.ts —— 领域类型
export interface FeatureItem {
  id: string;
  name: string;
}
```

---

## 3. 跨平台开发规范

### 3.1 共享与分离的边界

```
┌─────────────────────────────────────────────────────────────┐
│                    跨平台组件架构                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │           共享层（@studyflow/shared + api）          │   │
│  │  • TypeScript 类型                                   │   │
│  │  • 常量与枚举                                        │   │
│  │  • 纯工具函数（无平台依赖）                          │   │
│  │  • TanStack Query hooks（业务逻辑）                 │   │
│  │  • API 服务封装                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│            ┌───────────────┼───────────────┐                │
│            ▼               ▼               ▼                │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐       │
│  │  Web UI     │   │  Mobile UI  │   │  Shared UI  │       │
│  │  (React)    │   │  (RN)       │   │  (Types)    │       │
│  └─────────────┘   └─────────────┘   └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 必须共享的代码

- ✅ 类型定义（`packages/shared/src/types/`）
- ✅ 常量与枚举（`packages/shared/src/constants/`）
- ✅ 纯函数工具（`packages/shared/src/utils/`）
- ✅ API 服务层（`packages/api/src/services/`）
- ✅ TanStack Query hooks（`packages/api/src/hooks/`）

### 3.3 必须分离的代码

- ❌ React 组件（Web）与 React Native 组件（Mobile）不共享
- ❌ 平台特定的 API（localStorage vs AsyncStorage）
- ❌ DOM 操作 vs Native 模块调用
- ❌ Tailwind 类名 vs StyleSheet 对象

### 3.4 跨平台组件开发模式

**模式 A：共享逻辑 + 分离 UI**（推荐，适用于大多数场景）

```typescript
// packages/shared/src/hooks/usePomodoro.ts
export function usePomodoro() {
  // 纯业务逻辑，无 UI
  const [status, setStatus] = useState<PomodoroStatus>('idle');
  // ...
  return { status, start, pause, stop };
}

// apps/web/src/components/PomodoroTimer.tsx
export function PomodoroTimer() {
  const { status, start } = usePomodoro();
  return <div className="timer">{/* Web UI */}</div>;
}

// apps/mobile/src/components/PomodoroTimer.tsx
export function PomodoroTimer() {
  const { status, start } = usePomodoro();
  return <View style={styles.timer}>{/* Mobile UI */}</View>;
}
```

**模式 B：共享 Props 类型**

```typescript
// packages/shared/src/types/components.ts
export interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onSelect?: (task: Task) => void;
}

// Web 和 Mobile 分别实现，但 props 类型一致
```

---

## 4. TanStack Query 最佳实践

### 4.1 Query Key 规范

```typescript
// packages/api/src/hooks/queryKeys.ts
export const queryKeys = {
  tasks: {
    all: ['tasks'] as const,
    lists: (filter: TaskFilter) => [...queryKeys.tasks.all, 'list', filter] as const,
    detail: (id: string) => [...queryKeys.tasks.all, 'detail', id] as const,
    today: ['tasks', 'today'] as const,
  },
  pomodoro: {
    all: ['pomodoro'] as const,
    history: (page: number) => [...queryKeys.pomodoro.all, 'history', page] as const,
    todayStats: ['pomodoro', 'stats', 'today'] as const,
  },
  stats: {
    all: ['stats'] as const,
    overview: (period: StatsPeriod) => [...queryKeys.stats.all, 'overview', period] as const,
  },
  // 新增模块的 key 请按此模式扩展
  chat: {
    all: ['chat'] as const,
    sessions: ['chat', 'sessions'] as const,
    messages: (sessionId: string) => ['chat', 'messages', sessionId] as const,
  },
  community: {
    all: ['community'] as const,
    posts: (page: number) => ['community', 'posts', page] as const,
    postDetail: (id: string) => ['community', 'post', id] as const,
    comments: (postId: string) => ['community', 'comments', postId] as const,
  },
};
```

### 4.2 Mutation 与乐观更新

```typescript
export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.task.toggleStatus,

    // 乐观更新
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all });
      const previousTasks = queryClient.getQueryData(queryKeys.tasks.today);

      queryClient.setQueryData(queryKeys.tasks.today, (old: Task[] = []) =>
        old.map(task =>
          task.id === taskId
            ? { ...task, status: task.status === 'completed' ? 'todo' : 'completed' }
            : task
        )
      );

      return { previousTasks };
    },

    onError: (err, taskId, context) => {
      queryClient.setQueryData(queryKeys.tasks.today, context?.previousTasks);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
    },
  });
}
```

### 4.3 无限滚动（社区 Feeds / 消息历史）

```typescript
export function usePosts() {
  return useInfiniteQuery({
    queryKey: queryKeys.community.posts(0),
    queryFn: ({ pageParam = 1 }) => api.community.getPosts({ page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.page >= lastPage.data.totalPages) return undefined;
      return lastPage.data.page + 1;
    },
  });
}
```

---

## 5. Zustand 状态管理规范

### 5.1 Store 划分原则

按领域拆分 store，避免大 store：

```typescript
// stores/authStore.ts —— 认证状态
// stores/pomodoroStore.ts —— 番茄钟运行时状态（跨组件共享）
// stores/uiStore.ts —— UI 状态（主题、弹窗、Toast）
// stores/settingsStore.ts —— 用户设置
```

### 5.2 Store 模板

```typescript
// stores/featureStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FeatureState {
  // State
  value: string;

  // Actions
  setValue: (v: string) => void;
  reset: () => void;
}

export const useFeatureStore = create<FeatureState>()(
  persist(
    (set) => ({
      value: '',
      setValue: (v) => set({ value: v }),
      reset: () => set({ value: '' }),
    }),
    {
      name: 'feature-storage',
      // Web: createJSONStorage(() => localStorage)
      // Mobile: createJSONStorage(() => AsyncStorage)
    }
  )
);
```

### 5.3 性能优化：精确选择

```typescript
// ❌ 错误：订阅整个 store，任何字段变化都触发重渲染
const { user } = useAuthStore();

// ✅ 正确：只订阅需要的字段
const user = useAuthStore(state => state.user);
```

---

## 6. 主题与样式规范

### 6.1 设计令牌（Source of Truth）

所有颜色、间距、圆角必须从 `@studyflow/theme` 导入，禁止硬编码：

```typescript
// ❌ 错误
<div className="bg-[#E07A5F] p-[15px]">

// ✅ 正确（Web）
import { tokens } from '@studyflow/theme';
<div className="bg-coral-500 p-4">

// ✅ 正确（Mobile）
import { colors, spacing } from '../../theme';
<View style={{ backgroundColor: colors.coral[500], padding: spacing.md }}>
```

### 6.2 核心设计令牌速查

| Token | 色值 | 用途 |
|-------|------|------|
| `coral.500` | `#E07A5F` | 主品牌色、CTA 按钮 |
| `sage.500` | `#81B29A` | 成功状态、次要操作 |
| `neutral.900` | `#3D405B` | 主文字颜色 |
| `neutral.500` | `#8E8E93` | 次要文字 |
| `neutral.200` | `#E5E5E5` | 边框、分割线 |

### 6.3 响应式（仅 Web）

```tsx
// Tailwind 响应式前缀
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## 7. API 集成规范

### 7.1 新增 API 服务的标准流程

1. **在 `packages/shared/src/types/index.ts` 中定义类型**
2. **在 `packages/api/src/services/` 中创建 service**
3. **在 `packages/api/src/index.ts` 中导出**
4. **在 `packages/api/src/hooks/` 中创建 Query/Mutation hooks**
5. **在 Web/Mobile 中使用 hooks**

### 7.2 Service 模板

```typescript
// packages/api/src/services/featureService.ts
import { httpClient } from '../client/httpClient';
import type { ApiResponse, PaginatedData } from '@studyflow/shared';

export interface CreateFeatureRequest {
  name: string;
  description?: string;
}

export interface FeatureDto {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export const featureService = {
  getList: (params?: { page?: number; size?: number }) =>
    httpClient.get<ApiResponse<PaginatedData<FeatureDto>>>('/features', { params }),

  getById: (id: string) =>
    httpClient.get<ApiResponse<FeatureDto>>(`/features/${id}`),

  create: (data: CreateFeatureRequest) =>
    httpClient.post<ApiResponse<FeatureDto>>('/features', data),

  update: (id: string, data: Partial<CreateFeatureRequest>) =>
    httpClient.put<ApiResponse<FeatureDto>>(`/features/${id}`, data),

  delete: (id: string) =>
    httpClient.delete<ApiResponse<void>>(`/features/${id}`),
};
```

### 7.3 HTTP 客户端特性

- 自动 Token 注入（从 Zustand store 读取 Access Token）
- 自动 Token 刷新（401 时静默刷新，失败则跳转登录）
- 统一错误处理（ BusinessException 转友好提示）
- 请求/响应拦截器（日志、loading 状态）

---

## 8. 性能优化检查清单

- [ ] 纯展示组件使用 `React.memo`
- [ ] 复杂计算使用 `useMemo`
- [ ] 传递给子组件的回调使用 `useCallback`
- [ ] 长列表使用虚拟化（Web: react-window，Mobile: FlashList）
- [ ] 图片懒加载 + 适当压缩
- [ ] TanStack Query 设置合理的 `staleTime`（频繁变更 30s-1min，稳定数据 5min+）
- [ ] 使用骨架屏提升感知性能
- [ ] 非关键资源延迟加载（React.lazy）
- [ ] 动画使用 `transform` 和 `opacity`（GPU 加速）
- [ ] 清理订阅和定时器（useEffect return）

---

## 9. 变更日志

| 日期 | 版本 | 变更内容 | 变更者 |
|------|------|----------|--------|
| 2026-05-11 | v1.0 | 初始创建，整合 skills 目录前端规范 | Kimi Code CLI |

---

**最后更新**：2026-05-11  
**版本**：v1.0
