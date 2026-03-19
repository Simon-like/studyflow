import { http } from '../httpClient';
import type {
  ApiResponse,
  UserProfile,
  UserStats,
  UpdateProfileRequest,
  PomodoroSettings,
  SystemSettings,
} from '@studyflow/shared';
import { API_ENDPOINTS } from '@studyflow/shared';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface StudyCalendarData {
  date: string;
  focusMinutes: number;
  pomodoros: number;
  tasks: number;
}

export const userService = {
  // 获取用户资料
  getProfile: () =>
    http.get<ApiResponse<UserProfile>>(API_ENDPOINTS.USER.PROFILE),

  // 更新用户资料
  updateProfile: (data: UpdateProfileRequest) =>
    http.put<ApiResponse<UserProfile>>(API_ENDPOINTS.USER.PROFILE, data),

  // 上传头像（base64 JSON 格式）
  uploadAvatar: (data: { avatar: string }) =>
    http.post<ApiResponse<{ avatarUrl: string }>>(API_ENDPOINTS.USER.AVATAR, data),

  // 获取番茄钟设置
  getPomodoroSettings: () =>
    http.get<ApiResponse<PomodoroSettings>>(API_ENDPOINTS.USER.SETTINGS.POMODORO),

  // 更新番茄钟设置
  updatePomodoroSettings: (data: Partial<PomodoroSettings>) =>
    http.put<ApiResponse<PomodoroSettings>>(API_ENDPOINTS.USER.SETTINGS.POMODORO, data),

  // 获取系统设置
  getSystemSettings: () =>
    http.get<ApiResponse<SystemSettings>>(API_ENDPOINTS.USER.SETTINGS.SYSTEM),

  // 更新系统设置
  updateSystemSettings: (data: Partial<SystemSettings>) =>
    http.put<ApiResponse<SystemSettings>>(API_ENDPOINTS.USER.SETTINGS.SYSTEM, data),

  // 修改密码
  changePassword: (data: ChangePasswordRequest) =>
    http.put<ApiResponse<{ success: boolean }>>(API_ENDPOINTS.USER.PASSWORD, data),

  // 获取用户统计
  getUserStats: () =>
    http.get<ApiResponse<UserStats>>(API_ENDPOINTS.USER.STATS),

  // 获取学习日历
  getStudyCalendar: (startDate: string, endDate: string) =>
    http.get<ApiResponse<StudyCalendarData[]>>(API_ENDPOINTS.USER.CALENDAR, {
      params: { startDate, endDate },
    }),

  // 注销账号
  deleteAccount: () =>
    http.delete<ApiResponse<void>>(API_ENDPOINTS.USER.ACCOUNT),
};
