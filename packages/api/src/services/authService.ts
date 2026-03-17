import { http } from "../client/httpClient";
import type {
  ApiResponse,
  User,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
} from "@studyflow/shared";
import { storage, STORAGE_KEYS } from "@studyflow/shared";

export const authService = {
  // 登录
  login: (data: LoginRequest) =>
    http.post<ApiResponse<TokenResponse>>("/api/v1/auth/login", data),

  // 注册
  register: (data: RegisterRequest) =>
    http.post<ApiResponse<TokenResponse>>("/api/v1/auth/register", data),

  // 刷新 Token
  refresh: (refreshToken: string) =>
    http.post<ApiResponse<TokenResponse>>("/api/v1/auth/refresh", {
      refreshToken,
    }),

  // 登出 — 发送 refreshToken 以便后端加入黑名单
  logout: () => {
    const refreshToken = storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
    return http.post<ApiResponse<void>>("/api/v1/auth/logout", { refreshToken });
  },

  // 获取当前用户
  getCurrentUser: () => http.get<ApiResponse<User>>("/api/v1/auth/me"),
};
