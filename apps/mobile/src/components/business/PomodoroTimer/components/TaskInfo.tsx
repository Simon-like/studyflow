import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontWeight } from '../../../../theme';

interface TaskInfoProps {
  title: string;
  subtitle: string;
  emoji: string;
  pomodoroCount: string;
}

export function TaskInfo({ title, subtitle, emoji, pomodoroCount }: TaskInfoProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{pomodoroCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warm,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.primary + '25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  badge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
