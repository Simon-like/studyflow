import { Clock, Target, TrendingUp, Calendar, Plus } from 'lucide-react';
import { PomodoroTimer } from '@studyflow/features-pomodoro';
import { StatCard } from '../components/StatCard';
import { TaskList } from '../components/TaskList';
import { WeeklyChart } from '../components/WeeklyChart';
import { useDashboard } from '../hooks/useDashboard';

export default function DashboardPage() {
  const { todayPomodoros, totalFocusTime, tasks, weeklyData, currentDate } = useDashboard();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal">仪表盘</h1>
          <p className="text-stone text-sm">{currentDate}</p>
        </div>
        <button className="btn-primary gap-2">
          <Plus className="w-4 h-4" />
          新建任务
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Clock} label="今日番茄" value={String(todayPomodoros)} trend="+12%" color="coral" />
        <StatCard icon={Target} label="专注时长" value={totalFocusTime} trend="+8%" color="sage" />
        <StatCard icon={TrendingUp} label="完成率" value="89%" trend="+5%" color="coral" />
        <StatCard icon={Calendar} label="连续天数" value="23" trend="+2" color="sage" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PomodoroTimer />
        </div>
        <div className="lg:col-span-1">
          <TaskList tasks={tasks} />
        </div>
        <div className="lg:col-span-1">
          <WeeklyChart data={weeklyData} />
        </div>
      </div>
    </div>
  );
}
