/**
 * Mock 数据
 * 测试账号: test@studyflow.com / Test1234
 */

import type {
  User,
  UserProfile,
  UserStats,
  PomodoroSettings,
  SystemSettings,
  Task,
  PomodoroRecord,
  ChatMessage,
  SocialPost,
  Achievement,
  UserTag,
} from "@studyflow/shared";

// ==================== 测试账号 ====================

export const TEST_ACCOUNT = {
  username: "test@studyflow.com",
  password: "Test1234",
};

// ==================== 用户数据 ====================

export const MOCK_USER: User = {
  id: "user-001",
  username: "test@studyflow.com",
  email: "test@studyflow.com",
  phone: "13800138000",
  nickname: "学习达人",
  avatar: "",
  studyGoal: "考研上岸",
  createdAt: "2026-01-15T08:00:00Z",
  updatedAt: "2026-03-12T10:00:00Z",
};

// 用户标签
export const MOCK_USER_TAGS: UserTag[] = [
  { id: 'tag_kaoyan', name: '考研上岸', type: 'custom' },
  { id: 'tag_math', name: '数学达人', type: 'custom' },
  { id: 'tag_focus', name: '专注力强', type: 'system' },
];

// 用户统计
export const MOCK_USER_STATS: UserStats = {
  totalFocusMinutes: 900,
  totalPomodoros: 36,
  totalTasks: 25,
  completedTasks: 16,
  currentStreak: 7,
  longestStreak: 15,
  studyDays: 30,
  todayFocusMinutes: 75,
  todayPomodoros: 3,
  todayTasks: 2,
};

// 番茄钟设置
export const MOCK_POMODORO_SETTINGS: PomodoroSettings = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  autoStartBreak: false,
  autoStartPomodoro: false,
  longBreakInterval: 4,
};

// 系统设置
export const MOCK_SYSTEM_SETTINGS: SystemSettings = {
  theme: 'light',
  notificationEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  language: 'zh-CN',
};

// 用户完整资料
export const MOCK_USER_PROFILE: UserProfile = {
  ...MOCK_USER,
  tags: MOCK_USER_TAGS,
  focusDuration: MOCK_POMODORO_SETTINGS.focusDuration,
  shortBreakDuration: MOCK_POMODORO_SETTINGS.shortBreakDuration,
  longBreakDuration: MOCK_POMODORO_SETTINGS.longBreakDuration,
  autoStartBreak: MOCK_POMODORO_SETTINGS.autoStartBreak,
  autoStartPomodoro: MOCK_POMODORO_SETTINGS.autoStartPomodoro,
  longBreakInterval: MOCK_POMODORO_SETTINGS.longBreakInterval,
  theme: MOCK_SYSTEM_SETTINGS.theme,
  notificationEnabled: MOCK_SYSTEM_SETTINGS.notificationEnabled,
  soundEnabled: MOCK_SYSTEM_SETTINGS.soundEnabled,
  vibrationEnabled: MOCK_SYSTEM_SETTINGS.vibrationEnabled,
  language: MOCK_SYSTEM_SETTINGS.language,
  stats: MOCK_USER_STATS,
};

export const MOCK_TOKENS = {
  accessToken:
    "mock-access-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.studyflow",
  refreshToken:
    "mock-refresh-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.studyflow",
  expiresIn: 7200,
};

// ==================== 任务数据 ====================

export const MOCK_TASKS: Task[] = [
  {
    id: "task-001",
    userId: "user-001",
    title: "高等数学 - 极限与连续",
    description: "复习第一章极限的定义、性质和求解方法",
    category: "高等数学",
    priority: "high",
    status: "in_progress",
    dueDate: "2026-03-15T00:00:00Z",
    createdAt: "2026-03-10T08:00:00Z",
    updatedAt: "2026-03-12T10:00:00Z",
  },
  {
    id: "task-002",
    userId: "user-001",
    title: "英语阅读理解 - 真题训练",
    description: "完成2024年英语一阅读真题",
    category: "英语",
    priority: "medium",
    status: "todo",
    dueDate: "2026-03-14T00:00:00Z",
    createdAt: "2026-03-11T08:00:00Z",
    updatedAt: "2026-03-11T08:00:00Z",
  },
  {
    id: "task-003",
    userId: "user-001",
    title: "线性代数 - 矩阵运算",
    description: "矩阵的加减乘除和逆矩阵求解练习",
    category: "线性代数",
    priority: "high",
    status: "completed",
    createdAt: "2026-03-09T08:00:00Z",
    updatedAt: "2026-03-11T16:00:00Z",
  },
  {
    id: "task-004",
    userId: "user-001",
    title: "政治 - 马原重点背诵",
    description: "唯物辩证法核心考点梳理",
    category: "政治",
    priority: "low",
    status: "todo",
    dueDate: "2026-03-20T00:00:00Z",
    createdAt: "2026-03-12T08:00:00Z",
    updatedAt: "2026-03-12T08:00:00Z",
  },
  {
    id: "task-005",
    userId: "user-001",
    title: "概率论 - 条件概率",
    description: "贝叶斯公式及全概率公式练习",
    category: "概率论",
    priority: "medium",
    status: "todo",
    createdAt: "2026-03-11T14:00:00Z",
    updatedAt: "2026-03-12T09:00:00Z",
  },
];

// ==================== 番茄钟记录 ====================

