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

// 声明 process 以避免在浏览器环境中报错
declare const process: {
  env?: {
    VITE_USE_MOCK?: string;
  };
} | undefined;

/**
 * 检测当前环境是否应该使用 Mock
 * 优先级: VITE_USE_MOCK > 默认 false (使用真实后端)
 */
const shouldUseMock = (): boolean => {
  try {
    if (typeof process !== 'undefined' && process.env?.VITE_USE_MOCK) {
      return process.env.VITE_USE_MOCK === 'true';
    }
  } catch {
    // 浏览器环境中 process 可能不存在
  }
  return false; // 默认使用真实后端
};

/**
 * 创建 API 门面
 * @param useMock 是否使用 mock 数据（默认自动检测环境变量）
 */
export function createApi(useMock = shouldUseMock()) {
  return {
    auth: useMock ? mockAuthService : authService,
    task: useMock ? mockTaskService : taskService,
    pomodoro: useMock ? mockPomodoroService : pomodoroService,
    chat: useMock ? mockChatService : chatService,
    community: mockCommunityService, // 社区模块暂未实现后端
    stats: useMock ? mockStatsService : statsService,
    user: useMock ? mockUserService : userService,
  };
}

/**
 * 默认 API 实例 — 根据环境变量自动选择模式
 * 
 * 环境变量配置:
 *   VITE_USE_MOCK=true   -> 使用 Mock 数据
 *   VITE_USE_MOCK=false  -> 使用真实后端 (默认)
 * 
 * 手动切换:
 *   const api = createApi(true);  // 强制使用 Mock
 *   const api = createApi(false); // 强制使用后端
 * 
 * 用法:
 *   import { api } from '@studyflow/api';
 *   const res = await api.auth.login({ username, password });
 */
export const api = createApi();
