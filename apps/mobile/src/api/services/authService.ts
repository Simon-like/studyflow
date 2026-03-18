import { http } from "../httpClient";
import type {
  ApiResponse,
  User,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
} from "@studyflow/shared";

export const authService = {
  // 登录（仅使用手机号）
  login: (data: LoginRequest) =>
    http.post<ApiResponse<TokenResponse & { user: User }>>("/api/v1/auth/login", data),

  // 注册（手机号必填，自动生成账号和PIN）
  register: (data: RegisterRequest) =>
    http.post<ApiResponse<TokenResponse & { user: User }>>("/api/v1/auth/register", data),

  // 刷新 Token
  refresh: (refreshToken: string) =>
    http.post<ApiResponse<TokenResponse>>(
      "/api/v1/auth/refresh",
      {},
      {
        headers: {
          "X-Refresh-Token": refreshToken,
        },
      },
    ),

  // 登出
  logout: () => http.post<ApiResponse<void>>("/api/v1/auth/logout"),

  // 获取当前用户
  getCurrentUser: () => http.get<ApiResponse<User>>("/api/v1/user/profile"),
};
