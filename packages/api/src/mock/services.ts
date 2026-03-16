/**
 * Mock 服务实现
 * 与 services/ 下的真实服务接口完全一致
 *
 * 测试账号: test@studyflow.com / Test1234
 */

import type {
  ApiResponse,
  User,
  Task,
  TaskProgress,
  TodayStats,
  TokenResponse,
  LoginRequest,
  RegisterRequest,
  PomodoroRecord,
  ChatMessage,
  SocialPost,
  PaginatedData,
  PaginationParams,
  ReorderTasksRequest,
} from "@studyflow/shared";
import { STORAGE_KEYS } from "@studyflow/shared";
import {
  TEST_ACCOUNT,
  MOCK_USER,
  MOCK_TOKENS,
  MOCK_TASKS,
  MOCK_POMODORO_RECORDS,
  MOCK_CHAT_MESSAGES,
  MOCK_POSTS,
  MOCK_USER_TAGS,
  PRESET_TAGS,
} from "./data";
import { mockDelay, ok, fail, paginate, genId } from "./helpers";
import type { CreateTaskRequest, UpdateTaskRequest } from "../services/taskService";
import type { StartPomodoroRequest, StopPomodoroRequest } from "../services/pomodoroService";
import type { SendMessageRequest } from "../services/chatService";

// ==================== 安全 Storage 封装 ====================
// localStorage 在 React Native 中不存在，做 try-catch 保护

const safeStorage = {
  set: (key: string, value: unknown) => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch { /* noop */ }
  },
  get: <T>(key: string): T | null => {
    try {
      if (typeof localStorage !== "undefined") {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : null;
      }
    } catch { /* noop */ }
    return null;
  },
  remove: (key: string) => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch { /* noop */ }
  },
};

// ==================== 内存状态 ====================

let currentUser: User | null = null;

let registeredUsers: Array<{
  user: User;
  password: string;
}> = [{ user: { ...MOCK_USER }, password: TEST_ACCOUNT.password }];

let tasks = [...MOCK_TASKS];
let pomodoroRecords = [...MOCK_POMODORO_RECORDS];
let chatMessages = [...MOCK_CHAT_MESSAGES];
let posts = [...MOCK_POSTS];

// ==================== Auth Mock ====================

type AuthLoginResponse = ApiResponse<TokenResponse & { user: User }>;
type AuthRegisterResponse = AuthLoginResponse;