export const MOCK_POMODORO_RECORDS: PomodoroRecord[] = [
  {
    id: "pomo-001",
    userId: "user-001",
    taskId: "task-001",
    startTime: "2026-03-12T08:00:00Z",
    endTime: "2026-03-12T08:25:00Z",
    duration: 1500,
    actualDuration: 1500,
    status: "completed",
    isLocked: false,
  },
  {
    id: "pomo-002",
    userId: "user-001",
    taskId: "task-001",
    startTime: "2026-03-12T08:30:00Z",
    endTime: "2026-03-12T08:55:00Z",
    duration: 1500,
    actualDuration: 1500,
    status: "completed",
    isLocked: false,
  },
  {
    id: "pomo-003",
    userId: "user-001",
    taskId: "task-005",
    startTime: "2026-03-12T09:00:00Z",
    endTime: "2026-03-12T09:25:00Z",
    duration: 1500,
    actualDuration: 1500,
    status: "completed",
    isLocked: true,
  },
];

// ==================== 聊天消息 ====================

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-001",
    sessionId: "session-001",
    role: "assistant",
    content: "你好！我是你的AI学习伙伴。今天想学什么？",
    type: "text",
    createdAt: "2026-03-12T08:00:00Z",
  },
  {
    id: "msg-002",
    sessionId: "session-001",
    role: "user",
    content: "帮我规划一下今天的高数复习",
    type: "text",
    createdAt: "2026-03-12T08:01:00Z",
  },
  {
    id: "msg-003",
    sessionId: "session-001",
    role: "assistant",
    content:
      "根据你的进度，建议今天的高数复习这样安排：\n\n1. **极限复习** (2个番茄钟)\n   - 回顾极限的定义和性质\n   - 练习夹逼准则相关题目\n\n2. **连续性** (2个番茄钟)\n   - 函数连续性判断\n   - 间断点分类练习\n\n需要我帮你创建对应的任务吗？",
    type: "text",
    createdAt: "2026-03-12T08:01:30Z",
  },
];

// ==================== 社区帖子 ====================

export const MOCK_POSTS: SocialPost[] = [
  {
    id: "post-001",
    userId: "user-002",
    user: {
      id: "user-002",
      username: "mathlover",
      email: "math@example.com",
      nickname: "数学小王子",
      avatar: "",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-03-12T00:00:00Z",
    },
    content:
      "今天终于搞懂了泰勒展开！连续学了4个番茄钟，感觉自己棒棒的 🍅🍅🍅🍅",
    tags: ["高等数学", "考研"],
    likeCount: 23,
    commentCount: 5,
    isLiked: false,
    createdAt: "2026-03-12T09:30:00Z",
    updatedAt: "2026-03-12T09:30:00Z",
  },
  {
    id: "post-002",
    userId: "user-003",
    user: {
      id: "user-003",
      username: "englishpro",
      email: "eng@example.com",
      nickname: "英语冲冲冲",
      avatar: "",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-03-12T00:00:00Z",
    },
    content: "分享一个背单词的方法：用番茄钟计时，每个番茄钟背30个词，效率超高！",
    tags: ["英语", "学习方法"],
    likeCount: 45,
    commentCount: 12,
    isLiked: true,
    createdAt: "2026-03-11T18:00:00Z",
    updatedAt: "2026-03-11T18:00:00Z",
  },
];

// ==================== 成就 ====================

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-001",
    userId: "user-001",
    type: "first_pomodoro",
    name: "初次专注",
    description: "完成第一个番茄钟",
    unlockedAt: "2026-01-15T09:00:00Z",
  },
  {
    id: "ach-002",
    userId: "user-001",
    type: "streak_7",
    name: "坚持一周",
    description: "连续7天完成学习任务",
    unlockedAt: "2026-01-22T20:00:00Z",
  },
  {
    id: "ach-003",
    userId: "user-001",
    type: "pomodoro_100",
    name: "百番达人",
    description: "累计完成100个番茄钟",
    unlockedAt: "2026-02-28T18:00:00Z",
  },
];

// ==================== 统计数据 ====================

export const MOCK_DAILY_STATS = [
  { date: "2026-03-06", focusMinutes: 100, pomodoros: 4, tasks: 2 },
  { date: "2026-03-07", focusMinutes: 150, pomodoros: 6, tasks: 3 },
  { date: "2026-03-08", focusMinutes: 75, pomodoros: 3, tasks: 1 },
  { date: "2026-03-09", focusMinutes: 200, pomodoros: 8, tasks: 4 },
  { date: "2026-03-10", focusMinutes: 125, pomodoros: 5, tasks: 2 },
  { date: "2026-03-11", focusMinutes: 175, pomodoros: 7, tasks: 3 },
  { date: "2026-03-12", focusMinutes: 75, pomodoros: 3, tasks: 1 },
];

export const MOCK_OVERVIEW_STATS = {
  totalFocusMinutes: 900,
  completedPomodoros: 36,
  completedTasks: 16,
  streakDays: 7,
  compareLastPeriod: {
    focusMinutes: "+15%",
    pomodoros: "+20%",
    tasks: "-5%",
  },
};

// 预设标签列表
export const PRESET_TAGS = [
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
];

export const MOCK_SUBJECT_STATS = [
  { category: "高等数学", focusMinutes: 320, percentage: 35.6 },
  { category: "英语", focusMinutes: 220, percentage: 24.4 },
  { category: "线性代数", focusMinutes: 180, percentage: 20.0 },
  { category: "概率论", focusMinutes: 100, percentage: 11.1 },
  { category: "政治", focusMinutes: 80, percentage: 8.9 },
];
