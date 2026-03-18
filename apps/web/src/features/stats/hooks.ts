import { useState, useMemo, useCallback } from 'react';
import type { Period } from './types';
import type { StatsPeriod } from '@studyflow/shared';
import {
  useOverviewStats,
  useDailyStats,
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

  // 刷新统计数据
  const { refreshAllStats } = useRefreshStats();

  // 转换柱状图数据：周=按天，月=按周聚合，年=按月聚合
  const chartData = useMemo(() => {
    if (!dailyStats) return [];

    if (period === 'week') {
      return dailyStats.map((item, index) => ({
        day: formatChartDayLabel(item.date, period, index),
        pomodoros: item.pomodoros,
        hours: Math.round((item.focusMinutes / 60) * 10) / 10,
      }));
    }

    if (period === 'month') {
      return aggregateByWeek(dailyStats);
    }

    // year
    return aggregateByMonth(dailyStats);
  }, [dailyStats, period]);

  // 计算最大番茄数（用于柱状图高度计算）
  const maxPomodoros = useMemo(() => {
    if (chartData.length === 0) return 1;
    return Math.max(...chartData.map((d) => d.pomodoros), 1);
  }, [chartData]);

  // 基于真实 dailyStats 生成热力图数据（近365天）
  // 打卡逻辑：当天有番茄钟记录或任务完成记录即视为打卡
  const heatmapData = useMemo(() => {
    const dailyMap = new Map(
      (dailyStats || []).map((item) => [item.date, item])
    );
    const today = new Date();

    return Array.from({ length: 365 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (364 - i));
      const dateKey = formatDate(date);
      const dayData = dailyMap.get(dateKey);
      const checkedIn = dayData
        ? (dayData.pomodoros > 0 || dayData.focusMinutes > 0)
        : false;

      return {
        day: i + 1,
        value: checkedIn ? 1 : 0,
        label: checkedIn ? `${dateKey}: 已打卡` : `${dateKey}: 未打卡`,
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

    return overviewHasData || chartHasData;
  }, [overviewStats, chartData]);

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
    ]);
  }, [refreshAllStats, refetchOverview, refetchDaily]);

  // 是否正在加载
  const isLoading = isOverviewLoading || isDailyLoading;

  return {
    period,
    setPeriod: handlePeriodChange,
    chartData,
    maxPomodoros,
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
        { icon: 'Clock', label: '学习时长', value: '--', change: '--', isPositive: true },
        { icon: 'Target', label: '日均学习', value: '--', change: '--', isPositive: true },
        { icon: 'CheckCircle', label: '完成任务', value: '--', change: '--', isPositive: true },
        { icon: 'Flame', label: '连续打卡', value: '--', change: '--', isPositive: true },
      ];
    }

    const {
      focusMinutes = 0,
      completedTasks = 0,
      streakDays = 0,
      compareLastPeriod = {},
    } = overviewStats;

    // 将分钟转换为小时显示
    const hours = Math.round((focusMinutes / 60) * 10) / 10;
    // 日均学习时长（基于打卡天数，避免除0）
    const activeDays = streakDays || 1;
    const avgHours = Math.round((hours / activeDays) * 10) / 10;

    return [
      {
        icon: 'Clock',
        label: '学习时长',
        value: `${hours}h`,
        change: compareLastPeriod.focusMinutes || '+0%',
        isPositive: (compareLastPeriod.focusMinutes || '').startsWith('+'),
      },
      {
        icon: 'Target',
        label: '日均学习',
        value: `${avgHours}h`,
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

/** 月视图：按自然周聚合 dailyStats */
function aggregateByWeek(dailyStats: { date: string; pomodoros: number; focusMinutes: number }[]) {
  const weeks: Map<number, { pomodoros: number; minutes: number; startDate: string }> = new Map();

  for (const item of dailyStats) {
    const date = new Date(`${item.date}T00:00:00`);
    const weekNum = getWeekOfMonth(date);
    const existing = weeks.get(weekNum);
    if (existing) {
      existing.pomodoros += item.pomodoros;
      existing.minutes += item.focusMinutes;
    } else {
      weeks.set(weekNum, { pomodoros: item.pomodoros, minutes: item.focusMinutes, startDate: item.date });
    }
  }

  return Array.from(weeks.entries())
    .sort(([a], [b]) => a - b)
    .map(([weekNum, data]) => ({
      day: `第${weekNum}周`,
      pomodoros: data.pomodoros,
      hours: Math.round((data.minutes / 60) * 10) / 10,
    }));
}

function getWeekOfMonth(date: Date): number {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = firstDay.getDay() || 7; // Monday = 1
  return Math.ceil((date.getDate() + dayOfWeek - 1) / 7);
}

/** 年视图：按月聚合 dailyStats */
function aggregateByMonth(dailyStats: { date: string; pomodoros: number; focusMinutes: number }[]) {
  const months: Map<number, { pomodoros: number; minutes: number }> = new Map();

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

  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  return Array.from(months.entries())
    .sort(([a], [b]) => a - b)
    .map(([month, data]) => ({
      day: monthNames[month],
      pomodoros: data.pomodoros,
      hours: Math.round((data.minutes / 60) * 10) / 10,
    }));
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
