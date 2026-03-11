export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}
