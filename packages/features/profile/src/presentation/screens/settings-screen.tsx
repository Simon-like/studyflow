import { useState } from 'react';
import { 
  Clock, 
  Volume2, 
  Bell, 
  Moon, 
  Shield, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface SettingsScreenProps {
  onNavigateBack?: () => void;
}

export function SettingsScreen({ onNavigateBack }: SettingsScreenProps) {
  const [settings, setSettings] = useState({
    focusDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    soundEnabled: true,
    vibrationEnabled: true,
    dailyReminder: true,
    darkMode: false,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onNavigateBack}
          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-charcoal" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal">应用设置</h1>
          <p className="text-stone text-sm">个性化你的学习体验</p>
        </div>
      </div>

      {/* Pomodoro Settings */}
      <section className="card p-6">
        <h2 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-coral" />
          番茄钟设置
        </h2>
        <div className="space-y-4">
          <DurationSetting
            label="专注时长"
            value={settings.focusDuration}
            onChange={(v) => setSettings({ ...settings, focusDuration: v })}
            options={[15, 25, 45, 60]}
          />
          <DurationSetting
            label="短休息"
            value={settings.shortBreak}
            onChange={(v) => setSettings({ ...settings, shortBreak: v })}
            options={[3, 5, 10, 15]}
          />
          <DurationSetting
            label="长休息"
            value={settings.longBreak}
            onChange={(v) => setSettings({ ...settings, longBreak: v })}
            options={[15, 20, 25, 30]}
          />
        </div>
      </section>

      {/* Notification Settings */}
      <section className="card p-6">
        <h2 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-coral" />
          通知设置
        </h2>
        <div className="space-y-4">
          <ToggleSetting
            label="声音提示"
            description="专注完成时播放提示音"
            enabled={settings.soundEnabled}
            onChange={(v) => setSettings({ ...settings, soundEnabled: v })}
            icon={Volume2}
          />
          <ToggleSetting
            label="每日提醒"
            description="每天9:00提醒你开始学习"
            enabled={settings.dailyReminder}
            onChange={(v) => setSettings({ ...settings, dailyReminder: v })}
            icon={Bell}
          />
        </div>
      </section>

      {/* Appearance */}
      <section className="card p-6">
        <h2 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Moon className="w-5 h-5 text-coral" />
          外观
        </h2>
        <ToggleSetting
          label="深色模式"
          description="切换深色主题（开发中）"
          enabled={settings.darkMode}
          onChange={(v) => setSettings({ ...settings, darkMode: v })}
          icon={Moon}
        />
      </section>

      {/* Account */}
      <section className="card p-6">
        <h2 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-coral" />
          账号
        </h2>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-warm transition-colors">
            <span className="text-charcoal">修改密码</span>
            <ChevronRight className="w-5 h-5 text-mist" />
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-warm transition-colors">
            <span className="text-charcoal">数据备份</span>
            <ChevronRight className="w-5 h-5 text-mist" />
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-warm transition-colors text-red-500">
            <span>删除账号</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}

function DurationSetting({ 
  label, 
  value, 
  onChange, 
  options 
}: { 
  label: string; 
  value: number; 
  onChange: (v: number) => void;
  options: number[];
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-charcoal">{label}</span>
        <span className="text-sm font-medium text-coral">{value} 分钟</span>
      </div>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              value === opt
                ? 'bg-coral text-white'
                : 'bg-warm text-charcoal hover:bg-coral/10'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleSetting({ 
  label, 
  description, 
  enabled, 
  onChange,
  icon: Icon 
}: { 
  label: string; 
  description: string; 
  enabled: boolean; 
  onChange: (v: boolean) => void;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-coral" />
        </div>
        <div>
          <p className="text-charcoal font-medium">{label}</p>
          <p className="text-xs text-stone">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`w-12 h-6 rounded-full transition-colors relative ${
          enabled ? 'bg-coral' : 'bg-mist'
        }`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`} />
      </button>
    </div>
  );
}
