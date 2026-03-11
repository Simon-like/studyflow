import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { StatItem } from '../../../components/business/StatItem';
import { colors, spacing } from '../../../theme';
import { DEFAULT_STATS } from '../constants';

const STATS_CONFIG = [
  { key: 'totalStudy', label: '累计学习' },
  { key: 'completedPomodoros', label: '完成番茄' },
  { key: 'streakDays', label: '连续打卡' },
] as const;

interface StatsCardProps {
  stats?: typeof DEFAULT_STATS;
}

export function StatsCard({ stats = DEFAULT_STATS }: StatsCardProps) {
  return (
    <Card style={styles.container} padding="md">
      {STATS_CONFIG.map((config, index) => (
        <React.Fragment key={config.key}>
          {index > 0 && <View style={styles.divider} />}
          <StatItem
            label={config.label}
            value={String(stats[config.key])}
          />
        </React.Fragment>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: -spacing.sm,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border + '50',
    marginVertical: 4,
  },
});
