// 应用常量
export const APP_NAME = "StudyFlow";
export const APP_VERSION = "1.0.0";

// 番茄钟默认设置
export const DEFAULT_FOCUS_DURATION = 25 * 60; // 25 分钟（秒）
export const DEFAULT_SHORT_BREAK_DURATION = 5 * 60; // 5 分钟
export const DEFAULT_LONG_BREAK_DURATION = 15 * 60; // 15 分钟
export const POMODOROS_BEFORE_LONG_BREAK = 4;

// 存储键
export const STORAGE_KEYS = {
  TOKEN: "studyflow_token",
  REFRESH_TOKEN: "studyflow_refresh_token",
  USER: "studyflow_user",
  POMODORO_SETTINGS: "studyflow_pomodoro_settings",
  TASKS: "studyflow_tasks",
} as const;

// 路由路径
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  TASKS: "/tasks",
  STATS: "/stats",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  COMPANION: "/companion",
  COMMUNITY: "/community",
} as const;

// API 端点
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    REFRESH: "/api/v1/auth/refresh",
    LOGOUT: "/api/v1/auth/logout",
  },
  USER: {
    PROFILE: "/api/v1/user/profile",
    UPDATE: "/api/v1/user/update",
  },
  TASK: {
    LIST: "/api/v1/tasks",
    TODAY: "/api/v1/tasks/today",
    CREATE: "/api/v1/tasks",
    UPDATE: (id: string) => `/api/v1/tasks/${id}`,
    DELETE: (id: string) => `/api/v1/tasks/${id}`,
    TOGGLE: (id: string) => `/api/v1/tasks/${id}/toggle`,
    START: (id: string) => `/api/v1/tasks/${id}/start`,
    PROGRESS: "/api/v1/tasks/progress",
    REORDER: "/api/v1/tasks/reorder",
  },
  POMODORO: {
    START: "/api/v1/pomodoro/start",
    STOP: (id: string) => `/api/v1/pomodoro/${id}/stop`,
    HISTORY: "/api/v1/pomodoro/history",
    TODAY_STATS: "/api/v1/pomodoro/stats/today",
    WEEKLY_STATS: "/api/v1/pomodoro/stats/weekly",
  },
  STATS: {
    OVERVIEW: "/api/v1/stats/overview",
    DAILY: "/api/v1/stats/daily",
    SUBJECTS: "/api/v1/stats/subjects",
  },
  DASHBOARD: {
    SUMMARY: "/api/v1/dashboard/summary",
  },
} as const;
