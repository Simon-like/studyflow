export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface PomodoroTimerProps {
  status: TimerStatus;
  timeRemaining: number;
  totalTime?: number;
  taskTitle?: string;
  taskSubtitle?: string;
  taskProgress?: string;
  // 四个操作
  onToggleTimer: () => void;  // 开始/暂停（合一）
  onCompleteTask: () => void; // 提前完成任务
  onResetTimer: () => void;   // 重新计时
  onAbandonTask: () => void;  // 放弃任务（转为自由模式）
  className?: string;
}
