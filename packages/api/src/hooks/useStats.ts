/**
 * 统计模块 Hooks - 双端共享
 * 
 * 基于 TanStack Query 的统一数据获取方案
 * 支持 Web 和 React Native 两端使用
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { statsService } from '../services/statsService';
import { pomodoroService } from '../services/pomodoroService';
import type {
  TodayStats,
  OverviewStats,
  DailyStat,
  SubjectStat,
  DashboardSummary,
  StatsPeriod,
  UserStats,
} from '@studyflow/shared';

// ==================== Query Keys ====================

export const STATS_KEYS = {
  all: ['stats'] as const,
  today: () => [...STATS_KEYS.all, 'today'] as const,
  overview: (period: StatsPeriod) => [...STATS_KEYS.all, 'overview', period] as const,
  daily: (startDate: string, endDate: string) => 
    [...STATS_KEYS.all, 'daily', startDate, endDate] as const,
  subjects: (period: StatsPeriod) => [...STATS_KEYS.all, 'subjects', period] as const,
  dashboard: () => [...STATS_KEYS.all, 'dashboard'] as const,
  userStats: () => ['user', 'stats'] as const,
};

// ==================== 今日统计 Hook ====================

interface UseTodayStatsOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

/**
 * 获取今日统计数据
 * 
 * 包含：今日专注时长、完成番茄数、完成任务数、连续天数
 * 
 * @example
 * ```tsx
 * const { data: todayStats, isLoading } = useTodayStats();
 * 
 * // 在番茄钟完成后刷新
 * const { refetch } = useTodayStats();
 * // 完成番茄钟后调用 refetch()
 * ```
 */
export function useTodayStats(options?: UseTodayStatsOptions) {
  return useQuery<TodayStats>({
    queryKey: STATS_KEYS.today(),
    queryFn: async () => {
      const response = await pomodoroService.getTodayStats();
      return response.data;
    },
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval,
    staleTime: 30 * 1000, // 30秒内视为新鲜数据
  });
}

// ==================== 总览统计 Hook ====================

interface UseOverviewStatsOptions {
  period?: StatsPeriod;
  enabled?: boolean;
}

/**
 * 获取总览统计数据
 * 
 * 支持多周期：today/week/month/year
 * 包含：专注时长、番茄数、任务数、连续天数、环比变化
 * 
 * @example
 * ```tsx
 * const { data: overview } = useOverviewStats({ period: 'week' });
 * ```
 */
