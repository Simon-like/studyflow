import type { AvatarProps } from './types';
import { AVATAR_SIZES, AVATAR_COLORS, AVATAR_BASE_CLASSES } from './constants';

function getAvatarColor(name: string): string {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function Avatar({
  name,
  src,
  size = 'md',
  color,
  className = '',
}: AvatarProps) {
  const classes = [
    AVATAR_BASE_CLASSES,
    AVATAR_SIZES[size],
    color || getAvatarColor(name),
    className,
  ].join(' ');

  const initial = name[0]?.toUpperCase() || '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${AVATAR_SIZES[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return <div className={classes}>{initial}</div>;
}

export { type AvatarProps, type AvatarSize } from './types';
