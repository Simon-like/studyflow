import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@studyflow/api';
import { useAuthStore } from '@/stores/authStore';
import { USER_KEYS } from '@/hooks';
import type { UserProfile, UpdateProfileRequest, UserStats } from '@studyflow/shared';
import type { ProfileStats } from './types';
import { Clock, Target, Flame, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '@/lib/utils';

// Profile 模块专用 Query keys
const PROFILE_KEYS = {
  all: ['profile'] as const,
  stats: () => [...PROFILE_KEYS.all, 'stats'] as const,
};

/**
 * 获取用户资料（使用统一的 USER_KEYS 以保持缓存一致性）
 * 推荐使用 useUser hook 代替
 */
export function useUserProfile() {
  return useQuery({
    queryKey: USER_KEYS.profile(),
    queryFn: async () => {
      const response = await api.user.getProfile();
      return response.data;
    },
    staleTime: 60 * 1000, // 1分钟
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
    staleTime: 60 * 1000, // 1分钟
  });
}

/**
 * 更新用户资料
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await api.user.updateProfile(data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(USER_KEYS.profile(), (old: UserProfile | undefined) => {
        if (!old) return old;
        // 使用后端返回的数据更新缓存
        return { ...old, ...data };
      });
      // 同时使 profile 模块的 stats 缓存失效
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.stats() });
      // 更新AuthStore
      setUser(data);
      toast.success('资料更新成功');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, '资料更新失败'));
    },
  });
}

/**
 * 上传头像
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (file: File) => {
      const response = await api.user.uploadAvatar(file);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.profile() });
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.stats() });
      // 使用返回的 URL 更新本地用户状态
      if (user && data.avatarUrl) {
        setUser({ ...user, avatar: data.avatarUrl });
      }
      toast.success('头像上传成功');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, '头像上传失败'));
    },
  });
}

/**
 * Profile页面数据Hook
 */
export function useProfileData() {
  const { user } = useAuthStore();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const { data: stats, isLoading: isStatsLoading } = useUserStats();

  const displayName = useMemo(() => {
    return profile?.nickname || profile?.username || user?.nickname || user?.username || '学习者';
  }, [profile, user]);

  const avatarUrl = useMemo(() => {
    return profile?.avatar || user?.avatar;
  }, [profile, user]);

  const studyGoal = useMemo(() => {
    return profile?.studyGoal || '暂无学习目标';
  }, [profile]);

  const profileStats: ProfileStats[] = useMemo(() => {
    const userStats = profile?.stats || stats;
    if (!userStats) return [];

    return [
      {
        icon: Clock,
        label: '累计学习',
        value: `${Math.floor((userStats.totalFocusMinutes || 0) / 60)}h`,
        color: 'coral',
      },
      {
        icon: Target,
        label: '完成番茄',
        value: String(userStats.totalPomodoros || 0),
        color: 'sage',
      },
      {
        icon: Flame,
        label: '连续打卡',
        value: `${userStats.currentStreak || 0}天`,
        color: 'coral',
      },
      {
        icon: Award,
        label: '获得成就',
        value: '3个', // TODO: 接入真实成就数据
        color: 'sage',
      },
    ];
  }, [profile, stats]);

  return {
    displayName,
    avatarUrl,
    studyGoal,
    tags: profile?.tags,
    stats: profileStats,
    profile,
    userStats: profile?.stats || stats,
    isLoading: isProfileLoading || isStatsLoading,
  };
}


