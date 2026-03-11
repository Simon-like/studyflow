import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { StatItem } from '../../../components/business/StatItem';
import { colors, spacing } from '../../../theme';
import { DEFAULT_STATS } from '../constants';

const STATS_CONFIG = [
  { key: 'todayPomodoros', label: '今日番茄' },
  { key: 'completedTasks', label: '完成任务' },
  { key: 'streakDays', label: '连续天数' },
] as const;

interface StatsRowProps {
  stats?: typeof DEFAULT_STATS;
}

export function StatsRow({ stats = DEFAULT_STATS }: StatsRowProps) {
  return (
    <Card variant="default" style={styles.container}>
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
    marginTop: spacing.md,
    padding: spacing.md,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border + '50',
    marginVertical: 4,
  },
});
