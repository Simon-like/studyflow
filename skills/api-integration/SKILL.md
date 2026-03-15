# API Integration & State Management

StudyFlow API集成与状态管理指南 - 如何高效对接后端API并管理应用状态。

---

## 概述

StudyFlow前端使用TanStack Query管理服务端状态，Zustand管理客户端状态。本Skill提供标准化的API集成模式。

## 技术栈

| 用途 | 库 | 版本 |
|------|-----|------|
| 服务端状态 | TanStack Query (React Query) | v5 |
| 客户端状态 | Zustand | v4 |
| HTTP客户端 | Axios | v1 |
| 数据获取 | @studyflow/api | workspace |

## 架构分层

```
┌─────────────────────────────────────────────────────────────────┐
│                      数据层架构                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    UI Components                         │   │
│  │              (React / React Native)                      │   │
│  └─────────────────────────┬───────────────────────────────┘   │
│                            │                                   │
│  ┌─────────────────────────▼───────────────────────────────┐   │
│  │                    Custom Hooks                          │   │
│  │         (useTasks, usePomodoro, useStats)                │   │
│  │              TanStack Query + Zustand                    │   │
│  └─────────────────────────┬───────────────────────────────┘   │
│                            │                                   │
│  ┌─────────────────────────▼───────────────────────────────┐   │
│  │                @studyflow/api Services                   │   │
│  │      (taskService, pomodoroService, statsService)        │   │
│  └─────────────────────────┬───────────────────────────────┘   │
│                            │ HTTP (Axios)                      │
│  ┌─────────────────────────▼───────────────────────────────┐   │
│  │                   Spring Boot API                        │   │
│  │              (/api/v1/tasks, /api/v1/pomodoros)          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## TanStack Query 最佳实践

### 1. Query Key 设计

```typescript
// 遵循层级化命名
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
    daily: (range: DateRange) => [...queryKeys.stats.all, 'daily', range] as const,
  },
};

// 使用
const { data: tasks } = useQuery({
  queryKey: queryKeys.tasks.today,
  queryFn: api.task.getTodayTasks,
});
```

### 2. Query Hook封装

```typescript
// features/tasks/hooks/useTasks.ts
export function useTasks(filter?: TaskFilter) {
  return useQuery({
    queryKey: queryKeys.tasks.lists(filter ?? {}),
    queryFn: () => api.task.getTasks(filter),
    staleTime: 1000 * 60 * 5, // 5分钟
  });
}

export function useTodayTasks() {
  return useQuery({
    queryKey: queryKeys.tasks.today,
    queryFn: api.task.getTodayTasks,
    staleTime: 1000 * 60, // 1分钟
  });
}

export function useTaskDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => api.task.getTask(id),
    enabled: !!id, // id存在时才查询
  });
}
```

### 3. Mutation 与乐观更新

```typescript
// features/tasks/hooks/useTaskMutations.ts
export function useToggleTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.task.toggleStatus,
    
    // 乐观更新
    onMutate: async (taskId) => {
      // 取消正在进行的重新获取
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all });
      
      // 保存之前的值用于回滚
      const previousTasks = queryClient.getQueryData(queryKeys.tasks.today);
      
      // 乐观更新缓存
      queryClient.setQueryData(queryKeys.tasks.today, (old: Task[] = []) =>
        old.map(task =>
          task.id === taskId
            ? { ...task, status: task.status === 'completed' ? 'todo' : 'completed' }
            : task
        )
      );
      
      return { previousTasks };
    },
    
    // 错误时回滚
    onError: (err, taskId, context) => {
      queryClient.setQueryData(queryKeys.tasks.today, context?.previousTasks);
      toast.error('操作失败，请重试');
    },
    
    // 完成后刷新
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all });
    },
  });
}
```

### 4. 无限滚动查询

```typescript
// features/community/hooks/usePosts.ts
export function usePosts() {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => api.community.getPosts({ page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.page >= lastPage.data.totalPages) return undefined;
      return lastPage.data.page + 1;
    },
  });
}
```

## Zustand 状态管理

### 1. 全局状态划分

```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      setUser: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, token: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage), // Mobile
      // storage: createJSONStorage(() => localStorage), // Web
    }
  )
);
```

### 2. Pomodoro状态（跨组件共享）

```typescript
// stores/pomodoroStore.ts
interface PomodoroState {
  // 状态
  status: PomodoroStatus;
  timeLeft: number;
  activeTaskId: string | null;
  recordId: string | null;
  
