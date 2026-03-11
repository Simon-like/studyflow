import { useEffect, useRef } from 'react';
import type { TimerStatus } from './types';

export function useTimerTick(
  status: TimerStatus,
  onTick: () => void
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => onTick(), 1000);
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
  }, [status, onTick]);
}
