/**
 * Profile 页面自定义 Hooks
 * 
 * 集成双 Token 认证：
 * - 使用 AuthContext 的 logout 方法
 * - 自动清除 token 并跳转登录页
 * 
 * 数据同步规范（遵循 DATA_SYNC.md）：
 * - 使用统一的 USER_KEYS 进行缓存管理
 * - 更新资料时同步更新全局缓存
 */

import { useState, useCallback, useMemo } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../api';
import { USER_KEYS, useUserProfile, useUserStats } from '../../hooks/useUser';
import type { UpdateProfileRequest, PomodoroSettings, SystemSettings } from '@studyflow/shared';
import { PRESET_USER_TAGS } from '@studyflow/shared';

// 轻量 toast 替代（RN 中 react-hot-toast 不可用）
const toast = {
  success: (msg: string) => Alert.alert('成功', msg),
  error: (msg: string) => Alert.alert('提示', msg),
};

// 设置相关的独立 Query Keys
const SETTINGS_KEYS = {
  pomodoro: ['settings', 'pomodoro'] as const,
  system: ['settings', 'system'] as const,
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
 * 更新用户资料 - 同步更新全局缓存
 * 
 * 注意：此 Hook 与 apps/mobile/src/hooks/useUser.ts 中的版本保持一致
 * 确保所有页面使用相同的缓存更新逻辑
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await api.user.updateProfile(data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // 1. 更新 QueryClient 缓存（统一使用 USER_KEYS）
      queryClient.setQueryData(USER_KEYS.profile(), (old: any) => {
        if (!old) return old;
        
        // 如果更新了tags，从variables中获取最新的tags数据
        const updatedTags = variables.tags || old.tags;
        
        return { ...old, ...data, tags: updatedTags };
      });
      
      // 2. 同时使 stats 缓存失效（因为统计数据可能变化）
      queryClient.invalidateQueries({ queryKey: USER_KEYS.stats() });
      
      toast.success('资料更新成功');
    },
    onError: () => {
      toast.error('资料更新失败');
    },
  });
}

/**
 * 上传头像 - 使统一的用户资料缓存失效
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
      // 使用统一的 USER_KEYS 使缓存失效
      queryClient.invalidateQueries({ queryKey: USER_KEYS.profile() });
      toast.success('头像上传成功');
    },
    onError: () => {
      toast.error('头像上传失败');
    },
  });
}

/**
 * Profile 数据 Hook - 从统一数据源获取
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
    tags: profile?.tags,
    profile,
    stats: profile?.stats || stats,
    isLoading: isProfileLoading || isStatsLoading,
  };
}

/**
 * 番茄钟设置 Hook - 带本地存储同步
 * 
 * 注意：更新设置时同时使 USER_KEYS.profile() 缓存失效
 * 确保设置页面和用户资料页面数据一致
 */
export function usePomodoroSettings() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: SETTINGS_KEYS.pomodoro,
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
    onSuccess: (_, variables) => {
      // 使设置缓存失效
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.pomodoro });
      
      // 同时使统一的 user profile 缓存失效，保持数据一致性
      queryClient.invalidateQueries({ queryKey: USER_KEYS.profile() });
      
      // 同步到本地存储供番茄钟组件使用
      const localSettings = {
        focusDuration: variables.focusDuration,
        shortBreakDuration: variables.shortBreakDuration,
        longBreakDuration: variables.longBreakDuration,
        autoStartBreak: variables.autoStartBreak,
        autoStartPomodoro: variables.autoStartPomodoro,
        longBreakInterval: variables.longBreakInterval,
      };
      AsyncStorage.setItem('pomodoro_settings', JSON.stringify(localSettings)).catch(() => {});
      toast.success('设置已保存，下次专注时生效');
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
 * 系统设置 Hook - 带主题应用
 * 
 * 注意：更新设置时同时使 USER_KEYS.profile() 缓存失效
 * 确保设置页面和用户资料页面数据一致
 */
export function useSystemSettings() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: SETTINGS_KEYS.system,
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
    onSuccess: (_, variables) => {
      // 使设置缓存失效
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.system });
      
      // 同时使统一的 user profile 缓存失效，保持数据一致性
      queryClient.invalidateQueries({ queryKey: USER_KEYS.profile() });
      
      // 应用主题设置到本地存储
      if (variables.theme) {
        AsyncStorage.setItem('theme', variables.theme).catch(() => {});
      }
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
