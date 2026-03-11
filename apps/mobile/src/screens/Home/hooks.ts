/**
 * Home 页面自定义 Hooks
 */

import { useState, useCallback } from 'react';
import { Task } from './types';
import { DEFAULT_TASKS, DEFAULT_STATS } from './constants';
import { usePomodoro } from '../../hooks';

export function useHomeScreen() {
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [stats, setStats] = useState(DEFAULT_STATS);
  
  const pomodoro = usePomodoro({
    onComplete: () => {
      // 番茄钟完成，更新统计数据
      setStats(prev => ({
        ...prev,
        todayPomodoros: prev.todayPomodoros + 1,
      }));
    },
  });
  
  const toggleTask = useCallback((taskId: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, done: !task.done }
          : task
      )
    );
  }, []);
  
  const addTask = useCallback(() => {
    // 添加新任务逻辑
    console.log('Add new task');
  }, []);
  
  const viewStats = useCallback(() => {
    // 查看统计逻辑
    console.log('View stats');
  }, []);
  
  return {
    tasks,
    stats,
    pomodoro,
    toggleTask,
    addTask,
    viewStats,
  };
}
