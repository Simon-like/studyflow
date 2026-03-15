export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  color?: string;
  className?: string;
}
