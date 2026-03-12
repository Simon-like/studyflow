/**
 * Home 页面类型定义
 * 复用 @studyflow/shared 的类型，保持双端一致
 */

import type { Task as SharedTask, TodayStats, WeeklyOverview } from '@studyflow/shared';

// 复用共享包的 Task 类型
export type Task = SharedTask;

// 本地 UI 状态类型
export interface HomeStats {
  todayPomodoros: number;
  completedTasks: string;
  streakDays: string;
}

export interface User {
  name: string;
  avatar: string;
}

// 导出共享类型供组件使用
export type { TodayStats, WeeklyOverview };
