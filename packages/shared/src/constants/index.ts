// 应用常量
export const APP_NAME = "StudyFlow";
export const APP_VERSION = "1.0.0";

// 预设用户标签
export const PRESET_USER_TAGS = [
  { id: 'tag_kaoyan', name: '考研上岸', type: 'custom' as const, description: '正在备战考研' },
  { id: 'tag_math', name: '数学达人', type: 'custom' as const, description: '擅长数学学习' },
  { id: 'tag_english', name: '英语学霸', type: 'custom' as const, description: '英语能力出众' },
  { id: 'tag_coder', name: '代码工匠', type: 'custom' as const, description: '热爱编程学习' },
  { id: 'tag_early_bird', name: '早起鸟', type: 'custom' as const, description: '习惯早起学习' },
  { id: 'tag_night_owl', name: '夜猫子', type: 'custom' as const, description: '深夜学习效率更高' },
  { id: 'tag_focus', name: '专注力强', type: 'system' as const, description: '连续专注超过1小时' },
  { id: 'tag_persist', name: '持之以恒', type: 'achievement' as const, description: '连续打卡7天' },
  { id: 'tag_master', name: '学习大师', type: 'achievement' as const, description: '累计学习100小时' },
  { id: 'tag_tomato', name: '番茄达人', type: 'achievement' as const, description: '完成100个番茄钟' },
] as const;

// 用户可选择的最大标签数
export const MAX_USER_TAGS = 3;

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
    ME: "/api/v1/auth/me",
  },
  USER: {
    PROFILE: "/api/v1/users/profile",
    UPDATE_PROFILE: "/api/v1/users/profile",
    AVATAR: "/api/v1/users/avatar",
    PASSWORD: "/api/v1/users/password",
    ACCOUNT: "/api/v1/users/account",
    STATS: "/api/v1/users/stats",
    CALENDAR: "/api/v1/users/calendar",
    SETTINGS: {
      POMODORO: "/api/v1/users/settings/pomodoro",
      SYSTEM: "/api/v1/users/settings/system",
    },
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
    START: "/api/v1/pomodoros/start",
    STOP: (id: string) => `/api/v1/pomodoros/${id}/stop`,
    HISTORY: "/api/v1/pomodoros/history",
    TODAY_STATS: "/api/v1/pomodoros/stats/today",
    WEEKLY_STATS: "/api/v1/pomodoros/stats/weekly",
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
