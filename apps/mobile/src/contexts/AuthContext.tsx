/**
 * 认证上下文
 * 
 * 提供完整的认证状态管理：
 * 1. 登录状态
 * 2. 用户信息
 * 3. 登录/登出方法
 * 4. 双 token 自动刷新
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthToken } from '../hooks/useAuthToken';
import type { User } from '../utils/tokenStorage';

interface AuthContextValue {
  // 状态
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  
  // 方法
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  getValidAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthToken();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

// 导出类型
export type { User };
