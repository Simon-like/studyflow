# Frontend Performance Optimization

StudyFlow前端性能优化指南 - 如何打造流畅的双端体验。

---

## 概述

StudyFlow需要在Web和Mobile两端都提供流畅的体验。本Skill涵盖React渲染优化、列表性能、网络优化等关键领域。

## 渲染优化

### 1. 组件 memoization

```typescript
// ✅ 使用React.memo防止不必要重渲染
const TaskCard = React.memo(function TaskCard({ task, onToggle }: TaskCardProps) {
  return (
    <div onClick={() => onToggle(task.id)}>
      {task.title}
    </div>
  );
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.task.id === nextProps.task.id &&
         prevProps.task.status === nextProps.task.status;
});

// ✅ 使用useMemo缓存计算
function TaskList({ tasks }: { tasks: Task[] }) {
  const sortedTasks = useMemo(() => {
    return tasks.sort((a, b) => b.priority - a.priority);
  }, [tasks]);
  
  return (
    <div>
      {sortedTasks.map(task => <TaskCard key={task.id} task={task} />)}
    </div>
  );
}

// ✅ 使用useCallback缓存回调
function TaskList({ tasks, onUpdate }: TaskListProps) {
  const handleToggle = useCallback((id: string) => {
    onUpdate(id, { status: 'completed' });
  }, [onUpdate]);
  
  return (
    <div>
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
```

### 2. 代码分割

```typescript
// Web端 - React.lazy
const StatsPage = React.lazy(() => import('./features/stats'));
const CommunityPage = React.lazy(() => import('./features/community'));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/community" element={<CommunityPage />} />
      </Routes>
    </Suspense>
  );
}

// Mobile端 - 使用Expo的lazy loading
const CompanionScreen = React.lazy(() => import('./screens/Companion'));
```

## 列表性能优化

### 1. 虚拟列表 (长列表)

```typescript
// Web - react-window
import { FixedSizeList as List } from 'react-window';

function VirtualTaskList({ tasks }: { tasks: Task[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <TaskCard task={tasks[index]} />
    </div>
  );
  
  return (
    <List
      height={600}
      itemCount={tasks.length}
      itemSize={72}
      width="100%"
    >
      {Row}
    </List>
  );
}

// Mobile - FlashList (React Native)
import { FlashList } from '@shopify/flash-list';

function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <FlashList
      data={tasks}
      renderItem={({ item }) => <TaskCard task={item} />}
      estimatedItemSize={72}
      keyExtractor={item => item.id}
    />
  );
}
```

### 2. 列表优化技巧

```typescript
// ✅ 使用keyExtractor
<FlatList
  data={tasks}
  keyExtractor={item => item.id} // 不要用index！
/>

// ✅ 避免内联函数
// ❌ 错误
<FlatList
  renderItem={({ item }) => <TaskCard task={item} onPress={() => handlePress(item)} />}
/>

// ✅ 正确
const renderItem = useCallback(({ item }: { item: Task }) => (
  <TaskCard task={item} onPress={handlePress} />
), [handlePress]);

<FlatList renderItem={renderItem} />

// ✅ 使用getItemLayout（固定高度时）
<FlatList
  getItemLayout={(data, index) => ({
    length: 72,
    offset: 72 * index,
    index,
  })}
/>
```

## 图片优化

### Web端

```typescript
// ✅ 使用WebP格式
<img src="image.webp" alt="描述" />

// ✅ 响应式图片
<picture>
  <source srcSet="image-400.webp 400w, image-800.webp 800w" type="image/webp" />
  <img src="image.jpg" alt="描述" loading="lazy" />
</picture>

// ✅ 懒加载
<img src="image.jpg" loading="lazy" alt="描述" />

// ✅ 使用Vite的图像优化
import imageUrl from './image.jpg?w=400&format=webp';
```

### Mobile端

```typescript
// ✅ 使用Expo Image
import { Image } from 'expo-image';

<Image
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 200, height: 200 }}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>

// ✅ 预加载关键图片
Image.prefetch(['https://example.com/avatar1.jpg', 'https://example.com/avatar2.jpg']);
```

## 网络优化

### 1. 请求合并与去重

```typescript
// ✅ TanStack Query自动去重
// 多个组件同时请求相同数据，只会发起一次请求
function ComponentA() {
  const { data } = useQuery({ queryKey: ['tasks'], queryFn: api.task.getTasks });
  return <div>...</div>;
}

function ComponentB() {
  const { data } = useQuery({ queryKey: ['tasks'], queryFn: api.task.getTasks });
  return <div>...</div>;
}
// 只会发起一次请求
```

### 2. 请求缓存策略

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 数据在5分钟内被视为新鲜
      staleTime: 1000 * 60 * 5,
      
      // 保留不活跃数据30分钟
      gcTime: 1000 * 60 * 30,
      
      // 失败后重试3次
      retry: 3,
      
      // 窗口重新聚焦时不自动刷新
      refetchOnWindowFocus: false,
      
      // 网络重连时刷新
      refetchOnReconnect: true,
    },
  },
});
```

### 3. 数据预加载

```typescript
// 鼠标悬停预加载
function TaskItem({ task }: { task: Task }) {
  const queryClient = useQueryClient();
  
  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['task', task.id],
      queryFn: () => api.task.getTask(task.id),
    });
  };
  
  return (
    <div onMouseEnter={prefetch}>
      {task.title}
    </div>
  );
}

