import { useState, useEffect } from 'react';
import { usePomodoroStore } from '@studyflow/features-pomodoro';
import { taskService, statsService } from '@/modules/shared/services/mockApi';
import type { Task } from '@/modules/shared/types/api';

const weeklyData = [
  { day: '一', minutes: 120 },
  { day: '二', minutes: 180 },
  { day: '三', minutes: 240 },
  { day: '四', minutes: 135 },
  { day: '五', minutes: 270 },
  { day: '六', minutes: 300 },
  { day: '日', minutes: 60 },
];

export function useDashboard() {
  const { todayPomodoros, totalFocusTime } = usePomodoroStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const taskData = await taskService.getTasks();
        setTasks(taskData);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const formattedFocusTime = `${Math.floor(totalFocusTime / 3600)}h`;

  return {
    todayPomodoros,
    totalFocusTime: formattedFocusTime,
    tasks,
    weeklyData,
    isLoading,
    currentDate: new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }),
  };
}
