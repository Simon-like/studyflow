import type { Task, TaskStatus, Priority } from '@/types';

export type { Task, TaskStatus, Priority };
export type TaskFilter = 'all' | TaskStatus;

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
