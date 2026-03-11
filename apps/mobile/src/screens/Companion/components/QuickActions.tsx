import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadows } from '../../../theme';
import { QUICK_ACTIONS } from '../constants';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {QUICK_ACTIONS.map(action => (
        <TouchableOpacity
          key={action}
          style={styles.button}
          onPress={() => onAction(action)}
          activeOpacity={0.7}
        >
          <Text style={styles.text}>{action}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 48,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  content: {
    gap: spacing.sm,
    paddingVertical: 4,
  },
  button: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    ...shadows.sm,
  },
  text: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
});
