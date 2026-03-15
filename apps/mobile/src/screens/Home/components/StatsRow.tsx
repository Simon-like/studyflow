import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { StatItem } from '../../../components/business/StatItem';
import { colors, spacing } from '../../../theme';
import type { TodayStats } from '../types';

interface StatsRowProps {
  stats?: {
    todayPomodoros: number;
    completedTasks: string;
    streakDays: string;
  };
  todayStats?: TodayStats | null;
  isLoading?: boolean;
}

export function StatsRow({ stats, todayStats, isLoading }: StatsRowProps) {
  // 优先使用 todayStats（来自 API），否则使用 stats（本地计算）
  
  if (isLoading) {
    return (
      <Card variant="default" style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </Card>
    );
  }
  
  // 从 todayStats 或 stats 获取值
  const todayPomodoros = todayStats?.completedPomodoros ?? stats?.todayPomodoros ?? 0;
  const completedTasks = String(todayStats?.completedTasks ?? 0);
  const streakDays = `${todayStats?.streakDays ?? stats?.streakDays ?? '0'}天`;
  
  const statItems = [
    { label: '今日番茄', value: String(todayPomodoros) },
    { label: '完成任务', value: completedTasks },
    { label: '连续天数', value: streakDays },
  ];
  
  return (
    <Card variant="default" style={styles.container}>
      {statItems.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && <View style={styles.divider} />}
          <StatItem 
            label={item.label} 
            value={item.value}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border + '50',
    marginVertical: 4,
  },
});
