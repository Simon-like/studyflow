import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@studyflow/api';
import { useAuthStore } from '@/stores/authStore';
import type { UserProfile, UpdateProfileRequest, UserStats } from '@studyflow/shared';
import type { ProfileStats } from './types';
import { Clock, Target, Flame, Award } from 'lucide-react';
import toast from 'react-hot-toast';

// Query keys
const PROFILE_KEYS = {
  all: ['profile'] as const,
  detail: () => [...PROFILE_KEYS.all, 'detail'] as const,
  stats: () => [...PROFILE_KEYS.all, 'stats'] as const,
};

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
    staleTime: 5 * 60 * 1000, // 5分钟
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
      // 更新本地缓存
      queryClient.setQueryData(PROFILE_KEYS.detail(), (old: UserProfile | undefined) => {
        if (!old) return old;
        return { ...old, ...data };
      });
      // 更新AuthStore
      setUser(data);
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
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: async (file: File) => {
      const response = await api.user.uploadAvatar(file);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.detail() });
      // 创建临时URL用于预览
      const avatarUrl = URL.createObjectURL(variables);
      if (user) {
        setUser({ ...user, avatar: avatarUrl });
      }
      toast.success('头像上传成功');
    },
    onError: () => {
      toast.error('头像上传失败');
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
    stats: profileStats,
    profile,
    userStats: profile?.stats || stats,
    isLoading: isProfileLoading || isStatsLoading,
  };
}

/**
 * 编辑Profile弹窗Hook
 */
export function useEditProfileModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useProfileData();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const handleSubmit = useCallback(async (data: UpdateProfileRequest) => {
    await updateProfile.mutateAsync(data);
    closeModal();
  }, [updateProfile, closeModal]);

  const handleAvatarChange = useCallback(async (file: File) => {
    await uploadAvatar.mutateAsync(file);
  }, [uploadAvatar]);

  return {
    isOpen,
    openModal,
    closeModal,
    profile,
    isSubmitting: updateProfile.isPending || uploadAvatar.isPending,
    handleSubmit,
    handleAvatarChange,
  };
}
