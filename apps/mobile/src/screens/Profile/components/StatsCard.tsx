import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { StatItem } from '../../../components/business/StatItem';
import { colors, spacing } from '../../../theme';
import type { UserStats } from '@studyflow/shared';

interface StatsCardProps {
  stats?: UserStats | null;
}

export function StatsCard({ stats }: StatsCardProps) {
  // 格式化统计数据
  const formatStats = () => {
    if (!stats) {
      return [
        { label: '累计学习', value: '0h' },
        { label: '完成番茄', value: '0' },
        { label: '连续打卡', value: '0天' },
      ];
    }

    return [
      {
        label: '累计学习',
        value: `${Math.floor((stats.totalFocusMinutes || 0) / 60)}h`,
      },
      {
        label: '完成番茄',
        value: String(stats.totalPomodoros || 0),
      },
      {
        label: '连续打卡',
        value: `${stats.currentStreak || 0}天`,
      },
    ];
  };

  const displayStats = formatStats();

  return (
    <Card style={styles.container} padding="md">
      {displayStats.map((stat, index) => (
        <React.Fragment key={stat.label}>
          {index > 0 && <View style={styles.divider} />}
          <StatItem
            label={stat.label}
            value={stat.value}
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
