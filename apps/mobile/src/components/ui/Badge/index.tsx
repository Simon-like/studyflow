import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BadgeProps } from './types';
import { BADGE_STYLES, BADGE_BORDER_RADIUS } from './constants';
import { spacing, fontWeight } from '../../../theme';

export * from './types';

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const styles = BADGE_STYLES[variant];
  
  return (
    <View style={[baseStyles.container, styles.container, { borderRadius: BADGE_BORDER_RADIUS }]}>
      <Text style={[baseStyles.text, styles.text]}>
        {children}
      </Text>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  text: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
  },
});
