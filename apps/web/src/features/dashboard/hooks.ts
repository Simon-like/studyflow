import { useEffect, useRef, useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import { formatDuration } from '@/lib/utils';
import { TODAY_TASKS, POMODORO_TOTAL_TIME } from './constants';
import type { DashboardStats } from './types';

export function useDashboardTimer() {
  const { status, timeRemaining, start, pause, resume, stop, tick } = usePomodoroStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => tick(), 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, tick]);

  const progress = useMemo(
    () => (timeRemaining / POMODORO_TOTAL_TIME) * (2 * Math.PI * 90),
    [timeRemaining]
  );

  return {
    status,
    timeRemaining,
    progress,
    onStart: start,
    onPause: pause,
    onResume: resume,
    onStop: stop,
  };
}

export function useDashboardStats(): DashboardStats[] {
  const { todayPomodoros } = usePomodoroStore();

  const focusMinutes = todayPomodoros * 25;

  return useMemo(
    () => [
      {
        label: '今日专注',
        value: formatDuration(focusMinutes),
        sub: `${todayPomodoros} 个番茄`,
      },
      { label: '完成任务', value: '3 / 6', sub: '今日任务' },
      { label: '连续天数', value: '23', sub: '天不间断' },
      { label: '本周效率', value: '89%', sub: '完成率' },
    ],
    [focusMinutes, todayPomodoros]
  );
}

export function useDashboardData() {
  const { user } = useAuthStore();
  const displayName = user?.nickname || user?.username || '同学';

  return {
    displayName,
    todayTasks: TODAY_TASKS,
    weeklyStats: useDashboardStats(),
  };
}
