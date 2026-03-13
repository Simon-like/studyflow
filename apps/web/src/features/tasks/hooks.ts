import { useState, useMemo, useCallback, useEffect } from 'react';
import { api } from '@studyflow/api';
import type { Task as SharedTask } from '@studyflow/shared';
import type { TaskFilter, TaskFormData, TaskCounts } from './types';
import { DEFAULT_FORM_DATA } from './constants';

export function useTasks() {
  const [allTasks, setAllTasks] = useState<SharedTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [search, setSearch] = useState('');

  // 从 mock API 获取全部任务
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.task.getTasks();
      setAllTasks(response.data.list);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFilterChange = useCallback((key: string) => {
    setFilter(key as TaskFilter);
  }, []);

  // 前端过滤（状态 + 模糊搜索）
  const tasks = useMemo(() => {
    return allTasks.filter((t) => {
      const matchFilter = filter === 'all' || t.status === filter;
      const matchSearch = !search.trim() ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description?.toLowerCase().includes(search.toLowerCase()));
      return matchFilter && matchSearch;
    });
  }, [allTasks, filter, search]);

  // 统计数基于全量数据
  const counts: TaskCounts = useMemo(
    () => ({
      all: allTasks.length,
      todo: allTasks.filter((t) => t.status === 'todo').length,
      in_progress: allTasks.filter((t) => t.status === 'in_progress').length,
      completed: allTasks.filter((t) => t.status === 'completed').length,
    }),
    [allTasks]
  );

  // 添加任务 - 调用 mock API
  const addTask = useCallback(async (formData: TaskFormData) => {
    if (!formData.title.trim()) return;

    try {
      await api.task.createTask({
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority,
        estimatedPomodoros: formData.pomodoros,
      });
      await fetchTasks();
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  }, [fetchTasks]);

  // 切换任务状态 - 调用 mock API
  const toggleStatus = useCallback(async (id: string) => {
    try {
      await api.task.toggleStatus(id);
      await fetchTasks();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  }, [fetchTasks]);

  // 删除任务 - 调用 mock API
  const deleteTask = useCallback(async (id: string) => {
    try {
      await api.task.deleteTask(id);
      await fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  }, [fetchTasks]);

  return {
    tasks,
    counts,
    filter,
    setFilter: handleFilterChange,
    search,
    setSearch,
    addTask,
    toggleStatus,
    deleteTask,
    isLoading,
  };
}

export function useTaskModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>(DEFAULT_FORM_DATA);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setFormData(DEFAULT_FORM_DATA);
  }, []);

  const updateField = useCallback(<K extends keyof TaskFormData>(
    field: K,
    value: TaskFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => setFormData(DEFAULT_FORM_DATA), []);

  return {
    isOpen,
    formData,
    open,
    close,
    updateField,
    reset,
  };
}
