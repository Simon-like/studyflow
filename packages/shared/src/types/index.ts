// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  nickname?: string;
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  studyGoal?: string;
  createdAt: string;
  updatedAt: string;
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
  estimatedPomodoros: number;
  completedPomodoros: number;
  status: TaskStatus;
  dueDate?: string;
  parentId?: string;
  subtasks?: Task[];
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
