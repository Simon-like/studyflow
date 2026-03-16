import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { colors, radius, spacing, fontSize } from '../../../theme';

interface SubjectItem {
  name: string;
  value: number;
  hours: number;
}

interface SubjectDistributionProps {
  data: SubjectItem[];
  isLoading?: boolean;
}

const COLORS = [colors.primary, colors.success, colors.warning, colors.error, colors.info];

export function SubjectDistribution({ data, isLoading }: SubjectDistributionProps) {
  if (isLoading) {
    return (
      <Card style={styles.container}>
        <SectionHeader title="学科分布" />
        <View style={styles.loadingContainer}>
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={i} style={styles.loadingItem} />
          ))}
        </View>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card style={styles.container}>
        <SectionHeader title="学科分布" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无数据</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <SectionHeader title="学科分布" />
      <View style={styles.list}>
        {data.map((item, index) => (
          <View key={item.name} style={styles.item}>
            <View style={styles.header}>
              <View style={[styles.dot, { backgroundColor: COLORS[index % COLORS.length] }]} />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.percent}>{item.value}%</Text>
            </View>
            <View style={styles.barContainer}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    width: `${item.value}%`,
                    backgroundColor: COLORS[index % COLORS.length],
                  }
                ]} 
              />
            </View>
            <Text style={styles.hours}>{item.hours}小时</Text>
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
  loadingContainer: {
    gap: spacing.sm,
  },
  loadingItem: {
    height: 40,
    backgroundColor: colors.border + '30',
    borderRadius: radius.md,
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
  list: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  item: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  name: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text,
  },
  percent: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  barContainer: {
    height: 6,
    backgroundColor: colors.border + '30',
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: radius.sm,
  },
  hours: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});
