export type TaskStatus = 'todo' | 'active' | 'completed';

export interface TaskCardProps {
  id: string | number;
  title: string;
  subtitle: string;
  status: TaskStatus;
  onPress?: () => void;
  onToggle?: () => void;
}
