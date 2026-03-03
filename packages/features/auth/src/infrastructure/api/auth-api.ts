import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthTokens 
} from '../../domain/entities/user';
import type { IAuthRepository } from '../../domain/repositories/auth-repository.interface';

/**
 * HTTP API 实现
 * 实际项目中应使用 axios 或其他 HTTP 客户端
 */

const API_BASE = '/api/v1';

class AuthApi implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    // TODO: Replace with actual API call
    // const response = await axios.post(`${API_BASE}/auth/login`, credentials);
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: '1',
      email: credentials.email,
      username: credentials.email.split('@')[0],
      nickname: '学习者',
      studyGoal: '考研冲刺中',
      preferences: {
        theme: 'light',
        notifications: {
          dailyReminder: true,
          reminderTime: '09:00',
          focusComplete: true,
          breakComplete: true,
        },
        soundEnabled: true,
        vibrationEnabled: true,
      },
      focusDuration: 25 * 60,
      shortBreakDuration: 5 * 60,
      longBreakDuration: 15 * 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const tokens: AuthTokens = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    return { user, tokens };
  }

  async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: '1',
      email: data.email,
      username: data.email.split('@')[0],
      nickname: data.nickname,
      studyGoal: data.studyGoal,
      preferences: {
        theme: 'light',
        notifications: {
          dailyReminder: true,
          reminderTime: '09:00',
          focusComplete: true,
          breakComplete: true,
        },
        soundEnabled: true,
        vibrationEnabled: true,
      },
      focusDuration: 25 * 60,
      shortBreakDuration: 5 * 60,
      longBreakDuration: 15 * 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const tokens: AuthTokens = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    return { user, tokens };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      accessToken: 'new-mock-access-token',
      refreshToken,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async getCurrentUser(): Promise<User | null> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return null if not logged in
    return null;
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) throw new Error('Not authenticated');
    
    return { ...currentUser, ...data, updatedAt: new Date().toISOString() };
  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    // TODO: Replace with actual API call (FormData)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 800));
  }
}

// Import here to avoid circular dependency
import { useAuthStore } from '../../application/hooks/auth-store';

export const authApi = new AuthApi();
