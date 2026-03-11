import type { Achievement, StudyGoal } from '@/types';

export interface ProfileStats {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: 'coral' | 'sage';
}

export interface WeeklyActivityData {
  day: string;
  hours: number;
}
