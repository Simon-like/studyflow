export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed' | 'resting';

export interface PomodoroTimerProps {
  timeLeft: number;
  totalTime: number;
  status: TimerStatus;
  taskTitle?: string;
  taskSubtitle?: string;
  taskEmoji?: string;
  pomodoroCount?: string;
  isTaskBound?: boolean;
  // 专注模式操作
  onToggleTimer: () => void;
  onCompleteTask: () => void;
  onAbandonTask: () => void;
  onShowTaskDetail?: () => void;
  // 休息模式操作
  onExtendRest?: () => void;
  onEndRestEarly?: () => void;
  onCompleteTaskFromRest?: () => void;
}
