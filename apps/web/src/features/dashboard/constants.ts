import type { TodayTask, WeeklyStat } from './types';

export const TODAY_TASKS: TodayTask[] = [
  { id: '1', title: '英语单词背诵', description: '100个单词', status: 'completed', priority: 'medium', pomodoros: 2, active: false },
  { id: '2', title: '考研数学复习', description: '进行中 · 预计4个番茄', status: 'in_progress', priority: 'high', pomodoros: 4, active: true },
  { id: '3', title: '专业课笔记整理', description: '预计2个番茄', status: 'todo', priority: 'medium', pomodoros: 2, active: false },
  { id: '4', title: '政治错题巩固', description: '预计1个番茄', status: 'todo', priority: 'low', pomodoros: 1, active: false },
];

export const WEEKLY_STATS: WeeklyStat[] = [
  { label: '番茄总数', value: '48' },
  { label: '专注时长', value: '20h' },
  { label: '完成率', value: '89%', accent: true },
  { label: '连续天数', value: '23天' },
];

export const POMODORO_TOTAL_TIME = 25 * 60; // 25 minutes in seconds
export const CIRCUMFERENCE = 2 * Math.PI * 90; // For SVG circle progress
