// ==================== 用户相关类型 ====================

/**
 * 基础用户类型
 */
export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  nickname?: string;
  studyGoal?: string;
  // 番茄钟设置（在基础类型中包含以便 mock 数据使用）
  focusDuration?: number; // 默认专注时长（秒）
  shortBreakDuration?: number; // 短休息时长（秒）
  longBreakDuration?: number; // 长休息时长（秒）
  createdAt: string;
  updatedAt: string;
}

/**
 * 用户完整资料（包含设置和统计）
 */
export interface UserProfile extends User {
  // 番茄钟个性化设置
  focusDuration: number;           // 默认专注时长（秒）
  shortBreakDuration: number;      // 短休息时长（秒）
  longBreakDuration: number;       // 长休息时长（秒）
  autoStartBreak: boolean;         // 是否自动开始休息
  autoStartPomodoro: boolean;      // 是否自动开始下一个番茄
  longBreakInterval: number;       // 几个番茄后长休息
  
  // 系统设置
  theme: 'light' | 'dark' | 'system';
  notificationEnabled: boolean;
  soundEnabled: boolean;           // 提示音开关
  vibrationEnabled: boolean;       // 震动开关（移动端）
  language: string;                // 语言设置
  
  // 统计数据（实时计算或预聚合）
  stats: UserStats;
}

/**
 * 用户统计数据
 */
export interface UserStats {
  totalFocusMinutes: number;       // 累计专注时长（分钟）
  totalPomodoros: number;          // 累计番茄数
  totalTasks: number;              // 累计任务数
  completedTasks: number;          // 已完成任务数
  currentStreak: number;           // 当前连续天数
  longestStreak: number;           // 最长连续天数
  studyDays: number;               // 有学习记录的天数
  todayFocusMinutes: number;       // 今日专注时长
  todayPomodoros: number;          // 今日完成番茄数
  todayTasks: number;              // 今日完成任务数
}

/**
 * 更新用户资料请求
 */
export interface UpdateProfileRequest {
  nickname?: string;
  avatar?: string;
  studyGoal?: string;
  email?: string;
  phone?: string;
}

/**
 * 番茄钟设置
 */
export interface PomodoroSettings {
  focusDuration: number;           // 专注时长（秒）
  shortBreakDuration: number;      // 短休息时长（秒）
  longBreakDuration: number;       // 长休息时长（秒）
  autoStartBreak: boolean;         // 是否自动开始休息
  autoStartPomodoro: boolean;      // 是否自动开始下一个番茄
  longBreakInterval: number;       // 几个番茄后长休息
}

/**
 * 系统设置
 */
export interface SystemSettings {
  theme: 'light' | 'dark' | 'system';
  notificationEnabled: boolean;
  soundEnabled: boolean;           // 提示音开关
  vibrationEnabled: boolean;       // 震动开关（移动端）
  language: string;                // 语言设置
}

/**
 * 修改密码请求
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 学习日历数据
 */
export interface StudyCalendarData {
  date: string;                    // 日期 YYYY-MM-DD
  focusMinutes: number;
  pomodoros: number;
  tasks: number;
  hasStudy: boolean;
}

// 任务类型
export type TaskStatus = "todo" | "in_progress" | "completed" | "abandoned";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  parentId?: string;
  subtasks?: Task[];
  order?: number; // 任务排序序号
  estimatedPomodoros?: number; // 预估番茄数
  completedPomodoros?: number; // 已完成番茄数
  createdAt: string;
  updatedAt: string;
}

// 番茄钟记录类型
export type PomodoroStatus = "running" | "paused" | "stopped" | "completed";

export interface PomodoroRecord {
  id: string;
  userId: string;
  taskId?: string;
  task?: Task;
  startTime: string;
  endTime?: string;
  duration: number;
  actualDuration?: number;
  status: PomodoroStatus;
  isLocked: boolean;
  abandonReason?: string;
}

// 对话消息类型
export type MessageRole = "user" | "assistant";
export type MessageType = "text" | "voice" | "plan";

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  createdAt: string;
}

// 成就类型
export interface Achievement {
  id: string;
  userId: string;
  type: string;
  name: string;
  description: string;
  iconUrl?: string;
  unlockedAt: string;
}

// 社区动态类型
export interface SocialPost {
  id: string;
  userId: string;
  user?: User;
  content: string;
  images?: string[];
  tags?: string[];
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

// API 响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 认证相关类型
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  nickname?: string;
  email?: string;
  phone?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// 分页类型
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedData<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

// ==================== Dashboard 相关类型 ====================

export interface TodayStats {
  focusMinutes: number;
  completedPomodoros: number;
  completedTasks: number;
  streakDays: number;
}

export interface WeeklyOverview {
  totalPomodoros: number;
  totalFocusHours: number;
  completionRate: number;
  streakDays: number;
}

export interface DashboardSummary {
  todayStats: TodayStats;
  weeklyStats: WeeklyOverview;
  todayTasks: Task[];
  activePomodoro: PomodoroRecord | null;
}

// ==================== 番茄钟结算类型 ====================

export interface PomodoroSettlement {
  record: PomodoroRecord;
  task: Task | null;
  todayStats: TodayStats;
}

// ==================== 统计相关类型 ====================

export interface OverviewStats extends TodayStats {
  compareLastPeriod: {
    focusMinutes: string;  // 如 "+15%"
    pomodoros: string;
    tasks: string;
  };
}

export interface DailyStat {
  date: string;           // "2026-03-12"
  focusMinutes: number;
  pomodoros: number;
  tasks: number;
}

export interface SubjectStat {
  category: string;
  focusMinutes: number;
  percentage: number;
}

// ==================== 任务进度类型 ====================

export interface TaskProgress {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  completionRate: number;
  byCategory: Array<{
    category: string;
    total: number;
    completed: number;
  }>;
}

// ==================== 时间周期类型 ====================

export type StatsPeriod = 'today' | 'week' | 'month' | 'year';

// ==================== 任务排序类型 ====================

export interface TaskOrderItem {
  id: string;
  order: number;
}

export interface ReorderTasksRequest {
  taskOrders: TaskOrderItem[];
}
