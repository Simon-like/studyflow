import { colors } from '../../../theme';
import { AvatarSize } from './types';

export const AVATAR_SIZES: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 80,
};

export const AVATAR_FONT_SIZES: Record<AvatarSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 32,
};

export const DEFAULT_BG_COLOR = colors.primary;
export const DEFAULT_TEXT_COLOR = colors.surface;
export const ONLINE_DOT_COLOR = colors.success;
