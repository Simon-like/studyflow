import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { designSystem } from '../../theme/design-system';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.base,
    styles.variants[variant],
    styles.sizes[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.textBase,
    styles.textVariants[variant],
    styles.textSizes[size],
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  variants: {
    primary: {
      backgroundColor: designSystem.colors.coral.DEFAULT,
      borderColor: designSystem.colors.coral.DEFAULT,
    },
    secondary: {
      backgroundColor: '#FFFFFF',
      borderColor: designSystem.colors.mist,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
  },
  sizes: {
    sm: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    md: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
    },
    lg: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 16,
    },
  },
  textBase: {
    fontFamily: designSystem.fonts.body,
    textAlign: 'center',
  },
  textVariants: {
    primary: {
      color: '#FFFFFF',
    },
    secondary: {
      color: designSystem.colors.charcoal,
    },
    ghost: {
      color: designSystem.colors.charcoal,
    },
  },
  textSizes: {
    sm: {
      fontSize: 14,
      fontWeight: '500',
    },
    md: {
      fontSize: 16,
      fontWeight: '500',
    },
    lg: {
      fontSize: 18,
      fontWeight: '600',
    },
  },
  disabled: {
    opacity: 0.5,
  },
});