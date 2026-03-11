import { ViewStyle } from 'react-native';
import { colors, shadows, radius, spacing } from '../../../theme';
import { CardVariant } from './types';

export const VARIANT_STYLES: Record<CardVariant, ViewStyle> = {
  default: {
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  elevated: {
    backgroundColor: colors.surface,
    ...shadows.lg,
  },
  outlined: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.none,
  },
};

export const PADDING_STYLES = {
  none: 0,
  sm: spacing.md,
  md: spacing.lg,
  lg: spacing.xl,
};

export const CARD_BORDER_RADIUS = radius['2xl'];
