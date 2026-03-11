/**
 * 番茄钟计时器 Hook
 * 封装番茄钟的核心逻辑
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { POMODORO_CONFIG } from '../constants';

export type PomodoroStatus = 'idle' | 'running' | 'paused' | 'completed';

interface UsePomodoroOptions {
  initialDuration?: number;
  onComplete?: () => void;
  onTick?: (timeLeft: number) => void;
}

interface UsePomodoroReturn {
  // 状态
  timeLeft: number;
  status: PomodoroStatus;
  progress: number; // 0-1
  progressPercent: number; // 0-100
  
  // 动作
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  
  // 计算属性
  formattedTime: string;
  isRunning: boolean;
  isPaused: boolean;
  isIdle: boolean;
}

export function usePomodoro(options: UsePomodoroOptions = {}): UsePomodoroReturn {
  const { 
    initialDuration = POMODORO_CONFIG.DEFAULT_DURATION,
    onComplete,
    onTick 
  } = options;
  
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [status, setStatus] = useState<PomodoroStatus>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // 清理定时器
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  
  // 开始计时
  const start = useCallback(() => {
    if (status === 'running') return;
    setStatus('running');
  }, [status]);
  
  // 暂停
  const pause = useCallback(() => {
    if (status !== 'running') return;
    setStatus('paused');
  }, [status]);
  
  // 继续
  const resume = useCallback(() => {
    if (status !== 'paused') return;
    setStatus('running');
  }, [status]);
  
  // 停止
  const stop = useCallback(() => {
    clearTimer();
    setStatus('idle');
    setTimeLeft(initialDuration);
  }, [clearTimer, initialDuration]);
  
  // 重置
  const reset = useCallback(() => {
    clearTimer();
    setStatus('idle');
    setTimeLeft(initialDuration);
  }, [clearTimer, initialDuration]);
  
  // 计时逻辑
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setStatus('completed');
            onComplete?.();
            return 0;
          }
          const next = prev - 1;
          onTick?.(next);
          return next;
        });
      }, 1000);
    } else {
      clearTimer();
    }
    
    return clearTimer;
  }, [status, clearTimer, onComplete, onTick]);
  
  // 格式化时间
  const formattedTime = formatTime(timeLeft);
  
  // 计算进度
  const elapsed = initialDuration - timeLeft;
  const progress = elapsed / initialDuration;
  const progressPercent = Math.round(progress * 100);
  
  return {
    timeLeft,
    status,
    progress,
    progressPercent,
    start,
    pause,
    resume,
    stop,
    reset,
    formattedTime,
    isRunning: status === 'running',
    isPaused: status === 'paused',
    isIdle: status === 'idle',
  };
}

// 辅助函数
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
