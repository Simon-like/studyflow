export type TimerStatus = 'idle' | 'running' | 'paused';

export interface PomodoroTimerProps {
  status: TimerStatus;
  timeRemaining: number;
  totalTime?: number;
  taskTitle?: string;
  taskSubtitle?: string;
  taskProgress?: string;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  className?: string;
}