export const mockAuthService = {
  login: async (data: LoginRequest): Promise<AuthLoginResponse> => {
    await mockDelay();

    const found = registeredUsers.find(
      (u) =>
        (u.user.username === data.username ||
          u.user.email === data.username ||
          u.user.phone === data.username) &&
        u.password === data.password,
    );

    if (!found) {
      throw { response: { status: 401, data: fail(401, "账号或密码错误") } };
    }

    currentUser = found.user;
    safeStorage.set(STORAGE_KEYS.TOKEN, MOCK_TOKENS.accessToken);
    safeStorage.set(STORAGE_KEYS.REFRESH_TOKEN, MOCK_TOKENS.refreshToken);
    safeStorage.set(STORAGE_KEYS.USER, found.user);

    return ok({ ...MOCK_TOKENS, user: found.user });
  },

  register: async (data: RegisterRequest): Promise<AuthRegisterResponse> => {
    await mockDelay();

    // 检查唯一性
    const exists = registeredUsers.some(
      (u) =>
        u.user.username === data.username ||
        u.user.email === data.username ||
        u.user.phone === data.username,
    );
    if (exists) {
      throw {
        response: { status: 409, data: fail(409, "该手机号/邮箱已被注册") },
      };
    }

    const isEmailAddr = data.username.includes("@");
    const newUser: User = {
      id: genId(),
      username: data.username,
      email: isEmailAddr ? data.username : (data.email || ""),
      phone: isEmailAddr ? (data.phone || "") : data.username,
      nickname: data.nickname || data.username.split("@")[0],
      avatar: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    registeredUsers.push({ user: newUser, password: data.password });

    currentUser = newUser;
    safeStorage.set(STORAGE_KEYS.TOKEN, MOCK_TOKENS.accessToken);
    safeStorage.set(STORAGE_KEYS.REFRESH_TOKEN, MOCK_TOKENS.refreshToken);
    safeStorage.set(STORAGE_KEYS.USER, newUser);

    return ok({ ...MOCK_TOKENS, user: newUser });
  },

  refresh: async (): Promise<ApiResponse<TokenResponse>> => {
    await mockDelay(200);
    return ok(MOCK_TOKENS);
  },

  logout: async (): Promise<ApiResponse<void>> => {
    await mockDelay(200);
    currentUser = null;
    safeStorage.remove(STORAGE_KEYS.TOKEN);
    safeStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    safeStorage.remove(STORAGE_KEYS.USER);
    return ok(undefined as unknown as void);
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    await mockDelay(300);
    const user = currentUser || safeStorage.get<User>(STORAGE_KEYS.USER);
    if (!user) {
      throw { response: { status: 401, data: fail(401, "未登录") } };
    }
    return ok(user);
  },
};

// ==================== Task Mock ====================

export const mockTaskService = {
  getTasks: async (
    params?: PaginationParams & {
      status?: string;
      priority?: string;
      keyword?: string;
    },
  ): Promise<ApiResponse<PaginatedData<Task>>> => {
    await mockDelay(400);

    let filtered = [...tasks];
    if (params?.status) {
      filtered = filtered.filter((t) => t.status === params.status);
    }
    if (params?.priority) {
      filtered = filtered.filter((t) => t.priority === params.priority);
    }
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(kw) ||
          t.description?.toLowerCase().includes(kw),
      );
    }

    return ok(paginate(filtered, params));
  },

  getTodayTasks: async (): Promise<ApiResponse<Task[]>> => {
    await mockDelay(300);
    // 返回未完成任务 + 今天刚完成的任务
    const active = tasks.filter(
      (t) => t.status === "todo" || t.status === "in_progress",
    );
    // 排序：in_progress > todo，同状态下 high > medium > low
    const sorted = active.sort((a, b) => {
      const statusOrder = { in_progress: 0, todo: 1, completed: 2, abandoned: 3 };
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    return ok(sorted);
  },

  getTask: async (id: string): Promise<ApiResponse<Task>> => {
    await mockDelay(200);
    const task = tasks.find((t) => t.id === id);
    if (!task) throw { response: { status: 404, data: fail(404, "任务不存在") } };
    return ok(task);
  },

  createTask: async (data: CreateTaskRequest): Promise<ApiResponse<Task>> => {
    await mockDelay();
    const task: Task = {
      id: genId(),
      userId: "user-001",
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority || "medium",
      status: "todo",
      dueDate: data.dueDate,
      parentId: data.parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.unshift(task);
    return ok(task, "创建成功");
  },

  updateTask: async (
    id: string,
    data: UpdateTaskRequest,
  ): Promise<ApiResponse<Task>> => {
    await mockDelay();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1)
      throw { response: { status: 404, data: fail(404, "任务不存在") } };

    tasks[idx] = {
      ...tasks[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return ok(tasks[idx], "更新成功");
  },

  deleteTask: async (id: string): Promise<ApiResponse<void>> => {
    await mockDelay(300);
    tasks = tasks.filter((t) => t.id !== id);
    return ok(undefined as unknown as void, "删除成功");
  },

  // 快速切换任务状态 (PATCH /api/v1/tasks/{id}/toggle)
  toggleStatus: async (id: string): Promise<ApiResponse<Task>> => {
    await mockDelay(200);
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1)
      throw { response: { status: 404, data: fail(404, "任务不存在") } };

    const currentStatus = tasks[idx].status;
    const newStatus: Task["status"] =
      currentStatus === "completed" ? "todo" : "completed";

    tasks[idx] = {
      ...tasks[idx],
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    recalculateTodayStats();
    return ok(tasks[idx]);
  },

  // 设置任务为进行中 (POST /api/v1/tasks/{id}/start)
  startTask: async (id: string): Promise<ApiResponse<Task>> => {
    await mockDelay(200);
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1)
      throw { response: { status: 404, data: fail(404, "任务不存在") } };

    // 先将所有其他 in_progress 任务重置为 todo
    tasks.forEach((task, i) => {
      if (task.status === "in_progress" && i !== idx) {
        tasks[i] = { ...task, status: "todo", updatedAt: new Date().toISOString() };
      }
    });

    // 设置当前任务为 in_progress
    tasks[idx] = {
      ...tasks[idx],
      status: "in_progress",
      updatedAt: new Date().toISOString(),
    };
    return ok(tasks[idx]);
  },

  // 获取任务进度统计 (GET /api/v1/tasks/progress)
  getProgress: async (period?: string): Promise<ApiResponse<TaskProgress>> => {
    await mockDelay(300);
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const todo = tasks.filter((t) => t.status === "todo").length;

    // 按分类统计
    const categoryMap = new Map<string, { total: number; completed: number }>();
    tasks.forEach((t) => {
      const cat = t.category || "未分类";
      const existing = categoryMap.get(cat) || { total: 0, completed: 0 };
      existing.total++;
      if (t.status === "completed") existing.completed++;
      categoryMap.set(cat, existing);
    });

    const byCategory = Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      ...stats,
    }));

    return ok({
      total,
      completed,
      inProgress,
      todo,
      completionRate: total > 0 ? Math.round((completed / total) * 100 * 10) / 10 : 0,
      byCategory,
    });
  },

  // 更新任务排序 (POST /api/v1/tasks/reorder)
  reorderTasks: async (data: ReorderTasksRequest): Promise<ApiResponse<Task[]>> => {
    await mockDelay(200);
    
    // 更新任务的 order 字段
    data.taskOrders.forEach(({ id, order }) => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        task.order = order;
      }
    });
    
    // 按 order 排序返回
    const sortedTasks = [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));
    return ok(sortedTasks);
  },
};

