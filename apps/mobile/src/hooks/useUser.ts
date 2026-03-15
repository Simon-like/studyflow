/**
 * 统一的用户数据 Hook
 * 
 * 遵循 DATA_SYNC.md 规范：
 * - 所有页面使用统一的数据源
 * - 支持缓存同步
 * - 提供计算属性 (displayName, avatarUrl)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@studyflow/api';
import type { UserProfile, UpdateProfileRequest, PomodoroSettings, SystemSettings } from '@studyflow/shared';
import { PRESET_USER_TAGS } from '@studyflow/shared';
import { useAuth } from '../contexts/AuthContext';

// ==================== Query Keys ====================
export const USER_KEYS = {
  all: ['user'] as const,
  profile: () => [...USER_KEYS.all, 'profile'] as const,
  stats: () => [...USER_KEYS.all, 'stats'] as const,
};

// ==================== 获取用户资料 ====================

export function useUserProfile() {
  return useQuery({
    queryKey: USER_KEYS.profile(),
    queryFn: async () => {
      const response = await api.user.getProfile();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5分钟内数据视为新鲜
    // 注意：不设置 refetchOnMount，使用默认行为
    // 缓存数据优先，避免频繁请求覆盖本地更新
  });
}

// ==================== 更新用户资料 ====================

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await api.user.updateProfile(data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // 1. 更新 QueryClient 缓存 - 立即更新本地数据
      queryClient.setQueryData(USER_KEYS.profile(), (old: UserProfile | undefined) => {
        if (!old) return old;
        
        // 如果更新了tags，从variables中获取最新的tags数据
        const updatedTags = variables.tags 
          ? PRESET_USER_TAGS
              .filter(tag => variables.tags?.includes(tag.id))
              .map(tag => ({ ...tag, unlockedAt: new Date().toISOString() }))
          : old.tags;
        
        return { ...old, ...data, tags: updatedTags };
      });
      
      // 2. 同时使 stats 缓存失效（因为统计数据可能变化）
      queryClient.invalidateQueries({ queryKey: USER_KEYS.stats() });
    },
  });
}

// ==================== 统一的用户数据 Hook ====================

interface UseUserReturn {
  // 用户数据
  user: UserProfile | null | undefined;
  isLoading: boolean;
  error: Error | null;
  
  // 计算属性
  displayName: string;
  avatarUrl: string | undefined;
  studyGoal: string;
  tags: UserProfile['tags'];
  stats: UserProfile['stats'] | null;
  
  // 设置数据
  pomodoroSettings: {
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    autoStartBreak: boolean;
    autoStartPomodoro: boolean;
    longBreakInterval: number;
  } | null;
  systemSettings: {
    theme: 'light' | 'dark' | 'system';
    notificationEnabled: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    language: string;
  } | null;
  
  // 方法
  refetch: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  isUpdating: boolean;
}

export function useUser(): UseUserReturn {
  const { data: profile, isLoading, error, refetch: refetchProfile } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();

  // 计算显示名称（nickname > username > 默认值）
  const displayName = profile?.nickname || profile?.username || '学习者';
  
  // 头像URL
  const avatarUrl = profile?.avatar;
  
  // 学习目标
  const studyGoal = profile?.studyGoal || '暂无学习目标';
  
  // 用户标签
  const tags = profile?.tags;
  
  // 统计数据
  const stats = profile?.stats ?? null;

  // 番茄钟设置
  const pomodoroSettings = profile ? {
    focusDuration: profile.focusDuration,
    shortBreakDuration: profile.shortBreakDuration,
    longBreakDuration: profile.longBreakDuration,
    autoStartBreak: profile.autoStartBreak,
    autoStartPomodoro: profile.autoStartPomodoro,
    longBreakInterval: profile.longBreakInterval,
  } : null;

  // 系统设置
  const systemSettings = profile ? {
    theme: profile.theme,
    notificationEnabled: profile.notificationEnabled,
    soundEnabled: profile.soundEnabled,
    vibrationEnabled: profile.vibrationEnabled,
    language: profile.language,
  } : null;

  // 重新获取数据
  const refetch = async () => {
    await refetchProfile();
  };

  // 更新资料
  const updateProfile = async (data: UpdateProfileRequest) => {
    await updateProfileMutation.mutateAsync(data);
  };

  return {
    user: profile,
    isLoading,
    error,
    displayName,
    avatarUrl,
    studyGoal,
    tags,
    stats,
    pomodoroSettings,
    systemSettings,
    refetch,
    updateProfile,
    isUpdating: updateProfileMutation.isPending,
  };
}

// ==================== 获取用户统计 ====================

export function useUserStats() {
  return useQuery({
    queryKey: USER_KEYS.stats(),
    queryFn: async () => {
      const response = await api.user.getUserStats();
      return response.data;
    },
    staleTime: 60 * 1000, // 1分钟
  });
}


