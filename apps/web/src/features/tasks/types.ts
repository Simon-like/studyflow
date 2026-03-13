import type { Task, TaskStatus } from '@studyflow/shared';

export type { Task, TaskStatus };
export type Priority = 'high' | 'medium' | 'low';
export type TaskFilter = 'all' | 'todo' | 'in_progress' | 'completed';

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  pomodoros: number;
}

export interface FilterOption {
  key: TaskFilter;
  label: string;
}

export interface TaskCounts {
  all: number;
  todo: number;
  in_progress: number;
  completed: number;
}
