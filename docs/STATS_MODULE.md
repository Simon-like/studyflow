# StudyFlow 统计模块文档

> **版本**: 1.0.0  
> **日期**: 2026-03-16  
> **状态**: 已完成

---

## 1. 模块概述

统计模块提供双端（Web + Mobile）统一的学习数据统计功能，包括：

- **今日统计**: 今日专注时长、完成番茄数、完成任务数、连续天数
- **周/月/年统计**: 多维度学习数据分析
- **学科分布**: 各学科学习时长占比
- **学习趋势**: 柱状图展示每日学习情况

---

## 2. 架构设计

### 2.1 模块结构

```
packages/api/src/
├── hooks/
│   └── useStats.ts          # 双端共享的统计 Hooks
├── services/
│   └── statsService.ts      # 统计 API 服务
└── mock/
    └── services.ts          # Mock 统计服务

apps/web/src/features/stats/   # Web 端统计页面
apps/mobile/src/screens/Stats/ # Mobile 端统计屏幕
```

### 2.2 数据流

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Stats Page    │────▶│   useStats Hook │────▶│   API Service   │
│  (Web/Mobile)   │◄────│ (TanStack Query)│◄────│  (Real/Mock)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                                              │
         │                                              │
         ▼                                              ▼
┌─────────────────┐                           ┌─────────────────┐
│   UI Components │                           │   Stats Cache   │
│  (Cards/Charts) │                           │  (QueryClient)  │
└─────────────────┘                           └─────────────────┘
```

---

## 3. API 参考

### 3.1 Hooks

#### `useTodayStats`

获取今日统计数据。

```typescript
const { data: todayStats, isLoading, refetch } = useTodayStats({
  enabled: true,
  refetchInterval: 30000, // 30秒轮询
});

// todayStats: {
//   focusMinutes: number;      // 今日专注分钟
//   completedPomodoros: number; // 今日完成番茄数
//   completedTasks: number;    // 今日完成任务数
//   streakDays: number;        // 连续学习天数
// }
```

#### `useOverviewStats`

获取总览统计数据（支持多周期）。

```typescript
const { data: overview } = useOverviewStats({ 
  period: 'week' // 'today' | 'week' | 'month' | 'year'
});
```

#### `useDailyStats`

获取每日学习数据（用于柱状图/热力图）。

```typescript
const { data: dailyStats } = useDailyStats({
  startDate: '2026-03-01',
  endDate: '2026-03-31'
});
```

#### `useSubjectStats`

获取学科分布统计数据。

```typescript
const { data: subjectStats } = useSubjectStats({ 
  period: 'week' 
});
```

#### `useDashboardSummary`

获取 Dashboard 聚合数据。

```typescript
const { data: summary } = useDashboardSummary({
  refetchInterval: 30000
});
```

#### `useUserStats`

获取用户累计统计数据。

```typescript
const { data: userStats } = useUserStats();

// userStats: {
//   totalFocusMinutes: number;
//   totalPomodoros: number;
//   totalTasks: number;
//   completedTasks: number;
//   currentStreak: number;
//   longestStreak: number;
//   studyDays: number;
//   todayFocusMinutes: number;
//   todayPomodoros: number;
//   todayTasks: number;
// }
```

#### `useRefreshStats`

刷新统计数据。

```typescript
const { refreshAllStats, refreshTodayStats, refreshOverviewStats } = useRefreshStats();

// 番茄钟完成后调用
await completePomodoro();
refreshTodayStats();
```

#### `usePomodoroSettlement`

番茄钟结算 Hook（自动刷新统计）。

```typescript
const { mutate: stopPomodoro, isPending } = usePomodoroSettlement({
  onSuccess: (todayStats) => {
    console.log('今日已完成', todayStats.completedPomodoros, '个番茄');
  }
});

stopPomodoro({ id: 'pomo-123', status: 'completed' });
```

### 3.2 Query Keys

```typescript
import { STATS_KEYS } from '@studyflow/api';

STATS_KEYS.all              // ['stats']
STATS_KEYS.today()          // ['stats', 'today']
STATS_KEYS.overview('week') // ['stats', 'overview', 'week']
STATS_KEYS.daily(start, end)// ['stats', 'daily', start, end]
STATS_KEYS.subjects('week') // ['stats', 'subjects', 'week']
STATS_KEYS.dashboard()      // ['stats', 'dashboard']
STATS_KEYS.userStats()      // ['user', 'stats']
```

---

## 4. 使用示例

### 4.1 Web 端统计页面

```tsx
// apps/web/src/features/stats/index.tsx
import { useStats } from './hooks';
import { OverviewCards, WeeklyChart, SubjectDistribution } from './components';

