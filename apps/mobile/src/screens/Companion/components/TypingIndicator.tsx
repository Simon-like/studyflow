import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar } from '../../../components/ui/Avatar';
import { Card } from '../../../components/ui/Card';
import { colors, radius, spacing } from '../../../theme';

export function TypingIndicator() {
  return (
    <View style={styles.container}>
      <Avatar name="知" size="sm" backgroundColor={colors.primary} />
      <View style={[styles.bubble, styles.typingBubble]}>
        <View style={styles.dots}>
          {[0, 1, 2].map(i => (
            <View key={i} style={styles.dot} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  bubble: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderBottomLeftRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  typingBubble: {
    paddingVertical: 14,
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
