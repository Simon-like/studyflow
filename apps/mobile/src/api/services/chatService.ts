import { http } from "../httpClient";
import { API_ENDPOINTS } from "@studyflow/shared";
import type { ApiResponse, ChatMessage } from "@studyflow/shared";

export interface SendMessageRequest {
  content: string;
  sessionId?: string;        // 为空则创建新会话
  type?: "text" | "plan" | "reminder";
}

export interface GeneratePlanRequest {
  goal: string;
  days: number;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export const chatService = {
  // 发送消息（返回 AI 回复及会话信息）
  sendMessage: (data: SendMessageRequest) =>
    http.post<ApiResponse<{ sessionId: string; userMessage: ChatMessage; aiMessage: ChatMessage }>>(
      API_ENDPOINTS.COMPANION.CHAT,
      data,
    ),

  // 获取会话列表
  getSessions: () =>
    http.get<ApiResponse<ChatSession[]>>(API_ENDPOINTS.COMPANION.SESSIONS),

  // 获取指定会话的历史消息
  getSessionHistory: (sessionId: string) =>
    http.get<ApiResponse<ChatMessage[]>>(API_ENDPOINTS.COMPANION.SESSION_HISTORY(sessionId)),

  // 生成学习计划
  generatePlan: (data: GeneratePlanRequest) =>
    http.post<ApiResponse<{ planId: string; plan: string }>>(API_ENDPOINTS.COMPANION.PLAN, data),

  // 获取已生成的学习计划列表
  getPlans: () =>
    http.get<ApiResponse<unknown[]>>(API_ENDPOINTS.COMPANION.PLANS),

  // 获取快捷回复建议
  getQuickReplies: () =>
    http.get<ApiResponse<string[]>>(API_ENDPOINTS.COMPANION.QUICK_REPLIES),
};
