import { http } from "../client/httpClient";
import type {
  ApiResponse,
  Task,
  TaskProgress,
  PaginatedData,
  PaginationParams,
  StatsPeriod,
  ReorderTasksRequest,
} from "@studyflow/shared";
import { API_ENDPOINTS } from "@studyflow/shared";

export interface CreateTaskRequest {
  title: string;
  description?: string;
  category?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  parentId?: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  status?: "todo" | "in_progress" | "completed" | "abandoned";
}

export const taskService = {
  // 获取任务列表
  getTasks: (params?: PaginationParams & {
    status?: string;
    priority?: string;
    keyword?: string;
  }) =>
    http.get<ApiResponse<PaginatedData<Task>>>(API_ENDPOINTS.TASK.LIST, { params }),

  // 获取今日任务 (Dashboard 专用)
  getTodayTasks: () =>
    http.get<ApiResponse<Task[]>>(API_ENDPOINTS.TASK.TODAY),

  // 获取任务详情
  getTask: (id: string) =>
    http.get<ApiResponse<Task>>(API_ENDPOINTS.TASK.UPDATE(id)),

  // 创建任务
  createTask: (data: CreateTaskRequest) =>
    http.post<ApiResponse<Task>>(API_ENDPOINTS.TASK.CREATE, data),

  // 更新任务
  updateTask: (id: string, data: UpdateTaskRequest) =>
    http.put<ApiResponse<Task>>(API_ENDPOINTS.TASK.UPDATE(id), data),

  // 删除任务
  deleteTask: (id: string) =>
    http.delete<ApiResponse<void>>(API_ENDPOINTS.TASK.DELETE(id)),

  // 快速切换任务状态 (todo/in_progress <-> completed)
  toggleStatus: (id: string) =>
    http.patch<ApiResponse<Task>>(API_ENDPOINTS.TASK.TOGGLE(id)),

  // 开始任务（设置为 in_progress，同时确保只有一个任务进行中）
  startTask: (id: string) =>
    http.post<ApiResponse<Task>>(API_ENDPOINTS.TASK.START(id)),

  // 获取任务进度统计
  getProgress: (period?: StatsPeriod) =>
    http.get<ApiResponse<TaskProgress>>(API_ENDPOINTS.TASK.PROGRESS, {
      params: { period },
    }),

  // 更新任务排序
  reorderTasks: (data: ReorderTasksRequest) =>
    http.post<ApiResponse<Task[]>>(API_ENDPOINTS.TASK.REORDER, data),
};