export function useOverviewStats(options?: UseOverviewStatsOptions) {
  const period = options?.period ?? 'week';
  
  return useQuery<OverviewStats>({
    queryKey: STATS_KEYS.overview(period),
    queryFn: async () => {
      const response = await statsService.getOverview(period);
      return response.data;
    },
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

// ==================== 每日统计 Hook ====================

interface UseDailyStatsOptions {
  startDate: string;
  endDate: string;
  enabled?: boolean;
}

/**
 * 获取每日学习数据（用于柱状图/热力图）
 * 
 * @example
 * ```tsx
 * const { data: dailyStats } = useDailyStats({
 *   startDate: '2026-03-01',
 *   endDate: '2026-03-31'
 * });
 * ```
 */
export function useDailyStats(options: UseDailyStatsOptions) {
  const { startDate, endDate } = options;
  
  return useQuery<DailyStat[]>({
    queryKey: STATS_KEYS.daily(startDate, endDate),
    queryFn: async () => {
      const response = await statsService.getDaily(startDate, endDate);
      return response.data;
    },
    enabled: options.enabled !== false && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 获取本周每日统计（便捷Hook）
 */
export function useWeeklyDailyStats(options?: { enabled?: boolean }) {
  const { startDate, endDate } = getWeekRange();
  
  return useDailyStats({
    startDate,
    endDate,
    enabled: options?.enabled,
  });
}

/**
 * 获取本月每日统计（便捷Hook）
 */
export function useMonthlyDailyStats(options?: { enabled?: boolean }) {
  const { startDate, endDate } = getMonthRange();
  
  return useDailyStats({
    startDate,
    endDate,
    enabled: options?.enabled,
  });
}

// ==================== 学科分布 Hook ====================

interface UseSubjectStatsOptions {
  period?: StatsPeriod;
  enabled?: boolean;
}

/**
 * 获取学科分布统计数据
 * 
 * @example
 * ```tsx
 * const { data: subjectStats } = useSubjectStats({ period: 'month' });
 * ```
 */
export function useSubjectStats(options?: UseSubjectStatsOptions) {
  const period = options?.period ?? 'week';
  
  return useQuery<SubjectStat[]>({
    queryKey: STATS_KEYS.subjects(period),
    queryFn: async () => {
      const response = await statsService.getSubjects(period);
      return response.data;
    },
    enabled: options?.enabled !== false,
    staleTime: 10 * 60 * 1000, // 10分钟
  });
}

// ==================== Dashboard 聚合数据 Hook ====================

interface UseDashboardSummaryOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

/**
 * 获取 Dashboard 聚合数据
 * 
 * 一次性获取：今日统计、周统计、今日任务、活跃番茄钟
 * 
 * @example
 * ```tsx
 * const { data: summary } = useDashboardSummary();
 * 
 * // 轮询刷新
 * const { data } = useDashboardSummary({ refetchInterval: 30000 });
 * ```
 */
export function useDashboardSummary(options?: UseDashboardSummaryOptions) {
  return useQuery<DashboardSummary>({
    queryKey: STATS_KEYS.dashboard(),
    queryFn: async () => {
      const response = await statsService.getDashboardSummary();
      return response.data;
    },
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval,
    staleTime: 30 * 1000,
  });
}

// ==================== 用户累计统计 Hook ====================

interface UseUserStatsOptions {
  enabled?: boolean;
}

/**
 * 获取用户累计统计数据
 * 
 * 包含：累计学习时长、累计番茄数、累计任务数、连续天数等
 * 
 * @example
 * ```tsx
 * const { data: userStats } = useUserStats();
 * ```
 */
export function useUserStats(options?: UseUserStatsOptions) {
  return useQuery<UserStats>({
    queryKey: STATS_KEYS.userStats(),
    queryFn: async () => {
      const response = await statsService.getUserStats();
      return response.data;
    },
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000,
  });
}

// ==================== 统计刷新 Hook ====================

/**
 * 刷新所有统计数据
 * 
 * 在番茄钟完成、任务状态变更等场景调用
 * 
 * @example
 * ```tsx
 * const { refreshAllStats } = useRefreshStats();
 * 
 * // 完成番茄钟后
 * await completePomodoro();
 * refreshAllStats();
 * ```
 */
export function useRefreshStats() {
  const queryClient = useQueryClient();

  const refreshAllStats = useCallback(() => {
    // 使所有统计相关缓存失效（STATS_KEYS.all 是前缀，会匹配所有子 key）
    queryClient.invalidateQueries({ queryKey: STATS_KEYS.all });
    queryClient.invalidateQueries({ queryKey: STATS_KEYS.userStats() });
  }, [queryClient]);

  const refreshTodayStats = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: STATS_KEYS.today() });
    queryClient.invalidateQueries({ queryKey: STATS_KEYS.dashboard() });
  }, [queryClient]);

  const refreshOverviewStats = useCallback((period?: StatsPeriod) => {
    if (period) {
      queryClient.invalidateQueries({ queryKey: STATS_KEYS.overview(period) });
    } else {
      (['today', 'week', 'month', 'year'] as StatsPeriod[]).forEach(p => {
        queryClient.invalidateQueries({ queryKey: STATS_KEYS.overview(p) });
      });
    }
  }, [queryClient]);

  return {
    refreshAllStats,
    refreshTodayStats,
    refreshOverviewStats,
  };
}

// ==================== 番茄钟结算 Hook ====================

interface UsePomodoroSettlementOptions {
  onSuccess?: (todayStats: TodayStats) => void;
}

/**
 * 番茄钟结算 Hook
 * 
 * 完成番茄钟后自动刷新相关统计数据
 * 
 * @example
 * ```tsx
 * const { mutate: stop, isPending } = usePomodoroSettlement({
 *   onSuccess: (todayStats) => {
 *     console.log('今日已完成', todayStats.completedPomodoros, '个番茄');
 *   }
 * });
 * 
 * // 完成番茄钟
 * stop({ id: 'pomo-123', status: 'completed' });
 * // 放弃番茄钟
 * stop({ id: 'pomo-123', status: 'stopped', abandonReason: '被打断' });
 * ```
 */
export function usePomodoroSettlement(options?: UsePomodoroSettlementOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, abandonReason }: { id: string; status: 'completed' | 'stopped'; abandonReason?: string }) => {
      const response = await pomodoroService.stop(id, { status, abandonReason });
      return response.data;
    },
    onSuccess: (data: { todayStats: TodayStats }) => {
      // 更新今日统计数据
      queryClient.setQueryData(STATS_KEYS.today(), data.todayStats);
      
      // 使其他统计缓存失效
      queryClient.invalidateQueries({ queryKey: STATS_KEYS.dashboard() });
      queryClient.invalidateQueries({ queryKey: STATS_KEYS.userStats() });
      
      options?.onSuccess?.(data.todayStats);
    },
  });
}

// ==================== 工具函数 ====================

/**
 * 获取本周日期范围
 */
function getWeekRange(): { startDate: string; endDate: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // 周一开始
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}

/**
 * 获取本月日期范围
 */
function getMonthRange(): { startDate: string; endDate: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
