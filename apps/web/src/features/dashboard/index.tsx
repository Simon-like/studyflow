import { Link } from 'react-router-dom';
import { PomodoroTimer } from '@/components/business';
import { Card, CardHeader } from '@/components/ui';
import { useDashboardTimer, useDashboardData } from './hooks';
import { WelcomeHeader } from './components/WelcomeHeader';
import { StatsStrip } from './components/StatsStrip';
import { WeeklySummary } from './components/WeeklySummary';
import { TaskList } from './components/TaskList';
import { WEEKLY_STATS } from './constants';

export default function DashboardPage() {
  const { displayName, todayTasks, weeklyStats } = useDashboardData();
  const {
    status,
    timeRemaining,
    onStart,
    onPause,
    onResume,
    onStop,
  } = useDashboardTimer();

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <WelcomeHeader displayName={displayName} />
      <StatsStrip stats={weeklyStats} />

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
              taskTitle="考研数学复习"
              taskSubtitle="第三章 · 线性代数"
              taskProgress="2/4 番茄"
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
      <TaskList tasks={todayTasks} />
    </div>
  );
}
