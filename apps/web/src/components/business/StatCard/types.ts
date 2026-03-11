import type { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  color?: 'coral' | 'sage';
  className?: string;
}
