export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface PomodoroTimerProps {
  timeLeft: number;
  totalTime: number;
  status: TimerStatus;
  taskTitle?: string;
  taskSubtitle?: string;
  taskEmoji?: string;
  pomodoroCount?: string;
  isTaskBound?: boolean; // 是否绑定任务（自由模式为false）
  // 三个操作
  onToggleTimer: () => void;  // 开始/暂停（合一）
  onCompleteTask: () => void; // 提前完成任务
  onAbandonTask: () => void;  // 放弃任务（转为自由模式）
  onShowTaskDetail?: () => void; // 查看任务详情
}
