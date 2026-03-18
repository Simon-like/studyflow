/**
 * Mobile API 模块
 *
 * 统一导出移动端使用的 API 客户端和服务
 * 使用本地 httpClient（AsyncStorage，兼容 React Native）
 * 直接连接真实后端（NestJS，端口 3001）
 */

// HTTP 客户端
export { http, httpClient, createHttpClient, API_BASE_URL } from './httpClient';

// API 服务
export { authService } from './services/authService';
export { taskService } from './services/taskService';
export { pomodoroService } from './services/pomodoroService';
export { chatService } from './services/chatService';
export { statsService } from './services/statsService';
export { userService } from './services/userService';

// 服务类型
export type { CreateTaskRequest, UpdateTaskRequest } from './services/taskService';
export type { StartPomodoroRequest, StopPomodoroRequest, WeeklyDailyStat } from './services/pomodoroService';
export type { SendMessageRequest, GeneratePlanRequest } from './services/chatService';
export type { ChangePasswordRequest, StudyCalendarData } from './services/userService';

// 社区模块 mock（后端暂未实现）
export { mockCommunityService } from '@studyflow/api';

// ==================== 统一 API 门面 ====================

import { authService } from './services/authService';
import { taskService } from './services/taskService';
import { pomodoroService } from './services/pomodoroService';
import { chatService } from './services/chatService';
import { statsService } from './services/statsService';
import { userService } from './services/userService';
import { mockCommunityService } from '@studyflow/api';

/**
 * 默认 API 实例 — 使用真实后端
 */
export const api = {
  auth: authService,
  task: taskService,
  pomodoro: pomodoroService,
  chat: chatService,
  community: mockCommunityService, // 社区模块后端未实现，暂用 mock
  stats: statsService,
  user: userService,
};
