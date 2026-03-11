import React, { forwardRef } from 'react';
import { TextInput, StyleSheet, TextStyle, ViewStyle, TextInputProps } from 'react-native';
import { designSystem } from '../../theme/design-system';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  variant?: 'default' | 'error';
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export const Input = forwardRef<TextInput, InputProps>(({
  variant = 'default',
  style,
  inputStyle,
  ...props
}, ref) => {
  const containerStyles = [
    styles.base,
    styles.variants[variant],
    style,
  ];

  const inputStyles = [
    styles.input,
    inputStyle,
  ];

  return (
    <TextInput
      ref={ref}
      style={containerStyles}
      placeholderTextColor={designSystem.colors.stone}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  base: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 12,
    fontFamily: designSystem.fonts.body,
    fontSize: 16,
    color: designSystem.colors.charcoal,
  },
  variants: {
    default: {
      borderColor: designSystem.colors.mist,
    },
    error: {
      borderColor: designSystem.colors.error,
    },
  },
  input: {
    flex: 1,
  },
});