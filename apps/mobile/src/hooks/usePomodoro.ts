/**
 * 番茄钟计时器 Hook
 * 支持专注 + 休息模式（参照 web 端 pomodoroStore）
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { POMODORO_CONFIG } from '../constants';
import { REST_EXTEND_SECONDS } from '@studyflow/shared';
import { useUser } from './useUser';

export type PomodoroStatus = 'idle' | 'running' | 'paused' | 'completed' | 'resting';

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
  totalTime: number; // 当前模式的总时间

  // 动作
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  reset: () => void;
  // 休息相关
  startRest: () => void;
  extendRest: () => void;
  endRest: () => void;

  // 计算属性
  formattedTime: string;
  isRunning: boolean;
  isPaused: boolean;
  isIdle: boolean;
  isResting: boolean;
}

export function usePomodoro(options: UsePomodoroOptions = {}): UsePomodoroReturn {
  const { pomodoroSettings } = useUser();
  const {
    onComplete,
    onTick
  } = options;

  // 使用用户的番茄钟设置
  const userFocusDuration = pomodoroSettings?.focusDuration || POMODORO_CONFIG.DEFAULT_DURATION;
  const userBreakDuration = pomodoroSettings?.shortBreakDuration || POMODORO_CONFIG.SHORT_BREAK;
  const effectiveInitialDuration = options.initialDuration || userFocusDuration;

  const [timeLeft, setTimeLeft] = useState(effectiveInitialDuration);
  const [status, setStatus] = useState<PomodoroStatus>('idle');
  const [totalTime, setTotalTime] = useState(effectiveInitialDuration);
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
    setTotalTime(effectiveInitialDuration);
    setStatus('running');
  }, [status, effectiveInitialDuration]);

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
    setTimeLeft(effectiveInitialDuration);
    setTotalTime(effectiveInitialDuration);
  }, [clearTimer, effectiveInitialDuration]);

  // 重置
  const reset = useCallback(() => {
    clearTimer();
    setStatus('idle');
    setTimeLeft(effectiveInitialDuration);
    setTotalTime(effectiveInitialDuration);
  }, [clearTimer, effectiveInitialDuration]);

  // 进入休息状态
  const startRest = useCallback(() => {
    clearTimer();
    const breakDuration = userBreakDuration;
    setTimeLeft(breakDuration);
    setTotalTime(breakDuration);
    setStatus('resting');
  }, [clearTimer, userBreakDuration]);

  // 延长休息 5 分钟
  const extendRest = useCallback(() => {
    setTimeLeft(prev => prev + REST_EXTEND_SECONDS);
    setTotalTime(prev => prev + REST_EXTEND_SECONDS);
  }, []);

  // 提前结束休息，回到 idle
  const endRest = useCallback(() => {
    clearTimer();
    setStatus('idle');
    setTimeLeft(effectiveInitialDuration);
    setTotalTime(effectiveInitialDuration);
  }, [clearTimer, effectiveInitialDuration]);

  // 监听用户设置变化，更新计时器时长
  useEffect(() => {
    if (status === 'idle') {
      const newDuration = pomodoroSettings?.focusDuration || POMODORO_CONFIG.DEFAULT_DURATION;
      setTimeLeft(newDuration);
      setTotalTime(newDuration);
    }
  }, [pomodoroSettings?.focusDuration, status]);

  // 计时逻辑（支持 running 和 resting）
  useEffect(() => {
    if (status === 'running' || status === 'resting') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            if (status === 'running') {
              setStatus('completed');
              onComplete?.();
            }
            // resting 倒计时到 0 由外部处理
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
  const elapsed = totalTime - timeLeft;
  const progress = totalTime > 0 ? elapsed / totalTime : 0;
  const progressPercent = Math.round(progress * 100);

  return {
    timeLeft,
    status,
    progress,
    progressPercent,
    totalTime,
    start,
    pause,
    resume,
    stop,
    reset,
    startRest,
    extendRest,
    endRest,
    formattedTime,
    isRunning: status === 'running',
    isPaused: status === 'paused',
    isIdle: status === 'idle',
    isResting: status === 'resting',
  };
}

// 辅助函数
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
