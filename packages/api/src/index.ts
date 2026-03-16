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

// 导出 Mock 服务 + 测试账号
export { TEST_ACCOUNT } from "./mock/data";
export {
  mockAuthService,
  mockTaskService,
  mockPomodoroService,
  mockChatService,
  mockCommunityService,
  mockStatsService,
  mockUserService,
} from "./mock/services";

// ==================== 统一 API 门面 ====================

import { authService } from "./services/authService";
import { taskService } from "./services/taskService";
import { pomodoroService } from "./services/pomodoroService";
import { chatService } from "./services/chatService";
import { statsService } from "./services/statsService";
import { userService } from "./services/userService";
import {
  mockAuthService,
  mockTaskService,
  mockPomodoroService,
  mockChatService,
  mockCommunityService,
  mockStatsService,
  mockUserService,
} from "./mock/services";

/**
 * 创建 API 门面
 * @param useMock 是否使用 mock 数据（默认 true，后端就绪后传 false）
 */
export function createApi(useMock = true) {
  return {
    auth: useMock ? mockAuthService : authService,
    task: useMock ? mockTaskService : taskService,
    pomodoro: useMock ? mockPomodoroService : pomodoroService,
    chat: useMock ? mockChatService : chatService,
    community: mockCommunityService,
    stats: useMock ? mockStatsService : statsService,
    user: useMock ? mockUserService : userService,
  };
}

/**
 * 默认 API 实例 — 当前使用 mock
 *
 * 用法:
 *   import { api } from '@studyflow/api';
 *   const res = await api.auth.login({ username, password });
 */
export const api = createApi(true);