// ==================== Pomodoro Mock ====================

// 模拟今日统计数据（实时聚合）
let todayPomodoroCount = 0;
let todayFocusMinutes = 0;
let todayCompletedTasks = 0;

// 记录今天已经完成的任务ID（避免重复计数）
const todayCompletedTaskIds = new Set<string>();

const toDateKey = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCompletedDurationSeconds = (record: PomodoroRecord): number => {
  if (typeof record.actualDuration === "number" && record.actualDuration > 0) {
    return record.actualDuration;
  }
  return record.duration || 0;
};

const toFocusMinutes = (seconds: number): number => {
  if (seconds <= 0) return 0;
  return Math.max(1, Math.round(seconds / 60));
};

const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
};

const recalculateTodayStats = () => {
  const todayKey = toDateKey(new Date());

  const completedTodayRecords = pomodoroRecords.filter((record) => {
    if (record.status !== "completed") return false;
    const effectiveTime = record.endTime || record.startTime;
    return toDateKey(effectiveTime) === todayKey;
  });

  todayPomodoroCount = completedTodayRecords.length;
  todayFocusMinutes = completedTodayRecords.reduce(
    (sum, record) => sum + toFocusMinutes(getCompletedDurationSeconds(record)),
    0,
  );

  todayCompletedTaskIds.clear();
  tasks.forEach((task) => {
    if (task.status === "completed" && toDateKey(task.updatedAt) === todayKey) {
      todayCompletedTaskIds.add(task.id);
    }
  });
  todayCompletedTasks = todayCompletedTaskIds.size;
};

recalculateTodayStats();

