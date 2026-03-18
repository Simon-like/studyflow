// 导出客户端（httpClient 已兼容 Metro/RN）
export * from "./client/httpClient";

// 导出真实服务
export { authService } from "./services/authService";
export { taskService } from "./services/taskService";
export { pomodoroService } from "./services/pomodoroService";
export { chatService } from "./services/chatService";
export { statsService } from "./services/statsService";
export { userService } from "./services/userService";
export type { StudyCalendarData } from "./services/userService";

// 导出服务类型
export type { CreateTaskRequest, UpdateTaskRequest } from "./services/taskService";
export type { StartPomodoroRequest, StopPomodoroRequest, WeeklyDailyStat } from "./services/pomodoroService";
export type { SendMessageRequest, GeneratePlanRequest } from "./services/chatService";

// 导出统计 Hooks
export {
  useTodayStats,
  useOverviewStats,
  useDailyStats,
  useWeeklyDailyStats,
  useMonthlyDailyStats,
  useSubjectStats,
  useDashboardSummary,
  useUserStats,
  useRefreshStats,
  usePomodoroSettlement,
  STATS_KEYS,
} from "./hooks/useStats";

// ==================== 统一 API 门面 ====================

import { authService } from "./services/authService";
import { taskService } from "./services/taskService";
import { pomodoroService } from "./services/pomodoroService";
import { chatService } from "./services/chatService";
import { statsService } from "./services/statsService";
import { userService } from "./services/userService";

/**
 * 默认 API 实例 — 全部使用真实后端
 */
export const api = {
  auth: authService,
  task: taskService,
  pomodoro: pomodoroService,
  chat: chatService,
  stats: statsService,
  user: userService,
};
