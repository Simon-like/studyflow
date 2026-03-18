/**
 * 双 Token 持久化存储工具 (React Native)
 * 
 * 使用 AsyncStorage 存储 accessToken 和 refreshToken
 * 支持双 token 刷新机制
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Token 存储键名
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'studyflow_access_token',
  REFRESH_TOKEN: 'studyflow_refresh_token',
  TOKEN_EXPIRES_AT: 'studyflow_token_expires_at',
  USER: 'studyflow_user',
} as const;

// Token 数据类型
export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number; // 过期时间（秒）
}

// 用户数据类型
export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  pin: string;
  nickname: string;
  avatar?: string;
  focusDuration?: number;
  shortBreakDuration?: number;
  longBreakDuration?: number;
}

/**
 * Token 存储工具类
 */
class TokenStorage {
  /**
   * 保存 token 数据
   */
  async saveTokens(data: TokenData): Promise<void> {
    try {
      const { accessToken, refreshToken, expiresIn } = data;
      const expiresAt = expiresIn
        ? String(Date.now() + expiresIn * 1000)
        : String(Date.now() + 7 * 24 * 60 * 60 * 1000); // 默认7天
      
      // 使用 Promise.all 并行保存
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken),
        AsyncStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken),
        AsyncStorage.setItem(TOKEN_KEYS.TOKEN_EXPIRES_AT, expiresAt),
      ]);
    } catch (error) {
      console.error('Failed to save tokens:', error);
      throw error;
    }
  }

  /**
   * 获取 access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    } catch {
      return null;
    }
  }

  /**
   * 获取 refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    } catch {
      return null;
    }
  }

  /**
   * 获取 token 过期时间
   */
  async getTokenExpiresAt(): Promise<number | null> {
    try {
      const value = await AsyncStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRES_AT);
      return value ? Number(value) : null;
    } catch {
      return null;
    }
  }

  /**
   * 检查 token 是否即将过期（5分钟内过期视为即将过期）
   */
  async isTokenExpiringSoon(bufferMinutes = 5): Promise<boolean> {
    const expiresAt = await this.getTokenExpiresAt();
    if (!expiresAt) return true;
    
    const bufferMs = bufferMinutes * 60 * 1000;
    return Date.now() + bufferMs >= expiresAt;
  }

  /**
   * 检查是否已登录（有有效的 refresh token）
   */
  async isAuthenticated(): Promise<boolean> {
    const refreshToken = await this.getRefreshToken();
    return !!refreshToken;
  }

  /**
   * 清除所有 token（登出时使用）
   */
  async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN),
        AsyncStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN),
        AsyncStorage.removeItem(TOKEN_KEYS.TOKEN_EXPIRES_AT),
        AsyncStorage.removeItem(TOKEN_KEYS.USER),
      ]);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  /**
   * 保存用户信息
   */
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  }

  /**
   * 获取用户信息
   */
  async getUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(TOKEN_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * 获取所有 token 数据（用于初始化）
   */
  async getTokenData(): Promise<{ accessToken: string | null; refreshToken: string | null; user: User | null }> {
    const [accessToken, refreshToken, user] = await Promise.all([
      this.getAccessToken(),
      this.getRefreshToken(),
      this.getUser(),
    ]);
    
    return { accessToken, refreshToken, user };
  }
}

// 导出单例实例
export const tokenStorage = new TokenStorage();

// 导出存储键（供外部使用）
export { TOKEN_KEYS };
