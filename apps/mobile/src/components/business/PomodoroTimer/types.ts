export interface PomodoroTimerProps {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  isPaused: boolean;
  taskTitle?: string;
  taskSubtitle?: string;
  taskEmoji?: string;
  pomodoroCount?: string;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onSkip?: () => void;
}
