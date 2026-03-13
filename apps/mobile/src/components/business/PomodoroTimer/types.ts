export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface PomodoroTimerProps {
  timeLeft: number;
  totalTime: number;
  status: TimerStatus;
  taskTitle?: string;
  taskSubtitle?: string;
  taskEmoji?: string;
  pomodoroCount?: string;
  // 四个操作
  onToggleTimer: () => void;  // 开始/暂停（合一）
  onCompleteTask: () => void; // 提前完成任务
  onResetTimer: () => void;   // 重新计时
  onAbandonTask: () => void;  // 放弃任务（转为自由模式）
}
