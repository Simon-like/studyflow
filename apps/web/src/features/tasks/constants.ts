import type { Task, FilterOption } from './types';

export const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: '考研数学复习',
    description: '第三章 线性代数 · 行列式与矩阵',
    priority: 'high',
    status: 'in_progress',
    pomodoros: 4,
    dueDate: '2026-03-15',
  },
  {
    id: '2',
    title: '英语单词背诵',
    description: '每日200个核心词汇',
    priority: 'medium',
    status: 'completed',
    pomodoros: 2,
    dueDate: '2026-03-11',
  },
  {
    id: '3',
    title: '政治错题整理',
    description: '近代史部分重点标注',
    priority: 'medium',
    status: 'todo',
    pomodoros: 2,
    dueDate: '2026-03-16',
  },
  {
    id: '4',
    title: '专业课笔记',
    description: '数据结构第五章整理',
    priority: 'high',
    status: 'todo',
    pomodoros: 3,
    dueDate: '2026-03-17',
  },
  {
    id: '5',
    title: '阅读理解练习',
    description: '精读两篇英文文章',
    priority: 'low',
    status: 'todo',
    pomodoros: 1,
    dueDate: '2026-03-18',
  },
];

export const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: '全部' },
  { key: 'todo', label: '待开始' },
  { key: 'in_progress', label: '进行中' },
  { key: 'completed', label: '已完成' },
];

export const DEFAULT_FORM_DATA = {
  title: '',
  description: '',
  priority: 'medium' as const,
  pomodoros: 1,
};
