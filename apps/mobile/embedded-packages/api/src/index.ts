// 导出客户端（httpClient 已兼容 Metro/RN）
export * from "./client/httpClient";

// 导出真实服务
export { authService } from "./services/authService";
export { taskService } from "./services/taskService";
export { pomodoroService } from "./services/pomodoroService";
export { chatService } from "./services/chatService";
export { statsService } from "./services/statsService";

// 导出服务类型
export type { CreateTaskRequest, UpdateTaskRequest } from "./services/taskService";
export type { StartPomodoroRequest, StopPomodoroRequest, WeeklyDailyStat } from "./services/pomodoroService";
export type { SendMessageRequest, GeneratePlanRequest } from "./services/chatService";

// 社区模块 mock（后端暂未实现）
export { mockCommunityService } from "./mock/services";

// ==================== 统一 API 门面 ====================

import { authService } from "./services/authService";
import { taskService } from "./services/taskService";
import { pomodoroService } from "./services/pomodoroService";
import { chatService } from "./services/chatService";
import { statsService } from "./services/statsService";
import { mockCommunityService } from "./mock/services";

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
};
