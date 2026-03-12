/**
 * Home 页面自定义 Hooks
 * 与 Web Dashboard 保持数据架构一致性
 */

import { useState, useCallback, useEffect } from 'react';
import { api } from '@studyflow/api';
import type { Task, TodayStats, WeeklyOverview } from '@studyflow/shared';
import { usePomodoro } from '../../hooks';

// ==================== Home Screen 主 Hook ====================

export interface HomeScreenState {
  tasks: Task[];
  todayStats: TodayStats | null;
  weeklyStats: WeeklyOverview | null;
  isLoading: boolean;
  error: Error | null;
}

export interface HomeScreenActions {
  toggleTask: (id: string) => Promise<void>;
  reorderTasks: (tasks: Task[]) => Promise<void>;
  addTask: () => void;
  viewStats: () => void;
  refresh: () => Promise<void>;
}

export interface HomeScreenPomodoro {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function useHomeScreen() {
  // 任务和统计数据状态
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 获取今日任务列表
  const fetchTodayTasks = useCallback(async () => {
    try {
      const response = await api.task.getTodayTasks();
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch today tasks:', err);
      throw err;
    }
  }, []);

  // 获取今日统计数据
  const fetchTodayStats = useCallback(async () => {
    try {
      const response = await api.pomodoro.getTodayStats();
      setTodayStats(response.data);
    } catch (err) {
      console.error('Failed to fetch today stats:', err);
      throw err;
    }
  }, []);

  // 获取周统计数据
  const fetchWeeklyStats = useCallback(async () => {
    try {
      const response = await api.stats.getOverview('week');
      const data = response.data;
      setWeeklyStats({
        totalPomodoros: data.completedPomodoros,
        totalFocusHours: Math.floor(data.focusMinutes / 60),
        completionRate: parseInt(data.compareLastPeriod.focusMinutes) || 0,
        streakDays: data.streakDays,
      });
    } catch (err) {
      console.error('Failed to fetch weekly stats:', err);
      throw err;
    }
  }, []);

  // 初始化数据加载
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await Promise.all([
        fetchTodayTasks(),
        fetchTodayStats(),
        fetchWeeklyStats(),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load data'));
    } finally {
      setIsLoading(false);
    }
  }, [fetchTodayTasks, fetchTodayStats, fetchWeeklyStats]);

  // 组件挂载时加载数据
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 番茄钟完成回调 - 更新任务进度和统计数据
  const handlePomodoroComplete = useCallback(async () => {
    // 重新获取任务列表和统计数据（番茄钟完成后任务进度会更新）
    await Promise.all([
      fetchTodayTasks(),
      fetchTodayStats(),
    ]);
  }, [fetchTodayTasks, fetchTodayStats]);

  // 番茄钟 Hook
  const pomodoro = usePomodoro({
    onComplete: handlePomodoroComplete,
  });

  // 切换任务状态
  const toggleTask = useCallback(async (taskId: string) => {
    try {
      const response = await api.task.toggleStatus(taskId);
      const updatedTask = response.data;
      
      // 如果任务变为已完成，从今日任务列表中移除
      // 因为今日任务只显示 todo/in_progress + 今天刚完成的
      if (updatedTask.status === 'completed') {
        // 乐观移除：立即从列表中删除
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        
        // 刷新统计数据和任务列表（获取最新状态）
        await Promise.all([
          fetchTodayStats(),
          fetchTodayTasks(),
        ]);
      } else {
        // 重新打开任务，更新本地状态
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? updatedTask : t))
        );
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
      // 发生错误时重新加载任务列表
      await fetchTodayTasks();
    }
  }, [fetchTodayTasks, fetchTodayStats]);

  // 添加新任务（导航到任务页面）
  const addTask = useCallback(() => {
    // TODO: 导航到任务创建页面或显示添加任务弹窗
    console.log('Navigate to add task');
  }, []);

  // 查看统计（导航到统计页面）
  const viewStats = useCallback(() => {
    // TODO: 导航到统计页面
    console.log('Navigate to stats');
  }, []);

  // 刷新数据
  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

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
      await fetchTodayTasks();
    }
  }, [fetchTodayTasks]);

  // 格式化统计数据供 UI 使用
  const stats = {
    todayPomodoros: todayStats?.completedPomodoros || 0,
    completedTasks: `${todayStats?.completedTasks || 0}/${tasks.filter(t => t.status === 'completed').length}`,
    streakDays: `${todayStats?.streakDays || 0}天`,
  };

  return {
    tasks,
    stats,
    todayStats,
    weeklyStats,
    isLoading,
    error,
    pomodoro: {
      timeLeft: pomodoro.timeLeft,
      isRunning: pomodoro.isRunning,
      isPaused: pomodoro.isPaused,
      start: pomodoro.start,
      pause: pomodoro.pause,
      resume: pomodoro.resume,
      stop: pomodoro.stop,
    },
    toggleTask,
    reorderTasks,
    addTask,
    viewStats,
    refresh,
  };
}

// ==================== Home Screen 任务列表 Hook ====================

export function useHomeTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.task.getTodayTasks();
      setTasks(response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTask = useCallback(async (taskId: string) => {
    const response = await api.task.toggleStatus(taskId);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? response.data : t))
    );
  }, []);

  return {
    tasks,
    isLoading,
    toggleTask,
    refresh: fetchTasks,
  };
}

// ==================== Home Screen 统计 Hook ====================

export function useHomeStats() {
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.pomodoro.getTodayStats();
      setTodayStats(response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    todayStats,
    isLoading,
    refresh: fetchStats,
  };
}
