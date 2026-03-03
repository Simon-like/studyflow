import { useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, CheckCircle, Square } from 'lucide-react';
import { usePomodoroStore } from '../../application/hooks/pomodoro-store';
import { PomodoroDomain } from '../../domain/entities/pomodoro';
import type { Task, PomodoroMode } from '../../domain/entities/pomodoro';

interface PomodoroTimerProps {
  task?: Task;
  onComplete?: () => void;
}

export function PomodoroTimer({ task, onComplete }: PomodoroTimerProps) {
  const {
    status,
    timeRemaining,
    currentMode,
    todayPomodoros,
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    start,
    pause,
    resume,
    stop,
    complete,
    tick,
    setMode,
    reset,
    setTask,
  } = usePomodoroStore();

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'running') {
      interval = setInterval(tick, 1000);
    }
    return () => clearInterval(interval);
  }, [status, tick]);

  // Completion effect
  useEffect(() => {
    if (status === 'running' && timeRemaining <= 0) {
      complete();
      onComplete?.();
    }
  }, [timeRemaining, status, complete, onComplete]);

  // Set task when provided
  useEffect(() => {
    if (task) setTask(task);
  }, [task, setTask]);

  const handleStart = () => start(task);
  const handleModeChange = (mode: PomodoroMode) => {
    if (status === 'idle') {
      setMode(mode);
      reset();
    }
  };

  const getDuration = () => {
    switch (currentMode) {
      case 'focus': return focusDuration;
      case 'shortBreak': return shortBreakDuration;
      case 'longBreak': return longBreakDuration;
    }
  };

  const progress = ((getDuration() - timeRemaining) / getDuration()) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const modeConfig = {
    focus: { label: '专注', color: '#E8A87C', bgColor: 'bg-coral' },
    shortBreak: { label: '短休息', color: '#9DB5A0', bgColor: 'bg-sage' },
    longBreak: { label: '长休息', color: '#9DB5A0', bgColor: 'bg-sage' },
  };

  return (
    <div className="card p-8">
      {/* Mode Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {(Object.keys(modeConfig) as PomodoroMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
            disabled={status !== 'idle'}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentMode === mode
                ? `${modeConfig[mode].bgColor} text-white`
                : 'bg-warm text-charcoal hover:bg-coral/10'
            } ${status !== 'idle' && currentMode !== mode ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {mode === 'focus' ? <Play className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
            {modeConfig[mode].label}
          </button>
        ))}
      </div>

      {/* Timer Circle */}
      <div className="relative w-64 h-64 mx-auto mb-8">
        <svg className="w-full h-full progress-ring" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#F5EDE4" strokeWidth="8" />
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke={modeConfig[currentMode].color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-5xl font-bold text-charcoal">
            {PomodoroDomain.formatDuration(timeRemaining)}
          </span>
          <span className="text-stone text-sm mt-2">{modeConfig[currentMode].label}中</span>
          {todayPomodoros > 0 && currentMode === 'focus' && (
            <span className="text-coral text-xs mt-1">今日已完成 {todayPomodoros} 个番茄</span>
          )}
        </div>
      </div>

      {/* Current Task */}
      {task && (
        <div className="bg-warm rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-coral/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-coral" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-charcoal font-medium truncate">{task.title}</p>
              <p className="text-stone text-xs">
                {task.completedPomodoros}/{task.estimatedPomodoros} 番茄
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {status === 'idle' && (
          <button onClick={handleStart} className="btn-primary gap-2 px-8">
            <Play className="w-5 h-5" />
            开始{currentMode === 'focus' ? '专注' : '休息'}
          </button>
        )}

        {status === 'running' && (
          <>
            <button onClick={pause} className="btn-secondary gap-2 px-8">
              <Pause className="w-5 h-5" />
              暂停
            </button>
            <button onClick={() => stop()} className="btn-ghost text-red-500 hover:bg-red-50">
              <Square className="w-5 h-5" />
            </button>
          </>
        )}

        {status === 'paused' && (
          <>
            <button onClick={resume} className="btn-primary gap-2 px-8">
              <Play className="w-5 h-5" />
              继续
            </button>
            <button onClick={() => stop()} className="btn-ghost text-red-500 hover:bg-red-50">
              <Square className="w-5 h-5" />
            </button>
          </>
        )}

        {status === 'completed' && (
          <button onClick={reset} className="btn-secondary gap-2">
            <RotateCcw className="w-5 h-5" />
            重置
          </button>
        )}
      </div>
    </div>
  );
}
