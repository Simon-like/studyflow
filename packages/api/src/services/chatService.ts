import type { ApiResponse, ChatMessage } from "@studyflow/shared";

import { http } from "../client/httpClient";

export interface SendMessageRequest {
  content: string;
  type?: "text" | "voice";
}

export interface GeneratePlanRequest {
  goal: string;
  days: number;
}

export const chatService = {
  // 发送消息
  sendMessage: (data: SendMessageRequest) =>
    http.post<ApiResponse<ChatMessage>>("/api/v1/companion/chat", data),

  // 获取历史消息
  getHistory: (sessionId?: string) =>
    http.get<ApiResponse<ChatMessage[]>>("/api/v1/companion/history", {
      params: { sessionId },
    }),

  // 生成学习计划
  generatePlan: (data: GeneratePlanRequest) =>
    http.post<ApiResponse<{ plan: string }>>("/api/v1/companion/plan", data),

  // 获取快速回复建议
  getQuickReplies: () =>
    http.get<ApiResponse<string[]>>("/api/v1/companion/quick-replies"),
};
