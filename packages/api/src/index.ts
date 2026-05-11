// 导出客户端（httpClient 已兼容 Metro/RN）
export * from "./client/httpClient";

// 导出真实服务
export { authService } from "./services/authService";
export { taskService } from "./services/taskService";
export { pomodoroService } from "./services/pomodoroService";
export { chatService } from "./services/chatService";
export { statsService } from "./services/statsService";
export { userService } from "./services/userService";
export { communityService } from "./services/communityService";
export type { StudyCalendarData } from "./services/userService";

// 导出服务类型
export type { CreateTaskRequest, UpdateTaskRequest } from "./services/taskService";
export type { StartPomodoroRequest, StopPomodoroRequest, WeeklyDailyStat } from "./services/pomodoroService";
export type { SendMessageRequest, GeneratePlanRequest, ChatSession } from "./services/chatService";
export type {
  Post,
  Comment,
  StudyGroup,
  CreatePostRequest,
  CreateCommentRequest,
  CreateGroupRequest,
  LikeResponse,
  PostsResponse,
  GroupsResponse,
} from "@studyflow/shared";

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

// 导出社区 Hooks
export {
  usePosts,
  usePostsInfinite,
  usePostDetail,
  useCreatePost,
  useDeletePost,
  useToggleLike,
  useComments,
  useCreateComment,
  useGroups,
  useJoinGroup,
  useLeaveGroup,
  COMMUNITY_KEYS,
} from "./hooks/useCommunity";

// ==================== 统一 API 门面 ====================

import { authService } from "./services/authService";
import { taskService } from "./services/taskService";
import { pomodoroService } from "./services/pomodoroService";
import { chatService } from "./services/chatService";
import { statsService } from "./services/statsService";
import { userService } from "./services/userService";
import { communityService } from "./services/communityService";

/**
 * 默认 API 实例 — 全部使用 Spring Boot 后端（端口 8080）
 */
export const api = {
  auth: authService,
  task: taskService,
  pomodoro: pomodoroService,
  chat: chatService,
  stats: statsService,
  user: userService,
  community: communityService,
};
