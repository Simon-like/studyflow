import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { StatItem } from '../../../components/business/StatItem';
import { colors, spacing } from '../../../theme';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api';
import type { TodayStats } from '@studyflow/shared';

function useTodayStats() {
  return useQuery<TodayStats>({
    queryKey: ['stats', 'today'],
    queryFn: async () => {
      const res = await api.pomodoro.getTodayStats();
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}

interface StatsRowProps {
  // 可选的外部统计数据（用于兼容旧代码）
  legacyStats?: {
    todayPomodoros: number;
    completedTasks: string;
    streakDays: string;
  };
}

export function StatsRow({ legacyStats }: StatsRowProps) {
  const { data: todayStats, isLoading } = useTodayStats();

  if (isLoading) {
    return (
      <Card variant="default" style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </Card>
    );
  }

  // 优先使用 API 数据，否则使用 legacy 数据
  const todayPomodoros = todayStats?.completedPomodoros ?? legacyStats?.todayPomodoros ?? 0;
  const completedTasks = String(todayStats?.completedTasks ?? 0);
  const streakDays = `${todayStats?.streakDays ?? legacyStats?.streakDays ?? '0'}天`;

  const statItems = [
    { label: '今日番茄', value: `${todayPomodoros}个` },
    { label: '完成任务', value: `${completedTasks}个` },
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
