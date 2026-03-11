export interface ProgressBarProps {
  progress: number;
  total?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'coral';
  label?: string;
  className?: string;
}
