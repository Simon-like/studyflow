/**
 * 用户领域实体
 * 纯 TypeScript，无框架依赖
 */

export interface User {
  id: string;
  email: string;
  username: string;
  nickname?: string;
  avatar?: string;
  phone?: string;
  studyGoal?: string;
  preferences: UserPreferences;
  focusDuration: number;        // 默认专注时长（秒）
  shortBreakDuration: number;   // 默认短休息时长（秒）
  longBreakDuration: number;    // 默认长休息时长（秒）
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface NotificationSettings {
  dailyReminder: boolean;
  reminderTime: string;  // HH:mm
  focusComplete: boolean;
  breakComplete: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  nickname: string;
  studyGoal?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

/**
 * 用户领域方法
 */
export const UserDomain = {
  getDisplayName(user: User): string {
    return user.nickname || user.username || user.email.split('@')[0];
  },

  getInitials(user: User): string {
    const name = this.getDisplayName(user);
    return name.charAt(0).toUpperCase();
  },

  isNewUser(user: User): boolean {
    const createdAt = new Date(user.createdAt);
    const now = new Date();
    const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays < 7;
  },
};
