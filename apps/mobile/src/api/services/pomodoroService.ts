import { http } from "../httpClient";
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
  status: "completed" | "stopped";
  abandonReason?: string;
}

export interface WeeklyDailyStat {
  date: string;
  pomodoros: number;
  focusTime: number;
}

/**
 * 将 Spring Boot 的 Page 格式转换为前端 PaginatedData 格式
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePage<T>(data: any): PaginatedData<T> {
  if (data && data.content !== undefined) {
    return {
      list: data.content,
      total: data.totalElements ?? 0,
      page: data.number ?? 0,
      size: data.size ?? 20,
      totalPages: data.totalPages ?? 1,
    };
  }
  if (Array.isArray(data)) {
    return { list: data, total: data.length, page: 0, size: data.length, totalPages: 1 };
  }
  return data;
}

export const pomodoroService = {
  // 开始番茄钟
  start: (data: StartPomodoroRequest) =>
    http.post<ApiResponse<PomodoroRecord>>(API_ENDPOINTS.POMODORO.START, data),

  // 停止番茄钟 (增强版，返回结算摘要)
  stop: (id: string, data: StopPomodoroRequest) =>
    http.post<ApiResponse<PomodoroSettlement>>(API_ENDPOINTS.POMODORO.STOP(id), data),

  // 获取当前进行中的番茄钟
  getActive: () =>
    http.get<ApiResponse<PomodoroRecord | null>>(API_ENDPOINTS.POMODORO.ACTIVE),

  // 获取历史记录（兼容 Spring Boot Page 格式）
  getHistory: async (params?: PaginationParams): Promise<ApiResponse<PaginatedData<PomodoroRecord>>> => {
    const res = await http.get<ApiResponse<PaginatedData<PomodoroRecord>>>(
      API_ENDPOINTS.POMODORO.HISTORY,
      { params }
    );
    res.data = normalizePage<PomodoroRecord>(res.data);
    return res;
  },

  // 获取今日统计 (用于 Dashboard StatsStrip)
  getTodayStats: () =>
    http.get<ApiResponse<TodayStats>>(API_ENDPOINTS.POMODORO.TODAY_STATS),

  // 获取周统计 (用于周报/柱状图)
  getWeeklyStats: () =>
    http.get<ApiResponse<{ dailyStats: WeeklyDailyStat[] }>>(
      API_ENDPOINTS.POMODORO.WEEKLY_STATS
    ),
};
