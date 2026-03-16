/**
 * Mobile API 模块
 * 
 * 统一导出移动端使用的 API 客户端和服务
 * 使用本地 httpClient 替代 @studyflow/api 中的版本（避免 localStorage 问题）
 */

// HTTP 客户端
export { http, httpClient, createHttpClient, API_BASE_URL } from './httpClient';

// API 服务（重新导出，使用本地 httpClient）
// 注意：authService 等使用 mock 数据，实际请求可能不会被发送
export { authService } from './services/authService';
export { taskService } from './services/taskService';
export { pomodoroService } from './services/pomodoroService';
export { chatService } from './services/chatService';
export { statsService } from './services/statsService';

// 导出服务类型
export type { CreateTaskRequest, UpdateTaskRequest } from './services/taskService';
export type { StartPomodoroRequest, StopPomodoroRequest, WeeklyDailyStat } from './services/pomodoroService';
export type { SendMessageRequest, GeneratePlanRequest } from './services/chatService';

// Mock 服务（当前使用 mock 数据）
export { TEST_ACCOUNT } from '@studyflow/api';
export {
  mockAuthService,
  mockTaskService,
  mockPomodoroService,
  mockChatService,
  mockCommunityService,
  mockStatsService,
} from '@studyflow/api';

// 统一 API 门面
import { authService } from './services/authService';
import { taskService } from './services/taskService';
import { pomodoroService } from './services/pomodoroService';
import { chatService } from './services/chatService';
import { statsService } from './services/statsService';
import {
  mockAuthService,
  mockTaskService,
  mockPomodoroService,
  mockChatService,
  mockCommunityService,
  mockStatsService,
} from '@studyflow/api';

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
  };
}

/**
 * 默认 API 实例 — 当前使用 mock
 */
export const api = createApi(true);
