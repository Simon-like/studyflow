import type {
  ApiResponse,
  PaginatedData,
  PaginationParams,
  Task,
} from "@studyflow/shared";

import { http } from "../client/httpClient";

export interface CreateTaskRequest {
  title: string;
  description?: string;
  category?: string;
  priority?: "low" | "medium" | "high";
  estimatedPomodoros?: number;
  dueDate?: string;
  parentId?: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  status?: "todo" | "in_progress" | "completed" | "abandoned";
}

export const taskService = {
  // 获取任务列表
  getTasks: (params?: PaginationParams) =>
    http.get<ApiResponse<PaginatedData<Task>>>("/api/v1/tasks", { params }),

  // 获取今日任务
  getTodayTasks: () => http.get<ApiResponse<Task[]>>("/api/v1/tasks/today"),

  // 获取任务详情
  getTask: (id: string) => http.get<ApiResponse<Task>>(`/api/v1/tasks/${id}`),

  // 创建任务
  createTask: (data: CreateTaskRequest) =>
    http.post<ApiResponse<Task>>("/api/v1/tasks", data),

  // 更新任务
  updateTask: (id: string, data: UpdateTaskRequest) =>
    http.put<ApiResponse<Task>>(`/api/v1/tasks/${id}`, data),

  // 删除任务
  deleteTask: (id: string) =>
    http.delete<ApiResponse<void>>(`/api/v1/tasks/${id}`),

  // 完成任务
  completeTask: (id: string) =>
    http.patch<ApiResponse<Task>>(`/api/v1/tasks/${id}/complete`),
};
