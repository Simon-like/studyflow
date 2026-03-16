/**
 * Stats 屏幕 Hooks
 * 
 * 接入真实统计数据
 */

import { useState, useMemo, useCallback } from 'react';
import { 
  useOverviewStats, 
  useWeeklyDailyStats, 
  useSubjectStats,
  useUserStats,
  useRefreshStats,
} from '@studyflow/api';
import type { StatsPeriod } from '@studyflow/shared';

export type Period = 'week' | 'month' | 'year';

/**
 * Stats 屏幕主 Hook
 */
export function useStatsScreen() {
  const [period, setPeriod] = useState<Period>('week');
  
  // 将 Period 转换为 StatsPeriod
  const statsPeriod: StatsPeriod = period === 'week' ? 'week' : 
                                   period === 'month' ? 'month' : 'year';

  // 获取总览统计数据
  const { 
    data: overviewStats, 
    isLoading: isOverviewLoading,
  } = useOverviewStats({ period: statsPeriod });

  // 获取本周每日统计数据
  const { 
    data: dailyStats, 
    isLoading: isDailyLoading,
  } = useWeeklyDailyStats();

  // 获取学科分布统计数据
  const { 
    data: subjectStats, 
    isLoading: isSubjectLoading,
  } = useSubjectStats({ period: statsPeriod });

  // 获取用户累计统计数据
  const {
    data: userStats,
    isLoading: isUserStatsLoading,
  } = useUserStats();

  // 刷新统计数据
  const { refreshAllStats } = useRefreshStats();

  // 转换柱状图数据
  const weeklyData = useMemo(() => {
    if (!dailyStats) return [];
    return dailyStats.map((item) => item.focusMinutes / 60); // 转换为小时
  }, [dailyStats]);

  // 转换学科分布数据
  const subjectDistribution = useMemo(() => {
    if (!subjectStats) return [];
    return subjectStats.map((item) => ({
      name: item.category,
      value: Math.round(item.percentage),
      hours: Math.round(item.focusMinutes / 60 * 10) / 10,
    }));
  }, [subjectStats]);

  // 总览数据
  const overviewData = useMemo(() => {
    if (!overviewStats) return null;
    
    return {
      focusHours: Math.round(overviewStats.focusMinutes / 60 * 10) / 10,
      pomodoros: overviewStats.completedPomodoros,
      tasks: overviewStats.completedTasks,
      streakDays: overviewStats.streakDays,
    };
  }, [overviewStats]);

  // 处理周期切换
  const handlePeriodChange = useCallback((newPeriod: Period) => {
    setPeriod(newPeriod);
  }, []);

  // 是否正在加载
  const isLoading = isOverviewLoading || isDailyLoading || isSubjectLoading || isUserStatsLoading;

  return {
    period,
    setPeriod: handlePeriodChange,
    weeklyData,
    subjectDistribution,
    overviewData,
    userStats,
    isLoading,
    refreshAllStats,
  };
}

/**
 * 格式化学习时长
 */
export function formatStudyTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}小时`;
  }
  return `${hours}小时${mins}分钟`;
}

/**
 * 获取周期显示文本
 */
export function getPeriodText(period: Period): string {
  const periodMap: Record<Period, string> = {
    week: '本周',
    month: '本月',
    year: '本年',
  };
  return periodMap[period];
}
