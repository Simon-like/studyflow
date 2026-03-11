import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatItemProps } from './types';
import { colors, typography, spacing } from '../../../theme';

export * from './types';

export function StatItem({ label, value }: StatItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    ...typography.statValue,
  },
  label: {
    ...typography.statLabel,
    marginTop: spacing.xs,
  },
});
