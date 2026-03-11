/**
 * Home 页面常量
 */

// 欢迎语
export const WELCOME_MESSAGES = {
  morning: '早安，开启元气满满的一天',
  afternoon: '午安，继续加油哦',
  evening: '晚上好，今天收获满满',
  default: '今天也要加油哦',
};

// 默认用户
export const DEFAULT_USER = {
  name: '应东林',
  avatar: 'Y',
};

// 默认任务
export const DEFAULT_TASKS = [
  { id: 1, title: '英语单词背诵', sub: '100个单词 · 已完成', done: true, active: false },
  { id: 2, title: '考研数学复习', sub: '进行中 · 预计4个番茄', done: false, active: true },
  { id: 3, title: '专业课笔记整理', sub: '预计2个番茄', done: false, active: false },
];

// 统计数据
export const DEFAULT_STATS = {
  todayPomodoros: 2,
  completedTasks: '3/6',
  streakDays: '23天',
};

// 当前任务信息
export const CURRENT_TASK = {
  title: '考研数学复习',
  subtitle: '第三章 · 线性代数',
  emoji: '📖',
  pomodoroCount: '2/4',
};
