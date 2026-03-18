import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { useUser } from '@/hooks';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import { formatDuration, getApiErrorMessage } from '@/lib/utils';
import { api, useTodayStats, useRefreshStats } from '@studyflow/api';
import toast from 'react-hot-toast';
import type { Task, TodayStats, WeeklyOverview } from '@studyflow/shared';
import type { DashboardStats } from './types';

// ==================== Dashboard 计时器 Hook ====================

export function useDashboardTimer() {
  const {
    status, timeRemaining, focusDuration, breakDuration,
    start, pause, resume, stop, tick,
    startRest, extendRest, endRest,
  } = usePomodoroStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === 'running' || status === 'resting') {
      intervalRef.current = setInterval(() => tick(), 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, tick]);

  // totalTime 根据状态切换：专注用 focusDuration，休息用 breakDuration
  const totalTime = status === 'resting' ? breakDuration : focusDuration;

  const progress = useMemo(
    () => (timeRemaining / totalTime) * (2 * Math.PI * 90),
    [timeRemaining, totalTime]
  );

  return {
    status,
    timeRemaining,
    totalTime,
    progress,
    onStart: start,
    onPause: pause,
    onResume: resume,
    onStop: stop,
    onStartRest: startRest,
    onExtendRest: extendRest,
    onEndRest: endRest,
  };
}

// ==================== Dashboard 统计数据 Hook ====================

interface UseDashboardStatsReturn {
  stats: DashboardStats[];
  todayStats: TodayStats | null;
  isLoading: boolean;
  refetch: () => void;
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const { data: todayStats, isLoading, refetch } = useTodayStats();
  
  // 转换为 DashboardStats 格式
  const stats = useMemo<DashboardStats[]>(() => {
    if (!todayStats) {
      return [
        { label: '今日专注', value: '--', sub: '-- 个番茄' },
        { label: '完成任务', value: '--', sub: '今日任务' },
        { label: '连续天数', value: '--', sub: '天不间断' },
        { label: '本周效率', value: '--', sub: '完成率' },
      ];
    }

    return [
      {
        label: '今日专注',
        value: `${todayStats.focusMinutes}分钟`,
        sub: `${todayStats.completedPomodoros}个番茄`,
      },
      {
        label: '完成任务',
        value: `${todayStats.completedTasks}个`,
        sub: '今日任务',
      },
      {
        label: '连续天数',
        value: `${todayStats.streakDays}天`,
        sub: '天不间断',
      },
      {
        label: '本周效率',
        value: '89%',
        sub: '完成率',
      },
    ];
  }, [todayStats]);

  return {
    stats,
    todayStats: todayStats || null,
    isLoading,
    refetch,
  };
}

// ==================== Dashboard 任务列表 Hook ====================

interface UseDashboardTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  toggleTask: (id: string) => Promise<void>;
  reorderTasks: (tasks: Task[]) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useDashboardTasks(): UseDashboardTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.task.getTodayTasks();
      setTasks(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
      console.error('Failed to fetch today tasks:', err);
      toast.error(getApiErrorMessage(err, '获取今日任务失败'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTask = useCallback(async (id: string) => {
    // 乐观更新：立即切换本地状态
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'completed' ? 'todo' as const : 'completed' as const }
          : t
      )
    );

    try {
      const response = await api.task.toggleStatus(id);
      const updatedTask = response.data;
      // 用服务器返回的真实数据覆盖
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updatedTask : t))
      );
    } catch (err) {
      console.error('Failed to toggle task:', err);
      toast.error(getApiErrorMessage(err, '更新任务状态失败'));
      // 出错时从服务器重新获取
      await fetchTasks();
      throw err;
    }
  }, [fetchTasks]);

  // 更新任务排序
  const reorderTasks = useCallback(async (newTasks: Task[]) => {
    try {
      // 乐观更新本地状态
      setTasks(newTasks);
      
      // 调用 API 保存排序
      const taskOrders = newTasks.map((task, index) => ({
        id: task.id,
        order: index,
      }));
      
      await api.task.reorderTasks({ taskOrders });
    } catch (err) {
      console.error('Failed to reorder tasks:', err);
      toast.error(getApiErrorMessage(err, '任务排序失败'));
      // 发生错误时重新获取任务列表
      await fetchTasks();
      throw err;
    }
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    toggleTask,
    reorderTasks,
    refetch: fetchTasks,
  };
}

// ==================== Dashboard 聚合数据 Hook ====================

interface UseDashboardSummaryReturn {
  todayStats: TodayStats | null;
  weeklyStats: WeeklyOverview | null;
  todayTasks: Task[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDashboardSummary(): UseDashboardSummaryReturn {
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyOverview | null>(null);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.stats.getDashboardSummary();
      const data = response.data;
      
      setTodayStats(data.todayStats);
      setWeeklyStats(data.weeklyStats);
      setTodayTasks(data.todayTasks);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard summary'));
      console.error('Failed to fetch dashboard summary:', err);
      toast.error(getApiErrorMessage(err, '获取仪表盘数据失败'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    todayStats,
    weeklyStats,
    todayTasks,
    isLoading,
    error,
    refetch: fetchSummary,
  };
}

// ==================== Dashboard 主数据 Hook ====================

export function useDashboardData() {
  const { displayName } = useUser();

  const { stats, todayStats, isLoading: statsLoading, refetch: refetchStats } = useDashboardStats();
  const { tasks, isLoading: tasksLoading, error, toggleTask: rawToggleTask, reorderTasks, refetch: refetchTasks } = useDashboardTasks();
  const { refreshAllStats } = useRefreshStats();

  const isLoading = statsLoading || tasksLoading;

  const refetch = useCallback(async () => {
    // 强制使所有统计缓存失效，确保数据同步
    refreshAllStats();
    await Promise.all([refetchStats(), refetchTasks()]);
  }, [refetchStats, refetchTasks, refreshAllStats]);

  // 包装 toggleTask：完成/恢复后同时刷新统计
  const toggleTask = useCallback(async (id: string) => {
    await rawToggleTask(id);
    // 任务状态变化会影响统计数据（完成任务数等）
    refreshAllStats();
  }, [rawToggleTask, refreshAllStats]);

  return {
    displayName,
    todayTasks: tasks,
    weeklyStats: stats,
    todayStats,
    isLoading,
    error,
    toggleTask,
    reorderTasks,
    refetch,
  };
}
