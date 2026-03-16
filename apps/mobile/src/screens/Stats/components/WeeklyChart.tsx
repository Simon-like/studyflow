import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { colors, radius, spacing, fontSize } from '../../../theme';

interface WeeklyChartProps {
  data: number[];
  isLoading?: boolean;
}

const WEEK_DAYS = ['一', '二', '三', '四', '五', '六', '日'];

export function WeeklyChart({ data, isLoading }: WeeklyChartProps) {
  const maxValue = Math.max(...(data.length > 0 ? data : [1]), 1);

  if (isLoading) {
    return (
      <Card style={styles.container}>
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

  if (data.length === 0) {
    return (
      <Card style={styles.container}>
        <SectionHeader title="本周学习时长" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无数据</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <SectionHeader title="本周学习时长" />
      <View style={styles.chart}>
        {data.map((value, index) => (
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
  container: {
    marginHorizontal: spacing.lg,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 6,
    marginTop: spacing.sm,
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
