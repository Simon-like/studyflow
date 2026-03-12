/**
 * Mock 工具函数
 */

import type { ApiResponse, PaginatedData, PaginationParams } from "@studyflow/shared";

/** 模拟网络延迟 */
export const mockDelay = (ms = 600) =>
  new Promise<void>((r) => setTimeout(r, ms));

/** 构造成功响应 */
export function ok<T>(data: T, message = "success"): ApiResponse<T> {
  return { code: 200, message, data, timestamp: Date.now() };
}

/** 构造错误响应 */
export function fail(code: number, message: string): ApiResponse<null> {
  return { code, message, data: null, timestamp: Date.now() };
}

/** 模拟分页 */
export function paginate<T>(
  list: T[],
  params?: PaginationParams,
): PaginatedData<T> {
  const page = params?.page ?? 1;
  const size = params?.size ?? 20;
  const start = (page - 1) * size;
  const end = start + size;

  return {
    list: list.slice(start, end),
    total: list.length,
    page,
    size,
    totalPages: Math.ceil(list.length / size),
  };
}

/** 生成简易 ID */
export const genId = () =>
  `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
