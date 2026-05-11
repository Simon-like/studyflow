import { http } from "../httpClient";
import { API_ENDPOINTS } from "@studyflow/shared";
import type {
  ApiResponse,
  User,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
} from "@studyflow/shared";

export const authService = {
  // 登录
  login: (data: LoginRequest) =>
    http.post<ApiResponse<TokenResponse & { user: User }>>(API_ENDPOINTS.AUTH.LOGIN, data),

  // 注册
  register: (data: RegisterRequest) =>
    http.post<ApiResponse<TokenResponse & { user: User }>>(API_ENDPOINTS.AUTH.REGISTER, data),

  // 刷新 Token（Spring Boot 读 body.refreshToken）
  refresh: (refreshToken: string) =>
    http.post<ApiResponse<TokenResponse>>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken }),

  // 登出（将 token 加入 Redis 黑名单）
  logout: () => http.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.LOGOUT),

  // 获取当前用户信息
  getCurrentUser: () => http.get<ApiResponse<User>>(API_ENDPOINTS.USER.PROFILE),
};
