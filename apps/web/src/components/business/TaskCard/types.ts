export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  pomodoros: number;
  dueDate?: string;
  onToggleStatus: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  pomodoros: number;
  dueDate?: string;
}
