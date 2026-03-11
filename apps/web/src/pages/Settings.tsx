import { useState } from 'react';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import { useAuthStore } from '@/stores/authStore';
import { Bell, Volume2, Shield, Palette, Clock, User, ChevronRight } from 'lucide-react';

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${value ? 'bg-coral' : 'bg-mist'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-soft transition-all duration-300 ${value ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-mist/20 last:border-0">
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-charcoal font-medium text-sm">{label}</p>
        {desc && <p className="text-stone text-xs mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { focusDuration, shortBreakDuration, longBreakDuration, updateSettings } = usePomodoroStore();
  const { user } = useAuthStore();

  const [notifications, setNotifications] = useState({ breakReminder: true, dailyGoal: true, achievement: true, community: false });
  const [sound, setSound] = useState({ enabled: true, volume: 70, breakSound: true });
  const [prefs, setPrefs] = useState({ autoStart: false, strictMode: false });

  const sections = [
    {
      icon: Clock,
      title: '番茄钟设置',
      color: 'coral',
      content: (
        <>
          <SettingRow label="专注时长" desc="每个番茄钟的工作时间">
            <div className="flex items-center gap-2">
              <button onClick={() => updateSettings({ focusDuration: Math.max(5 * 60, focusDuration - 5 * 60) })} className="w-7 h-7 bg-warm rounded-lg flex items-center justify-center hover:bg-mist/30 transition-all font-bold text-stone">-</button>
              <span className="text-charcoal font-semibold w-12 text-center">{focusDuration / 60} 分</span>
              <button onClick={() => updateSettings({ focusDuration: Math.min(60 * 60, focusDuration + 5 * 60) })} className="w-7 h-7 bg-warm rounded-lg flex items-center justify-center hover:bg-mist/30 transition-all font-bold text-stone">+</button>
            </div>
          </SettingRow>
          <SettingRow label="短休息时长" desc="每次番茄后的短暂休息">
            <div className="flex items-center gap-2">
              <button onClick={() => updateSettings({ shortBreakDuration: Math.max(60, shortBreakDuration - 60) })} className="w-7 h-7 bg-warm rounded-lg flex items-center justify-center hover:bg-mist/30 transition-all font-bold text-stone">-</button>
              <span className="text-charcoal font-semibold w-12 text-center">{shortBreakDuration / 60} 分</span>
              <button onClick={() => updateSettings({ shortBreakDuration: Math.min(30 * 60, shortBreakDuration + 60) })} className="w-7 h-7 bg-warm rounded-lg flex items-center justify-center hover:bg-mist/30 transition-all font-bold text-stone">+</button>
            </div>
          </SettingRow>
          <SettingRow label="长休息时长" desc="每4个番茄后的长休息">
            <div className="flex items-center gap-2">
              <button onClick={() => updateSettings({ longBreakDuration: Math.max(5 * 60, longBreakDuration - 5 * 60) })} className="w-7 h-7 bg-warm rounded-lg flex items-center justify-center hover:bg-mist/30 transition-all font-bold text-stone">-</button>
              <span className="text-charcoal font-semibold w-12 text-center">{longBreakDuration / 60} 分</span>
              <button onClick={() => updateSettings({ longBreakDuration: Math.min(60 * 60, longBreakDuration + 5 * 60) })} className="w-7 h-7 bg-warm rounded-lg flex items-center justify-center hover:bg-mist/30 transition-all font-bold text-stone">+</button>
            </div>
          </SettingRow>
          <SettingRow label="自动开始休息" desc="番茄结束后自动进入休息模式">
            <Toggle value={prefs.autoStart} onChange={(v) => setPrefs({ ...prefs, autoStart: v })} />
          </SettingRow>
          <SettingRow label="严格专注模式" desc="专注期间禁止提前结束">
            <Toggle value={prefs.strictMode} onChange={(v) => setPrefs({ ...prefs, strictMode: v })} />
          </SettingRow>
        </>
      ),
    },
    {
      icon: Bell,
      title: '通知设置',
      color: 'sage',
      content: (
        <>
          <SettingRow label="休息提醒" desc="番茄结束时推送通知">
            <Toggle value={notifications.breakReminder} onChange={(v) => setNotifications({ ...notifications, breakReminder: v })} />
          </SettingRow>
          <SettingRow label="每日目标提醒" desc="每天定时提醒你完成学习目标">
            <Toggle value={notifications.dailyGoal} onChange={(v) => setNotifications({ ...notifications, dailyGoal: v })} />
          </SettingRow>
          <SettingRow label="成就解锁通知" desc="解锁新成就时推送通知">
            <Toggle value={notifications.achievement} onChange={(v) => setNotifications({ ...notifications, achievement: v })} />
          </SettingRow>
          <SettingRow label="社区互动通知" desc="有人评论或点赞时提醒">
            <Toggle value={notifications.community} onChange={(v) => setNotifications({ ...notifications, community: v })} />
          </SettingRow>
        </>
      ),
    },
    {
      icon: Volume2,
      title: '声音设置',
      color: 'coral',
      content: (
        <>
          <SettingRow label="提示音" desc="番茄结束时播放提示音">
            <Toggle value={sound.enabled} onChange={(v) => setSound({ ...sound, enabled: v })} />
          </SettingRow>
          <SettingRow label="音量" desc="调节提示音的音量大小">
            <div className="flex items-center gap-3 w-40">
              <input
                type="range" min="0" max="100" value={sound.volume}
                onChange={(e) => setSound({ ...sound, volume: parseInt(e.target.value) })}
                className="flex-1 accent-coral"
              />
              <span className="text-charcoal text-sm w-8 text-right">{sound.volume}%</span>
            </div>
          </SettingRow>
          <SettingRow label="休息提示音" desc="休息开始时播放轻柔提示">
            <Toggle value={sound.breakSound} onChange={(v) => setSound({ ...sound, breakSound: v })} />
          </SettingRow>
        </>
      ),
    },
    {
      icon: User,
      title: '账号设置',
      color: 'sage',
      content: (
        <>
          <SettingRow label="用户名" desc={user?.username || '—'}>
            <button className="flex items-center gap-1 text-coral text-sm font-medium hover:text-coral-700 transition-colors">
              编辑 <ChevronRight className="w-4 h-4" />
            </button>
          </SettingRow>
          <SettingRow label="邮箱" desc={user?.email || '未绑定'}>
            <button className="flex items-center gap-1 text-coral text-sm font-medium hover:text-coral-700 transition-colors">
              {user?.email ? '修改' : '绑定'} <ChevronRight className="w-4 h-4" />
            </button>
          </SettingRow>
          <SettingRow label="修改密码" desc="定期更换密码保障账号安全">
            <button className="flex items-center gap-1 text-stone text-sm hover:text-charcoal transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </SettingRow>
        </>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-charcoal">设置</h1>
        <p className="text-stone text-sm mt-0.5">个性化你的学习体验</p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-mist/20">
                <div className={`w-8 h-8 bg-${section.color}/10 rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 text-${section.color}`} />
                </div>
                <h2 className="font-semibold text-charcoal">{section.title}</h2>
              </div>
              <div className="px-6">{section.content}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-warm rounded-2xl text-center">
        <p className="text-stone text-sm">StudyFlow v1.0.0 · 使用 React + Vite 构建</p>
        <p className="text-mist text-xs mt-1">© 2026 StudyFlow. 应东林</p>
      </div>
    </div>
  );
}
