/**
 * 鉴权状态管理
 * 使用 Zustand 进行状态管理
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, TokenResponse } from '@studyflow/shared';
import { STORAGE_KEYS } from '@studyflow/shared';
import { storage } from '../utils/storage';

// ==================== 类型定义 ====================

interface AuthState {
  // 状态
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // 动作
  setUser: (user: User | null) => void;
  setTokens: (tokens: TokenResponse) => void;
  login: (user: User, tokens: TokenResponse) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  checkAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  getToken: () => string | null;
}

// ==================== Zustand Store ====================

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      // ==================== Actions ====================

      /**
       * 设置用户信息
       */
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      /**
       * 设置 Token
       */
      setTokens: (tokens) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
        // 同时保存到 AsyncStorage 供 API 客户端使用
        storage.set(STORAGE_KEYS.TOKEN, tokens.accessToken);
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      },

      /**
       * 登录成功
       */
      login: (user, tokens) => {
        set({
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
        // 持久化到 AsyncStorage
        storage.set(STORAGE_KEYS.TOKEN, tokens.accessToken);
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
        storage.set(STORAGE_KEYS.USER, user);
      },

      /**
       * 登出
       */
      logout: async () => {
        // 清除所有存储
        await storage.multiRemove([
          STORAGE_KEYS.TOKEN,
          STORAGE_KEYS.REFRESH_TOKEN,
          STORAGE_KEYS.USER,
        ]);
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      /**
       * 更新用户信息
       */
      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...updates };
          set({ user: updatedUser });
          storage.set(STORAGE_KEYS.USER, updatedUser);
        }
      },

      /**
       * 检查登录状态
       */
      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const [tokenResult, userResult] = await storage.multiGet([
            STORAGE_KEYS.TOKEN,
            STORAGE_KEYS.USER,
          ]);

          const token = tokenResult[1];
          const userStr = userResult[1];

          if (token && userStr) {
            const user = JSON.parse(userStr) as User;
            const refreshToken = await storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
            
            set({
              user,
              accessToken: token,
              refreshToken,
              isAuthenticated: true,
              isInitialized: true,
              isLoading: false,
            });
          } else {
            set({
              isAuthenticated: false,
              isInitialized: true,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Check auth error:', error);
          set({
            isAuthenticated: false,
            isInitialized: true,
            isLoading: false,
          });
        }
      },

      /**
       * 刷新 Access Token
       */
      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          // TODO: 调用 API 刷新 token
          // const response = await authService.refresh(refreshToken);
          // const { accessToken, refreshToken: newRefreshToken } = response.data;
          // get().setTokens({ accessToken, refreshToken: newRefreshToken, expiresIn: 3600 });
          return true;
        } catch (error) {
          console.error('Refresh token error:', error);
          get().logout();
          return false;
        }
      },

      /**
       * 获取当前 Token
       */
      getToken: () => {
        return get().accessToken;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          const value = await storage.get<string>(name);
          return value ?? null;
        },
        setItem: async (name, value) => {
          await storage.set(name, value);
        },
        removeItem: async (name) => {
          await storage.remove(name);
        },
      })),
      // 只持久化这些字段
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
