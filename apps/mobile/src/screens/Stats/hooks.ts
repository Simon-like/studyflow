/**
 * Stats 屏幕 Hooks
 *
 * 使用移动端 api（AsyncStorage + axios，兼容 RN）
 */

import { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import type { StatsPeriod, OverviewStats, DailyStat, SubjectStat, UserStats } from '@studyflow/shared';

export type Period = 'week' | 'month' | 'year';

// ==================== Query Keys ====================

const STATS_KEYS = {
  all: ['stats'] as const,
  overview: (period: StatsPeriod) => ['stats', 'overview', period] as const,
  daily: (start: string, end: string) => ['stats', 'daily', start, end] as const,
  subjects: (period: StatsPeriod) => ['stats', 'subjects', period] as const,
  userStats: () => ['user', 'stats'] as const,
};

// ==================== Stats 屏幕主 Hook ====================

export function useStatsScreen() {
  const [period, setPeriod] = useState<Period>('week');
  const queryClient = useQueryClient();

  const statsPeriod: StatsPeriod = period;

  // 总览统计
  const { data: overviewStats, isLoading: isOverviewLoading } = useQuery<OverviewStats>({
    queryKey: STATS_KEYS.overview(statsPeriod),
    queryFn: async () => {
      const res = await api.stats.getOverview(statsPeriod);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // 本周每日统计
  const { startDate, endDate } = getWeekRange();
  const { data: dailyStats, isLoading: isDailyLoading } = useQuery<DailyStat[]>({
    queryKey: STATS_KEYS.daily(startDate, endDate),
    queryFn: async () => {
      const res = await api.stats.getDaily(startDate, endDate);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // 学科分布
  const { data: subjectStats, isLoading: isSubjectLoading } = useQuery<SubjectStat[]>({
    queryKey: STATS_KEYS.subjects(statsPeriod),
    queryFn: async () => {
      const res = await api.stats.getSubjects(statsPeriod);
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  // 用户累计统计
  const { data: userStats, isLoading: isUserStatsLoading } = useQuery<UserStats>({
    queryKey: STATS_KEYS.userStats(),
    queryFn: async () => {
      const res = await api.user.getUserStats();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // 刷新所有统计
  const refreshAllStats = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: STATS_KEYS.all });
    queryClient.invalidateQueries({ queryKey: STATS_KEYS.userStats() });
  }, [queryClient]);

  // 柱状图数据（小时）
  const weeklyData = useMemo(() => {
    if (!dailyStats) return [];
    return dailyStats.map((item) => item.focusMinutes / 60);
  }, [dailyStats]);

  // 学科分布数据
  const subjectDistribution = useMemo(() => {
    if (!subjectStats) return [];
    return subjectStats.map((item) => ({
      name: item.category,
      value: Math.round(item.percentage),
      hours: Math.round((item.focusMinutes / 60) * 10) / 10,
    }));
  }, [subjectStats]);

  // 总览
  const overviewData = useMemo(() => {
    if (!overviewStats) return null;
    return {
      focusHours: Math.round((overviewStats.focusMinutes / 60) * 10) / 10,
      pomodoros: overviewStats.completedPomodoros,
      tasks: overviewStats.completedTasks,
      streakDays: overviewStats.streakDays,
    };
  }, [overviewStats]);

  const isLoading = isOverviewLoading || isDailyLoading || isSubjectLoading || isUserStatsLoading;

  return {
    period,
    setPeriod,
    weeklyData,
    subjectDistribution,
    overviewData,
    userStats,
    isLoading,
    refreshAllStats,
  };
}

// ==================== 工具函数 ====================

function getWeekRange(): { startDate: string; endDate: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { startDate: formatDate(start), endDate: formatDate(end) };
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatStudyTime(minutes: number): string {
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours}小时` : `${hours}小时${mins}分钟`;
}

export function getPeriodText(period: Period): string {
  const map: Record<Period, string> = { week: '本周', month: '本月', year: '本年' };
  return map[period];
}