export const mockPomodoroService = {
  start: async (
    data: StartPomodoroRequest,
  ): Promise<ApiResponse<PomodoroRecord>> => {
    await mockDelay();

    const running = pomodoroRecords.find((r) => r.status === "running");
    if (running) {
      throw {
        response: { status: 409, data: fail(409, "已有正在进行的番茄钟") },
      };
    }

    const record: PomodoroRecord = {
      id: genId(),
      userId: "user-001",
      taskId: data.taskId,
      startTime: new Date().toISOString(),
      duration: data.duration,
      status: "running",
      isLocked: data.isLocked,
    };
    pomodoroRecords.push(record);
    return ok(record);
  },

  // 增强版 stop：返回 PomodoroSettlement（结算摘要）
  stop: async (
    id: string,
    data: StopPomodoroRequest,
  ): Promise<ApiResponse<import("@studyflow/shared").PomodoroSettlement>> => {
    await mockDelay();
    const idx = pomodoroRecords.findIndex((r) => r.id === id);
    if (idx === -1)
      throw { response: { status: 404, data: fail(404, "记录不存在") } };

    const now = new Date();
    const current = pomodoroRecords[idx];
    const start = new Date(current.startTime);
    const elapsedDuration = Math.max(0, Math.floor((now.getTime() - start.getTime()) / 1000));
    const isCompleted = data.status === "completed";
    const actualDuration = isCompleted
      ? (elapsedDuration <= 1 ? (current.duration || 0) : elapsedDuration)
      : elapsedDuration;

    // 更新记录
    pomodoroRecords[idx] = {
      ...current,
      status: isCompleted ? "completed" : "stopped",
      endTime: now.toISOString(),
      actualDuration,
      abandonReason: data.abandonReason,
    };

    const record = pomodoroRecords[idx];
    let updatedTask: Task | null = null;

    // 如果完成且有关联任务，将任务状态设为进行中（如果是todo）
    if (isCompleted && record.taskId) {
      const taskIdx = tasks.findIndex((t) => t.id === record.taskId);
      if (taskIdx !== -1 && tasks[taskIdx].status === "todo") {
        tasks[taskIdx] = {
          ...tasks[taskIdx],
          status: "in_progress",
          updatedAt: now.toISOString(),
        };
        updatedTask = tasks[taskIdx];
      }
    }

    recalculateTodayStats();

    // 构建结算摘要
    const settlement: import("@studyflow/shared").PomodoroSettlement = {
      record,
      task: updatedTask,
      todayStats: {
        focusMinutes: todayFocusMinutes,
        completedPomodoros: todayPomodoroCount,
        completedTasks: todayCompletedTasks,
        streakDays: 7,
      },
    };

    return ok(settlement);
  },

  getHistory: async (
    params?: PaginationParams,
  ): Promise<ApiResponse<PaginatedData<PomodoroRecord>>> => {
    await mockDelay(400);
    return ok(paginate(pomodoroRecords, params));
  },

  // 获取今日统计 (TodayStats 格式)
  getTodayStats: async (): Promise<ApiResponse<TodayStats>> => {
    await mockDelay(300);
    recalculateTodayStats();
    return ok({
      focusMinutes: todayFocusMinutes,
      completedPomodoros: todayPomodoroCount,
      completedTasks: todayCompletedTasks,
      streakDays: 7,
    });
  },

  getWeeklyStats: async () => {
    await mockDelay(400);
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    weekStart.setHours(0, 0, 0, 0);

    const dailyStats = Array.from({ length: 7 }).map((_, i) => {
      const dayStart = new Date(weekStart);
      dayStart.setDate(weekStart.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dayRecords = pomodoroRecords.filter((record) => {
        if (record.status !== "completed") return false;
        const effectiveTime = new Date(record.endTime || record.startTime);
        return isDateInRange(effectiveTime, dayStart, dayEnd);
      });

      const focusSeconds = dayRecords.reduce(
        (sum, record) => sum + getCompletedDurationSeconds(record),
        0,
      );

      return {
        date: toDateKey(dayStart),
        pomodoros: dayRecords.length,
        focusTime: focusSeconds,
      };
    });

    return ok({ dailyStats });
  },
};

// ==================== Chat Mock ====================

const AI_REPLIES = [
  "这是一个很好的问题！让我来帮你分析一下...\n\n首先，你需要理解核心概念，然后通过练习来巩固。建议先看教材上的定义，再做对应的例题。",
  "根据你目前的学习进度，我建议你今天重点复习以下内容：\n\n1. 回顾昨天的知识点\n2. 完成课后习题\n3. 整理错题笔记\n\n加油！你做得很好！",
  "学习累了就休息一下吧！适当的休息能提高学习效率。\n\n建议每学习25分钟休息5分钟，这就是番茄工作法的核心理念。",
  "我帮你制定了一个学习计划：\n\n**上午 (8:00-12:00)**\n- 2个番茄钟：数学刷题\n- 2个番茄钟：英语阅读\n\n**下午 (14:00-18:00)**\n- 2个番茄钟：专业课复习\n- 2个番茄钟：政治背诵\n\n你觉得这个安排怎么样？",
];

export const mockChatService = {
  sendMessage: async (
    data: SendMessageRequest,
  ): Promise<ApiResponse<ChatMessage>> => {
    await mockDelay(800);

    const userMsg: ChatMessage = {
      id: genId(),
      sessionId: "session-001",
      role: "user",
      content: data.content,
      type: data.type || "text",
      createdAt: new Date().toISOString(),
    };
    chatMessages.push(userMsg);

    const reply: ChatMessage = {
      id: genId(),
      sessionId: "session-001",
      role: "assistant",
      content: AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)],
      type: "text",
      createdAt: new Date().toISOString(),
    };
    chatMessages.push(reply);

    return ok(reply);
  },

  getHistory: async (
    sessionId?: string,
  ): Promise<ApiResponse<ChatMessage[]>> => {
    await mockDelay(300);
    const filtered = sessionId
      ? chatMessages.filter((m) => m.sessionId === sessionId)
      : chatMessages;
    return ok(filtered);
  },

  generatePlan: async (data: {
    goal: string;
    days: number;
  }): Promise<ApiResponse<{ plan: string }>> => {
    await mockDelay(1200);
    return ok({
      plan: `## ${data.goal} - ${data.days}天学习计划\n\n### 第1-${Math.ceil(data.days / 3)}天：基础巩固\n- 复习核心概念\n- 完成基础题目\n\n### 第${Math.ceil(data.days / 3) + 1}-${Math.ceil((data.days * 2) / 3)}天：强化训练\n- 刷专项题目\n- 整理错题本\n\n### 第${Math.ceil((data.days * 2) / 3) + 1}-${data.days}天：冲刺模拟\n- 模拟考试\n- 查漏补缺`,
    });
  },

  getQuickReplies: async (): Promise<ApiResponse<string[]>> => {
    await mockDelay(200);
    return ok([
      "帮我规划今天的学习",
      "我想复习高数",
      "给我出几道练习题",
      "总结今天的学习成果",
    ]);
  },
};

