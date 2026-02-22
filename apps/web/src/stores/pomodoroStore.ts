import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_FOCUS_DURATION, STORAGE_KEYS } from "@studyflow/shared";
import type { Task, PomodoroRecord } from "@studyflow/shared";

type PomodoroStatus = "idle" | "running" | "paused" | "completed";

interface PomodoroState {
  // 状态
  status: PomodoroStatus;
  timeRemaining: number;
  currentTask: Task | null;
  currentRecord: PomodoroRecord | null;
  todayPomodoros: number;
  totalFocusTime: number;

  // 设置
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;

  // 动作
  start: (task?: Task) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  complete: () => void;
  tick: () => void;
  setTask: (task: Task | null) => void;
  updateSettings: (
    settings: Partial<
      Omit<
        PomodoroState,
        "status" | "timeRemaining" | "currentTask" | "currentRecord"
      >
    >,
  ) => void;
  reset: () => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      status: "idle",
      timeRemaining: DEFAULT_FOCUS_DURATION,
      currentTask: null,
      currentRecord: null,
      todayPomodoros: 0,
      totalFocusTime: 0,
      focusDuration: DEFAULT_FOCUS_DURATION,
      shortBreakDuration: 5 * 60,
      longBreakDuration: 15 * 60,

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
        });
      },

      tick: () => {
        const { status, timeRemaining } = get();
        if (status === "running" && timeRemaining > 0) {
          set({ timeRemaining: timeRemaining - 1 });
        }
      },

      setTask: (task) => set({ currentTask: task }),

      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),

      reset: () =>
        set({
          status: "idle",
          timeRemaining: get().focusDuration,
          currentTask: null,
          currentRecord: null,
        }),
    }),
    {
      name: STORAGE_KEYS.POMODORO_SETTINGS,
      partialize: (state) => ({
        focusDuration: state.focusDuration,
        shortBreakDuration: state.shortBreakDuration,
        longBreakDuration: state.longBreakDuration,
        todayPomodoros: state.todayPomodoros,
        totalFocusTime: state.totalFocusTime,
      }),
    },
  ),
);
