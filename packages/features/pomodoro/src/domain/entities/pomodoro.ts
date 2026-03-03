/**
 * 番茄钟领域实体
 */

export type PomodoroStatus = 'idle' | 'running' | 'paused' | 'completed';
export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroSession {
  id: string;
  userId: string;
  taskId?: string;
  mode: PomodoroMode;
  duration: number;        // 计划时长（秒）
  actualDuration?: number; // 实际时长（秒）
  startTime: string;
  endTime?: string;
  status: PomodoroStatus;
  isLocked: boolean;
  abandonReason?: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  estimatedPomodoros: number;
  completedPomodoros: number;
  status: 'todo' | 'in_progress' | 'completed' | 'abandoned';
  dueDate?: string;
  parentId?: string;
  subtasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface PomodoroSettings {
  focusDuration: number;      // 默认 25 分钟
  shortBreakDuration: number; // 默认 5 分钟
  longBreakDuration: number;  // 默认 15 分钟
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;  // 几个番茄后长休息，默认 4
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
};

/**
 * 番茄钟领域方法
 */
export const PomodoroDomain = {
  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },

  getProgressPercent(session: PomodoroSession): number {
    if (session.status === 'completed') return 100;
    if (session.status === 'idle') return 0;
    
    const elapsed = session.actualDuration || 0;
    return Math.min((elapsed / session.duration) * 100, 100);
  },

  shouldLongBreak(completedCount: number, interval: number): boolean {
    return completedCount > 0 && completedCount % interval === 0;
  },

  calculateStreak(sessions: PomodoroSession[]): number {
    // 计算连续打卡天数
    const dates = [...new Set(sessions
      .filter(s => s.status === 'completed')
      .map(s => s.startTime.split('T')[0])
    )].sort().reverse();
    
    if (dates.length === 0) return 0;
    
    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  },
};
