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
  TokenResponse,
  LoginRequest,
  RegisterRequest,
  PomodoroRecord,
  ChatMessage,
  SocialPost,
  PaginatedData,
  PaginationParams,
} from "@studyflow/shared";
import { storage, STORAGE_KEYS, generateId } from "@studyflow/shared";
import {
  TEST_ACCOUNT,
  MOCK_USER,
  MOCK_TOKENS,
  MOCK_TASKS,
  MOCK_POMODORO_RECORDS,
  MOCK_CHAT_MESSAGES,
  MOCK_POSTS,
  MOCK_OVERVIEW_STATS,
  MOCK_DAILY_STATS,
  MOCK_SUBJECT_STATS,
} from "./data";
import { mockDelay, ok, fail, paginate, genId } from "./helpers";
import type { CreateTaskRequest, UpdateTaskRequest } from "../services/taskService";
import type { StartPomodoroRequest, StopPomodoroRequest } from "../services/pomodoroService";
import type { SendMessageRequest } from "../services/chatService";

// ==================== 内存状态 ====================

let registeredUsers: Array<{
  user: User;
  password: string;
}> = [{ user: { ...MOCK_USER }, password: TEST_ACCOUNT.password }];

let tasks = [...MOCK_TASKS];
let pomodoroRecords = [...MOCK_POMODORO_RECORDS];
let chatMessages = [...MOCK_CHAT_MESSAGES];
let posts = [...MOCK_POSTS];

// ==================== Auth Mock ====================

type AuthLoginResponse = ApiResponse<{ user: User } & TokenResponse>;
type AuthRegisterResponse = AuthLoginResponse;

export const mockAuthService = {
  login: async (data: {
    username: string;
    password: string;
  }): Promise<AuthLoginResponse> => {
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

    // 存储 token
    storage.set(STORAGE_KEYS.TOKEN, MOCK_TOKENS.accessToken);
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, MOCK_TOKENS.refreshToken);
    storage.set(STORAGE_KEYS.USER, found.user);

    return ok({ user: found.user, ...MOCK_TOKENS });
  },

  register: async (data: {
    username: string;
    password: string;
    nickname?: string;
  }): Promise<AuthRegisterResponse> => {
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

    const isEmail = data.username.includes("@");
    const newUser: User = {
      id: genId(),
      username: data.username,
      email: isEmail ? data.username : "",
      phone: isEmail ? "" : data.username,
      nickname: data.nickname || data.username.split("@")[0],
      avatar: "",
      focusDuration: 1500,
      shortBreakDuration: 300,
      longBreakDuration: 900,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    registeredUsers.push({ user: newUser, password: data.password });

    storage.set(STORAGE_KEYS.TOKEN, MOCK_TOKENS.accessToken);
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, MOCK_TOKENS.refreshToken);
    storage.set(STORAGE_KEYS.USER, newUser);

    return ok({ user: newUser, ...MOCK_TOKENS });
  },

  refresh: async (): Promise<ApiResponse<TokenResponse>> => {
    await mockDelay(200);
    return ok(MOCK_TOKENS);
  },

  logout: async (): Promise<ApiResponse<void>> => {
    await mockDelay(200);
    storage.remove(STORAGE_KEYS.TOKEN);
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    storage.remove(STORAGE_KEYS.USER);
    return ok(undefined as unknown as void);
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    await mockDelay(300);
    const user = storage.get<User>(STORAGE_KEYS.USER);
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
    const active = tasks.filter(
      (t) => t.status === "todo" || t.status === "in_progress",
    );
    return ok(active);
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
      estimatedPomodoros: data.estimatedPomodoros || 1,
      completedPomodoros: 0,
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

  completeTask: async (id: string): Promise<ApiResponse<Task>> => {
    await mockDelay();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1)
      throw { response: { status: 404, data: fail(404, "任务不存在") } };

    tasks[idx] = {
      ...tasks[idx],
      status: "completed",
      updatedAt: new Date().toISOString(),
    };
    return ok(tasks[idx]);
  },
};

// ==================== Pomodoro Mock ====================

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

  stop: async (
    id: string,
    data: StopPomodoroRequest,
  ): Promise<ApiResponse<PomodoroRecord>> => {
    await mockDelay();
    const idx = pomodoroRecords.findIndex((r) => r.id === id);
    if (idx === -1)
      throw { response: { status: 404, data: fail(404, "记录不存在") } };

    const now = new Date();
    const start = new Date(pomodoroRecords[idx].startTime);
    const actualDuration = Math.floor((now.getTime() - start.getTime()) / 1000);

    pomodoroRecords[idx] = {
      ...pomodoroRecords[idx],
      status: data.status === "completed" ? "completed" : "stopped",
      endTime: now.toISOString(),
      actualDuration,
      abandonReason: data.abandonReason,
    };
    return ok(pomodoroRecords[idx]);
  },

  getHistory: async (
    params?: PaginationParams,
  ): Promise<ApiResponse<PaginatedData<PomodoroRecord>>> => {
    await mockDelay(400);
    return ok(paginate(pomodoroRecords, params));
  },

  getTodayStats: async () => {
    await mockDelay(300);
    return ok({
      totalPomodoros: 3,
      totalFocusTime: 4500,
      completedTasks: 1,
    });
  },

  getWeeklyStats: async () => {
    await mockDelay(400);
    return ok({
      dailyStats: MOCK_DAILY_STATS.map((d) => ({
        date: d.date,
        pomodoros: d.pomodoros,
        focusTime: d.focusMinutes * 60,
      })),
    });
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

    // 保存用户消息
    const userMsg: ChatMessage = {
      id: genId(),
      sessionId: "session-001",
      role: "user",
      content: data.content,
      type: data.type || "text",
      createdAt: new Date().toISOString(),
    };
    chatMessages.push(userMsg);

    // 生成 AI 回复
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

// ==================== Stats Mock ====================

export const mockStatsService = {
  getOverview: async (
    _period?: string,
  ): Promise<ApiResponse<typeof MOCK_OVERVIEW_STATS>> => {
    await mockDelay(400);
    return ok(MOCK_OVERVIEW_STATS);
  },

  getDailyStats: async (
    _startDate?: string,
    _endDate?: string,
  ): Promise<ApiResponse<typeof MOCK_DAILY_STATS>> => {
    await mockDelay(400);
    return ok(MOCK_DAILY_STATS);
  },

  getSubjectStats: async (
    _period?: string,
  ): Promise<ApiResponse<typeof MOCK_SUBJECT_STATS>> => {
    await mockDelay(300);
    return ok(MOCK_SUBJECT_STATS);
  },
};
