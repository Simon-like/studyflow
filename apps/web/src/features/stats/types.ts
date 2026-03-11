import type { Period, DailyStudyData, SubjectDistribution } from '@/types';

export type { Period };

export interface OverviewCard {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

export interface HeatmapData {
  day: number;
  value: number;
}
