import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  PomodoroSession, 
  Task, 
  PomodoroSettings, 
  PomodoroMode,
  PomodoroStatus 
} from '../../domain/entities/pomodoro';
import { DEFAULT_SETTINGS } from '../../domain/entities/pomodoro';

interface PomodoroState extends PomodoroSettings {
  // 当前会话状态
  status: PomodoroStatus;
  currentMode: PomodoroMode;
  timeRemaining: number;
  currentSession: PomodoroSession | null;
  currentTask: Task | null;
  
  // 统计数据
  todayPomodoros: number;
  totalFocusTime: number; // 秒
  completedPomodoros: number;
  
  // 动作
  start: (task?: Task) => void;
  pause: () => void;
  resume: () => void;
  stop: (reason?: string) => void;
  complete: () => void;
  tick: () => void;
  
  // 模式切换
  setMode: (mode: PomodoroMode) => void;
  setTask: (task: Task | null) => void;
  
  // 设置
  updateSettings: (settings: Partial<PomodoroSettings>) => void;
  reset: () => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,
      
      status: 'idle',
      currentMode: 'focus',
      timeRemaining: DEFAULT_SETTINGS.focusDuration,
      currentSession: null,
      currentTask: null,
      
      todayPomodoros: 0,
      totalFocusTime: 0,
      completedPomodoros: 0,

      start: (task) => {
        const { currentMode, focusDuration, shortBreakDuration, longBreakDuration } = get();
        const duration = currentMode === 'focus' 
          ? focusDuration 
          : currentMode === 'shortBreak' 
            ? shortBreakDuration 
            : longBreakDuration;
        
        const session: PomodoroSession = {
          id: Date.now().toString(),
          userId: '', // Will be set from auth
          taskId: task?.id,
          mode: currentMode,
          duration,
          startTime: new Date().toISOString(),
          status: 'running',
          isLocked: false,
        };

        set({
          status: 'running',
          timeRemaining: duration,
          currentSession: session,
          currentTask: task || null,
        });
      },

      pause: () => {
        set({ status: 'paused' });
      },

      resume: () => {
        set({ status: 'running' });
      },

      stop: (reason) => {
        const { currentSession } = get();
        if (currentSession) {
          currentSession.status = 'idle';
          currentSession.abandonReason = reason;
          currentSession.endTime = new Date().toISOString();
        }
        
        set({
          status: 'idle',
          timeRemaining: get().focusDuration,
          currentSession: null,
        });
      },

      complete: () => {
        const { currentSession, currentMode, focusDuration, completedPomodoros, todayPomodoros, totalFocusTime } = get();
        
        if (currentSession) {
          currentSession.status = 'completed';
          currentSession.endTime = new Date().toISOString();
          currentSession.actualDuration = currentSession.duration;
        }

        const updates: Partial<PomodoroState> = {
          status: 'completed',
          currentSession: null,
        };

        if (currentMode === 'focus') {
          updates.completedPomodoros = completedPomodoros + 1;
          updates.todayPomodoros = todayPomodoros + 1;
          updates.totalFocusTime = totalFocusTime + focusDuration;
        }

        set(updates);
      },

      tick: () => {
        const { status, timeRemaining, currentSession } = get();
        if (status === 'running' && timeRemaining > 0) {
          const newTime = timeRemaining - 1;
          if (currentSession) {
            currentSession.actualDuration = (currentSession.actualDuration || 0) + 1;
          }
          set({ timeRemaining: newTime });
        }
      },

      setMode: (mode) => {
        const { focusDuration, shortBreakDuration, longBreakDuration } = get();
        const duration = mode === 'focus' 
          ? focusDuration 
          : mode === 'shortBreak' 
            ? shortBreakDuration 
            : longBreakDuration;
        
        set({
          currentMode: mode,
          timeRemaining: duration,
          status: 'idle',
        });
      },

      setTask: (task) => {
        set({ currentTask: task });
      },

      updateSettings: (settings) => {
        set((state) => ({ ...state, ...settings }));
      },

      reset: () => {
        const { currentMode, focusDuration, shortBreakDuration, longBreakDuration } = get();
        const duration = currentMode === 'focus' 
          ? focusDuration 
          : currentMode === 'shortBreak' 
            ? shortBreakDuration 
            : longBreakDuration;
        
        set({
          status: 'idle',
          timeRemaining: duration,
          currentSession: null,
        });
      },
    }),
    {
      name: 'studyflow-pomodoro-storage',
      partialize: (state) => ({
        focusDuration: state.focusDuration,
        shortBreakDuration: state.shortBreakDuration,
        longBreakDuration: state.longBreakDuration,
        autoStartBreaks: state.autoStartBreaks,
        autoStartPomodoros: state.autoStartPomodoros,
        longBreakInterval: state.longBreakInterval,
        todayPomodoros: state.todayPomodoros,
        totalFocusTime: state.totalFocusTime,
        completedPomodoros: state.completedPomodoros,
      }),
    }
  )
);
