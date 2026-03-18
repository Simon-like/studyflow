import { useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@studyflow/api';
import { useAuthStore } from '@/stores/authStore';
import type { UserProfile, UserStats } from '@studyflow/shared';
import { Clock, Target, Flame, Award } from 'lucide-react';
import type { ProfileStats } from '@/features/profile/types';

// Query keys
const USER_KEYS = {
  all: ['user'] as const,
  profile: () => [...USER_KEYS.all, 'profile'] as const,
};

/**
 * 统一的用户数据 Hook
 * 从 API 获取最新用户资料，同时保持 authStore 同步
 * 所有页面都应该使用这个 hook 来获取用户信息
 */
export function useUser() {
  const { user: authUser, setUser, logout } = useAuthStore();
  const queryClient = useQueryClient();

  // 从 API 获取完整用户资料
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: USER_KEYS.profile(),
    queryFn: async () => {
      const response = await api.user.getProfile();
      return response.data;
    },
    staleTime: 60 * 1000, // 1分钟
    // 使用 placeholderData 而不是 initialData，确保始终会发起请求获取最新数据
    placeholderData: authUser as UserProfile | undefined,
  });

  // 当 profile 数据更新时，同步到 authStore
  useEffect(() => {
    if (profile && JSON.stringify(profile) !== JSON.stringify(authUser)) {
      setUser(profile);
    }
  }, [profile, authUser, setUser]);

  // 派生数据
  const displayName = useMemo(() => {
    return profile?.nickname || profile?.username || authUser?.nickname || authUser?.username || '同学';
  }, [profile, authUser]);

  const avatarUrl = useMemo(() => {
    return profile?.avatar || authUser?.avatar;
  }, [profile, authUser]);

  const studyGoal = useMemo(() => {
    return profile?.studyGoal || '暂无学习目标';
  }, [profile]);

  // 格式化后的统计信息（用于 Profile 页面）
  const profileStats: ProfileStats[] = useMemo(() => {
    const stats = profile?.stats;
    if (!stats) return [];

    return [
      {
        icon: Clock,
        label: '累计学习',
        value: `${Math.floor((stats.totalFocusMinutes || 0) / 60)}h`,
        color: 'coral',
      },
      {
        icon: Target,
        label: '完成番茄',
        value: String(stats.totalPomodoros || 0),
        color: 'sage',
      },
      {
        icon: Flame,
        label: '连续打卡',
        value: `${stats.currentStreak || 0}天`,
        color: 'coral',
      },
      {
        icon: Award,
        label: '获得成就',
        value: `${countUnlockedAchievements(stats)}个`,
        color: 'sage',
      },
    ];
  }, [profile]);

  // 手动同步用户数据（在更新后调用）
  const syncUser = (updatedUser: Partial<UserProfile>) => {
    // 更新 queryClient 缓存
    queryClient.setQueryData(USER_KEYS.profile(), (old: UserProfile | undefined) => {
      if (!old) return old;
      return { ...old, ...updatedUser };
    });
    // 更新 authStore
    if (updatedUser) {
      setUser({ ...authUser, ...updatedUser } as UserProfile);
    }
  };

  return {
    // 完整用户资料
    user: profile,
    // 简化字段
    displayName,
    avatarUrl,
    studyGoal,
    tags: profile?.tags,
    stats: profileStats,
    rawStats: profile?.stats,
    // 设置
    pomodoroSettings: profile
      ? {
          focusDuration: profile.focusDuration,
          breakDuration: profile.breakDuration ?? profile.shortBreakDuration ?? 300,
          shortBreakDuration: profile.shortBreakDuration,
          longBreakDuration: profile.longBreakDuration,
          autoStartBreak: profile.autoStartBreak,
          autoStartPomodoro: profile.autoStartPomodoro,
          longBreakInterval: profile.longBreakInterval,
        }
      : undefined,
    systemSettings: profile
      ? {
          theme: profile.theme,
          notificationEnabled: profile.notificationEnabled,
          soundEnabled: profile.soundEnabled,
          vibrationEnabled: profile.vibrationEnabled,
          language: profile.language,
        }
      : undefined,
    // 状态
    isLoading,
    error,
    // 操作
    refetch,
    syncUser,
    logout,
  };
}

/** 与 Achievements 组件保持一致的成就解锁条件 */
function countUnlockedAchievements(stats: UserStats): number {
  const checks: ((s: UserStats) => boolean)[] = [
    (s) => s.totalFocusMinutes >= 60,
    (s) => s.completedTasks >= 10,
    (s) => s.longestStreak >= 7,
    (s) => s.totalFocusMinutes >= 6000,
    (s) => s.totalPomodoros >= 100,
    (s) => s.studyDays >= 30,
  ];
  return checks.filter((check) => check(stats)).length;
}

// 导出 query keys 供其他 hooks 使用
export { USER_KEYS };
