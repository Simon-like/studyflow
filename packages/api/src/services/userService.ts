import { http } from "../client/httpClient";
import { API_ENDPOINTS } from "@studyflow/shared";
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

export const userService = {
  // 获取当前用户完整资料
  getProfile: () =>
    http.get<ApiResponse<UserProfile>>(API_ENDPOINTS.USER.PROFILE),

  // 更新用户资料
  updateProfile: (data: UpdateProfileRequest) =>
    http.put<ApiResponse<UserProfile>>(API_ENDPOINTS.USER.UPDATE_PROFILE, data),

  /**
   * 上传头像（将 File 转为 Base64，字段名 base64Image 对应后端 AvatarUploadRequest）
   */
  uploadAvatar: async (file: File): Promise<ApiResponse<{ avatarUrl: string }>> => {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    return http.post<ApiResponse<{ avatarUrl: string }>>(API_ENDPOINTS.USER.AVATAR, {
      base64Image: base64,
    });
  },

  // 获取番茄钟设置
  getPomodoroSettings: () =>
    http.get<ApiResponse<PomodoroSettings>>(API_ENDPOINTS.USER.SETTINGS.POMODORO),

  // 更新番茄钟设置
  updatePomodoroSettings: (data: PomodoroSettings) =>
    http.put<ApiResponse<PomodoroSettings>>(API_ENDPOINTS.USER.SETTINGS.POMODORO, data),

  // 获取系统设置
  getSystemSettings: () =>
    http.get<ApiResponse<SystemSettings>>(API_ENDPOINTS.USER.SETTINGS.SYSTEM),

  // 更新系统设置
  updateSystemSettings: (data: SystemSettings) =>
    http.put<ApiResponse<SystemSettings>>(API_ENDPOINTS.USER.SETTINGS.SYSTEM, data),

  // 获取用户统计数据
  getUserStats: () =>
    http.get<ApiResponse<UserStats>>(API_ENDPOINTS.USER.STATS),

  // 修改密码
  changePassword: (data: ChangePasswordRequest) =>
    http.put<ApiResponse<void>>(API_ENDPOINTS.USER.PASSWORD, data),

  // 获取学习日历数据
  getStudyCalendar: (startDate: string, endDate: string) =>
    http.get<ApiResponse<StudyCalendarData[]>>(API_ENDPOINTS.USER.CALENDAR, {
      params: { startDate, endDate },
    }),

  // 删除账号
  deleteAccount: () =>
    http.delete<ApiResponse<void>>(API_ENDPOINTS.USER.ACCOUNT),
};

export interface StudyCalendarData {
  date: string;
  focusMinutes: number;
  pomodoros: number;
  tasks: number;
  hasStudy: boolean;
}

export type {
  User,
  UserProfile,
  UpdateProfileRequest,
  PomodoroSettings,
  SystemSettings,
  UserStats,
  ChangePasswordRequest,
};
