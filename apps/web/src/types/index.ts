// 全局类型定义

// 任务相关
export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  pomodoros: number;
  dueDate?: string;
}

// 番茄钟相关
export type PomodoroStatus = 'idle' | 'running' | 'paused';

export interface PomodoroRecord {
  id: string;
  taskId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  completed: boolean;
}

// 用户相关
export interface User {
  id: string;
  username: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

// 统计数据
export interface StudyStats {
  totalHours: number;
  completedPomodoros: number;
  streakDays: number;
  completionRate: number;
}

// 学习时间分布
export interface DailyStudyData {
  day: string;
  pomodoros: number;
  hours: number;
}

// 科目分布
export interface SubjectDistribution {
  name: string;
  hours: number;
  percent: number;
  color: string;
}

// 学习目标
export interface StudyGoal {
  id: string;
  label: string;
  progress: number;
  total: string;
  done: string;
}

// 社区相关
export interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  group: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  liked: boolean;
}

export interface StudyGroup {
  id: string;
  name: string;
  members: number;
  goal: string;
  color: 'coral' | 'sage';
}

// 消息相关
export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  time: string;
  suggestions?: string[];
}

// 成就相关
export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  color: 'coral' | 'sage';
}

// 页面配置
export interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// 时间周期
export type Period = 'week' | 'month' | 'year';
