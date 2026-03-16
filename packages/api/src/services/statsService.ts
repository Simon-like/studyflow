import { http } from "../client/httpClient";
import type {
  ApiResponse,
  OverviewStats,
  DailyStat,
  SubjectStat,
  DashboardSummary,
  StatsPeriod,
  UserStats,
} from "@studyflow/shared";
import { API_ENDPOINTS } from "@studyflow/shared";

export const statsService = {
  // 获取总览统计 (周期: today/week/month/year)
  getOverview: (period: StatsPeriod = "week") =>
    http.get<ApiResponse<OverviewStats>>(API_ENDPOINTS.STATS.OVERVIEW, {
      params: { period },
    }),

  // 获取每日学习数据 (用于柱状图/热力图)
  getDaily: (startDate: string, endDate: string) =>
    http.get<ApiResponse<DailyStat[]>>(API_ENDPOINTS.STATS.DAILY, {
      params: { startDate, endDate },
    }),

  // 获取学科分布统计
  getSubjects: (period: StatsPeriod = "week") =>
    http.get<ApiResponse<SubjectStat[]>>(API_ENDPOINTS.STATS.SUBJECTS, {
      params: { period },
    }),

  // 获取 Dashboard 聚合数据 (一键获取今日任务+统计)
  getDashboardSummary: () =>
    http.get<ApiResponse<DashboardSummary>>(API_ENDPOINTS.DASHBOARD.SUMMARY),
    
  // 获取用户累计统计数据
  getUserStats: () =>
    http.get<ApiResponse<UserStats>>(API_ENDPOINTS.USER.STATS),
};
