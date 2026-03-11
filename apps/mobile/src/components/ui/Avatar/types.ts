export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  name?: string;
  src?: string;
  size?: AvatarSize;
  backgroundColor?: string;
  textColor?: string;
  online?: boolean;
}
