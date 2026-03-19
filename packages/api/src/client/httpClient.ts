import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { storage, STORAGE_KEYS } from "@studyflow/shared";

// 声明 process 以避免在浏览器环境中报错
declare const process: {
  env?: {
    VITE_API_BASE_URL?: string;
  };
} | undefined;

// 创建 axios 实例
const createHttpClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // 启用跨域凭证支持
  });

  // 请求拦截器
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = storage.get<string>(STORAGE_KEYS.TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // 响应拦截器
  client.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    async (error) => {
      const originalRequest = error.config;
      const requestUrl = originalRequest?.url || "";

      // 不对 refresh / logout 请求做 401 重试，避免死循环
      const isAuthRequest =
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/register") ||
        requestUrl.includes("/auth/refresh") ||
        requestUrl.includes("/auth/logout");

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isAuthRequest
      ) {
        originalRequest._retry = true;

        const refreshToken = storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          try {
            const response = await axios.post(
              `${baseURL}/api/v1/auth/refresh`,
              { refreshToken },
            );

            const { accessToken, refreshToken: newRefreshToken } =
              response.data.data;
            storage.set(STORAGE_KEYS.TOKEN, accessToken);
            storage.set(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return client(originalRequest);
          } catch {
            // refresh 失败，走下面的清理逻辑
          }
        }

        // 无 refreshToken 或 refresh 失败 → 清除状态跳转登录
        storage.remove(STORAGE_KEYS.TOKEN);
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        storage.remove(STORAGE_KEYS.USER);
        if (typeof window !== "undefined" && window.location) {
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }

      return Promise.reject(error);
    },
  );

  return client;
};

// 默认 API 地址
// Vite 项目通过 define 注入 process.env.VITE_API_BASE_URL
// React Native 通过 babel 的 transform-inline-environment-variables 或直接使用默认值
const DEFAULT_BASE_URL = "http://localhost:8080";

// 默认客户端
const getBaseUrl = () => {
  try {
    if (typeof process !== "undefined" && process.env?.VITE_API_BASE_URL) {
      return process.env.VITE_API_BASE_URL;
    }
  } catch {
    // 在浏览器环境中 process 可能不存在
  }
  return DEFAULT_BASE_URL;
};

export const httpClient = createHttpClient(getBaseUrl());

// 创建自定义客户端
export { createHttpClient };

// HTTP 方法封装
export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    httpClient.get<unknown, T>(url, config),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.post<unknown, T>(url, data, config),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.put<unknown, T>(url, data, config),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.patch<unknown, T>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    httpClient.delete<unknown, T>(url, config),
};
