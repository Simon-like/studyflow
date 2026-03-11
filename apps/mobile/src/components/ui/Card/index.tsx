import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CardProps } from './types';
import { VARIANT_STYLES, PADDING_STYLES, CARD_BORDER_RADIUS } from './constants';

export * from './types';

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  style,
  onPress,
}: CardProps) {
  const content = (
    <View
      style={[
        styles.base,
        VARIANT_STYLES[variant],
        { padding: PADDING_STYLES[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        {content}
      </TouchableOpacity>
    );
  }
  
  return content;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: CARD_BORDER_RADIUS,
  },
});
