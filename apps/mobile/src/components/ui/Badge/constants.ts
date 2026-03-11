import { ViewStyle, TextStyle } from 'react-native';
import { colors, alpha, radius } from '../../../theme';
import { BadgeVariant } from './types';

export const BADGE_STYLES: Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> = {
  default: {
    container: {
      backgroundColor: alpha.mist25,
    },
    text: {
      color: colors.textSecondary,
    },
  },
  primary: {
    container: {
      backgroundColor: alpha.primary25,
    },
    text: {
      color: colors.primaryDark,
    },
  },
  secondary: {
    container: {
      backgroundColor: alpha.secondary25,
    },
    text: {
      color: colors.secondaryDark,
    },
  },
  success: {
    container: {
      backgroundColor: `${colors.success}25`,
    },
    text: {
      color: colors.success,
    },
  },
  warning: {
    container: {
      backgroundColor: `${colors.warning}25`,
    },
    text: {
      color: colors.warning,
    },
  },
};

export const BADGE_BORDER_RADIUS = radius.full;
