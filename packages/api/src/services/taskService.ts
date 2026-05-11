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

/**
 * 将 Spring Boot 的 Page 格式转换为前端 PaginatedData 格式
 * Spring Boot: { content, totalElements, number, size, totalPages }
 * Frontend:    { list, total, page, size, totalPages }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizePage<T>(data: any): PaginatedData<T> {
  if (data && data.content !== undefined) {
    return {
      list: data.content,
      total: data.totalElements ?? 0,
      page: data.number ?? 0,
      size: data.size ?? 20,
      totalPages: data.totalPages ?? 1,
    };
  }
  // 已经是 PaginatedData 格式或纯数组
  if (Array.isArray(data)) {
    return { list: data, total: data.length, page: 0, size: data.length, totalPages: 1 };
  }
  return data;
}

export const taskService = {
  // 获取任务列表（兼容 Spring Boot Page 格式）
  getTasks: async (params?: PaginationParams & {
    status?: string;
    priority?: string;
    keyword?: string;
  }): Promise<ApiResponse<PaginatedData<Task>>> => {
    const res = await http.get<ApiResponse<PaginatedData<Task>>>(API_ENDPOINTS.TASK.LIST, { params });
    res.data = normalizePage<Task>(res.data);
    return res;
  },

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

  // 快速切换任务状态
  toggleStatus: (id: string) =>
    http.patch<ApiResponse<Task>>(API_ENDPOINTS.TASK.TOGGLE(id)),

  // 开始任务
  startTask: (id: string) =>
    http.post<ApiResponse<Task>>(API_ENDPOINTS.TASK.START(id)),

  // 获取任务进度统计
  getProgress: (period?: StatsPeriod) =>
    http.get<ApiResponse<TaskProgress>>(API_ENDPOINTS.TASK.PROGRESS, {
      params: { period },
    }),

  // 更新任务排序
  reorderTasks: (data: ReorderTasksRequest) =>
    http.post<ApiResponse<void>>(API_ENDPOINTS.TASK.REORDER, data),
};
