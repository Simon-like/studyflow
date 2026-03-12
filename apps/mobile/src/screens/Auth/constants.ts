/**
 * Auth 页面常量
 */

export const FEATURES = [
  { emoji: '🧠', text: 'AI智能规划学习计划' },
  { emoji: '🍅', text: '番茄钟专注管理' },
  { emoji: '💬', text: '虚拟学伴实时互动' },
] as const;

export type AuthScreen = 'login' | 'register';
