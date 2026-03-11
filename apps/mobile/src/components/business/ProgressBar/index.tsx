import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBarProps } from './types';
import { colors, radius, spacing, fontWeight, alpha } from '../../../theme';

export * from './types';

export function ProgressBar({
  progress,
  label,
  showPercentage = true,
  color = colors.primary,
  height = 8,
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && (
            <Text style={[styles.percentage, { color }]}>
              {Math.round(clampedProgress)}%
            </Text>
          )}
        </View>
      )}
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        <View
          style={[
            styles.fill,
            { width: `${clampedProgress}%`, backgroundColor: color, borderRadius: height / 2 },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  percentage: {
    fontSize: 14,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  track: {
    backgroundColor: alpha.mist30,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
