/**
 * Stats 屏幕 Hooks
 *
 * 参照 web 实现，支持周/月/年三种粒度的柱状图
 * - 周：按天（7天）
 * - 月：按周聚合
 * - 年：按月聚合
 */

import { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import type { StatsPeriod, OverviewStats, DailyStat, UserStats } from '@studyflow/shared';

export type Period = 'week' | 'month' | 'year';

export interface ChartItem {
  label: string;
  hours: number;
  pomodoros: number;
}

// ==================== Query Keys ====================

const STATS_KEYS = {
  all: ['stats'] as const,
  overview: (period: StatsPeriod) => ['stats', 'overview', period] as const,
  daily: (start: string, end: string) => ['stats', 'daily', start, end] as const,
  userStats: () => ['user', 'stats'] as const,
};

// ==================== Stats 屏幕主 Hook ====================

export function useStatsScreen() {
  const [period, setPeriod] = useState<Period>('week');
  const queryClient = useQueryClient();

  const statsPeriod: StatsPeriod = period;

  // 根据周期计算日期范围
  const dateRange = useMemo(() => getDateRangeByPeriod(period), [period]);

  // 总览统计
  const { data: overviewStats, isLoading: isOverviewLoading } = useQuery<OverviewStats>({
    queryKey: STATS_KEYS.overview(statsPeriod),
    queryFn: async () => {
      const res = await api.stats.getOverview(statsPeriod);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // 周期内每日统计（用于柱状图聚合）
  const { data: dailyStats, isLoading: isDailyLoading } = useQuery<DailyStat[]>({
    queryKey: STATS_KEYS.daily(dateRange.startDate, dateRange.endDate),
    queryFn: async () => {
      const res = await api.stats.getDaily(dateRange.startDate, dateRange.endDate);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
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

  // 柱状图数据：按周期聚合
  const chartData = useMemo((): ChartItem[] => {
    if (!dailyStats) return [];

    if (period === 'week') {
      const WEEK_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      return dailyStats.map((item, index) => ({
        label: WEEK_LABELS[index] || item.date.slice(5),
        hours: Math.round((item.focusMinutes / 60) * 10) / 10,
        pomodoros: item.pomodoros,
      }));
    }

    if (period === 'month') {
      return aggregateByWeek(dailyStats);
    }

    return aggregateByMonth(dailyStats);
  }, [dailyStats, period]);

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

  const isLoading = isOverviewLoading || isDailyLoading || isUserStatsLoading;

  return {
    period,
    setPeriod,
    chartData,
    overviewData,
    userStats,
    isLoading,
    refreshAllStats,
  };
}

// ==================== 聚合函数 ====================

/** 月视图：按自然周聚合 */
function aggregateByWeek(dailyStats: DailyStat[]): ChartItem[] {
  const weeks = new Map<number, { pomodoros: number; minutes: number }>();

  for (const item of dailyStats) {
    const date = new Date(`${item.date}T00:00:00`);
    const weekNum = getWeekOfMonth(date);
    const existing = weeks.get(weekNum);
    if (existing) {
      existing.pomodoros += item.pomodoros;
      existing.minutes += item.focusMinutes;
    } else {
      weeks.set(weekNum, { pomodoros: item.pomodoros, minutes: item.focusMinutes });
    }
  }

  return Array.from(weeks.entries())
    .sort(([a], [b]) => a - b)
    .map(([weekNum, data]) => ({
      label: `第${weekNum}周`,
      hours: Math.round((data.minutes / 60) * 10) / 10,
      pomodoros: data.pomodoros,
    }));
}

function getWeekOfMonth(date: Date): number {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = firstDay.getDay() || 7;
  return Math.ceil((date.getDate() + dayOfWeek - 1) / 7);
}

/** 年视图：按月聚合 */
function aggregateByMonth(dailyStats: DailyStat[]): ChartItem[] {
  const months = new Map<number, { pomodoros: number; minutes: number }>();

  for (const item of dailyStats) {
    const date = new Date(`${item.date}T00:00:00`);
    const month = date.getMonth();
    const existing = months.get(month);
    if (existing) {
      existing.pomodoros += item.pomodoros;
      existing.minutes += item.focusMinutes;
    } else {
      months.set(month, { pomodoros: item.pomodoros, minutes: item.focusMinutes });
    }
  }

  const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  return Array.from(months.entries())
    .sort(([a], [b]) => a - b)
    .map(([month, data]) => ({
      label: MONTH_LABELS[month],
      hours: Math.round((data.minutes / 60) * 10) / 10,
      pomodoros: data.pomodoros,
    }));
}

// ==================== 工具函数 ====================

function getDateRangeByPeriod(period: Period): { startDate: string; endDate: string } {
  const now = new Date();

  if (period === 'week') {
    const dayOfWeek = now.getDay();
    const start = new Date(now);
    start.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { startDate: formatDate(start), endDate: formatDate(end) };
  }

  if (period === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startDate: formatDate(start), endDate: formatDate(end) };
  }

  // year
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31);
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
