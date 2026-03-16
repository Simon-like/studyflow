/**
 * Home 页面自定义 Hooks
 * 与 Web Dashboard 保持数据架构一致性
 */

import { useState, useCallback, useEffect } from 'react';
import { api } from '../../api';
import type { Task, TodayStats, WeeklyOverview } from '@studyflow/shared';
import { usePomodoro } from '../../hooks';
import { useDialog } from '../../providers/DialogProvider';
import { POMODORO_CONFIG } from '../../constants';

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
  status: 'idle' | 'running' | 'paused' | 'completed';
  toggleTimer: () => void;
  completeTask: () => Promise<void>;
  abandonTask: () => void;
}

export function useHomeScreen() {
  const dialog = useDialog();

  // 任务和统计数据状态
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 选中的任务（用于番茄钟专注）
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  // 番茄钟完成回调
  const handlePomodoroComplete = useCallback(async () => {
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

      if (updatedTask.status === 'completed') {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        if (selectedTask?.id === taskId) {
          setSelectedTask(null);
        }
        await Promise.all([
          fetchTodayStats(),
          fetchTodayTasks(),
        ]);
      } else {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? updatedTask : t))
        );
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
      await fetchTodayTasks();
    }
  }, [fetchTodayTasks, fetchTodayStats, selectedTask]);

  // 添加新任务
  const addTask = useCallback(() => {
    console.log('Navigate to add task');
  }, []);

  // 查看统计
  const viewStats = useCallback(() => {
    console.log('Navigate to stats');
  }, []);

  // 刷新数据
  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // 更新任务排序
  const reorderTasks = useCallback(async (newTasks: Task[]) => {
    try {
      setTasks(newTasks);
      const taskOrders = newTasks.map((task, index) => ({
        id: task.id,
        order: index,
      }));
      await api.task.reorderTasks({ taskOrders });
    } catch (err) {
      console.error('Failed to reorder tasks:', err);
      await fetchTodayTasks();
    }
  }, [fetchTodayTasks]);

  // ========== 番茄钟操作 ==========

  // 开始/暂停（自由模式下不自动选择任务）
  const toggleTimer = useCallback(async () => {
    if (pomodoro.isRunning) {
      pomodoro.pause();
    } else if (pomodoro.isPaused) {
      pomodoro.resume();
    } else {
      // 只有在有明确选中任务时才绑定任务，否则保持自由模式
      if (selectedTask && selectedTask.status !== 'completed') {
        try {
          await api.task.startTask(selectedTask.id);
          await fetchTodayTasks();
        } catch (err) {
          console.error('Failed to start task:', err);
        }
      }
      pomodoro.start();
    }
  }, [pomodoro, selectedTask, fetchTodayTasks]);

  // 提前完成任务
  const completeTask = useCallback(async () => {
    // 自由模式下：计时器未运行时无法完成
    if (!selectedTask && pomodoro.status === 'idle') {
      return;
    }

    // 显示确认弹窗
    dialog.confirm({
      variant: 'success',
      title: '完成任务',
      message: selectedTask
        ? `确定要提前结束并完成任务「${selectedTask.title}」吗？`
        : '确定要完成当前番茄钟吗？完成后将计入统计。',
      confirmText: '确认完成',
      cancelText: '取消',
      onConfirm: async () => {
        if (selectedTask) {
          // 任务模式：标记任务完成
          if (selectedTask.status !== 'completed') {
            try {
              await api.task.toggleStatus(selectedTask.id);
              await fetchTodayTasks();
              await fetchTodayStats();
            } catch (err) {
              console.error('Failed to complete task:', err);
            }
          }
          setSelectedTask(null);
        } else {
          // 自由模式：记录完成的番茄钟
          try {
            // 计算已专注的时间
            const focusedDuration = POMODORO_CONFIG.DEFAULT_DURATION - pomodoro.timeLeft;
            if (focusedDuration > 0) {
              // 创建番茄钟记录
              const response = await api.pomodoro.start({
                duration: focusedDuration,
                isLocked: false,
              });
              // 停止番茄钟并标记为完成
              if (response.data?.id) {
                await api.pomodoro.stop(response.data.id, { status: 'completed' });
              }
              await fetchTodayStats();
            }
          } catch (err) {
            console.error('Failed to record pomodoro:', err);
          }
        }
        pomodoro.stop();
      },
    });
  }, [selectedTask, pomodoro, fetchTodayTasks, fetchTodayStats, dialog]);



  // 放弃任务（进入自由模式，所有任务未选中）
  const abandonTask = useCallback(() => {
    const isTimerActive = pomodoro.status === 'running' || pomodoro.status === 'paused';
    
    if (!isTimerActive && !selectedTask) {
      // 已经是自由模式且计时器未运行，无需操作
      return;
    }
    
    dialog.confirm({
      variant: 'danger',
      title: '放弃任务',
      message: selectedTask
        ? `确定要放弃当前任务「${selectedTask.title}」吗？放弃后计时将不会计入统计。`
        : '确定要放弃当前番茄钟吗？放弃后计时将不会计入统计。',
      confirmText: '确认放弃',
      cancelText: '继续',
      onConfirm: () => {
        // 清除选中的任务，进入自由模式
        setSelectedTask(null);
        pomodoro.stop();
      },
    });
  }, [selectedTask, pomodoro, dialog]);

  // ========== 任务切换确认 ==========

  // 选择任务（带切换确认）
  const handleSelectTask = useCallback((task: Task) => {
    if (selectedTask && selectedTask.id !== task.id && (pomodoro.isRunning || pomodoro.isPaused)) {
      dialog.confirm({
        variant: 'warning',
        title: '更换当前任务？',
        message: `当前正在专注「${selectedTask.title}」，切换后计时数据将被清零。确定要更换为「${task.title}」吗？`,
        confirmText: '确认更换',
        cancelText: '继续当前任务',
        onConfirm: () => {
          pomodoro.stop();
          setSelectedTask(task);
        },
      });
      return;
    }
    setSelectedTask(task);
  }, [selectedTask, pomodoro, dialog]);

  // 格式化统计数据供 UI 使用
  const stats = {
    todayPomodoros: todayStats?.completedPomodoros || 0,
    completedTasks: `${todayStats?.completedTasks || 0}/${tasks.filter(t => t.status === 'completed').length}`,
    streakDays: `${todayStats?.streakDays || 0}天`,
  };

  // 获取显示的任务状态（自由模式下显示默认字样）
  const getTaskStatus = useCallback(() => {
    // 只有在有明确选中任务时才显示任务信息
    if (selectedTask) {
      return {
        title: selectedTask.title,
        subtitle: selectedTask.category || '专注模式',
        count: '任务模式中',
      };
    }
    
    // 自由模式：所有任务未选中状态
    return {
      title: '自由任务',
      subtitle: '专注当下，提升效率',
      count: '自由模式',
    };
  }, [selectedTask]);

  // 获取显示的任务（用于详情弹窗）- 只有明确选中时才显示
  const displayTask = selectedTask;

  const taskStatus = getTaskStatus();

  return {
    tasks,
    selectedTask,
    displayTask,
    setSelectedTask: handleSelectTask,
    stats,
    todayStats,
    weeklyStats,
    isLoading,
    error,
    pomodoro: {
      timeLeft: pomodoro.timeLeft,
      status: pomodoro.status,
      toggleTimer,
      completeTask,
      abandonTask,
    },
    taskStatus,
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