export default function StatsPage() {
  const { 
    period, setPeriod,
    chartData, maxPomodoros,
    subjectData, overviewStats,
    isLoading, refreshAllStats 
  } = useStats();

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <StatsHeader 
        period={period} 
        onPeriodChange={setPeriod}
        onRefresh={refreshAllStats}
      />
      <OverviewCards overviewStats={overviewStats} isLoading={isLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <WeeklyChart data={chartData} maxValue={maxPomodoros} />
        <SubjectDistribution data={subjectData} />
      </div>
    </div>
  );
}
```

### 4.2 Mobile 端统计屏幕

```tsx
// apps/mobile/src/screens/Stats/index.tsx
import { useStatsScreen } from './hooks';
import { PeriodSelector, OverviewGrid, WeeklyChart } from './components';

export default function StatsScreen({ onBack }: { onBack?: () => void }) {
  const { 
    period, setPeriod,
    weeklyData, subjectDistribution,
    overviewData, isLoading,
    refreshAllStats 
  } = useStatsScreen();

  return (
    <ScreenContainer>
      <PeriodSelector period={period} onChange={setPeriod} />
      <OverviewGrid data={overviewData} period={period} isLoading={isLoading} />
      <WeeklyChart data={weeklyData} isLoading={isLoading} />
      <SubjectDistribution data={subjectDistribution} isLoading={isLoading} />
    </ScreenContainer>
  );
}
```

### 4.3 Dashboard 今日统计

```tsx
// 使用共享 Hook
import { useTodayStats } from '@studyflow/api';

