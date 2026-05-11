// 应用常量
export const APP_NAME = "StudyFlow";
export const APP_VERSION = "1.0.0";

import type { UserTag } from '../types';

// 预设用户标签
export const PRESET_USER_TAGS: UserTag[] = [
  { id: 'tag_kaoyan', name: '考研上岸', type: 'custom' },
  { id: 'tag_math', name: '数学达人', type: 'custom' },
  { id: 'tag_english', name: '英语学霸', type: 'custom' },
  { id: 'tag_coder', name: '代码工匠', type: 'custom' },
  { id: 'tag_early_bird', name: '早起鸟', type: 'custom' },
  { id: 'tag_night_owl', name: '夜猫子', type: 'custom' },
  { id: 'tag_focus', name: '专注力强', type: 'system' },
  { id: 'tag_persist', name: '持之以恒', type: 'achievement' },
  { id: 'tag_master', name: '学习大师', type: 'achievement' },
  { id: 'tag_tomato', name: '番茄达人', type: 'achievement' },
];

// 用户可选择的最大标签数
export const MAX_USER_TAGS = 3;

// 番茄钟默认设置
export const DEFAULT_FOCUS_DURATION = 25 * 60; // 25 分钟（秒）
export const DEFAULT_BREAK_DURATION = 5 * 60; // 休息时长 5 分钟（秒）
export const DEFAULT_SHORT_BREAK_DURATION = 5 * 60; // 5 分钟（兼容旧代码）
export const DEFAULT_LONG_BREAK_DURATION = 15 * 60; // 15 分钟（兼容旧代码）
export const POMODOROS_BEFORE_LONG_BREAK = 4;
export const REST_EXTEND_SECONDS = 5 * 60; // 休息延长 5 分钟

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

// API 端点（对应 Spring Boot 后端，端口 8080，无 /api/v1 前缀）
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  USER: {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
    AVATAR: "/users/avatar",
    PASSWORD: "/users/password",
    ACCOUNT: "/users/account",
    STATS: "/users/stats",
    CALENDAR: "/users/calendar",
    SETTINGS: {
      POMODORO: "/users/settings/pomodoro",
      SYSTEM: "/users/settings/system",
    },
  },
  TASK: {
    LIST: "/tasks",
    TODAY: "/tasks/today",
    CREATE: "/tasks",
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
    TOGGLE: (id: string) => `/tasks/${id}/toggle`,
    START: (id: string) => `/tasks/${id}/start`,
    PROGRESS: "/tasks/progress",
    REORDER: "/tasks/reorder",
  },
  POMODORO: {
    START: "/pomodoros/start",
    STOP: (id: string) => `/pomodoros/${id}/stop`,
    ACTIVE: "/pomodoros/active",
    HISTORY: "/pomodoros/history",
    TODAY_STATS: "/pomodoros/stats/today",
    WEEKLY_STATS: "/pomodoros/stats/weekly",
  },
  STATS: {
    OVERVIEW: "/stats/overview",
    DAILY: "/stats/daily",
    SUBJECTS: "/stats/subjects",
  },
  COMPANION: {
    CHAT: "/companion/chat",
    SESSIONS: "/companion/sessions",
    SESSION_HISTORY: (id: string) => `/companion/sessions/${id}`,
    PLAN: "/companion/plan",
    PLANS: "/companion/plans",
    QUICK_REPLIES: "/companion/quick-replies",
  },
  COMMUNITY: {
    POSTS: "/community/posts",
    POST: (id: string) => `/community/posts/${id}`,
    LIKE: (id: string) => `/community/posts/${id}/like`,
    COMMENTS: (id: string) => `/community/posts/${id}/comments`,
    GROUPS: "/community/groups",
    JOIN_GROUP: (id: string) => `/community/groups/${id}/join`,
    LEAVE_GROUP: (id: string) => `/community/groups/${id}/leave`,
  },
  DASHBOARD: {
    // 复合接口，由前端聚合多个接口数据
    SUMMARY: "/stats/overview",
  },
} as const;
