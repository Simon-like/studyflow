import { Clock, Target, Flame, Award } from 'lucide-react';
import type { Achievement, StudyGoal } from '@/types';

interface WeeklyActivityData {
  day: string;
  hours: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: '1', icon: '⚡', title: '专注达人', description: '连续专注30分钟', color: 'coral', unlocked: true },
  { id: '2', icon: '🎯', title: '任务完成者', description: '完成10个任务', color: 'sage', unlocked: true },
  { id: '3', icon: '🔥', title: '连续打卡', description: '连续7天打卡', color: 'coral', unlocked: true },
  { id: '4', icon: '📚', title: '知识探索者', description: '累计学习100小时', color: 'sage', unlocked: false },
  { id: '5', icon: '🏆', title: '番茄大师', description: '累计完成100个番茄', color: 'coral', unlocked: false },
  { id: '6', icon: '🌟', title: '社区之星', description: '获得100个点赞', color: 'sage', unlocked: false },
];

export const WEEKLY_DATA: WeeklyActivityData[] = [
  { day: '周一', hours: 3.5 },
  { day: '周二', hours: 4.0 },
  { day: '周三', hours: 2.5 },
  { day: '周四', hours: 5.0 },
  { day: '周五', hours: 3.0 },
  { day: '周六', hours: 4.5 },
  { day: '周日', hours: 2.0 },
];

export const STUDY_GOALS: StudyGoal[] = [
  { id: '1', label: '考研数学', progress: 68, total: '300h', done: '204h' },
  { id: '2', label: '英语备考', progress: 45, total: '200h', done: '90h' },
  { id: '3', label: '专业课', progress: 82, total: '250h', done: '205h' },
];

export const USER_TAGS = ['数学达人', '早起鸟', '专注力强'];
