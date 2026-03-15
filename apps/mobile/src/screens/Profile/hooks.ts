/**
 * Profile 页面自定义 Hooks
 * 
 * 集成双 Token 认证：
 * - 使用 AuthContext 的 logout 方法
 * - 自动清除 token 并跳转登录页
 */

import { useState, useCallback, useMemo } from 'react';
import { Alert, Platform } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../../embedded-packages/api/src';
import type { UpdateProfileRequest, PomodoroSettings, SystemSettings } from '@studyflow/shared';
import toast from 'react-hot-toast';

// Query keys
const PROFILE_KEYS = {
  all: ['profile'] as const,
  detail: () => [...PROFILE_KEYS.all, 'detail'] as const,
  stats: () => [...PROFILE_KEYS.all, 'stats'] as const,
  pomodoroSettings: ['settings', 'pomodoro'] as const,
  systemSettings: ['settings', 'system'] as const,
};

/**
 * Profile 页面主 Hook
 */
export function useProfileScreen() {
  const { logout } = useAuth();
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = useCallback(() => {
    setEditMode(prev => !prev);
  }, []);

  const handleMenuPress = useCallback((label: string) => {
    console.log('Menu pressed:', label);
  }, []);

  const handleLogout = useCallback(async () => {
    const performLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = confirm('确定要退出当前账号吗？');
      if (confirmed) performLogout();
    } else {
      Alert.alert('退出登录', '确定要退出当前账号吗？', [
        { text: '取消', style: 'cancel' },
        { text: '退出', style: 'destructive', onPress: performLogout },
      ]);
    }
  }, [logout]);

  return {
    editMode,
    toggleEditMode,
    handleMenuPress,
    handleLogout,
  };
}

/**
 * 获取用户资料
 */
export function useUserProfile() {
  return useQuery({
    queryKey: PROFILE_KEYS.detail(),
    queryFn: async () => {
      const response = await api.user.getProfile();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 获取用户统计
 */
export function useUserStats() {
  return useQuery({
    queryKey: PROFILE_KEYS.stats(),
    queryFn: async () => {
      const response = await api.user.getUserStats();
      return response.data;
    },
    staleTime: 60 * 1000,
  });
}

/**
 * 更新用户资料
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await api.user.updateProfile(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.detail() });
      toast.success('资料更新成功');
    },
    onError: () => {
      toast.error('资料更新失败');
    },
  });
}

/**
 * 上传头像
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: { uri: string; name: string; type: string }) => {
      // React Native 中使用 FormData
      const formData = new FormData();
      formData.append('avatar', file as any);
      const response = await api.user.uploadAvatar(formData as any);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.detail() });
      toast.success('头像上传成功');
    },
    onError: () => {
      toast.error('头像上传失败');
    },
  });
}

/**
 * Profile 数据 Hook
 */
export function useProfileData() {
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const { data: stats, isLoading: isStatsLoading } = useUserStats();

  const displayName = useMemo(() => {
    return profile?.nickname || profile?.username || '学习者';
  }, [profile]);

  const avatarUrl = useMemo(() => {
    return profile?.avatar;
  }, [profile]);

  const studyGoal = useMemo(() => {
    return profile?.studyGoal || '暂无学习目标';
  }, [profile]);

  const subtitle = useMemo(() => {
    const streak = profile?.stats?.currentStreak || stats?.currentStreak || 0;
    return `${studyGoal} · 坚持 ${streak} 天`;
  }, [studyGoal, profile, stats]);

  return {
    displayName,
    avatarUrl,
    studyGoal,
    subtitle,
    profile,
    stats: profile?.stats || stats,
    isLoading: isProfileLoading || isStatsLoading,
  };
}

/**
 * 番茄钟设置 Hook
 */
export function usePomodoroSettings() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: PROFILE_KEYS.pomodoroSettings,
    queryFn: async () => {
      const response = await api.user.getPomodoroSettings();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async (settings: PomodoroSettings) => {
      const response = await api.user.updatePomodoroSettings(settings);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.pomodoroSettings });
      toast.success('设置已保存');
    },
    onError: () => {
      toast.error('设置保存失败');
    },
  });

  return {
    settings: data,
    isLoading,
    updateSettings: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}

/**
 * 系统设置 Hook
 */
export function useSystemSettings() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: PROFILE_KEYS.systemSettings,
    queryFn: async () => {
      const response = await api.user.getSystemSettings();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async (settings: SystemSettings) => {
      const response = await api.user.updateSystemSettings(settings);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.systemSettings });
      toast.success('设置已保存');
    },
    onError: () => {
      toast.error('设置保存失败');
    },
  });

  return {
    settings: data,
    isLoading,
    updateSettings: mutation.mutate,
    isUpdating: mutation.isPending,
  };
}

/**
 * 修改密码 Hook
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await api.user.changePassword({
        ...data,
        confirmPassword: data.newPassword,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('密码修改成功');
    },
    onError: () => {
      toast.error('密码修改失败');
    },
  });
}
