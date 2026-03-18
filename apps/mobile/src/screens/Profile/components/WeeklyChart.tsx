import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { colors, radius, spacing, fontSize } from '../../../theme';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api';
import type { DailyStat } from '@studyflow/shared';

function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { startDate: fmt(start), endDate: fmt(end) };
}

function useWeeklyDailyStats() {
  const { startDate, endDate } = getWeekRange();
  return useQuery<DailyStat[]>({
    queryKey: ['stats', 'daily', startDate, endDate],
    queryFn: async () => {
      const res = await api.stats.getDaily(startDate, endDate);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

const WEEK_DAYS = ['一', '二', '三', '四', '五', '六', '日'];

export function WeeklyChart() {
  const { data: dailyStats, isLoading } = useWeeklyDailyStats();

  // 转换数据为小时
  const weeklyData = React.useMemo(() => {
    if (!dailyStats) return [];
    return dailyStats.map(item => item.focusMinutes / 60);
  }, [dailyStats]);

  const maxValue = Math.max(...(weeklyData.length > 0 ? weeklyData : [1]), 1);

  if (isLoading) {
    return (
      <Card>
        <SectionHeader title="本周学习时长" />
        <View style={styles.chart}>
          {Array.from({ length: 7 }).map((_, i) => (
            <View key={i} style={styles.barItem}>
              <View style={[styles.track, { height: 64 }]}>
                <View style={[styles.fill, { height: '50%' }]} />
              </View>
            </View>
          ))}
        </View>
      </Card>
    );
  }

  if (weeklyData.length === 0) {
    return (
      <Card>
        <SectionHeader title="本周学习时长" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无数据</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeader title="本周学习时长" />
      <View style={styles.chart}>
        {weeklyData.map((value, index) => (
          <View key={index} style={styles.barItem}>
            <Text style={styles.value}>{value.toFixed(1)}h</Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  { height: `${Math.max((value / maxValue) * 100, 5)}%` },
                ]}
              />
            </View>
            <Text style={styles.day}>{WEEK_DAYS[index]}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 6,
  },
  barItem: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  value: {
    fontSize: 9,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  track: {
    width: '100%',
    height: 64,
    backgroundColor: colors.primary + '20',
    borderRadius: radius.md,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    width: '100%',
    minHeight: 4,
  },
  day: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
  emptyContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
