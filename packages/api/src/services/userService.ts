import { http } from "../client/httpClient";
import type {
  ApiResponse,
  User,
  UserProfile,
  UpdateProfileRequest,
  PomodoroSettings,
  SystemSettings,
  UserStats,
  ChangePasswordRequest,
} from "@studyflow/shared";

/**
 * 用户服务
 * 处理个人信息、设置相关的 API 调用
 */
export const userService = {
  /**
   * 获取当前用户完整资料
   * GET /api/v1/users/profile
   */
  getProfile: () =>
    http.get<ApiResponse<UserProfile>>("/api/v1/users/profile"),

  /**
   * 更新用户资料
   * PUT /api/v1/users/profile
   */
  updateProfile: (data: UpdateProfileRequest) =>
    http.put<ApiResponse<User>>("/api/v1/users/profile", data),

  /**
   * 上传头像
   * POST /api/v1/users/avatar
   */
  uploadAvatar: (file: File | FormData) => {
    const formData = file instanceof FormData 
      ? file 
      : (() => {
          const fd = new FormData();
          fd.append("avatar", file);
          return fd;
        })();
    
    return http.post<ApiResponse<{ avatarUrl: string }>>("/api/v1/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * 获取番茄钟设置
   * GET /api/v1/users/settings/pomodoro
   */
  getPomodoroSettings: () =>
    http.get<ApiResponse<PomodoroSettings>>("/api/v1/users/settings/pomodoro"),

  /**
   * 更新番茄钟设置
   * PUT /api/v1/users/settings/pomodoro
   */
  updatePomodoroSettings: (data: PomodoroSettings) =>
    http.put<ApiResponse<PomodoroSettings>>("/api/v1/users/settings/pomodoro", data),

  /**
   * 获取系统设置
   * GET /api/v1/users/settings/system
   */
  getSystemSettings: () =>
    http.get<ApiResponse<SystemSettings>>("/api/v1/users/settings/system"),

  /**
   * 更新系统设置
   * PUT /api/v1/users/settings/system
   */
  updateSystemSettings: (data: SystemSettings) =>
    http.put<ApiResponse<SystemSettings>>("/api/v1/users/settings/system", data),

  /**
   * 获取用户统计数据
   * GET /api/v1/users/stats
   */
  getUserStats: () =>
    http.get<ApiResponse<UserStats>>("/api/v1/users/stats"),

  /**
   * 修改密码
   * PUT /api/v1/users/password
   */
  changePassword: (data: ChangePasswordRequest) =>
    http.put<ApiResponse<void>>("/api/v1/users/password", data),

  /**
   * 获取学习日历数据
   * GET /api/v1/users/calendar?startDate=2026-03-01&endDate=2026-03-31
   */
  getStudyCalendar: (startDate: string, endDate: string) =>
    http.get<ApiResponse<StudyCalendarData[]>>(
      `/api/v1/users/calendar?startDate=${startDate}&endDate=${endDate}`
    ),

  /**
   * 删除账号
   * DELETE /api/v1/users/account
   */
  deleteAccount: () =>
    http.delete<ApiResponse<void>>("/api/v1/users/account"),
};

/**
 * 学习日历数据
 */
export interface StudyCalendarData {
  date: string;
  focusMinutes: number;
  pomodoros: number;
  tasks: number;
  hasStudy: boolean;
}

// 导出类型
export type { UserProfile, UpdateProfileRequest, PomodoroSettings, SystemSettings, UserStats, ChangePasswordRequest };
