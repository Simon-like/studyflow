import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, CheckCircle } from 'lucide-react';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import { formatDuration } from '@studyflow/shared';
import toast from 'react-hot-toast';

interface PomodoroTimerProps {
  onComplete?: () => void;
}

export function PomodoroTimer({ onComplete }: PomodoroTimerProps) {
  const {
    status,
    timeRemaining,
    currentTask,
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    todayPomodoros,
    start,
    pause,
    resume,
    stop,
    complete,
    tick,
    reset,
  } = usePomodoroStore();

  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  // Timer tick effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'running') {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, tick]);

  // Handle timer completion
  useEffect(() => {
    if (status === 'running' && timeRemaining <= 0) {
      handleComplete();
    }
  }, [timeRemaining, status]);

  const handleStart = () => {
    start();
    toast.success('专注开始！加油！');
  };

  const handlePause = () => {
    pause();
  };

  const handleResume = () => {
    resume();
  };

  const handleStop = () => {
    stop();
    toast('专注已取消', { icon: '⏹️' });
  };

  const handleComplete = () => {
    complete();
    setCompletedPomodoros(prev => prev + 1);
    
    if (mode === 'focus') {
      toast.success('恭喜完成一个番茄！🎉');
      // Auto switch to break
      if ((completedPomodoros + 1) % 4 === 0) {
        setMode('longBreak');
        toast('休息15分钟，放松一下~', { icon: '☕' });
      } else {
        setMode('shortBreak');
        toast('休息5分钟，喝口水吧~', { icon: '🥤' });
      }
    } else {
      toast('休息结束，准备开始新的专注！', { icon: '💪' });
      setMode('focus');
    }
    
    onComplete?.();
  };

  const handleReset = () => {
    reset();
    setMode('focus');
  };

  const getDuration = () => {
    switch (mode) {
      case 'focus':
        return focusDuration;
      case 'shortBreak':
        return shortBreakDuration;
      case 'longBreak':
        return longBreakDuration;
      default:
        return focusDuration;
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'focus':
        return '专注中';
      case 'shortBreak':
        return '短休息';
      case 'longBreak':
        return '长休息';
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'focus':
        return 'text-coral';
      case 'shortBreak':
      case 'longBreak':
        return 'text-sage';
    }
  };

  const progress = ((getDuration() - timeRemaining) / getDuration()) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="card p-8">
      {/* Mode Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {[
          { key: 'focus', label: '专注', icon: Play },
          { key: 'shortBreak', label: '短休息', icon: Coffee },
          { key: 'longBreak', label: '长休息', icon: Coffee },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              if (status === 'idle') {
                setMode(key as typeof mode);
                reset();
              }
            }}
            disabled={status !== 'idle'}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              mode === key
                ? 'bg-coral text-white'
                : 'bg-warm text-charcoal hover:bg-coral/10'
            } ${status !== 'idle' && mode !== key ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative w-64 h-64 mx-auto mb-8">
        <svg className="w-full h-full progress-ring" viewBox="0 0 200 200">
          {/* Background Circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#F5C9A8"
            strokeWidth="8"
          />
          {/* Progress Circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={mode === 'focus' ? '#E8A87C' : '#9DB5A0'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        
        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-display text-5xl font-bold text-charcoal ${getModeColor()}`}>
            {formatDuration(timeRemaining)}
          </span>
          <span className="text-stone text-sm mt-2">{getModeLabel()}</span>
          {todayPomodoros > 0 && (
            <span className="text-coral text-xs mt-1">
              今日已完成 {todayPomodoros} 个番茄
            </span>
          )}
        </div>
      </div>

      {/* Current Task */}
      {currentTask && (
        <div className="bg-warm rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-coral/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-coral" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-charcoal font-medium truncate">{currentTask.title}</p>
              <p className="text-stone text-xs">
                预计 {currentTask.estimatedPomodoros} 个番茄 · 已完成 {currentTask.completedPomodoros} 个
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {status === 'idle' && (
          <button
            onClick={handleStart}
            className="btn-primary gap-2 px-8"
          >
            <Play className="w-5 h-5" />
            开始{mode === 'focus' ? '专注' : '休息'}
          </button>
        )}

        {status === 'running' && (
          <>
            <button
              onClick={handlePause}
              className="btn-secondary gap-2 px-8"
            >
              <Pause className="w-5 h-5" />
              暂停
            </button>
            <button
              onClick={handleStop}
              className="btn-ghost text-red-500 hover:bg-red-50"
            >
              放弃
            </button>
          </>
        )}

        {status === 'paused' && (
          <>
            <button
              onClick={handleResume}
              className="btn-primary gap-2 px-8"
            >
              <Play className="w-5 h-5" />
              继续
            </button>
            <button
              onClick={handleStop}
              className="btn-ghost text-red-500 hover:bg-red-50"
            >
              放弃
            </button>
          </>
        )}

        {status === 'completed' && (
          <button
            onClick={handleReset}
            className="btn-secondary gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            重置
          </button>
        )}
      </div>
    </div>
  );
}
