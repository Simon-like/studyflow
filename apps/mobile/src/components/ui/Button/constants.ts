import { ViewStyle, TextStyle } from 'react-native';
import { colors, alpha, radius, spacing } from '../../../theme';
import { ButtonVariant, ButtonSize } from './types';

// 变体样式
export const VARIANT_STYLES: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: {
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 4,
    },
    text: {
      color: colors.surface,
    },
  },
  secondary: {
    container: {
      backgroundColor: alpha.primary15,
    },
    text: {
      color: colors.primary,
    },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
    text: {
      color: colors.text,
    },
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
    },
    text: {
      color: colors.textSecondary,
    },
  },
};

// 尺寸样式
export const SIZE_STYLES: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.lg,
    },
    text: {
      fontSize: 13,
    },
  },
  md: {
    container: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: radius.xl,
    },
    text: {
      fontSize: 14,
    },
  },
  lg: {
    container: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: radius['2xl'],
    },
    text: {
      fontSize: 15,
    },
  },
};

// 禁用状态
export const DISABLED_STYLE: ViewStyle = {
  opacity: 0.4,
};
