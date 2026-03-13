import type { Priority, TaskStatus } from './types';

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  high: { label: '高', color: 'text-coral', bg: 'bg-coral/10' },
  medium: { label: '中', color: 'text-amber-600', bg: 'bg-amber-50' },
  low: { label: '低', color: 'text-sage', bg: 'bg-sage/10' },
};

export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  todo: { label: '待开始', color: 'text-stone', bg: 'bg-warm' },
  in_progress: { label: '进行中', color: 'text-coral', bg: 'bg-coral/10' },
  completed: { label: '已完成', color: 'text-sage', bg: 'bg-sage/10' },
  abandoned: { label: '已放弃', color: 'text-stone', bg: 'bg-stone/10' },
};
