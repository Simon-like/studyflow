import { useAuthStore } from '@/stores/authStore';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import { Edit2, Award, Flame, Target, Clock } from 'lucide-react';

const ACHIEVEMENTS = [
  { icon: '⚡', title: '专注达人', desc: '连续专注30分钟', color: 'coral', unlocked: true },
  { icon: '🎯', title: '任务完成者', desc: '完成10个任务', color: 'sage', unlocked: true },
  { icon: '🔥', title: '连续打卡', desc: '连续7天打卡', color: 'coral', unlocked: true },
  { icon: '📚', title: '知识探索者', desc: '累计学习100小时', color: 'sage', unlocked: false },
  { icon: '🏆', title: '番茄大师', desc: '累计完成100个番茄', color: 'coral', unlocked: false },
  { icon: '🌟', title: '社区之星', desc: '获得100个点赞', color: 'sage', unlocked: false },
];

const WEEKLY_DATA = [
  { day: '周一', hours: 3.5 },
  { day: '周二', hours: 4.0 },
  { day: '周三', hours: 2.5 },
  { day: '周四', hours: 5.0 },
  { day: '周五', hours: 3.0 },
  { day: '周六', hours: 4.5 },
  { day: '周日', hours: 2.0 },
];
const MAX_HOURS = Math.max(...WEEKLY_DATA.map((d) => d.hours));

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { todayPomodoros, totalFocusTime } = usePomodoroStore();

  const displayName = user?.nickname || user?.username || '应东林';
  const avatar = displayName[0]?.toUpperCase();
  const totalHours = Math.floor(totalFocusTime / 3600);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-coral/20 via-warm to-cream rounded-3xl p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 bg-coral rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-coral">
              {avatar}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full shadow-medium flex items-center justify-center hover:bg-warm transition-all">
              <Edit2 className="w-3.5 h-3.5 text-stone" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl font-bold text-charcoal">{displayName}</h1>
            <p className="text-stone text-sm mt-0.5">考研冲刺中 · 坚持 23 天</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="bg-coral/20 text-coral text-xs px-3 py-1 rounded-full">数学达人</span>
              <span className="bg-sage/20 text-sage text-xs px-3 py-1 rounded-full">早起鸟</span>
              <span className="bg-coral/20 text-coral text-xs px-3 py-1 rounded-full">专注力强</span>
            </div>
          </div>
          <button className="flex-shrink-0 px-4 py-2 bg-white text-charcoal rounded-xl text-sm font-medium border border-mist hover:bg-warm transition-all">
            编辑资料
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Clock, label: '累计学习', value: `${totalHours}h`, color: 'text-coral', bg: 'bg-coral/10' },
          { icon: Target, label: '完成番茄', value: String(todayPomodoros || 48), color: 'text-sage', bg: 'bg-sage/10' },
          { icon: Flame, label: '连续打卡', value: '23天', color: 'text-coral', bg: 'bg-coral/10' },
          { icon: Award, label: '获得成就', value: '3个', color: 'text-sage', bg: 'bg-sage/10' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-soft text-center">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="font-display text-xl font-bold text-charcoal">{stat.value}</p>
              <p className="text-stone text-xs mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <h2 className="font-semibold text-charcoal mb-4">本周学习时长</h2>
          <div className="flex items-end gap-2 h-32">
            {WEEKLY_DATA.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-coral/20 rounded-t-lg relative overflow-hidden"
                  style={{ height: `${(d.hours / MAX_HOURS) * 100}%` }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-coral rounded-t-lg transition-all"
                    style={{ height: '100%' }}
                  />
                </div>
                <span className="text-stone text-xs">{d.day}</span>
              </div>
            ))}
          </div>
          <p className="text-stone text-xs mt-3 text-center">本周共学习 <span className="text-coral font-semibold">24.5 小时</span></p>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-charcoal">成就徽章</h2>
            <span className="text-stone text-xs">3/6 已解锁</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((ach) => (
              <div
                key={ach.title}
                className={`flex flex-col items-center p-3 rounded-xl text-center transition-all ${
                  ach.unlocked ? 'bg-warm hover:shadow-soft cursor-pointer' : 'opacity-40 grayscale'
                }`}
              >
                <div className={`w-12 h-12 bg-${ach.color}/20 rounded-xl flex items-center justify-center mb-2 text-2xl`}>
                  {ach.icon}
                </div>
                <p className="text-charcoal text-xs font-medium leading-tight">{ach.title}</p>
                <p className="text-stone text-xs mt-0.5 leading-tight">{ach.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Study Goal */}
      <div className="mt-6 bg-white rounded-2xl p-6 shadow-soft">
        <h2 className="font-semibold text-charcoal mb-4">学习目标</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: '考研数学', progress: 68, total: '300h', done: '204h' },
            { label: '英语备考', progress: 45, total: '200h', done: '90h' },
            { label: '专业课', progress: 82, total: '250h', done: '205h' },
          ].map((goal) => (
            <div key={goal.label} className="bg-warm rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <p className="text-charcoal font-medium text-sm">{goal.label}</p>
                <span className="text-coral text-sm font-bold">{goal.progress}%</span>
              </div>
              <div className="w-full bg-mist/40 rounded-full h-2 mb-2">
                <div
                  className="bg-coral h-2 rounded-full transition-all"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <p className="text-stone text-xs">{goal.done} / {goal.total}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
