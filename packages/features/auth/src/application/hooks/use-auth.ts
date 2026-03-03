import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useAuthStore } from './auth-store';
import { authApi } from '../../infrastructure/api/auth-api';
import type { LoginCredentials, RegisterData } from '../../domain/entities/user';

/**
 * 认证相关的 React Query Hooks
 */

const AUTH_KEYS = {
  all: ['auth'] as const,
  user: () => [...AUTH_KEYS.all, 'user'] as const,
  profile: (userId: string) => [...AUTH_KEYS.all, 'profile', userId] as const,
};

/**
 * 获取当前用户
 */
export function useCurrentUser() {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  return useQuery({
    queryKey: AUTH_KEYS.user(),
    queryFn: async () => {
      const currentUser = await authApi.getCurrentUser();
      if (currentUser) {
        useAuthStore.getState().setUser(currentUser);
      }
      return currentUser;
    },
    enabled: isAuthenticated && !user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * 登录
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const { login, setError } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await authApi.login(credentials);
      return result;
    },
    onSuccess: (data) => {
      login(data.user, data.tokens);
      queryClient.setQueryData(AUTH_KEYS.user(), data.user);
    },
    onError: (error: Error) => {
      setError(error.message || '登录失败');
    },
  });
}

/**
 * 注册
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const { login, setError } = useAuthStore();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const result = await authApi.register(data);
      return result;
    },
    onSuccess: (data) => {
      login(data.user, data.tokens);
      queryClient.setQueryData(AUTH_KEYS.user(), data.user);
    },
    onError: (error: Error) => {
      setError(error.message || '注册失败');
    },
  });
}

/**
 * 登出
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const { logout, tokens } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (tokens?.refreshToken) {
        await authApi.logout(tokens.refreshToken);
      }
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
}

/**
 * 更新用户信息
 */
export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: Parameters<typeof authApi.updateProfile>[1]) => {
      const updatedUser = await authApi.updateProfile(userId, data);
      return updatedUser;
    },
    onSuccess: (data) => {
      updateUser(data);
      queryClient.setQueryData(AUTH_KEYS.user(), data);
      queryClient.setQueryData(AUTH_KEYS.profile(userId), data);
    },
  });
}

/**
 * 检查认证状态
 */
export function useCheckAuth() {
  const { isAuthenticated, setLoading } = useAuthStore();

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const tokens = useAuthStore.getState().tokens;
      if (tokens?.accessToken) {
        const user = await authApi.getCurrentUser();
        if (user) {
          useAuthStore.getState().setUser(user);
          useAuthStore.getState().setAuthenticated(true);
        } else {
          useAuthStore.getState().logout();
        }
      }
    } catch {
      useAuthStore.getState().logout();
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  return { checkAuth, isAuthenticated };
}
