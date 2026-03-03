/**
 * Mock API 服务层
 * 模拟后端 API，延迟 200-500ms 返回数据
 * 待后端开发后，只需替换此文件为真实 API 调用
 */

import type { 
  User, 
  LoginRequest, 
  LoginResponse,
  RegisterRequest,
  PomodoroSession,
  Task,
  DailyStats,
  Achievement,
  Friend,
  Companion
} from '../types/api';

// 延迟模拟网络请求
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mock 数据存储
const mockStorage = {
  user: null as User | null,
  token: 'mock-jwt-token-' + Date.now(),
};

// 认证服务
export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    await delay();
    
    if (data.email !== 'test@example.com' || data.password !== 'password') {
      throw new Error('邮箱或密码错误');
    }
    
    const user: User = {
      id: 'user-001',
      email: data.email,
      nickname: '测试用户',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user001`,
      preferences: {
        theme: 'light',
        language: 'zh-CN',
        pomodoroDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
      },
      createdAt: '2026-01-01T00:00:00Z',
    };
    
    mockStorage.user = user;
    
    return {
      token: mockStorage.token,
      user,
    };
  },

  async register(data: RegisterRequest): Promise<LoginResponse> {
    await delay();
    
    const user: User = {
      id: 'user-' + Date.now(),
      email: data.email,
      nickname: data.nickname,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      preferences: {
        theme: 'light',
        language: 'zh-CN',
        pomodoroDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
      },
      createdAt: new Date().toISOString(),
    };
    
    mockStorage.user = user;
    
    return {
      token: mockStorage.token,
      user,
    };
  },

  async logout(): Promise<void> {
    await delay(100);
    mockStorage.user = null;
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(200);
    return mockStorage.user;
  },
};

// 番茄钟服务
export const pomodoroService = {
  async getSessions(): Promise<PomodoroSession[]> {
    await delay();
    return [
      { id: 'sess-001', userId: 'user-001', duration: 1500, plannedDuration: 1500, status: 'completed', startedAt: '2026-03-03T08:00:00Z', completedAt: '2026-03-03T08:25:00Z' },
      { id: 'sess-002', userId: 'user-001', duration: 1200, plannedDuration: 1500, status: 'interrupted', startedAt: '2026-03-03T09:30:00Z', interruptedAt: '2026-03-03T09:50:00Z' },
    ];
  },

  async createSession(plannedDuration: number): Promise<PomodoroSession> {
    await delay();
    return {
      id: 'sess-' + Date.now(),
      userId: 'user-001',
      duration: 0,
      plannedDuration,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
    };
  },
};

// 任务服务
export const taskService = {
  async getTasks(): Promise<Task[]> {
    await delay();
    return [
      { id: 'task-001', userId: 'user-001', title: '完成 API 设计', description: '', status: 'in_progress', priority: 'high', completedPomodoros: 2, estimatedPomodoros: 4, tags: ['工作'], createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-03-03T00:00:00Z' },
      { id: 'task-002', userId: 'user-001', title: '整理文档', description: '', status: 'todo', priority: 'medium', completedPomodoros: 0, estimatedPomodoros: 2, tags: ['文档'], createdAt: '2026-03-02T00:00:00Z', updatedAt: '2026-03-02T00:00:00Z' },
      { id: 'task-003', userId: 'user-001', title: '修复 Bug', description: '', status: 'completed', priority: 'high', completedPomodoros: 1, estimatedPomodoros: 1, tags: ['Bug'], createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-03-02T00:00:00Z' },
    ];
  },
};

// 统计服务
export const statsService = {
  async getDailyStats(date?: string): Promise<DailyStats> {
    await delay();
    return {
      date: date || new Date().toISOString().split('T')[0],
      totalFocusTime: 150,
      completedSessions: 4,
      completedTasks: 2,
      interruptions: 1,
      hourlyDistribution: [0, 0, 0, 0, 0, 0, 0, 30, 45, 25, 0, 0, 0, 0, 60, 30, 0, 0, 0, 0, 0, 0, 0, 0],
    };
  },

  async getAchievements(): Promise<Achievement[]> {
    await delay();
    return [
      { id: 'ach-001', name: '初学者', description: '完成第一次专注', icon: '🎯', unlockedAt: '2026-01-01T00:00:00Z', progress: 1, total: 1 },
      { id: 'ach-002', name: '专注大师', description: '累计专注 100 小时', icon: '🏆', unlockedAt: undefined, progress: 45, total: 100 },
      { id: 'ach-003', name: '连续七天', description: '连续 7 天使用番茄钟', icon: '🔥', unlockedAt: undefined, progress: 3, total: 7 },
    ];
  },
};

// 好友服务
export const friendService = {
  async getFriends(): Promise<Friend[]> {
    await delay();
    return [
      { id: 'friend-001', nickname: '小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=friend1', status: 'focusing', todayFocusTime: 120, isStudyingTogether: true },
      { id: 'friend-002', nickname: '小红', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=friend2', status: 'offline', todayFocusTime: 0, isStudyingTogether: false },
    ];
  },
};

// 同伴服务
export const companionService = {
  async getCompanions(): Promise<Companion[]> {
    await delay();
    return [
      {
        id: 'comp-001',
        name: '小猫咪',
        type: 'cat',
        level: 5,
        experience: 450,
        maxExperience: 500,
        unlockedAt: '2026-01-01T00:00:00Z',
        isActive: true,
        outfits: [
          { id: 'outfit-001', name: '默认', isEquipped: true },
          { id: 'outfit-002', name: '侦探帽', isEquipped: false },
        ],
      },
    ];
  },
};
