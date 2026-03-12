import { Link } from 'react-router-dom';
import { PomodoroTimer } from '@/components/business';
import { Card, CardHeader } from '@/components/ui';
import { useDashboardTimer, useDashboardData } from './hooks';
import { WelcomeHeader } from './components/WelcomeHeader';
import { StatsStrip } from './components/StatsStrip';
import { WeeklySummary } from './components/WeeklySummary';
import { SortableTaskList } from './components/SortableTaskList';
import { WEEKLY_STATS } from './constants';

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
  
  const {
    status,
    timeRemaining,
    onStart,
    onPause,
    onResume,
    onStop,
  } = useDashboardTimer();

  // 获取当前活跃任务用于番茄钟显示（排序后的第一个未完成任务）
  const activeTask = todayTasks.find(t => t.status === 'in_progress') || 
                     todayTasks.find(t => t.status !== 'completed') || 
                     todayTasks[0];
  
  const taskTitle = activeTask?.title || '专注学习';
  const taskSubtitle = activeTask?.category ? `${activeTask.category}` : '选择任务开始专注';
  const taskProgress = activeTask 
    ? `${activeTask.completedPomodoros}/${activeTask.estimatedPomodoros} 番茄`
    : '0/0 番茄';

  return (
    <div className="p-10 max-w-6xl mx-auto">
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
              onStart={onStart}
              onPause={onPause}
              onResume={onResume}
              onStop={onStop}
            />
          </Card>
        </div>

        {/* Weekly Summary */}
        <WeeklySummary stats={WEEKLY_STATS} />
      </div>

      {/* Today's Tasks */}
      <SortableTaskList 
        tasks={todayTasks} 
        isLoading={isLoading}
        error={error}
        onToggleTask={toggleTask}
        onReorder={reorderTasks}
        onRefresh={refetch}
        isPomodoroRunning={status === 'running'}
        onResetPomodoro={onStop}
      />
    </div>
  );
}
