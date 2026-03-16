import { useState, useMemo, useCallback } from 'react';
import type { Period } from './types';
import type { StatsPeriod } from '@studyflow/shared';
import {
  useOverviewStats,
  useDailyStats,
  useSubjectStats,
  useRefreshStats,
} from '@studyflow/api';

/**
 * Stats 页面主 Hook
 *
 * 接入真实统计数据，支持周期切换
 */
export function useStats() {
  const [period, setPeriod] = useState<Period>('week');

  // 将 Period 转换为 StatsPeriod
  const statsPeriod: StatsPeriod = period === 'week'
    ? 'week'
    : period === 'month'
      ? 'month'
      : period === 'year'
        ? 'year'
        : 'today';

  const dateRange = useMemo(() => getDateRangeByPeriod(period), [period]);

  // 获取总览统计数据
  const {
    data: overviewStats,
    isLoading: isOverviewLoading,
    refetch: refetchOverview,
  } = useOverviewStats({ period: statsPeriod });

  // 获取周期内每日统计数据（用于柱状图）
  const {
    data: dailyStats,
    isLoading: isDailyLoading,
    refetch: refetchDaily,
  } = useDailyStats({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  // 获取学科分布统计数据
  const {
    data: subjectStats,
    isLoading: isSubjectLoading,
    refetch: refetchSubjects,
  } = useSubjectStats({ period: statsPeriod });

  // 刷新统计数据
  const { refreshAllStats } = useRefreshStats();

  // 转换柱状图数据
  const chartData = useMemo(() => {
    if (!dailyStats) return [];

    return dailyStats.map((item, index) => ({
      day: formatChartDayLabel(item.date, period, index),
      pomodoros: item.pomodoros,
      hours: Math.round((item.focusMinutes / 60) * 10) / 10,
    }));
  }, [dailyStats, period]);

  // 计算最大番茄数（用于柱状图高度计算）
  const maxPomodoros = useMemo(() => {
    if (chartData.length === 0) return 1;
    return Math.max(...chartData.map((d) => d.pomodoros), 1);
  }, [chartData]);

  // 转换学科分布数据
  const subjectData = useMemo(() => {
    if (!subjectStats) return [];

    const colors = ['bg-coral', 'bg-sage', 'bg-coral/60', 'bg-sage/60', 'bg-coral/40'];
    return subjectStats.map((item, index) => ({
      name: item.category,
      hours: Math.round((item.focusMinutes / 60) * 10) / 10,
      percent: Math.round(item.percentage),
      color: colors[index % colors.length],
    }));
  }, [subjectStats]);

  // 基于真实 dailyStats 生成热力图数据（近365天）
  const heatmapData = useMemo(() => {
    const dailyMap = new Map((dailyStats || []).map((item) => [item.date, item.focusMinutes]));
    const today = new Date();

    return Array.from({ length: 365 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (364 - i));
      const dateKey = formatDate(date);
      const minutes = dailyMap.get(dateKey) || 0;

      return {
        day: i + 1,
        value: toHeatLevel(minutes),
      };
    });
  }, [dailyStats]);

  const hasAnyData = useMemo(() => {
    const overviewHasData = !!overviewStats && (
      overviewStats.focusMinutes > 0 ||
      overviewStats.completedPomodoros > 0 ||
      overviewStats.completedTasks > 0
    );

    const chartHasData = chartData.some((item) => item.pomodoros > 0 || item.hours > 0);
    const subjectHasData = subjectData.length > 0;

    return overviewHasData || chartHasData || subjectHasData;
  }, [overviewStats, chartData, subjectData]);

  // 处理周期切换
  const handlePeriodChange = useCallback((key: string) => {
    setPeriod(key as Period);
  }, []);

  // 刷新所有数据
  const refetch = useCallback(async () => {
    refreshAllStats();
    await Promise.all([
      refetchOverview(),
      refetchDaily(),
      refetchSubjects(),
    ]);
  }, [refreshAllStats, refetchOverview, refetchDaily, refetchSubjects]);

  // 是否正在加载
  const isLoading = isOverviewLoading || isDailyLoading || isSubjectLoading;

  return {
    period,
    setPeriod: handlePeriodChange,
    chartData,
    maxPomodoros,
    subjectData,
    heatmapData,
    overviewStats,
    isLoading,
    hasAnyData,
    refetch,
    refreshAllStats: refetch,
  };
}

/**
 * 总览卡片数据 Hook
 *
 * 将 API 数据转换为卡片展示格式
 */
export function useOverviewCards(overviewStats?: {
  focusMinutes?: number;
  completedPomodoros?: number;
  completedTasks?: number;
  streakDays?: number;
  compareLastPeriod?: {
    focusMinutes?: string;
    pomodoros?: string;
    tasks?: string;
  };
}) {
  return useMemo(() => {
    if (!overviewStats) {
      return [
        { icon: 'Clock', label: '专注时长', value: '--', change: '--', isPositive: true },
        { icon: 'Target', label: '番茄完成', value: '--', change: '--', isPositive: true },
        { icon: 'CheckCircle', label: '完成任务', value: '--', change: '--', isPositive: true },
        { icon: 'Flame', label: '连续打卡', value: '--', change: '--', isPositive: true },
      ];
    }

    const {
      focusMinutes = 0,
      completedPomodoros = 0,
      completedTasks = 0,
      streakDays = 0,
      compareLastPeriod = {},
    } = overviewStats;

    // 将分钟转换为小时显示
    const hours = Math.round((focusMinutes / 60) * 10) / 10;

    return [
      {
        icon: 'Clock',
        label: '专注时长',
        value: `${hours}h`,
        change: compareLastPeriod.focusMinutes || '+0%',
        isPositive: (compareLastPeriod.focusMinutes || '').startsWith('+'),
      },
      {
        icon: 'Target',
        label: '番茄完成',
        value: String(completedPomodoros),
        change: compareLastPeriod.pomodoros || '+0%',
        isPositive: (compareLastPeriod.pomodoros || '').startsWith('+'),
      },
      {
        icon: 'CheckCircle',
        label: '完成任务',
        value: String(completedTasks),
        change: compareLastPeriod.tasks || '+0%',
        isPositive: (compareLastPeriod.tasks || '').startsWith('+'),
      },
      {
        icon: 'Flame',
        label: '连续打卡',
        value: `${streakDays}天`,
        change: '保持中',
        isPositive: true,
      },
    ];
  }, [overviewStats]);
}

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

  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31);
  return { startDate: formatDate(start), endDate: formatDate(end) };
}

function formatChartDayLabel(dateText: string, period: Period, index: number): string {
  if (period === 'week') {
    const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    return weekDays[index] || dateText.slice(5);
  }

  const date = new Date(`${dateText}T00:00:00`);
  if (period === 'month') {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  return `${date.getMonth() + 1}月`;
}

function toHeatLevel(focusMinutes: number): number {
  if (focusMinutes <= 0) return 0;
  if (focusMinutes < 30) return 1;
  if (focusMinutes < 60) return 2;
  if (focusMinutes < 120) return 3;
  if (focusMinutes < 180) return 4;
  return 5;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
