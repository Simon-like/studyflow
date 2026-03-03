import { useState } from 'react';
import { Clock, Target, TrendingUp, Flame, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

interface StatsScreenProps {
  onNavigateBack?: () => void;
}

const mockStats = {
  totalPomodoros: 128,
  totalHours: 52,
  completionRate: 89,
  streakDays: 23,
};

const achievements = [
  { id: '1', name: '初出茅庐', icon: '🌱', unlocked: true },
  { id: '2', name: '坚持不懈', icon: '🔥', unlocked: true },
  { id: '3', name: '番茄达人', icon: '🍅', unlocked: true },
  { id: '4', name: '百茄成钢', icon: '💯', unlocked: true },
  { id: '5', name: '学习狂人', icon: '📚', unlocked: false },
];

const weeklyData = [
  { day: '一', minutes: 120 },
  { day: '二', minutes: 180 },
  { day: '三', minutes: 240 },
  { day: '四', minutes: 135 },
  { day: '五', minutes: 270 },
  { day: '六', minutes: 300 },
  { day: '日', minutes: 60 },
];

export function StatsScreen({ onNavigateBack }: StatsScreenProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'achievements'>('overview');

  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal">学习统计</h1>
          <p className="text-stone text-sm">坚持记录，见证成长</p>
        </div>
        {onNavigateBack && (
          <button onClick={onNavigateBack} className="btn-secondary">
            返回
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Target} label="番茄总数" value={String(mockStats.totalPomodoros)} color="coral" />
        <StatCard icon={Clock} label="专注时长" value={`${mockStats.totalHours}h`} color="sage" />
        <StatCard icon={TrendingUp} label="完成率" value={`${mockStats.completionRate}%`} color="coral" />
        <StatCard icon={Flame} label="连续打卡" value={`${mockStats.streakDays}天`} color="sage" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-mist/30">
        {[
          { key: 'overview', label: '总览' },
          { key: 'trends', label: '趋势' },
          { key: 'achievements', label: '成就' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab.key
                ? 'text-coral border-coral'
                : 'text-stone border-transparent hover:text-charcoal'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Chart */}
          <div className="card p-6">
            <h3 className="font-semibold text-charcoal mb-6">本周专注</h3>
            <div className="flex items-end justify-between h-32 gap-2">
              {weeklyData.map(({ day, minutes }) => (
                <div key={day} className="flex flex-col items-center flex-1">
                  <div className="w-full relative">
                    <div 
                      className="w-full bg-coral/30 rounded-t-lg transition-all hover:bg-coral/50"
                      style={{ height: `${(minutes / maxMinutes) * 100}px` }}
                    />
                  </div>
                  <span className="text-xs text-stone mt-2">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Preview */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-charcoal">成就勋章</h3>
              <Trophy className="w-5 h-5 text-coral" />
            </div>
            <div className="flex gap-3">
              {achievements.filter(a => a.unlocked).slice(0, 4).map((achievement) => (
                <div key={achievement.id} className="flex flex-col items-center">
                  <div className="w-14 h-14 gradient-coral rounded-2xl flex items-center justify-center text-2xl mb-2">
                    {achievement.icon}
                  </div>
                  <span className="text-xs text-stone">{achievement.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-2xl text-center transition-all ${
                achievement.unlocked
                  ? 'bg-white shadow-lg'
                  : 'bg-warm opacity-50'
              }`}
            >
              <div className="w-16 h-16 gradient-coral rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">
                {achievement.icon}
              </div>
              <h4 className="font-medium text-charcoal text-sm">{achievement.name}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value,
  color 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string;
  color: 'coral' | 'sage';
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${color === 'coral' ? 'bg-coral/10' : 'bg-sage/10'} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color === 'coral' ? 'text-coral' : 'text-sage'}`} />
        </div>
        <div>
          <p className="text-stone text-xs">{label}</p>
          <p className="font-display text-xl font-bold text-charcoal">{value}</p>
        </div>
      </div>
    </div>
  );
}