// ==================== Community Mock ====================

export const mockCommunityService = {
  getPosts: async (
    params?: PaginationParams & { tag?: string },
  ): Promise<ApiResponse<PaginatedData<SocialPost>>> => {
    await mockDelay(400);
    let filtered = [...posts];
    if (params?.tag) {
      filtered = filtered.filter((p) => p.tags?.includes(params.tag!));
    }
    return ok(paginate(filtered, params));
  },

  createPost: async (data: {
    content: string;
    images?: string[];
    tags?: string[];
  }): Promise<ApiResponse<SocialPost>> => {
    await mockDelay();
    const post: SocialPost = {
      id: genId(),
      userId: "user-001",
      user: MOCK_USER,
      content: data.content,
      images: data.images,
      tags: data.tags,
      likeCount: 0,
      commentCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.unshift(post);
    return ok(post, "发布成功");
  },

  toggleLike: async (
    id: string,
  ): Promise<ApiResponse<{ isLiked: boolean; likeCount: number }>> => {
    await mockDelay(200);
    const post = posts.find((p) => p.id === id);
    if (!post)
      throw { response: { status: 404, data: fail(404, "动态不存在") } };

    post.isLiked = !post.isLiked;
    post.likeCount += post.isLiked ? 1 : -1;
    return ok({ isLiked: post.isLiked, likeCount: post.likeCount });
  },
};

// ==================== User Mock ====================

import type {
  UserProfile,
  UserStats,
  PomodoroSettings,
  SystemSettings,
  UpdateProfileRequest,
  ChangePasswordRequest,
  StudyCalendarData,
  UserTag,
} from "@studyflow/shared";

// 模拟用户设置存储
let userSettings: PomodoroSettings = {
  focusDuration: 1500,
  shortBreakDuration: 300,
  longBreakDuration: 900,
  autoStartBreak: false,
  autoStartPomodoro: false,
  longBreakInterval: 4,
};

let systemSettings: SystemSettings = {
  theme: "light",
  notificationEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  language: "zh-CN",
};

// 模拟用户统计数据
let userStats: UserStats = {
  totalFocusMinutes: 3600,
  totalPomodoros: 144,
  totalTasks: 50,
  completedTasks: 42,
  currentStreak: 7,
  longestStreak: 15,
  studyDays: 30,
  todayFocusMinutes: 75,
  todayPomodoros: 3,
  todayTasks: 2,
};

// 用户已选择的标签
let userTags: UserTag[] = [...MOCK_USER_TAGS];

// 默认头像（使用UI Avatars服务生成）
const getDefaultAvatar = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f4a261&color=fff&size=256`;
};

export const mockUserService = {
  // 获取用户完整资料
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    await mockDelay(400);
    const user = currentUser || MOCK_USER;
    const profile: UserProfile = {
      ...user,
      tags: userTags,
      avatar: user.avatar || getDefaultAvatar(user.nickname || user.username),
      focusDuration: userSettings.focusDuration,
      shortBreakDuration: userSettings.shortBreakDuration,
      longBreakDuration: userSettings.longBreakDuration,
      autoStartBreak: userSettings.autoStartBreak,
      autoStartPomodoro: userSettings.autoStartPomodoro,
      longBreakInterval: userSettings.longBreakInterval,
      theme: systemSettings.theme,
      notificationEnabled: systemSettings.notificationEnabled,
      soundEnabled: systemSettings.soundEnabled,
      vibrationEnabled: systemSettings.vibrationEnabled,
      language: systemSettings.language,
      stats: userStats,
    };
    return ok(profile);
  },

  // 获取预设标签列表
  getPresetTags: async (): Promise<ApiResponse<typeof PRESET_TAGS>> => {
    await mockDelay(300);
    return ok(PRESET_TAGS);
  },

  // 更新用户资料
  updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<User>> => {
    await mockDelay(500);
    const user = currentUser || MOCK_USER;
    
    // 如果更新了标签，同步更新userTags
    if (data.tags) {
      userTags = PRESET_TAGS
        .filter(tag => data.tags?.includes(tag.id))
        .map(tag => ({ ...tag, unlockedAt: new Date().toISOString() }));
    }
    
    const updatedUser = {
      ...user,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    currentUser = updatedUser;
    safeStorage.set(STORAGE_KEYS.USER, updatedUser);
    return ok(updatedUser, "资料更新成功");
  },

  // 上传头像
  uploadAvatar: async (file: File | FormData): Promise<ApiResponse<{ avatarUrl: string }>> => {
    await mockDelay(1000);
    // 模拟上传成功，返回一个随机头像
    const user = currentUser || MOCK_USER;
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nickname || user.username)}&background=random&color=fff&size=256&t=${Date.now()}`;
    
    if (currentUser) {
      currentUser.avatar = avatarUrl;
      safeStorage.set(STORAGE_KEYS.USER, currentUser);
    }
    
    return ok({ avatarUrl }, "头像上传成功");
  },

  // 获取番茄钟设置
  getPomodoroSettings: async (): Promise<ApiResponse<PomodoroSettings>> => {
    await mockDelay(300);
    return ok(userSettings);
  },

  // 更新番茄钟设置
  updatePomodoroSettings: async (data: PomodoroSettings): Promise<ApiResponse<PomodoroSettings>> => {
    await mockDelay(400);
    userSettings = { ...data };
    return ok(userSettings, "设置已保存");
  },

  // 获取系统设置
  getSystemSettings: async (): Promise<ApiResponse<SystemSettings>> => {
    await mockDelay(300);
    return ok(systemSettings);
  },

  // 更新系统设置
  updateSystemSettings: async (data: SystemSettings): Promise<ApiResponse<SystemSettings>> => {
    await mockDelay(400);
    systemSettings = { ...data };
    return ok(systemSettings, "设置已保存");
  },

  // 获取用户统计
  getUserStats: async (): Promise<ApiResponse<UserStats>> => {
    await mockDelay(400);
    return ok(userStats);
  },

  // 修改密码
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<void>> => {
    await mockDelay(500);
    // 模拟验证当前密码
    if (data.currentPassword !== TEST_ACCOUNT.password) {
      throw { response: { status: 401, data: fail(401, "当前密码错误") } };
    }
    return ok(undefined as unknown as void, "密码修改成功");
  },

  // 获取学习日历
  getStudyCalendar: async (startDate: string, endDate: string): Promise<ApiResponse<StudyCalendarData[]>> => {
    await mockDelay(500);
    // 生成模拟日历数据
    const calendar: StudyCalendarData[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const hasStudy = Math.random() > 0.3;
      calendar.push({
        date: d.toISOString().split("T")[0],
        focusMinutes: hasStudy ? Math.floor(Math.random() * 180) + 30 : 0,
        pomodoros: hasStudy ? Math.floor(Math.random() * 6) + 1 : 0,
        tasks: hasStudy ? Math.floor(Math.random() * 4) + 1 : 0,
        hasStudy,
      });
    }
    
    return ok(calendar);
  },

  // 删除账号 - 已禁用（危险操作）
  deleteAccount: async (): Promise<ApiResponse<void>> => {
    await mockDelay(300);
    throw { 
      response: { 
        status: 403, 
        data: fail(403, "账号删除功能已禁用，如需删除账号请联系客服") 
      } 
    };
  },
};

