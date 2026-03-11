import { Clock, Target, Flame, TrendingUp } from 'lucide-react';
import type { DailyStudyData, SubjectDistribution, HeatmapData } from './types';

export const PERIOD_OPTIONS = [
  { key: 'week', label: '本周' },
  { key: 'month', label: '本月' },
  { key: 'year', label: '全年' },
] as const;

export const WEEK_DATA: DailyStudyData[] = [
  { day: '周一', pomodoros: 6, hours: 2.5 },
  { day: '周二', pomodoros: 8, hours: 3.3 },
  { day: '周三', pomodoros: 4, hours: 1.7 },
  { day: '周四', pomodoros: 10, hours: 4.2 },
  { day: '周五', pomodoros: 7, hours: 2.9 },
  { day: '周六', pomodoros: 11, hours: 4.6 },
  { day: '周日', pomodoros: 5, hours: 2.1 },
];

export const SUBJECT_DATA: SubjectDistribution[] = [
  { name: '数学', hours: 32, percent: 40, color: 'bg-coral' },
  { name: '英语', hours: 18, percent: 22, color: 'bg-sage' },
  { name: '政治', hours: 14, percent: 17, color: 'bg-coral/60' },
  { name: '专业课', hours: 17, percent: 21, color: 'bg-sage/60' },
];

export const OVERVIEW_DATA = [
  { icon: Clock, label: '本周学习', value: '21.3h', change: '+15%', isPositive: true },
  { icon: Target, label: '番茄完成', value: '51', change: '+8%', isPositive: true },
  { icon: Flame, label: '连续打卡', value: '23天', change: '+3天', isPositive: true },
  { icon: TrendingUp, label: '平均效率', value: '89%', change: '-2%', isPositive: false },
];

export function generateMonthHeatmap(): HeatmapData[] {
  return Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    value: Math.floor(Math.random() * 6),
  }));
}
