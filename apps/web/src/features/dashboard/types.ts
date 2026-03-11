import type { Task } from '@/types';

export interface TodayTask extends Task {
  active?: boolean;
}

export interface DashboardStats {
  label: string;
  value: string;
  sub: string;
}

export interface WeeklyStat {
  label: string;
  value: string;
  accent?: boolean;
}
