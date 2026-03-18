import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_FOCUS_DURATION, DEFAULT_BREAK_DURATION, REST_EXTEND_SECONDS, STORAGE_KEYS } from "@studyflow/shared";
import type { Task, PomodoroRecord } from "@studyflow/shared";

type PomodoroStatus = "idle" | "running" | "paused" | "completed" | "resting";

interface PomodoroState {
  // 状态
  status: PomodoroStatus;
  timeRemaining: number;
  currentTask: Task | null;
  currentRecord: PomodoroRecord | null;
  activePomodoroId: string | null;
  todayPomodoros: number;
  totalFocusTime: number;

  // 设置
  focusDuration: number;
  breakDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;

  // 持久化状态
  hasHydrated: boolean;

  // 动作
  start: (task?: Task) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  complete: () => void;
  tick: () => void;
  setTask: (task: Task | null) => void;
  setActivePomodoroId: (id: string | null) => void;
  updateSettings: (
    settings: Partial<
      Omit<
        PomodoroState,
        "status" | "timeRemaining" | "currentTask" | "currentRecord" | "hasHydrated"
      >
    >,
  ) => void;
  reset: () => void;
  // 休息相关
  startRest: () => void;
  extendRest: () => void;
  endRest: () => void;
  // 设置 hydration 状态
  setHasHydrated: (hydrated: boolean) => void;
  // 同步 timeRemaining 到 focusDuration（用于初始化）
  syncTimeRemaining: () => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      status: "idle",
      timeRemaining: DEFAULT_FOCUS_DURATION,
      currentTask: null,
      currentRecord: null,
      activePomodoroId: null,
      todayPomodoros: 0,
      totalFocusTime: 0,
      focusDuration: DEFAULT_FOCUS_DURATION,
      breakDuration: DEFAULT_BREAK_DURATION,
      shortBreakDuration: 5 * 60,
      longBreakDuration: 15 * 60,
      hasHydrated: false,

      start: (task) => {
        const { focusDuration } = get();
        set({
          status: "running",
          timeRemaining: focusDuration,
          currentTask: task || null,
        });
      },

      pause: () => set({ status: "paused" }),

      resume: () => set({ status: "running" }),

      stop: () =>
        set({
          status: "idle",
          timeRemaining: get().focusDuration,
          currentTask: null,
          currentRecord: null,
          activePomodoroId: null,
        }),

      complete: () => {
        const { focusDuration, todayPomodoros, totalFocusTime } = get();
        set({
          status: "idle",
          timeRemaining: focusDuration,
          todayPomodoros: todayPomodoros + 1,
          totalFocusTime: totalFocusTime + focusDuration,
          currentTask: null,
          currentRecord: null,
          activePomodoroId: null,
        });
      },

      tick: () => {
        const { status, timeRemaining } = get();
        if ((status === "running" || status === "resting") && timeRemaining > 0) {
          set({ timeRemaining: timeRemaining - 1 });
        }
      },

      setTask: (task) => set({ currentTask: task }),

      setActivePomodoroId: (id) => set({ activePomodoroId: id }),

      updateSettings: (settings) => {
        const state = get();
        // 空闲时同步 timeRemaining，让首页立即显示新时长
        if (settings.focusDuration && state.status === "idle") {
          set({ ...settings, timeRemaining: settings.focusDuration as number });
        } else {
          set(settings);
        }
      },

      reset: () =>
        set({
          status: "idle",
          timeRemaining: get().focusDuration,
          currentTask: null,
          currentRecord: null,
          activePomodoroId: null,
        }),

      // 进入休息状态：专注结束后调用，保留 currentTask 不清除
      startRest: () => {
        const { breakDuration } = get();
        set({
          status: "resting",
          timeRemaining: breakDuration,
          activePomodoroId: null,
        });
      },

      // 延长休息 5 分钟
      extendRest: () => {
        const { timeRemaining } = get();
        set({ timeRemaining: timeRemaining + REST_EXTEND_SECONDS });
      },

      // 提前结束休息，回到 idle
      endRest: () => {
        set({
          status: "idle",
          timeRemaining: get().focusDuration,
          currentTask: null,
          currentRecord: null,
          activePomodoroId: null,
        });
      },

      // 设置 hydration 状态
      setHasHydrated: (hydrated: boolean) => set({ hasHydrated: hydrated }),

      // 同步 timeRemaining 到 focusDuration（用于 hydration 后初始化）
      syncTimeRemaining: () => {
        const { focusDuration, status } = get();
        // 只有在空闲状态时才同步，避免影响正在进行的计时
        if (status === "idle") {
          set({ timeRemaining: focusDuration });
        }
      },
    }),
    {
      name: STORAGE_KEYS.POMODORO_SETTINGS,
      partialize: (state) => ({
        focusDuration: state.focusDuration,
        breakDuration: state.breakDuration,
        shortBreakDuration: state.shortBreakDuration,
        longBreakDuration: state.longBreakDuration,
        todayPomodoros: state.todayPomodoros,
        totalFocusTime: state.totalFocusTime,
        activePomodoroId: state.activePomodoroId,
      }),
      // 不使用 onRehydrateStorage，改为在组件中手动同步
      // 这样可以避免初始化顺序问题
    },
  ),
);
