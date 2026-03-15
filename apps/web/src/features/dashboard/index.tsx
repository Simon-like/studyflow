import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { PomodoroTimer } from '@/components/business';
import { Card, CardHeader } from '@/components/ui';
import { useDashboardTimer, useDashboardData } from './hooks';
import { WelcomeHeader } from './components/WelcomeHeader';
import { StatsStrip } from './components/StatsStrip';
import { WeeklySummary } from './components/WeeklySummary';
import { SortableTaskList } from './components/SortableTaskList';
import { WEEKLY_STATS } from './constants';
import { api } from '@studyflow/api';
import type { Task } from '@studyflow/shared';
import toast from 'react-hot-toast';
import { useDialog } from '@/providers/DialogProvider';

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

  // 选中的任务（用于番茄钟专注）
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // 任务详情弹窗
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  const {
    status,
    timeRemaining,
    onStart,
    onPause,
    onResume,
    onStop,
  } = useDashboardTimer();

  // 获取当前显示的任务（优先显示选中的任务）
  const displayTask = selectedTask ||
                      todayTasks.find(t => t.status === 'in_progress') ||
                      todayTasks.find(t => t.status !== 'completed') ||
                      todayTasks[0];

  // 只有在有明确选中任务时才显示任务信息，否则显示自由模式
  const isTaskBound = !!selectedTask;
  const taskTitle = isTaskBound ? (selectedTask?.title || '自由任务') : '自由任务';
  const taskSubtitle = isTaskBound 
    ? (selectedTask?.category || '专注模式') 
    : '专注当下，提升效率';
  const taskProgress = isTaskBound ? '任务模式中' : '自由模式';

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
        onConfirm: () => {
          onStop();
          setSelectedTask(task);
          toast.success(`已切换到任务：${task.title}`);
        },
      });
      return;
    }
    setSelectedTask(task);
    toast.success(`已选择任务：${task.title}`);
  }, [selectedTask, status, dialog, onStop]);

  // 开始/暂停（合一，自由模式下不自动选择任务）
  const handleToggleTimer = useCallback(async () => {
    if (status === 'running') {
      onPause();
    } else if (status === 'paused') {
      onResume();
    } else {
      // 开始新番茄钟
      // 只有在有明确选中任务时才绑定任务，否则保持自由模式
      if (selectedTask && selectedTask.status !== 'completed') {
        try {
          await api.task.startTask(selectedTask.id);
          await refetch();
        } catch (err) {
          console.error('Failed to start task:', err);
        }
      }
      onStart();
    }
  }, [status, selectedTask, onStart, onPause, onResume, refetch]);

  // 提前完成任务
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
        if (selectedTask) {
          // 任务模式：标记任务完成
          if (selectedTask.status === 'completed') {
            toast('该任务已完成', { icon: 'ℹ️' });
            return;
          }

          try {
            await api.task.toggleStatus(selectedTask.id);
            await refetch();
            toast.success('任务已完成！');
            setSelectedTask(null);
          } catch (err) {
            console.error('Failed to complete task:', err);
            toast.error('完成任务失败');
          }
        } else {
          // 自由模式：记录完成的番茄钟
          try {
            // 计算已专注的时间
            const totalTime = 25 * 60; // 默认25分钟
            const focusedDuration = totalTime - timeRemaining;
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
              await refetch();
              toast.success('番茄钟已完成并计入统计！');
            }
          } catch (err) {
            console.error('Failed to record pomodoro:', err);
            toast.error('记录番茄钟失败');
          }
        }
        onStop();
      },
    });
  }, [selectedTask, status, timeRemaining, onStop, refetch, dialog]);



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
      onConfirm: () => {
        // 清除选中的任务，进入自由模式
        setSelectedTask(null);
        onStop();
        toast.success('已放弃，进入自由模式');
      },
    });
  }, [selectedTask, onStop, status, dialog]);

  // 查看任务详情
  const handleShowTaskDetail = useCallback(() => {
    if (displayTask) {
      setShowTaskDetail(true);
    }
  }, [displayTask]);

  return (
    <div className="p-10 max-w-6xl mx-auto">
      {/* 任务详情弹窗 */}
      {showTaskDetail && displayTask && (
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
                <p className="text-sm font-medium text-charcoal">{displayTask.title}</p>
              </div>
              {displayTask.description && (
                <div>
                  <p className="text-xs text-stone mb-1">任务描述</p>
                  <p className="text-sm text-charcoal leading-relaxed">{displayTask.description}</p>
                </div>
              )}
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-stone mb-1">优先级</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    displayTask.priority === 'high' ? 'text-red-500 bg-red-50' :
                    displayTask.priority === 'medium' ? 'text-amber-500 bg-amber-50' :
                    'text-sage bg-sage/10'
                  }`}>
                    {displayTask.priority === 'high' ? '高' : displayTask.priority === 'medium' ? '中' : '低'}
                  </span>
                </div>
                {displayTask.category && (
                  <div>
                    <p className="text-xs text-stone mb-1">分类</p>
                    <p className="text-sm text-charcoal">{displayTask.category}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-stone mb-1">状态</p>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  status === 'running' ? 'text-coral bg-coral/10' :
                  status === 'paused' ? 'text-amber-500 bg-amber-50' :
                  selectedTask?.id === displayTask.id ? 'text-charcoal bg-warm' :
                  'text-stone bg-warm'
                }`}>
                  {status === 'running' ? '进行中' :
                   status === 'paused' ? '已暂停' :
                   selectedTask?.id === displayTask.id ? '已选中' :
                   '待开始'}
                </span>
              </div>
            </div>
          </div>
        </div>
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
              taskTitle={taskTitle}
              taskSubtitle={taskSubtitle}
              taskProgress={taskProgress}
              isTaskBound={isTaskBound}
              onToggleTimer={handleToggleTimer}
              onCompleteTask={handleCompleteTask}
              onAbandonTask={handleAbandonTask}
              onShowTaskDetail={displayTask ? handleShowTaskDetail : undefined}
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
        onResetPomodoro={onStop}
      />
    </div>
  );
}
