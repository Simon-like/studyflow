import { useState, useMemo, useCallback } from 'react';
import type { Task, TaskStatus, TaskFilter, TaskFormData, TaskCounts } from './types';
import { INITIAL_TASKS, DEFAULT_FORM_DATA } from './constants';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [search, setSearch] = useState('');

  const handleFilterChange = useCallback((key: string) => {
    setFilter(key as TaskFilter);
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchFilter = filter === 'all' || t.status === filter;
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [tasks, filter, search]);

  const counts: TaskCounts = useMemo(
    () => ({
      all: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      in_progress: tasks.filter((t) => t.status === 'in_progress').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    }),
    [tasks]
  );

  const addTask = useCallback((formData: TaskFormData) => {
    if (!formData.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      status: 'todo',
      pomodoros: formData.pomodoros,
    };

    setTasks((prev) => [task, ...prev]);
  }, []);

  const toggleStatus = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: (t.status === 'completed' ? 'todo' : 'completed') as TaskStatus }
          : t
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    tasks: filteredTasks,
    counts,
    filter,
    setFilter: handleFilterChange,
    search,
    setSearch,
    addTask,
    toggleStatus,
    deleteTask,
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
