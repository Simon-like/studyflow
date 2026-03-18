import { useCallback, useEffect, useRef, useState } from 'react';
import { Portal } from '@/components/Portal';
import { Link } from 'react-router-dom';
import { PomodoroTimer } from '@/components/business';
import { Card, CardHeader } from '@/components/ui';
import { useDashboardTimer, useDashboardData } from './hooks';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import { WelcomeHeader } from './components/WelcomeHeader';
import { StatsStrip } from './components/StatsStrip';
import { WeeklySummary } from './components/WeeklySummary';
import { SortableTaskList } from './components/SortableTaskList';
import { WEEKLY_STATS } from './constants';
import { api, STATS_KEYS } from '@studyflow/api';
import { useQueryClient } from '@tanstack/react-query';
import type { Task } from '@studyflow/shared';
import toast from 'react-hot-toast';
import { useDialog } from '@/providers/DialogProvider';
import { getApiErrorMessage } from '@/lib/utils';

export default function DashboardPage() {
  const {
    displayName,
    todayTasks,
    weeklyStats,
    isLoading,
    error,
    toggleTask,
    reorderTasks,
    refetch
  } = useDashboardData();

  const dialog = useDialog();
  const queryClient = useQueryClient();

  // 选中的任务（用于番茄钟专注）
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // 从 Zustand store 读取 activePomodoroId（跨页面导航不丢失）
  const activePomodoroId = usePomodoroStore(s => s.activePomodoroId);
  const setActivePomodoroId = usePomodoroStore(s => s.setActivePomodoroId);
  const focusDuration = usePomodoroStore(s => s.focusDuration);

  // 防重入：避免自动结算重复触发
  const isAutoSettlingRef = useRef(false);

  // 任务详情弹窗
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  const {
    status,
    timeRemaining,
    totalTime,
    onStart,
    onPause,
    onResume,
    onStop,
    onStartRest,
    onExtendRest,
    onEndRest,
  } = useDashboardTimer();

  // 同步 timeRemaining 到 focusDuration（解决页面刷新后显示不正确的问题）
  const syncTimeRemaining = usePomodoroStore(s => s.syncTimeRemaining);
  const syncAttemptedRef = useRef(false);
  
  useEffect(() => {
    // 组件挂载后执行一次同步，确保 timeRemaining 与 focusDuration 一致
    if (!syncAttemptedRef.current && status === 'idle') {
      syncAttemptedRef.current = true;
      syncTimeRemaining();
    }
  }, [status, syncTimeRemaining]);

  // 恢复：组件挂载时检查后端是否有活跃的番茄钟，如有则恢复计时状态
  const recoveryAttemptedRef = useRef(false);
  useEffect(() => {
    if (recoveryAttemptedRef.current) return;

    // 从 store 直接读取最新值（避免 rehydrate 前闭包过期）
    const storeState = usePomodoroStore.getState();
    const currentStatus = storeState.status;
    const currentPomodoroId = storeState.activePomodoroId;

    const needsRecovery =
      (currentStatus === 'idle' && currentPomodoroId) ||
      (currentStatus === 'running' && !currentPomodoroId);
    if (!needsRecovery) return;

    recoveryAttemptedRef.current = true;
    api.pomodoro.getActive().then(res => {
      const record = res.data;
      if (record?.id) {
        // 计算剩余时间
        const elapsed = Math.floor((Date.now() - new Date(record.startTime).getTime()) / 1000);
        const remaining = Math.max(0, record.duration - elapsed);

        if (remaining > 0) {
          // 恢复计时状态
          usePomodoroStore.setState({
            status: 'running',
            timeRemaining: remaining,
            activePomodoroId: record.id,
          });
          toast.success('已恢复上次专注进度');
        } else {
          // 已超时，自动结算（交给 auto-settle effect 处理）
          usePomodoroStore.setState({
            status: 'running',
            timeRemaining: 0,
            activePomodoroId: record.id,
          });
        }
      } else {
        // 后端无活跃记录，清除本地残留
        if (currentPomodoroId) {
          usePomodoroStore.setState({ activePomodoroId: null });
        }
      }
    }).catch(() => {
      // 请求失败，重置
      usePomodoroStore.setState({ activePomodoroId: null });
      if (usePomodoroStore.getState().status === 'running') {
        onStop();
      }
    });
  }, []);

  // 直接用后端返回的 todayStats 更新 TanStack Query 缓存
  const updateStatsFromSettlement = useCallback(async (response: any) => {
    const todayStats = response?.data?.todayStats;
    if (todayStats) {
      // 立即更新缓存
      queryClient.setQueryData(STATS_KEYS.today(), todayStats);
    }
    // 强制从服务端重新拉取，确保数据一致
    await queryClient.refetchQueries({ queryKey: STATS_KEYS.today() });
    queryClient.invalidateQueries({ queryKey: STATS_KEYS.dashboard() });
    queryClient.invalidateQueries({ queryKey: STATS_KEYS.userStats() });
  }, [queryClient]);

  // 结算番茄钟记录
  const settlePomodoro = useCallback(async (
    settlementStatus: 'completed' | 'stopped',
    abandonReason?: string
  ) => {
    if (!activePomodoroId) return false;

    try {
      const response = await api.pomodoro.stop(activePomodoroId, {
        status: settlementStatus,
        abandonReason,
      });
      // 直接用后端响应更新统计缓存，并等待服务端数据刷新
      await updateStatsFromSettlement(response);
      return true;
    } catch (err) {
      console.error('Failed to settle pomodoro:', err);
      toast.error(getApiErrorMessage(err, '番茄钟结算失败'));
      return false;
    } finally {
      setActivePomodoroId(null);
    }
  }, [activePomodoroId, updateStatsFromSettlement]);

  // 兼容兜底：没有活跃 record 但用户完成了专注，补打一条记录
  const createAndCompleteFallbackPomodoro = useCallback(async () => {
    const focusedDuration = focusDuration - timeRemaining;
    if (focusedDuration <= 0) return false;

    const response = await api.pomodoro.start({
      taskId: selectedTask?.id,
      duration: focusedDuration,
      isLocked: !!selectedTask,
    });

    if (response.data?.id) {
      const stopResponse = await api.pomodoro.stop(response.data.id, { status: 'completed' });
      // 兜底路径也要更新统计缓存
      await updateStatsFromSettlement(stopResponse);
      return true;
    }

    return false;
  }, [selectedTask, timeRemaining, updateStatsFromSettlement]);

  // 获取当前显示的任务（优先显示选中的任务）
  const displayTask = selectedTask ||
                      todayTasks.find(t => t.status === 'in_progress') ||
                      todayTasks.find(t => t.status !== 'completed') ||
                      todayTasks[0];

  // 只有在有明确选中任务时才显示任务信息，否则显示自由模式
  const isTaskBound = !!selectedTask;
  const taskTitle = isTaskBound ? (selectedTask?.title || '自由任务') : '自由任务';
  const taskSubtitle = isTaskBound
    ? '专注模式'
    : '专注当下，提升效率';
  const taskProgress = isTaskBound ? '任务模式中' : '自由模式';

  // ========== 专注结束 → 自动结算 + 进入休息 ==========
  useEffect(() => {
    if (status !== 'running' || timeRemaining > 0 || isAutoSettlingRef.current) {
      return;
    }

    isAutoSettlingRef.current = true;

    (async () => {
      try {
        // 结算番茄数和学习时长（不结算任务数）
        const settled = await settlePomodoro('completed');
        if (!settled) {
          await createAndCompleteFallbackPomodoro();
        }
        await refetch();
        toast.success('专注完成，已计入统计！进入休息时间');
        // 进入休息状态（不清除 currentTask，休息期间仍可完成任务）
        onStartRest();
      } catch (err) {
        console.error('Failed to auto complete pomodoro:', err);
        toast.error(getApiErrorMessage(err, '专注结算失败，请稍后重试'));
        onStop();
      } finally {
        isAutoSettlingRef.current = false;
      }
    })();
  }, [status, timeRemaining, settlePomodoro, createAndCompleteFallbackPomodoro, refetch, onStartRest, onStop]);

  // ========== 休息结束 → 自动回到 idle ==========
  useEffect(() => {
    if (status !== 'resting' || timeRemaining > 0) return;
    onEndRest();
    toast.success('休息结束！');
  }, [status, timeRemaining, onEndRest]);

  // 选择任务（带切换确认）
  const handleSelectTask = useCallback((task: Task) => {
    // 如果当前有选中任务且番茄钟正在运行/暂停，需要确认切换
    if (selectedTask && selectedTask.id !== task.id && (status === 'running' || status === 'paused')) {
      dialog.confirm({
        variant: 'warning',
        title: '更换当前任务？',
        message: `当前正在专注「${selectedTask.title}」，切换后计时数据将被清零。确定要更换为「${task.title}」吗？`,
        confirmText: '确认更换',
        cancelText: '继续当前任务',
        onConfirm: async () => {
          await settlePomodoro('stopped', 'switch_task');
          onStop();
          setSelectedTask(task);
          toast.success(`已切换到任务：${task.title}`);
        },
      });
      return;
    }
    setSelectedTask(task);
    toast.success(`已选择任务：${task.title}`);
  }, [selectedTask, status, dialog, onStop, settlePomodoro]);

  // 开始/暂停（合一，自由模式下不自动选择任务）
  const handleToggleTimer = useCallback(async () => {
    if (status === 'running') {
      onPause();
    } else if (status === 'paused') {
      onResume();
    } else if (status === 'idle') {
      // 开始新番茄钟
      if (selectedTask && selectedTask.status !== 'completed') {
        try {
          await api.task.startTask(selectedTask.id);
          await refetch();
        } catch (err) {
          console.error('Failed to start task:', err);
          toast.error(getApiErrorMessage(err, '开始任务失败'));
        }
      }

      try {
        const response = await api.pomodoro.start({
          taskId: selectedTask?.id,
          duration: focusDuration,
          isLocked: !!selectedTask,
        });
        setActivePomodoroId(response.data?.id || null);
      } catch (err) {
        console.error('Failed to start pomodoro record:', err);
        toast.error(getApiErrorMessage(err, '开始专注失败，请稍后重试'));
        return;
      }

      onStart();
    }
    // resting 状态下 toggleTimer 不做任何事（由专用按钮处理）
  }, [status, selectedTask, focusDuration, onStart, onPause, onResume, refetch, setActivePomodoroId]);

  // 提前完成任务（专注期间）
  const handleCompleteTask = useCallback(async () => {
    // 自由模式下：计时器未运行时无法完成
    if (!selectedTask && status === 'idle') {
      toast.error('请先开始专注');
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
        try {
          const settled = await settlePomodoro('completed');
          if (!settled) {
            await createAndCompleteFallbackPomodoro();
          }

          if (selectedTask) {
            // 任务模式：标记任务完成（计入任务数统计）
            if (selectedTask.status === 'completed') {
              toast('该任务已完成', { icon: 'ℹ️' });
            } else {
              await api.task.toggleStatus(selectedTask.id);
              toast.success('任务已完成！');
            }
            setSelectedTask(null);
          } else {
            toast.success('番茄钟已完成并计入统计！');
          }

          await refetch();
        } catch (err) {
          console.error('Failed to complete task or pomodoro:', err);
          toast.error(getApiErrorMessage(err, '完成失败，请稍后重试'));
        } finally {
          onStop();
        }
      },
    });
  }, [selectedTask, status, onStop, refetch, dialog, settlePomodoro, createAndCompleteFallbackPomodoro]);

  // ========== 休息模式操作 ==========

  // 延长休息 5 分钟
  const handleExtendRest = useCallback(() => {
    onExtendRest();
    toast.success('已延长休息 5 分钟');
  }, [onExtendRest]);

  // 提前结束休息（自由模式）
  const handleEndRestEarly = useCallback(() => {
    onEndRest();
    toast.success('休息已结束');
  }, [onEndRest]);

  // 提前结束休息并完成任务（任务模式）
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
          if (selectedTask) {
            if (selectedTask.status !== 'completed') {
              await api.task.toggleStatus(selectedTask.id);
              toast.success('任务已完成！');
            }
            setSelectedTask(null);
          }
          await refetch();
        } catch (err) {
          console.error('Failed to complete task from rest:', err);
          toast.error(getApiErrorMessage(err, '完成失败'));
        } finally {
          onEndRest();
        }
      },
    });
  }, [selectedTask, dialog, onEndRest, refetch]);

  // 放弃任务（进入自由模式，所有任务未选中）
  const handleAbandonTask = useCallback(() => {
    const isTimerActive = status === 'running' || status === 'paused';

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
      onConfirm: async () => {
        await settlePomodoro('stopped', 'user_abandon');
        // 清除选中的任务，进入自由模式
        setSelectedTask(null);
        onStop();
        toast.success('已放弃，进入自由模式');
      },
    });
  }, [selectedTask, onStop, status, dialog, settlePomodoro]);

  // 从任务列表重置番茄钟（例如拖拽触发）
  const handleResetPomodoro = useCallback(async () => {
    await settlePomodoro('stopped', 'reorder_reset');
    onStop();
  }, [settlePomodoro, onStop]);

  // 查看任务详情（仅在任务模式下可用）
  const handleShowTaskDetail = useCallback(() => {
    if (isTaskBound && selectedTask) {
      setShowTaskDetail(true);
    }
  }, [isTaskBound, selectedTask]);

  // 进入自由模式时关闭任务详情弹窗
  useEffect(() => {
    if (!selectedTask) {
      setShowTaskDetail(false);
    }
  }, [selectedTask]);

  return (
    <div className="p-10 max-w-6xl mx-auto">
      {/* 任务详情弹窗 — 仅在任务模式下显示 */}
      {showTaskDetail && isTaskBound && selectedTask && (
        <Portal>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-charcoal">任务详情</h3>
                <button
                  onClick={() => setShowTaskDetail(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-warm hover:bg-warm/80 transition-colors"
                >
                  <span className="text-stone text-sm">✕</span>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-stone mb-1">任务名称</p>
                  <p className="text-sm font-medium text-charcoal">{selectedTask.title}</p>
                </div>
                {selectedTask.description && (
                  <div>
                    <p className="text-xs text-stone mb-1">任务描述</p>
                    <p className="text-sm text-charcoal leading-relaxed">{selectedTask.description}</p>
                  </div>
                )}
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-stone mb-1">优先级</p>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      selectedTask.priority === 'high' ? 'text-red-500 bg-red-50' :
                      selectedTask.priority === 'medium' ? 'text-amber-500 bg-amber-50' :
                      'text-sage bg-sage/10'
                    }`}>
                      {selectedTask.priority === 'high' ? '高' : selectedTask.priority === 'medium' ? '中' : '低'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-stone mb-1">状态</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    status === 'running' ? 'text-coral bg-coral/10' :
                    status === 'paused' ? 'text-amber-500 bg-amber-50' :
                    status === 'resting' ? 'text-sage bg-sage/10' :
                    'text-charcoal bg-warm'
                  }`}>
                    {status === 'running' ? '进行中' :
                     status === 'paused' ? '已暂停' :
                     status === 'resting' ? '休息中' :
                     '已选中'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}

      <WelcomeHeader displayName={displayName} />
      <StatsStrip stats={weeklyStats} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pomodoro Timer */}
        <div className="lg:col-span-2">
          <Card padding="lg">
            <CardHeader
              title="今日专注"
              action={
                <Link to="/stats" className="text-coral text-sm font-medium hover:text-coral-700">
                  查看统计
                </Link>
              }
            />
            <PomodoroTimer
              status={status}
              timeRemaining={timeRemaining}
              totalTime={totalTime}
              taskTitle={taskTitle}
              taskSubtitle={taskSubtitle}
              taskProgress={taskProgress}
              isTaskBound={isTaskBound}
              onToggleTimer={handleToggleTimer}
              onCompleteTask={handleCompleteTask}
              onAbandonTask={handleAbandonTask}
              onShowTaskDetail={isTaskBound && displayTask ? handleShowTaskDetail : undefined}
              onExtendRest={handleExtendRest}
              onEndRestEarly={handleEndRestEarly}
              onCompleteTaskFromRest={handleCompleteTaskFromRest}
            />
          </Card>
        </div>

        {/* Weekly Summary */}
        <WeeklySummary stats={WEEKLY_STATS} />
      </div>

      {/* Today's Tasks */}
      <SortableTaskList
        tasks={todayTasks}
        selectedTaskId={selectedTask?.id}
        pomodoroStatus={status}
        isLoading={isLoading}
        error={error}
        onToggleTask={toggleTask}
        onReorder={reorderTasks}
        onRefresh={refetch}
        onSelectTask={handleSelectTask}
        isPomodoroRunning={status === 'running'}
        onPausePomodoro={onPause}
        onResetPomodoro={handleResetPomodoro}
      />
    </div>
  );
}
