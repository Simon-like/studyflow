/**
 * Profile 页面类型定义
 */

export interface Achievement {
  icon: string;
  title: string;
  desc: string;
  unlocked: boolean;
}

export interface StudyGoal {
  label: string;
  progress: number;
}

export interface MenuItem {
  icon: string;
  label: string;
  sub: string;
}

export interface Badge {
  label: string;
  variant: 'primary' | 'secondary';
}