// 路由预加载
const router = createBrowserRouter([
  {
    path: '/tasks',
    element: <TasksPage />,
    loader: () => {
      // 路由加载时预取数据
      queryClient.prefetchQuery({
        queryKey: ['tasks'],
        queryFn: api.task.getTasks,
      });
      return null;
    },
  },
]);
```

## 状态管理优化

### 1. Zustand选择器

```typescript
// ❌ 错误：订阅整个store
const Component = () => {
  const { user, token, isLoggedIn, setUser, logout } = useAuthStore();
  return <div>{user?.name}</div>;
};

// ✅ 正确：只订阅需要的字段
const Component = () => {
  const user = useAuthStore(state => state.user);
  return <div>{user?.name}</div>;
};

// ✅ 或使用selector
const useUser = () => useAuthStore(state => state.user);
```

### 2. 状态分片

```typescript
// 将大store拆分为小store
// stores/pomodoroStore.ts
export const usePomodoroStore = create<PomodoroState>()(...);

// stores/uiStore.ts
export const useUIStore = create<UIState>()(...);

// stores/settingsStore.ts
export const useSettingsStore = create<SettingsState>()(...);
```

## 动画性能

### 1. 使用CSS动画

```css
/* ✅ 使用transform和opacity（GPU加速） */
.animate-slide {
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.animate-slide:hover {
  transform: translateX(10px);
}

/* ❌ 避免改变布局属性 */
.animate-bad {
  width: 100px;
  transition: width 0.3s; /* 会触发重排！ */
}
```

### 2. React Native动画

```typescript
// ✅ 使用Animated API
const fadeAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true, // 使用原生驱动
  }).start();
}, []);

// ✅ 使用LayoutAnimation（简单布局变化）
import { LayoutAnimation } from 'react-native';

const onAddItem = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  setItems([...items, newItem]);
};
```

## 内存优化

### 1. 清理订阅和监听器

```typescript
useEffect(() => {
  const subscription = eventEmitter.addListener('event', handler);
  const interval = setInterval(poll, 5000);
  
  return () => {
    subscription.remove();
    clearInterval(interval);
  };
}, []);
```

### 2. 大列表内存管理

```typescript
// ✅ 限制最大渲染项数
<FlatList
  data={tasks}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true} // 卸载屏幕外组件
/>
```

## 启动优化

### 1. 延迟加载非关键资源

```typescript
// ✅ 延迟加载大型库
const HeavyChart = lazy(() => import('./HeavyChart'));

// ✅ 延迟初始化
const useLazyService = () => {
  const [service, setService] = useState(null);
  
  useEffect(() => {
    import('./heavyService').then(mod => {
      setService(new mod.HeavyService());
    });
  }, []);
  
  return service;
};
```

### 2. 骨架屏

```tsx
// ✅ 使用骨架屏提升感知性能
function TaskList() {
  const { data, isLoading } = useTasks();
  
  if (isLoading) {
    return <TaskListSkeleton />;
  }
  
  return (
    <div>
      {data?.map(task => <TaskCard key={task.id} task={task} />)}
    </div>
  );
}

// 骨架屏组件
function TaskListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-neutral-200 rounded animate-pulse" />
      ))}
    </div>
  );
}
```

## 性能监控

### 1. React DevTools Profiler

```typescript
// 使用Profiler测量渲染性能
<Profiler id="TaskList" onRender={onRenderCallback}>
  <TaskList />
</Profiler>

function onRenderCallback(
  id: string,
  phase: "mount" | "update",
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) {
  console.log(`${id} ${phase} took ${actualDuration}ms`);
}
```

### 2. 自定义性能标记

```typescript
// Web - Performance API
function measureTaskLoad() {
  performance.mark('task-load-start');
  
  loadTasks().then(() => {
    performance.mark('task-load-end');
    performance.measure('task-load', 'task-load-start', 'task-load-end');
    
    const measure = performance.getEntriesByName('task-load')[0];
    console.log(`Tasks loaded in ${measure.duration}ms`);
  });
}
```

## 性能检查清单

- [ ] 使用React.memo包裹纯展示组件
- [ ] 使用useMemo缓存复杂计算
- [ ] 使用useCallback传递稳定的回调
- [ ] 长列表使用虚拟化
- [ ] 图片使用懒加载和适当压缩
- [ ] 设置合理的Query staleTime
- [ ] 使用骨架屏提升感知性能
- [ ] 代码分割减少首屏加载
- [ ] 动画使用transform和opacity
- [ ] 清理订阅和定时器

## 相关工具

- [React DevTools Profiler](https://react.dev/reference/react-devtools)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse) (Web)
- [Flipper](https://fbflipper.com) (React Native)
- [Why Did You Render](https://github.com/welldone-software/why-did-you-render)

## 相关链接

- [React性能优化](https://react.dev/reference/react/memo)
- [TanStack Query性能](https://tanstack.com/query/latest/docs/react/guides/important-defaults)
- [Web Vitals](https://web.dev/vitals/)
