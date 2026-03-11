'use client';

import React, { useState } from 'react';
import { Card, Button, Timer } from '@studyflow/ui';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward,
  Settings,
  Volume2,
  Bell
} from 'lucide-react';

interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export default function PomodoroPage() {
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: true,
    autoStartPomodoros: false,
    soundEnabled: true,
    notificationsEnabled: true,
  });

  const [currentTask, setCurrentTask] = useState<string>('React Native 学习');
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const handleTimerComplete = () => {
    setSessionCount(prev => prev + 1);
    // 播放提示音
    if (settings.soundEnabled) {
      // 这里可以添加音频播放逻辑
    }
  };

  const resetSession = () => {
    setSessionCount(0);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal">
            番茄钟
          </h1>
          <p className="text-stone mt-1">
            使用番茄工作法提高学习效率
          </p>
        </div>
        <Button 
          variant="secondary" 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          <Settings className="w-4 h-4 mr-2" />
          设置
        </Button>
      </div>

      {/* Main Timer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer */}
        <div className="lg:col-span-2">
          <Card className="text-center">
            <div className="mb-6">
              <h2 className="text-2xl font-display font-bold text-charcoal mb-2">
                {currentTask}
              </h2>
              <p className="text-stone">
                第 {sessionCount + 1} 个番茄钟
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <Timer 
                initialMinutes={settings.workDuration}
                size="lg"
                onComplete={handleTimerComplete}
              />
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="secondary">
                <SkipForward className="w-4 h-4 mr-2" />
                跳过
              </Button>
              <Button variant="primary">
                <RotateCcw className="w-4 h-4 mr-2" />
                重置
              </Button>
            </div>
          </Card>
        </div>

        {/* Session Info */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-lg font-display font-bold text-charcoal mb-4">
              会话信息
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone">今日番茄钟</span>
                  <span className="font-medium text-charcoal">{sessionCount}</span>
                </div>
                <div className="w-full bg-mist rounded-full h-2">
                  <div 
                    className="bg-coral h-2 rounded-full" 
                    style={{ width: `${Math.min((sessionCount / 8) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone">本周目标</span>
                  <span className="font-medium text-charcoal">45/60</span>
                </div>
                <div className="w-full bg-mist rounded-full h-2">
                  <div className="bg-sage h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="pt-4 border-t border-mist">
                <h4 className="font-medium text-charcoal mb-2">当前模式</h4>
                <div className="bg-coral/10 text-coral px-3 py-1 rounded-full text-sm inline-block">
                  工作模式
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-4">
            <h3 className="text-lg font-display font-bold text-charcoal mb-4">
              快捷操作
            </h3>
            
            <div className="space-y-2">
              <Button variant="secondary" className="w-full justify-start">
                <Volume2 className="w-4 h-4 mr-2" />
                声音 {settings.soundEnabled ? '开启' : '关闭'}
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Bell className="w-4 h-4 mr-2" />
                通知 {settings.notificationsEnabled ? '开启' : '关闭'}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Task Queue */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display font-bold text-charcoal">
            任务队列
          </h3>
          <Button variant="ghost" size="sm">管理</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-warm rounded-xl">
            <h4 className="font-medium text-charcoal mb-2">当前任务</h4>
            <p className="text-sm text-stone">{currentTask}</p>
          </div>

          <div className="p-4 bg-warm rounded-xl">
            <h4 className="font-medium text-charcoal mb-2">下一个任务</h4>
            <p className="text-sm text-stone">TypeScript 高级类型学习</p>
          </div>

          <div className="p-4 bg-warm rounded-xl">
            <h4 className="font-medium text-charcoal mb-2">待办任务</h4>
            <p className="text-sm text-stone">5 个任务等待开始</p>
          </div>
        </div>
      </Card>

      {/* Settings Panel */}
      {isSettingsOpen && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-display font-bold text-charcoal">
              番茄钟设置
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsSettingsOpen(false)}
            >
              关闭
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-charcoal mb-3">时间设置</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-stone mb-1">
                    工作时长 (分钟)
                  </label>
                  <Input
                    type="number"
                    value={settings.workDuration}
                    onChange={(e) => setSettings({...settings, workDuration: parseInt(e.target.value) || 25})}
                    min="1"
                    max="60"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-stone mb-1">
                    短休息时长 (分钟)
                  </label>
                  <Input
                    type="number"
                    value={settings.shortBreakDuration}
                    onChange={(e) => setSettings({...settings, shortBreakDuration: parseInt(e.target.value) || 5})}
                    min="1"
                    max="30"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-stone mb-1">
                    长休息时长 (分钟)
                  </label>
                  <Input
                    type="number"
                    value={settings.longBreakDuration}
                    onChange={(e) => setSettings({...settings, longBreakDuration: parseInt(e.target.value) || 15})}
                    min="1"
                    max="60"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-charcoal mb-3">行为设置</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.autoStartBreaks}
                    onChange={(e) => setSettings({...settings, autoStartBreaks: e.target.checked})}
                    className="rounded border-mist text-coral focus:ring-coral"
                  />
                  <span className="text-sm text-charcoal">自动开始休息</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.autoStartPomodoros}
                    onChange={(e) => setSettings({...settings, autoStartPomodoros: e.target.checked})}
                    className="rounded border-mist text-coral focus:ring-coral"
                  />
                  <span className="text-sm text-charcoal">自动开始番茄钟</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => setSettings({...settings, soundEnabled: e.target.checked})}
                    className="rounded border-mist text-coral focus:ring-coral"
                  />
                  <span className="text-sm text-charcoal">开启提示音</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.notificationsEnabled}
                    onChange={(e) => setSettings({...settings, notificationsEnabled: e.target.checked})}
                    className="rounded border-mist text-coral focus:ring-coral"
                  />
                  <span className="text-sm text-charcoal">开启通知</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-mist">
            <Button variant="secondary" onClick={() => setIsSettingsOpen(false)}>
              取消
            </Button>
            <Button variant="primary">
              保存设置
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}