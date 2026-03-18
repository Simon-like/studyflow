export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed' | 'resting';

export interface PomodoroTimerProps {
  status: TimerStatus;
  timeRemaining: number;
  totalTime?: number;
  taskTitle?: string;
  taskSubtitle?: string;
  taskProgress?: string;
  isTaskBound?: boolean; // 是否绑定任务（自由模式为false）
  // 专注操作
  onToggleTimer: () => void;  // 开始/暂停（合一）
  onCompleteTask: () => void; // 提前完成任务
  onAbandonTask: () => void;  // 放弃任务（转为自由模式）
  onShowTaskDetail?: () => void; // 查看任务详情
  // 休息操作
  onExtendRest?: () => void;       // 延长休息 5 分钟
  onEndRestEarly?: () => void;     // 提前结束休息（自由模式）
  onCompleteTaskFromRest?: () => void; // 提前结束休息并完成任务（任务模式）
  className?: string;
}
