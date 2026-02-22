import { http } from "../client/httpClient";
import type {
  ApiResponse,
  PomodoroRecord,
  PaginatedData,
  PaginationParams,
} from "@studyflow/shared";

export interface StartPomodoroRequest {
  taskId?: string;
  duration: number;
  isLocked: boolean;
}

export interface StopPomodoroRequest {
  status: "completed" | "abandoned";
  abandonReason?: string;
}

export const pomodoroService = {
  // 开始番茄钟
  start: (data: StartPomodoroRequest) =>
    http.post<ApiResponse<PomodoroRecord>>("/api/v1/pomodoro/start", data),

  // 停止番茄钟
  stop: (id: string, data: StopPomodoroRequest) =>
    http.post<ApiResponse<PomodoroRecord>>(`/api/v1/pomodoro/${id}/stop`, data),

  // 获取历史记录
  getHistory: (params?: PaginationParams) =>
    http.get<ApiResponse<PaginatedData<PomodoroRecord>>>(
      "/api/v1/pomodoro/history",
      {
        params,
      },
    ),

  // 获取今日统计
  getTodayStats: () =>
    http.get<
      ApiResponse<{
        totalPomodoros: number;
        totalFocusTime: number;
        completedTasks: number;
      }>
    >("/api/v1/pomodoro/stats/today"),

  // 获取周统计
  getWeeklyStats: () =>
    http.get<
      ApiResponse<{
        dailyStats: Array<{
          date: string;
          pomodoros: number;
          focusTime: number;
        }>;
      }>
    >("/api/v1/pomodoro/stats/weekly"),
};