// ==================== Stats Mock ====================

import type { 
  OverviewStats, 
  DailyStat, 
  SubjectStat, 
  DashboardSummary,
} from "@studyflow/shared";

export const mockStatsService = {
  // 获取总览统计
  getOverview: async (
    period?: string,
  ): Promise<ApiResponse<OverviewStats>> => {
    await mockDelay(400);
    recalculateTodayStats();

    const normalizedPeriod = period || "week";
    const now = new Date();

    let startDate = new Date(now);
    if (normalizedPeriod === "today") {
      startDate.setHours(0, 0, 0, 0);
    } else if (normalizedPeriod === "week") {
      const dayOfWeek = now.getDay();
      startDate.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      startDate.setHours(0, 0, 0, 0);
    } else if (normalizedPeriod === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const currentRecords = pomodoroRecords.filter((record) => {
      if (record.status !== "completed") return false;
      const effective = new Date(record.endTime || record.startTime);
      return effective >= startDate && effective <= now;
    });

    const periodFocusMinutes = currentRecords.reduce(
      (sum, record) => sum + toFocusMinutes(getCompletedDurationSeconds(record)),
      0,
    );
    const periodPomodoros = currentRecords.length;
    const periodCompletedTasks = tasks.filter((task) => {
      if (task.status !== "completed") return false;
      const updated = new Date(task.updatedAt);
      return updated >= startDate && updated <= now;
    }).length;

    const stats: OverviewStats = {
      focusMinutes: periodFocusMinutes,
      completedPomodoros: periodPomodoros,
      completedTasks: periodCompletedTasks,
      streakDays: 7,
      compareLastPeriod: {
        focusMinutes: "+0%",
        pomodoros: "+0%",
        tasks: "+0%",
      },
    };
    return ok(stats);
  },

  // 获取每日学习数据 (用于柱状图/热力图)
  getDaily: async (
    startDate?: string,
    endDate?: string,
  ): Promise<ApiResponse<DailyStat[]>> => {
    await mockDelay(400);

    const now = new Date();
    const rangeStart = startDate ? new Date(`${startDate}T00:00:00`) : (() => {
      const dayOfWeek = now.getDay();
      const d = new Date(now);
      d.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      d.setHours(0, 0, 0, 0);
      return d;
    })();
    const rangeEnd = endDate ? new Date(`${endDate}T23:59:59`) : (() => {
      const d = new Date(rangeStart);
      d.setDate(rangeStart.getDate() + 6);
      d.setHours(23, 59, 59, 999);
      return d;
    })();

    const dailyStats: DailyStat[] = [];
    for (let d = new Date(rangeStart); d <= rangeEnd; d.setDate(d.getDate() + 1)) {
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      const dayRecords = pomodoroRecords.filter((record) => {
        if (record.status !== "completed") return false;
        const effective = new Date(record.endTime || record.startTime);
        return isDateInRange(effective, dayStart, dayEnd);
      });

      const focusMinutes = dayRecords.reduce(
        (sum, record) => sum + toFocusMinutes(getCompletedDurationSeconds(record)),
        0,
      );

      const dayTasks = tasks.filter((task) => {
        if (task.status !== "completed") return false;
        const updated = new Date(task.updatedAt);
        return isDateInRange(updated, dayStart, dayEnd);
      }).length;

      dailyStats.push({
        date: toDateKey(dayStart),
        focusMinutes,
        pomodoros: dayRecords.length,
        tasks: dayTasks,
      });
    }

    return ok(dailyStats);
  },

  // 获取学科分布统计
  getSubjects: async (
    period?: string,
  ): Promise<ApiResponse<SubjectStat[]>> => {
    await mockDelay(300);

    const normalizedPeriod = period || "week";
    const now = new Date();
    let startDate = new Date(now);

    if (normalizedPeriod === "today") {
      startDate.setHours(0, 0, 0, 0);
    } else if (normalizedPeriod === "week") {
      const dayOfWeek = now.getDay();
      startDate.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      startDate.setHours(0, 0, 0, 0);
    } else if (normalizedPeriod === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const categoryMinutes = new Map<string, number>();
    const scopedRecords = pomodoroRecords.filter((record) => {
      if (record.status !== "completed") return false;
      const effective = new Date(record.endTime || record.startTime);
      return effective >= startDate && effective <= now;
    });

    scopedRecords.forEach((record) => {
      const task = record.taskId ? tasks.find((t) => t.id === record.taskId) : null;
      const category = task?.category || "未分类";
      const current = categoryMinutes.get(category) || 0;
      categoryMinutes.set(
        category,
        current + toFocusMinutes(getCompletedDurationSeconds(record)),
      );
    });

    const totalMinutes = Array.from(categoryMinutes.values()).reduce((sum, v) => sum + v, 0);
    if (totalMinutes <= 0) {
      return ok([]);
    }

    const subjectStats: SubjectStat[] = Array.from(categoryMinutes.entries())
      .map(([category, focusMinutes]) => ({
        category,
        focusMinutes,
        percentage: Number(((focusMinutes / totalMinutes) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.focusMinutes - a.focusMinutes);

    return ok(subjectStats);
  },

  // 获取 Dashboard 聚合数据
  getDashboardSummary: async (): Promise<ApiResponse<DashboardSummary>> => {
    await mockDelay(500);
    recalculateTodayStats();

    const todayTasks = tasks.filter(
      (t) => t.status === "todo" || t.status === "in_progress"
    );

    const { dailyStats } = await mockPomodoroService.getWeeklyStats().then((res) => res.data);
    const totalPomodoros = dailyStats.reduce((sum, d) => sum + d.pomodoros, 0);
    const totalFocusHours = Math.round(
      (dailyStats.reduce((sum, d) => sum + d.focusTime, 0) / 3600) * 10
    ) / 10;

    const summary: DashboardSummary = {
      todayStats: {
        focusMinutes: todayFocusMinutes,
        completedPomodoros: todayPomodoroCount,
        completedTasks: todayCompletedTasks,
        streakDays: 7,
      },
      weeklyStats: {
        totalPomodoros,
        totalFocusHours,
        completionRate: totalPomodoros > 0 ? 100 : 0,
        streakDays: 7,
      },
      todayTasks: todayTasks.slice(0, 5),
      activePomodoro: pomodoroRecords.find((r) => r.status === "running") || null,
    };
    return ok(summary);
  },

  // 获取用户累计统计数据
  getUserStats: async (): Promise<ApiResponse<UserStats>> => {
    await mockDelay(400);
    recalculateTodayStats();

    const completedRecords = pomodoroRecords.filter((r) => r.status === "completed");
    const totalFocusMinutes = completedRecords.reduce(
      (sum, record) => sum + toFocusMinutes(getCompletedDurationSeconds(record)),
      0,
    );

    const totalPomodoros = completedRecords.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const totalTasks = tasks.length;

    const userStats: UserStats = {
      totalFocusMinutes,
      totalPomodoros,
      totalTasks,
      completedTasks,
      currentStreak: 7,
      longestStreak: 15,
      studyDays: Math.max(1, new Set(
        completedRecords.map((r) => toDateKey(r.endTime || r.startTime))
      ).size),
      todayFocusMinutes: todayFocusMinutes,
      todayPomodoros: todayPomodoroCount,
      todayTasks: todayCompletedTasks,
    };
    return ok(userStats);
  },
};
