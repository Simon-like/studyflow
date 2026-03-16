import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontSize } from '../../../theme';
import type { Period } from '../hooks';

interface PeriodSelectorProps {
  period: Period;
  onChange: (period: Period) => void;
}

const PERIODS: { key: Period; label: string }[] = [
  { key: 'week', label: '本周' },
  { key: 'month', label: '本月' },
  { key: 'year', label: '本年' },
];

export function PeriodSelector({ period, onChange }: PeriodSelectorProps) {
  return (
    <View style={styles.container}>
      {PERIODS.map((p) => (
        <TouchableOpacity
          key={p.key}
          style={[styles.button, period === p.key && styles.activeButton]}
          onPress={() => onChange(p.key)}
        >
          <Text style={[styles.text, period === p.key && styles.activeText]}>
            {p.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: 4,
    gap: 4,
  },
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  activeButton: {
    backgroundColor: colors.card,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  activeText: {
    color: colors.text,
    fontWeight: '600',
  },
});
