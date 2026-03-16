/**
 * React Native HTTP Client
 * 
 * 专门适配 React Native 环境：
 * 1. 使用 AsyncStorage 替代 localStorage
 * 2. 使用 constants 管理 API URL
 * 3. 移除浏览器专属 API 引用
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys（与 tokenStorage.ts 保持一致）
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'studyflow_access_token',
  REFRESH_TOKEN: 'studyflow_refresh_token',
} as const;

// API 基础 URL 配置
// 注意：生产环境需要替换为实际的服务器地址
const API_BASE_URL = __DEV__ 
  ? "http://10.0.2.2:8080"  // Android 模拟器访问本机
  : "https://your-production-api.com";  // 生产环境地址

// 创建 axios 实例
const createHttpClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 请求拦截器
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to get token:', error);
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

      // Token 过期，尝试刷新
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
          if (refreshToken) {
            const response = await axios.post(
              `${baseURL}/api/v1/auth/refresh`,
              {},
              {
                headers: {
                  "X-Refresh-Token": refreshToken,
                },
              },
            );

            const { accessToken, refreshToken: newRefreshToken } =
              response.data.data;
            
            await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return client(originalRequest);
          }
        } catch (refreshError) {
          // 刷新失败，清除登录状态
          await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          // 注意：RN 中无法直接操作 window.location，由 AuthContext 处理跳转
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );

  return client;
};

// 默认客户端
export const httpClient = createHttpClient(API_BASE_URL);

// 创建自定义客户端
export { createHttpClient, API_BASE_URL };

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
