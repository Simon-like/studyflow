/**
 * Home 页面自定义 Hooks
 * 参照 web Dashboard 实现完整的专注-结算-休息流程
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { api } from '../../api';
import type { Task, TodayStats, WeeklyOverview } from '@studyflow/shared';
import { usePomodoro } from '../../hooks';
import { useDialog } from '../../providers/DialogProvider';

// ==================== Home Screen 主 Hook ====================

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

  // 活跃的番茄钟记录ID
  const [activePomodoroId, setActivePomodoroId] = useState<string | null>(null);

  // 防重入
  const isAutoSettlingRef = useRef(false);

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

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 番茄钟 Hook
  const pomodoro = usePomodoro({});

  // ========== 结算番茄钟 ==========
  const settlePomodoro = useCallback(async (status: 'completed' | 'abandoned') => {
    if (!activePomodoroId) return false;
    try {
      await api.pomodoro.stop(activePomodoroId, { status });
      setActivePomodoroId(null);
      await fetchTodayStats();
      return true;
    } catch (err) {
      console.error('Failed to settle pomodoro:', err);
      setActivePomodoroId(null);
      return false;
    }
  }, [activePomodoroId, fetchTodayStats]);

  // 兜底：没有活跃 record 但用户完成了专注
  const createAndCompleteFallbackPomodoro = useCallback(async () => {
    const focusedDuration = pomodoro.totalTime - pomodoro.timeLeft;
    if (focusedDuration <= 0) return false;
    try {
      const response = await api.pomodoro.start({
        taskId: selectedTask?.id,
        duration: focusedDuration,
        isLocked: !!selectedTask,
      });
      if (response.data?.id) {
        await api.pomodoro.stop(response.data.id, { status: 'completed' });
        await fetchTodayStats();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [selectedTask, pomodoro.timeLeft, pomodoro.totalTime, fetchTodayStats]);

  // ========== 专注结束 -> 自动结算 + 进入休息 ==========
  useEffect(() => {
    if (pomodoro.status !== 'completed' || isAutoSettlingRef.current) return;

    isAutoSettlingRef.current = true;

    (async () => {
      try {
        const settled = await settlePomodoro('completed');
        if (!settled) {
          await createAndCompleteFallbackPomodoro();
        }
        await fetchTodayTasks();
        Alert.alert('专注完成', '已计入统计！进入休息时间');
        pomodoro.startRest();
      } catch (err) {
        console.error('Failed to auto settle:', err);
        pomodoro.stop();
      } finally {
        isAutoSettlingRef.current = false;
      }
    })();
  }, [pomodoro.status]);

  // ========== 休息结束 -> 自动回到 idle ==========
  useEffect(() => {
    if (pomodoro.status !== 'resting' || pomodoro.timeLeft > 0) return;
    pomodoro.endRest();
    Alert.alert('休息结束', '准备好开始下一轮了吗？');
  }, [pomodoro.status, pomodoro.timeLeft]);

  // ========== 操作 ==========

  // 切换任务状态
  const toggleTask = useCallback(async (taskId: string) => {
    try {
      const response = await api.task.toggleStatus(taskId);
      const updatedTask = response.data;
      if (updatedTask.status === 'completed') {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        if (selectedTask?.id === taskId) setSelectedTask(null);
        await Promise.all([fetchTodayStats(), fetchTodayTasks()]);
      } else {
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
      await fetchTodayTasks();
    }
  }, [fetchTodayTasks, fetchTodayStats, selectedTask]);

  // 查看统计（由导航层处理）
  const [navigateTo, setNavigateTo] = useState<string | null>(null);

  const viewStats = useCallback(() => {
    setNavigateTo('stats');
  }, []);

  const clearNavigation = useCallback(() => {
    setNavigateTo(null);
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

  const addTask = useCallback(() => {
    setNavigateTo('tasks');
  }, []);

  // 开始/暂停（含后端记录创建）
  const toggleTimer = useCallback(async () => {
    if (pomodoro.status === 'resting') return; // 休息中不响应

    if (pomodoro.isRunning) {
      pomodoro.pause();
    } else if (pomodoro.isPaused) {
      pomodoro.resume();
    } else if (pomodoro.isIdle) {
      // 如果有选中任务，先标记为 in_progress
      if (selectedTask && selectedTask.status !== 'completed') {
        try {
          await api.task.startTask(selectedTask.id);
          await fetchTodayTasks();
        } catch (err) {
          console.error('Failed to start task:', err);
        }
      }

      // 创建后端番茄钟记录
      try {
        const response = await api.pomodoro.start({
          taskId: selectedTask?.id,
          duration: pomodoro.totalTime,
          isLocked: !!selectedTask,
        });
        setActivePomodoroId(response.data?.id || null);
      } catch (err) {
        console.error('Failed to start pomodoro record:', err);
        Alert.alert('提示', '开始专注失败，请稍后重试');
        return;
      }

      pomodoro.start();
    }
  }, [pomodoro, selectedTask, fetchTodayTasks]);

  // 提前完成任务
  const completeTask = useCallback(async () => {
    if (!selectedTask && pomodoro.status === 'idle') return;

    dialog.confirm({
      variant: 'success',
      title: '完成任务',
      message: selectedTask
        ? `确定要提前结束并完成任务「${selectedTask.title}」吗？`
        : '确定要完成当前番茄钟吗？完成后将计入统计。',
      confirmText: '确认完成',
      cancelText: '取消',
      onConfirm: async () => {
        try {
          const settled = await settlePomodoro('completed');
          if (!settled) {
            await createAndCompleteFallbackPomodoro();
          }
          if (selectedTask && selectedTask.status !== 'completed') {
            await api.task.toggleStatus(selectedTask.id);
          }
          setSelectedTask(null);
          await Promise.all([fetchTodayTasks(), fetchTodayStats()]);
        } catch (err) {
          console.error('Failed to complete task:', err);
        } finally {
          pomodoro.stop();
        }
      },
    });
  }, [selectedTask, pomodoro, fetchTodayTasks, fetchTodayStats, dialog, settlePomodoro, createAndCompleteFallbackPomodoro]);

  // 放弃任务
  const abandonTask = useCallback(() => {
    const isTimerActive = pomodoro.status === 'running' || pomodoro.status === 'paused';
    if (!isTimerActive && !selectedTask) return;

    dialog.confirm({
      variant: 'danger',
      title: '放弃任务',
      message: selectedTask
        ? `确定要放弃当前任务「${selectedTask.title}」吗？放弃后计时将不会计入统计。`
        : '确定要放弃当前番茄钟吗？放弃后计时将不会计入统计。',
      confirmText: '确认放弃',
      cancelText: '继续',
      onConfirm: async () => {
        await settlePomodoro('abandoned');
        setSelectedTask(null);
        pomodoro.stop();
      },
    });
  }, [selectedTask, pomodoro, dialog, settlePomodoro]);

  // ========== 休息模式操作 ==========

  const handleExtendRest = useCallback(() => {
    pomodoro.extendRest();
  }, [pomodoro]);

  const handleEndRestEarly = useCallback(() => {
    pomodoro.endRest();
  }, [pomodoro]);

  const handleCompleteTaskFromRest = useCallback(() => {
    dialog.confirm({
      variant: 'success',
      title: '提前结束休息',
      message: selectedTask
        ? `是否提前结束休息并完成任务「${selectedTask.title}」？`
        : '是否提前结束休息？',
      confirmText: '完成',
      cancelText: '继续休息',
      onConfirm: async () => {
        try {
          if (selectedTask && selectedTask.status !== 'completed') {
            await api.task.toggleStatus(selectedTask.id);
          }
          setSelectedTask(null);
          await Promise.all([fetchTodayTasks(), fetchTodayStats()]);
        } catch (err) {
          console.error('Failed to complete task from rest:', err);
        } finally {
          pomodoro.endRest();
        }
      },
    });
  }, [selectedTask, dialog, pomodoro, fetchTodayTasks, fetchTodayStats]);

  // 选择任务（带切换确认）
  const handleSelectTask = useCallback((task: Task) => {
    if (selectedTask && selectedTask.id !== task.id && (pomodoro.isRunning || pomodoro.isPaused)) {
      dialog.confirm({
        variant: 'warning',
        title: '更换当前任务？',
        message: `当前正在专注「${selectedTask.title}」，切换后计时数据将被清零。确定要更换为「${task.title}」吗？`,
        confirmText: '确认更换',
        cancelText: '继续当前任务',
        onConfirm: async () => {
          await settlePomodoro('abandoned');
          pomodoro.stop();
          setSelectedTask(task);
        },
      });
      return;
    }
    setSelectedTask(task);
  }, [selectedTask, pomodoro, dialog, settlePomodoro]);

  // 格式化统计数据
  const completedCount = todayStats?.completedTasks || 0;
  const totalCount = tasks.length + completedCount;
  const stats = {
    todayPomodoros: todayStats?.completedPomodoros || 0,
    completedTasks: `${completedCount}/${totalCount}`,
    streakDays: `${todayStats?.streakDays || 0}天`,
  };

  // 获取显示的任务状态
  const getTaskStatus = useCallback(() => {
    if (selectedTask) {
      return { title: selectedTask.title, subtitle: '专注模式', count: '任务模式中' };
    }
    return { title: '自由任务', subtitle: '专注当下，提升效率', count: '自由模式' };
  }, [selectedTask]);

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
      totalTime: pomodoro.totalTime,
      status: pomodoro.status,
      toggleTimer,
      completeTask,
      abandonTask,
      extendRest: handleExtendRest,
      endRestEarly: handleEndRestEarly,
      completeTaskFromRest: handleCompleteTaskFromRest,
    },
    taskStatus,
    toggleTask,
    reorderTasks,
    addTask,
    viewStats,
    refresh,
    navigateTo,
    clearNavigation,
  };
}
