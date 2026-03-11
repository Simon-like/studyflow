import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { usePomodoroStore } from '@/stores/pomodoroStore';

const TOTAL = 25 * 60;
const CIRCUMFERENCE = 2 * Math.PI * 90;

function formatTime(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const todayTasks = [
  { id: 1, title: '英语单词背诵', sub: '100个单词', done: true, active: false },
  { id: 2, title: '考研数学复习', sub: '进行中 · 预计4个番茄', done: false, active: true },
  { id: 3, title: '专业课笔记整理', sub: '预计2个番茄', done: false, active: false },
  { id: 4, title: '政治错题巩固', sub: '预计1个番茄', done: false, active: false },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { status, timeRemaining, todayPomodoros, start, pause, resume, stop, tick } = usePomodoroStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => tick(), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [status, tick]);

  const progress = (timeRemaining / TOTAL) * CIRCUMFERENCE;
  const displayName = user?.nickname || user?.username || '同学';

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-stone text-sm">今天也要加油哦</p>
          <h1 className="font-display text-3xl font-bold text-charcoal">Hi, {displayName}</h1>
        </div>
        <div className="w-12 h-12 bg-coral rounded-full flex items-center justify-center text-white font-bold text-lg shadow-coral">
          {displayName[0]?.toUpperCase()}
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: '今日专注', value: `${Math.floor(todayPomodoros * 25 / 60)}h ${(todayPomodoros * 25) % 60}m`, sub: `${todayPomodoros} 个番茄` },
          { label: '完成任务', value: '3 / 6', sub: '今日任务' },
          { label: '连续天数', value: '23', sub: '天不间断' },
          { label: '本周效率', value: '89%', sub: '完成率' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-soft">
            <p className="text-stone text-xs mb-1">{s.label}</p>
            <p className="font-display text-2xl font-bold text-charcoal">{s.value}</p>
            <p className="text-stone text-xs mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pomodoro Timer */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <span className="font-semibold text-charcoal">今日专注</span>
            <Link to="/stats" className="text-coral text-sm font-medium hover:text-coral-700">查看统计</Link>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative w-44 h-44 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#F5C9A8" strokeWidth="8" />
                <circle
                  cx="100" cy="100" r="90" fill="none"
                  stroke="#E8A87C" strokeWidth="8"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE - progress}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-4xl font-bold text-charcoal">{formatTime(timeRemaining)}</span>
                <span className="text-stone text-xs mt-1">剩余时间</span>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-warm rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-coral/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-charcoal font-medium text-sm">考研数学复习</p>
                    <p className="text-stone text-xs">第三章 · 线性代数</p>
                  </div>
                  <span className="text-xs text-stone bg-white px-2 py-1 rounded-full flex-shrink-0">2/4 番茄</span>
                </div>
              </div>

              <div className="flex gap-3">
                {status === 'idle' && (
                  <button onClick={() => start()} className="flex-1 bg-coral text-white py-3 rounded-xl font-medium hover:bg-coral-600 transition-all active:scale-95">
                    开始专注
                  </button>
                )}
                {status === 'running' && (
                  <button onClick={pause} className="flex-1 bg-coral text-white py-3 rounded-xl font-medium hover:bg-coral-600 transition-all active:scale-95">
                    暂停
                  </button>
                )}
                {status === 'paused' && (
                  <button onClick={resume} className="flex-1 bg-coral text-white py-3 rounded-xl font-medium hover:bg-coral-600 transition-all active:scale-95">
                    继续
                  </button>
                )}
                <button onClick={stop} className="px-6 bg-warm text-charcoal py-3 rounded-xl hover:bg-mist/30 transition-all active:scale-95">
                  结束
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="bg-white rounded-3xl p-6 shadow-soft">
          <h2 className="font-semibold text-charcoal mb-4">本周数据</h2>
          <div className="space-y-4">
            {[
              { label: '番茄总数', value: '48' },
              { label: '专注时长', value: '20h' },
              { label: '完成率', value: '89%', accent: true },
              { label: '连续天数', value: '23天' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-mist/20 last:border-0">
                <span className="text-stone text-sm">{item.label}</span>
                <span className={`font-bold ${item.accent ? 'text-coral' : 'text-charcoal'}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="mt-6 bg-white rounded-3xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-charcoal">今日任务</h2>
          <Link to="/tasks" className="text-coral text-sm font-medium hover:text-coral-700">
            + 添加任务
          </Link>
        </div>
        <div className="space-y-3">
          {todayTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer ${
                task.active
                  ? 'bg-coral/5 border border-coral'
                  : 'bg-warm/50 hover:bg-warm'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                task.done ? 'border-sage bg-sage/20' : task.active ? 'border-coral' : 'border-mist'
              }`}>
                {task.done && (
                  <svg className="w-3.5 h-3.5 text-sage" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.done ? 'text-stone line-through' : 'text-charcoal'}`}>
                  {task.title}
                </p>
                <p className="text-xs text-stone mt-0.5">{task.sub}</p>
              </div>
              {task.active && <span className="text-xs text-coral font-medium flex-shrink-0">进行中</span>}
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-3.5 border-2 border-dashed border-mist rounded-2xl text-stone text-sm hover:border-coral hover:text-coral transition-colors">
          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          添加新任务
        </button>
      </div>
    </div>
  );
}
