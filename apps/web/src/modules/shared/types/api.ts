/**
 * API 类型定义
 * 与后端 API 规范保持一致
 */

// 通用响应
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 用户
export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'zh-CN' | 'en-US';
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}

// 认证
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
}

// 番茄钟
export interface PomodoroSession {
  id: string;
  userId: string;
  taskId?: string;
  duration: number;
  plannedDuration: number;
  startedAt: string;
  completedAt?: string;
  interruptedAt?: string;
  status: 'completed' | 'interrupted' | 'in_progress';
  notes?: string;
}

// 任务
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  estimatedPomodoros?: number;
  completedPomodoros: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 统计
export interface DailyStats {
  date: string;
  totalFocusTime: number;
  completedSessions: number;
  completedTasks: number;
  interruptions: number;
  hourlyDistribution: number[];
}

// 成就
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  total: number;
}

// 好友
export interface Friend {
  id: string;
  nickname: string;
  avatar: string;
  status: 'online' | 'offline' | 'focusing';
  todayFocusTime: number;
  isStudyingTogether: boolean;
}

// 同伴
export interface Companion {
  id: string;
  name: string;
  type: 'cat' | 'dog' | 'owl' | 'fox';
  level: number;
  experience: number;
  maxExperience: number;
  unlockedAt: string;
  isActive: boolean;
  outfits: CompanionOutfit[];
}

export interface CompanionOutfit {
  id: string;
  name: string;
  isEquipped: boolean;
}
