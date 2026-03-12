import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import { formatDuration } from '@/lib/utils';
import { api } from '@studyflow/api';
import type { Task, TodayStats, WeeklyOverview } from '@studyflow/shared';
import type { DashboardStats } from './types';

// ==================== Dashboard 计时器 Hook ====================

export function useDashboardTimer() {
  const { status, timeRemaining, start, pause, resume, stop, tick } = usePomodoroStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === 'running') {
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

  const progress = useMemo(
    () => (timeRemaining / (25 * 60)) * (2 * Math.PI * 90),
    [timeRemaining]
  );

  return {
    status,
    timeRemaining,
    progress,
    onStart: start,
    onPause: pause,
    onResume: resume,
    onStop: stop,
  };
}

// ==================== Dashboard 统计数据 Hook ====================

interface UseDashboardStatsReturn {
  stats: DashboardStats[];
  todayStats: TodayStats | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.pomodoro.getTodayStats();
      setTodayStats(response.data);
    } catch (error) {
      console.error('Failed to fetch today stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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
        value: `${todayStats.focusMinutes}`,
        sub: `${todayStats.completedPomodoros} 个番茄`,
      },
      {
        label: '完成任务',
        value: `${todayStats.completedTasks}`,
        sub: '今日任务',
      },
      {
        label: '连续天数',
        value: `${todayStats.streakDays}`,
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
    todayStats,
    isLoading,
    refetch: fetchStats,
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTask = useCallback(async (id: string) => {
    try {
      const response = await api.task.toggleStatus(id);
      const updatedTask = response.data;
      
      // 乐观更新本地状态
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updatedTask : t))
      );
      
      // 如果任务变为已完成，可能需要从列表中移除（取决于业务需求）
      if (updatedTask.status === 'completed') {
        // 可选：延迟后移除或重新获取
        setTimeout(() => fetchTasks(), 500);
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
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

// ==================== Dashboard 主数据 Hook（向后兼容） ====================

export function useDashboardData() {
  const { user } = useAuthStore();
  const displayName = user?.nickname || user?.username || '同学';

  const { stats, todayStats, isLoading: statsLoading, refetch: refetchStats } = useDashboardStats();
  const { tasks, isLoading: tasksLoading, error, toggleTask, reorderTasks, refetch: refetchTasks } = useDashboardTasks();

  const isLoading = statsLoading || tasksLoading;

  const refetch = useCallback(async () => {
    await Promise.all([refetchStats(), refetchTasks()]);
  }, [refetchStats, refetchTasks]);

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
