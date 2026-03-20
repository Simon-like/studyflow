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
// iOS 模拟器使用 localhost，Android 模拟器使用 10.0.2.2
import { Platform } from 'react-native';

/**
 * API 基础 URL 配置
 *
 * 开发环境 (__DEV__):
 *   - Android 模拟器: 10.0.2.2 (访问本机 localhost)
 *   - iOS 模拟器: localhost
 *   - 真机调试: 需要改为电脑的局域网 IP (如 192.168.x.x)
 *
 * 生产环境:
 *   - 需要配置你的实际服务器地址
 *   - 修改下面的 PRODUCTION_API_URL 为你的后端地址
 */

// ⚠️ 部署前必须修改为你的实际后端地址！
// 例如: 'https://api.yourdomain.com' 或 'http://your-server-ip:3001'
const PRODUCTION_API_URL = 'https://api.studyflow.com';

// 开发环境配置
const getDevApiUrl = (): string => {
  // 真机调试时修改为电脑的局域网 IP
  // 例如: 'http://192.168.1.100:3001'
  const LOCAL_IP = null; // 设置为你的电脑 IP，如 '192.168.1.100'

  if (LOCAL_IP) {
    return `http://${LOCAL_IP}:3001`;
  }

  return Platform.OS === 'android'
    ? 'http://10.0.2.2:3001'   // Android 模拟器
    : 'http://localhost:3001';  // iOS 模拟器
};

const DEV_API_URL = getDevApiUrl();

// 根据环境选择 API 地址
const API_BASE_URL = __DEV__ ? DEV_API_URL : PRODUCTION_API_URL;

// 调试日志
if (__DEV__) {
  console.log('📡 API Base URL:', API_BASE_URL);
}

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
