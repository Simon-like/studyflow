import { http } from "../client/httpClient";
import type {
  ApiResponse,
  PomodoroRecord,
  PomodoroSettlement,
  TodayStats,
  PaginatedData,
  PaginationParams,
} from "@studyflow/shared";
import { API_ENDPOINTS } from "@studyflow/shared";

export interface StartPomodoroRequest {
  taskId?: string;
  duration: number;
  isLocked: boolean;
}

export interface StopPomodoroRequest {
  status: "completed" | "abandoned";
  abandonReason?: string;
}

export interface WeeklyDailyStat {
  date: string;
  pomodoros: number;
  focusTime: number;
}

export const pomodoroService = {
  // 开始番茄钟
  start: (data: StartPomodoroRequest) =>
    http.post<ApiResponse<PomodoroRecord>>(API_ENDPOINTS.POMODORO.START, data),

  // 停止番茄钟 (增强版，返回结算摘要)
  stop: (id: string, data: StopPomodoroRequest) =>
    http.post<ApiResponse<PomodoroSettlement>>(API_ENDPOINTS.POMODORO.STOP(id), data),

  // 获取历史记录
  getHistory: (params?: PaginationParams) =>
    http.get<ApiResponse<PaginatedData<PomodoroRecord>>>(
      API_ENDPOINTS.POMODORO.HISTORY,
      { params }
    ),

  // 获取今日统计 (用于 Dashboard StatsStrip)
  getTodayStats: () =>
    http.get<ApiResponse<TodayStats>>(API_ENDPOINTS.POMODORO.TODAY_STATS),

  // 获取周统计 (用于周报/柱状图)
  getWeeklyStats: () =>
    http.get<ApiResponse<{ dailyStats: WeeklyDailyStat[] }>>(
      API_ENDPOINTS.POMODORO.WEEKLY_STATS
    ),
};
