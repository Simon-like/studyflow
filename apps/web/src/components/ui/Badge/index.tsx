import type { BadgeProps } from './types';
import { BADGE_VARIANTS, BADGE_SIZES, BADGE_BASE_CLASSES } from './constants';

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  icon,
}: BadgeProps) {
  const classes = [
    BADGE_BASE_CLASSES,
    BADGE_VARIANTS[variant],
    BADGE_SIZES[size],
  ].join(' ');

  return (
    <span className={classes}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

export { type BadgeProps, type BadgeVariant, type BadgeSize } from './types';