function DashboardStats() {
  const { data: todayStats, isLoading } = useTodayStats();

  if (isLoading) return <Loading />;

  return (
    <div>
      <StatCard 
        label="今日专注" 
        value={`${todayStats?.focusMinutes}分钟`} 
      />
      <StatCard 
        label="完成番茄" 
        value={todayStats?.completedPomodoros} 
      />
      <StatCard 
        label="完成任务" 
        value={todayStats?.completedTasks} 
      />
    </div>
  );
}
```

---

## 5. 数据模型

### 5.1 今日统计 (TodayStats)

```typescript
interface TodayStats {
  focusMinutes: number;       // 今日专注分钟
  completedPomodoros: number; // 今日完成番茄数
  completedTasks: number;     // 今日完成任务数
  streakDays: number;         // 连续学习天数
}
```

### 5.2 总览统计 (OverviewStats)

```typescript
interface OverviewStats extends TodayStats {
  compareLastPeriod: {
    focusMinutes: string;  // 如 "+15%"
    pomodoros: string;
    tasks: string;
  };
}
```

### 5.3 每日统计 (DailyStat)

```typescript
interface DailyStat {
  date: string;        // "2026-03-12"
  focusMinutes: number;
  pomodoros: number;
  tasks: number;
}
```

### 5.4 学科统计 (SubjectStat)

```typescript
interface SubjectStat {
  category: string;    // 学科名称
  focusMinutes: number;
  percentage: number;  // 占比
}
```

---

## 6. 后端实现设计（供 AI 生成代码）

> 目标：保证“专注结束后统计必入库、可聚合、可幂等、可回放”，并与前端当前消费字段完全兼容。  
> 本节按“表设计 → 结算流程 → 聚合接口 → 空状态约定”组织，可直接用于代码生成。

### 6.1 接口清单（与前端当前调用保持一致）

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 开始番茄钟 | POST | `/api/v1/pomodoros/start` | 创建运行中记录，返回 `recordId` |
| 停止/结算番茄钟 | POST | `/api/v1/pomodoros/{id}/stop` | 状态为 completed/abandoned，返回结算摘要 |
| 今日统计 | GET | `/api/v1/pomodoros/stats/today` | Dashboard 卡片数据来源 |
| 总览统计 | GET | `/api/v1/stats/overview?period=week` | week/month/year/today |
| 每日统计 | GET | `/api/v1/stats/daily?startDate=&endDate=` | 柱状图与热力图来源 |
| 学科分布 | GET | `/api/v1/stats/subjects?period=week` | 饼图来源 |
| Dashboard 聚合 | GET | `/api/v1/dashboard/summary` | 今日任务 + 今日统计 + 周摘要 |
| 用户累计统计 | GET | `/api/v1/users/stats` | Profile/统计累计数据 |

---

### 6.2 数据库设计（最小可用）

#### 表 1：pomodoro_records
- `id` (PK, bigint/uuid)
- `user_id` (idx)
- `task_id` (nullable, idx)
- `status` (running/completed/abandoned/stopped, idx)
- `planned_duration_sec` (int)
- `actual_duration_sec` (int, nullable)
- `started_at` (datetime, idx)
- `ended_at` (datetime, nullable, idx)
- `abandon_reason` (varchar, nullable)
- `created_at`, `updated_at`
- `version` (int, 乐观锁可选)

推荐索引：
- `(user_id, status, started_at desc)`
- `(user_id, ended_at)`
- `(user_id, task_id, ended_at)`

#### 表 2：tasks（已存在，需确保字段）
- `id`, `user_id`
- `category`（用于学科聚合）
- `status`
- `updated_at`

#### 可选表 3：daily_stats_snapshot（按天预聚合）
- `user_id`
- `stat_date` (date)
- `focus_minutes`
- `completed_pomodoros`
- `completed_tasks`
- `updated_at`
- 唯一键 `(user_id, stat_date)`

---

### 6.3 结算事务设计（核心）

`POST /pomodoros/{id}/stop` 必须走事务，推荐步骤：

1. `SELECT ... FOR UPDATE` 读取该番茄记录  
2. 校验：仅 running 可结算（已完成直接返回当前结果，保证幂等）  
3. 计算 `actual_duration_sec`：
   - `elapsed = now - started_at`
   - completed 时：`actual = max(elapsed, planned_duration_sec)`（防止“开始后立即 stop 导致 0 分钟”）
   - abandoned 时：`actual = elapsed`
4. 更新记录状态、`ended_at`、`actual_duration_sec`
5. 若关联任务且业务需要，更新任务状态（如 todo -> in_progress 或完成）
6. 刷新/重算当天统计（实时聚合或增量快照）
7. 返回 `PomodoroSettlement`：
   - `record`
   - `task`
   - `todayStats`

幂等要求：
- 同一 `recordId` 多次 completed，不得重复累加统计。
- 推荐通过“仅 running 可状态跃迁”保证幂等。

---

### 6.4 聚合口径定义（统一口径，避免前后端不一致）

#### 今日统计（TodayStats）
- `focusMinutes`: 当天 `status=completed` 的 `actual_duration_sec` 求和后转分钟
- `completedPomodoros`: 当天 completed 记录数
- `completedTasks`: 当天任务状态变为 completed 的任务数（按 task 去重）
- `streakDays`: 连续有学习记录天数（可后续扩展）

#### 总览统计（OverviewStats）
- period in `today/week/month/year`
- 使用 `ended_at` 落入周期进行统计
- `compareLastPeriod` 可先返回 `+0%` 占位，后续再接同比算法

#### 每日统计（DailyStat）
- 按日期分桶：
  - `focusMinutes`
  - `pomodoros`
  - `tasks`

#### 学科分布（SubjectStat）
- 通过 `pomodoro_records.task_id -> tasks.category` 聚合
- 无分类归入“未分类”
- `percentage = categoryMinutes / totalMinutes`

---

### 6.5 空状态返回约定（前端依赖）

后端不要返回 null 结构，统一返回“空数组 + 零值”：

- `TodayStats`: `{ focusMinutes: 0, completedPomodoros: 0, completedTasks: 0, streakDays: 0 }`
- `OverviewStats`: 同上 + `compareLastPeriod` 默认 `+0%`
- `DailyStat[]`: `[]`
- `SubjectStat[]`: `[]`
- `DashboardSummary`: 
  - `todayStats` 零值对象
  - `weeklyStats` 零值对象
  - `todayTasks: []`
  - `activePomodoro: null`

这样前端可直接渲染空状态，不需要额外防御逻辑。

---

### 6.6 Mock 行为基准（用于联调）

Mock 必须满足：
1. `start` 创建 running 记录并返回 id  
2. `stop(completed)` 必须可观测地影响：
   - 今日统计
   - 总览统计
   - 每日统计
   - 学科分布
   - Dashboard summary
3. 统计口径基于记录动态重算，不使用固定常量
4. 重复 stop 同一记录不重复累计

---

## 7. 注意事项

1. **缓存策略**: 今日统计 30 秒 staleTime，总览统计 5 分钟 staleTime
2. **自动刷新**: 番茄钟结算成功后主动失效统计缓存
3. **数据一致性**: 结算接口事务化 + 幂等状态机
4. **错误处理**: 统计接口失败返回统一错误码，前端展示降级空态

---

*文档结束*
