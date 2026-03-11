import { useState } from 'react';
import { TrendingUp, Clock, Target, Flame } from 'lucide-react';

type Period = 'week' | 'month' | 'year';

const WEEK_DATA = [
  { day: '周一', pomodoros: 6, hours: 2.5 },
  { day: '周二', pomodoros: 8, hours: 3.3 },
  { day: '周三', pomodoros: 4, hours: 1.7 },
  { day: '周四', pomodoros: 10, hours: 4.2 },
  { day: '周五', pomodoros: 7, hours: 2.9 },
  { day: '周六', pomodoros: 11, hours: 4.6 },
  { day: '周日', pomodoros: 5, hours: 2.1 },
];

const SUBJECT_DATA = [
  { name: '数学', hours: 32, percent: 40, color: 'bg-coral' },
  { name: '英语', hours: 18, percent: 22, color: 'bg-sage' },
  { name: '政治', hours: 14, percent: 17, color: 'bg-coral/60' },
  { name: '专业课', hours: 17, percent: 21, color: 'bg-sage/60' },
];

const MONTH_HEATMAP = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  value: Math.floor(Math.random() * 5),
}));

export default function StatsPage() {
  const [period, setPeriod] = useState<Period>('week');
  const maxPomodoros = Math.max(...WEEK_DATA.map((d) => d.pomodoros));

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal">学习统计</h1>
          <p className="text-stone text-sm mt-0.5">了解你的学习习惯，持续优化效率</p>
        </div>
        <div className="flex gap-2 bg-white rounded-xl p-1 border border-mist/20 shadow-soft">
          {([['week', '本周'], ['month', '本月'], ['year', '全年']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                period === key ? 'bg-coral text-white shadow-soft' : 'text-stone hover:text-charcoal'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Clock, label: '本周学习', value: '21.3h', change: '+15%', up: true },
          { icon: Target, label: '番茄完成', value: '51', change: '+8%', up: true },
          { icon: Flame, label: '连续打卡', value: '23天', change: '+3天', up: true },
          { icon: TrendingUp, label: '平均效率', value: '89%', change: '-2%', up: false },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl p-4 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 bg-coral/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-coral" />
                </div>
                <span className={`text-xs font-medium ${card.up ? 'text-sage' : 'text-red-400'}`}>
                  {card.up ? '↑' : '↓'} {card.change}
                </span>
              </div>
              <p className="font-display text-2xl font-bold text-charcoal">{card.value}</p>
              <p className="text-stone text-xs mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-soft">
          <h2 className="font-semibold text-charcoal mb-6">每日番茄钟</h2>
          <div className="flex items-end gap-3 h-40">
            {WEEK_DATA.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-stone text-xs">{d.pomodoros}</span>
                <div
                  className="w-full bg-coral rounded-t-xl transition-all hover:opacity-80 cursor-pointer relative group"
                  style={{ height: `${(d.pomodoros / maxPomodoros) * 120}px` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-charcoal text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {d.hours}h
                  </div>
                </div>
                <span className="text-stone text-xs">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h2 className="font-semibold text-charcoal mb-4">科目分布</h2>
          <div className="space-y-3">
            {SUBJECT_DATA.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-charcoal font-medium">{s.name}</span>
                  <span className="text-stone">{s.hours}h ({s.percent}%)</span>
                </div>
                <div className="w-full bg-mist/30 rounded-full h-2">
                  <div className={`${s.color} h-2 rounded-full transition-all`} style={{ width: `${s.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Heatmap */}
      <div className="mt-6 bg-white rounded-2xl p-6 shadow-soft">
        <h2 className="font-semibold text-charcoal mb-4">本月打卡热图</h2>
        <div className="grid grid-cols-7 gap-2">
          {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
            <div key={d} className="text-center text-stone text-xs pb-1">{d}</div>
          ))}
          {MONTH_HEATMAP.map(({ day, value }) => {
            const opacity = value === 0 ? '0.08' : value === 1 ? '0.25' : value === 2 ? '0.45' : value === 3 ? '0.65' : value === 4 ? '0.85' : '1';
            return (
              <div
                key={day}
                className="aspect-square rounded-lg flex items-center justify-center text-xs cursor-pointer group relative transition-all hover:scale-110"
                style={{ backgroundColor: `rgba(232, 168, 124, ${opacity})` }}
                title={`${day}日: ${value * 2}h`}
              >
                <span className={`font-medium ${value > 2 ? 'text-white' : 'text-charcoal'}`}>{day}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-4 justify-end">
          <span className="text-stone text-xs">少</span>
          {[0.1, 0.3, 0.5, 0.7, 1].map((o) => (
            <div key={o} className="w-4 h-4 rounded" style={{ backgroundColor: `rgba(232, 168, 124, ${o})` }} />
          ))}
          <span className="text-stone text-xs">多</span>
        </div>
      </div>
    </div>
  );
}
