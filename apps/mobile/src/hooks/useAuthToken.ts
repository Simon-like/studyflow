/**
 * 双 Token 认证 Hook
 * 
 * 功能：
 * 1. 自动刷新 access token
 * 2. 管理登录状态
 * 3. 提供登录/登出方法
 * 4. mock 模式支持
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { tokenStorage, type TokenData, type User } from '../utils/tokenStorage';
import { api } from '../api';

// Token 刷新配置
const TOKEN_REFRESH_CONFIG = {
  // 提前 5 分钟刷新 token
  REFRESH_BUFFER_MINUTES: 5,
  // 刷新失败重试间隔（秒）
  RETRY_INTERVAL: 30,
  // 最大重试次数
  MAX_RETRIES: 3,
};

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

interface UseAuthTokenReturn extends AuthState {
  // 登录（使用 mock）
  login: (username: string, password: string) => Promise<void>;
  // 登出
  logout: () => Promise<void>;
  // 手动刷新 token
  refreshAccessToken: () => Promise<boolean>;
  // 获取当前 access token（带自动刷新）
  getValidAccessToken: () => Promise<string | null>;
}

export function useAuthToken(): UseAuthTokenReturn {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);

  /**
   * 初始化：检查本地存储的 token
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { accessToken, refreshToken, user } = await tokenStorage.getTokenData();
        
        if (refreshToken) {
          // 检查 access token 是否即将过期
          const isExpiring = await tokenStorage.isTokenExpiringSoon(
            TOKEN_REFRESH_CONFIG.REFRESH_BUFFER_MINUTES
          );
          
          if (isExpiring) {
            // 尝试刷新 token
            const success = await performRefresh(refreshToken);
            if (success && user) {
              setState({ isAuthenticated: true, isLoading: false, user });
            } else {
              // 刷新失败，清除登录状态
              await tokenStorage.clearTokens();
              setState({ isAuthenticated: false, isLoading: false, user: null });
            }
          } else {
            // token 有效，设置状态
            setState({ 
              isAuthenticated: true, 
              isLoading: false, 
              user: user 
            });
            // 启动定时刷新
            scheduleTokenRefresh();
          }
        } else {
          setState({ isAuthenticated: false, isLoading: false, user: null });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setState({ isAuthenticated: false, isLoading: false, user: null });
      }
    };

    initAuth();

    // 清理定时器
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  /**
   * 执行 token 刷新
   */
  const performRefresh = async (refreshToken: string): Promise<boolean> => {
    try {
      // 使用 mock 服务刷新 token
      const response = await api.auth.refresh(refreshToken);
      
      if (response.data) {
        const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;
        
        await tokenStorage.saveTokens({
          accessToken,
          refreshToken: newRefreshToken,
          expiresIn: expiresIn || 7200, // 默认2小时
        });
        
        retryCountRef.current = 0;
        scheduleTokenRefresh();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // 重试机制
      if (retryCountRef.current < TOKEN_REFRESH_CONFIG.MAX_RETRIES) {
        retryCountRef.current++;
        setTimeout(() => {
          tokenStorage.getRefreshToken().then(token => {
            if (token) performRefresh(token);
          });
        }, TOKEN_REFRESH_CONFIG.RETRY_INTERVAL * 1000);
      }
      
      return false;
    }
  };

  /**
   * 调度 token 刷新
   */
  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // 每 55 分钟刷新一次（假设 token 有效期为 1 小时）
    const refreshInterval = 55 * 60 * 1000;
    
    refreshTimerRef.current = setTimeout(async () => {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (refreshToken) {
        const success = await performRefresh(refreshToken);
        if (!success) {
          // 刷新失败，登出
          await logout();
        }
      }
    }, refreshInterval);
  }, []);

  /**
   * 登录（mock 模式）
   */
  const login = useCallback(async (username: string, password: string): Promise<void> => {
    try {
      const response = await api.auth.login({ username, password });
      
      if (response.data) {
        const { accessToken, refreshToken, expiresIn, user } = response.data as TokenData & { user: User };
        
        // 保存 token
        await tokenStorage.saveTokens({
          accessToken,
          refreshToken,
          expiresIn: expiresIn || 7200,
        });
        
        // 保存用户信息
        await tokenStorage.saveUser(user);
        
        // 更新状态
        setState({
          isAuthenticated: true,
          isLoading: false,
          user,
        });
        
        // 启动定时刷新
        scheduleTokenRefresh();
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [scheduleTokenRefresh]);

  /**
   * 登出
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      // 调用登出 API（mock）
      await api.auth.logout();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      // 清除本地存储
      await tokenStorage.clearTokens();
      
      // 清除定时器
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      
      // 重置状态
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
      
      retryCountRef.current = 0;
    }
  }, []);

  /**
   * 手动刷新 access token
   */
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) return false;
    
    return performRefresh(refreshToken);
  }, []);

  /**
   * 获取有效的 access token（自动刷新）
   */
  const getValidAccessToken = useCallback(async (): Promise<string | null> => {
    const isExpiring = await tokenStorage.isTokenExpiringSoon(
      TOKEN_REFRESH_CONFIG.REFRESH_BUFFER_MINUTES
    );
    
    if (isExpiring) {
      const success = await refreshAccessToken();
      if (!success) return null;
    }
    
    return tokenStorage.getAccessToken();
  }, [refreshAccessToken]);

  return {
    ...state,
    login,
    logout,
    refreshAccessToken,
    getValidAccessToken,
  };
}
