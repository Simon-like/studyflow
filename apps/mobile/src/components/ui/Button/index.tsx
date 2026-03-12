import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ButtonProps } from './types';
import { VARIANT_STYLES, SIZE_STYLES, DISABLED_STYLE } from './constants';
import { colors, fontWeight } from '../../../theme';

export * from './types';

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  leftIcon,
  rightIcon,
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];
  
  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyle.container,
        sizeStyle.container,
        fullWidth && styles.fullWidth,
        (disabled || loading) && DISABLED_STYLE,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyle.text.color} />
      ) : (
        <>
          {leftIcon}
          <Text style={[styles.text, sizeStyle.text, variantStyle.text, textStyle]} numberOfLines={1}>
            {children}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  text: {
    fontWeight: fontWeight.semibold,
  },
  fullWidth: {
    width: '100%',
  },
});