  // 动作
  start: (taskId?: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  complete: () => Promise<PomodoroSettlement>;
  abandon: (reason?: string) => Promise<void>;
}

export const usePomodoroStore = create<PomodoroState>()((set, get) => ({
  status: 'idle',
  timeLeft: DEFAULT_DURATION,
  activeTaskId: null,
  recordId: null,
  
  start: async (taskId) => {
    const response = await api.pomodoro.start({
      taskId,
      duration: DEFAULT_DURATION,
    });
    
    set({
      status: 'running',
      activeTaskId: taskId ?? null,
      recordId: response.data.id,
      timeLeft: DEFAULT_DURATION,
    });
  },
  
  complete: async () => {
    const { recordId } = get();
    if (!recordId) throw new Error('No active pomodoro');
    
    const response = await api.pomodoro.stop(recordId, { status: 'completed' });
    
    set({
      status: 'idle',
      activeTaskId: null,
      recordId: null,
      timeLeft: DEFAULT_DURATION,
    });
    
    return response.data;
  },
  
  // ...
}));
```

## API错误处理

### 1. 全局拦截器

```typescript
// packages/api/src/client/httpClient.ts
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，刷新或登出
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
```

### 2. 组件级错误处理

```typescript
function TaskList() {
  const { data, error, isError, refetch } = useTodayTasks();
  
  if (isError) {
    return (
      <ErrorState
        message={error.message}
        onRetry={refetch}
      />
    );
  }
  
  return <TaskListView tasks={data?.data ?? []} />;
}
```

## 数据获取模式

### 1. 并行请求

```typescript
// Dashboard同时获取多个数据
function useDashboardData() {
  const { data: tasks, isLoading: tasksLoading } = useTodayTasks();
  const { data: stats, isLoading: statsLoading } = useTodayStats();
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  
  return {
    data: {
      tasks: tasks?.data ?? [],
      stats: stats?.data,
      summary: summary?.data,
    },
    isLoading: tasksLoading || statsLoading || summaryLoading,
  };
}
```

### 2. 依赖请求

```typescript
// 先获取任务，再获取任务统计
function useTaskWithStats(taskId: string) {
  const { data: task } = useTaskDetail(taskId);
  
  const { data: stats } = useQuery({
    queryKey: ['task-stats', taskId],
    queryFn: () => api.task.getStats(taskId),
    enabled: !!task?.data, // 等待任务加载完成
  });
  
  return { task, stats };
}
```

### 3. 预加载

```typescript
// 鼠标悬停时预加载详情
function TaskItem({ task }: { task: Task }) {
  const queryClient = useQueryClient();
  
  const prefetchDetail = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.tasks.detail(task.id),
      queryFn: () => api.task.getTask(task.id),
    });
  };
  
  return (
    <div onMouseEnter={prefetchDetail}>
      {task.title}
    </div>
  );
}
```

## Mock数据切换

```typescript
// packages/api/src/index.ts
export function createApi(useMock: boolean) {
  if (useMock) {
    return {
      task: mockTaskService,
      pomodoro: mockPomodoroService,
      stats: mockStatsService,
    };
  }
  
  return {
    task: taskService,
    pomodoro: pomodoroService,
    stats: statsService,
  };
}

// 使用
export const api = createApi(import.meta.env.VITE_USE_MOCK === 'true');
```

## 性能优化

1. **合理设置staleTime**
   - 频繁变更数据：30s-1min
   - 相对稳定数据：5min+

2. **使用select转换数据**
   ```typescript
   const { data } = useQuery({
     queryKey: ['tasks'],
     queryFn: api.task.getTasks,
     select: (res) => res.data.list.filter(t => t.status !== 'completed'),
   });
   ```

3. **Mutation乐观更新**
   - 参见上面的useToggleTask示例

4. **Query缓存策略**
   ```typescript
   const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         staleTime: 1000 * 60 * 5, // 5分钟
         cacheTime: 1000 * 60 * 30, // 30分钟
         retry: 3,
        refetchOnWindowFocus: false,
       },
     },
   });
   ```

## 相关链接

- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://docs.pmnd.rs/zustand)
- [API_SPEC.md](../../docs/API_SPEC.md)
