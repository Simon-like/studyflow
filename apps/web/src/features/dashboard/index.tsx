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
import { AlertCircle } from 'lucide-react';

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

  // 选中的任务（用于番茄钟专注）
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // 任务切换确认
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false);
  const [pendingSwitchTask, setPendingSwitchTask] = useState<Task | null>(null);

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

  const hasTasks = todayTasks.length > 0;
  const taskTitle = displayTask?.title || '自由任务';
  const taskSubtitle = displayTask?.category || (hasTasks ? '点击任务开始专注' : '专注当下，提升效率');
  const taskProgress = displayTask
    ? `${displayTask.completedPomodoros}/${displayTask.estimatedPomodoros} 番茄`
    : '自由模式';

  // 选择任务（带切换确认）
  const handleSelectTask = useCallback((task: Task) => {
    // 如果当前有选中任务且番茄钟正在运行/暂停，需要确认切换
    if (selectedTask && selectedTask.id !== task.id && (status === 'running' || status === 'paused')) {
      setPendingSwitchTask(task);
      setShowSwitchConfirm(true);
      return;
    }
    setSelectedTask(task);
    toast.success(`已选择任务：${task.title}`);
  }, [selectedTask, status]);

  // 确认切换任务
  const handleConfirmSwitch = useCallback(async () => {
    if (pendingSwitchTask) {
      onStop();
      setSelectedTask(pendingSwitchTask);
      toast.success(`已切换到任务：${pendingSwitchTask.title}`);
    }
    setShowSwitchConfirm(false);
    setPendingSwitchTask(null);
  }, [pendingSwitchTask, onStop]);

  // 取消切换
  const handleCancelSwitch = useCallback(() => {
    setShowSwitchConfirm(false);
    setPendingSwitchTask(null);
  }, []);

  // 开始/暂停（合一）
  const handleToggleTimer = useCallback(async () => {
    if (status === 'running') {
      onPause();
    } else if (status === 'paused') {
      onResume();
    } else {
      // 开始新番茄钟
      // 如果没有手动选择任务，自动选择当前显示的任务
      const taskToStart = selectedTask || displayTask;
      if (taskToStart && taskToStart.status !== 'completed') {
        try {
          setSelectedTask(taskToStart);
          await api.task.startTask(taskToStart.id);
          await refetch();
        } catch (err) {
          console.error('Failed to start task:', err);
        }
      }
      onStart();
    }
  }, [status, selectedTask, displayTask, onStart, onPause, onResume, refetch]);

  // 提前完成任务
  const handleCompleteTask = useCallback(async () => {
    if (!selectedTask) {
      toast.error('请先选择一个任务');
      return;
    }
    if (selectedTask.status === 'completed') {
      toast('该任务已完成', { icon: 'ℹ️' });
      return;
    }

    try {
      await api.task.toggleStatus(selectedTask.id);
      await refetch();
      toast.success('任务已完成！');
      // 清除选中状态
      setSelectedTask(null);
      // 停止番茄钟
      onStop();
    } catch (err) {
      console.error('Failed to complete task:', err);
      toast.error('完成任务失败');
    }
  }, [selectedTask, onStop, refetch]);

  // 重新计时
  const handleResetTimer = useCallback(() => {
    onStop();
    toast.success('计时已重置');
  }, [onStop]);

  // 放弃任务（转为自由模式）
  const handleAbandonTask = useCallback(() => {
    setSelectedTask(null);
    onStop();
    toast.success('已切换到自由模式');
  }, [onStop]);

  return (
    <div className="p-10 max-w-6xl mx-auto">
      {/* 任务切换确认弹窗 */}
      {showSwitchConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">更换当前任务？</h3>
              <p className="text-sm text-stone mb-2 leading-relaxed">
                当前正在专注：<span className="font-medium text-charcoal">{selectedTask?.title}</span>
              </p>
              <p className="text-sm text-stone mb-6 leading-relaxed">
                切换后当前任务的计时数据将被清零，确定要更换为
                <span className="font-medium text-coral"> {pendingSwitchTask?.title}</span> 吗？
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCancelSwitch}
                  className="px-5 py-2.5 text-sm font-medium text-stone bg-warm hover:bg-warm/80 rounded-xl transition-colors"
                >
                  继续当前任务
                </button>
                <button
                  onClick={handleConfirmSwitch}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-coral hover:bg-coral-700 rounded-xl transition-colors"
                >
                  确认更换
                </button>
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
              onToggleTimer={handleToggleTimer}
              onCompleteTask={handleCompleteTask}
              onResetTimer={handleResetTimer}
              onAbandonTask={handleAbandonTask}
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
