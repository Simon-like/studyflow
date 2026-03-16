import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { colors, spacing, fontSize } from '../../../theme';

// 使用文本图标代替 lucide-react-native
const ClockIcon = () => <Text style={styles.iconText}>⏱</Text>;
const TargetIcon = () => <Text style={styles.iconText}>🎯</Text>;
const CheckIcon = () => <Text style={styles.iconText}>✓</Text>;
const FlameIcon = () => <Text style={styles.iconText}>🔥</Text>;

interface OverviewData {
  focusHours: number;
  pomodoros: number;
  tasks: number;
  streakDays: number;
}

interface OverviewGridProps {
  data: OverviewData | null;
  period: string;
  isLoading?: boolean;
}

export function OverviewGrid({ data, period, isLoading }: OverviewGridProps) {
  if (isLoading || !data) {
    return (
      <View style={styles.grid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} style={styles.card}>
            <View style={styles.skeleton} />
          </Card>
        ))}
      </View>
    );
  }

  const items = [
    { 
      Icon: ClockIcon, 
      label: `${period}学习`, 
      value: `${data.focusHours}h`,
      color: colors.primary 
    },
    { 
      Icon: TargetIcon, 
      label: '完成番茄', 
      value: String(data.pomodoros),
      color: colors.success 
    },
    { 
      Icon: CheckIcon, 
      label: '完成任务', 
      value: String(data.tasks),
      color: colors.warning 
    },
    { 
      Icon: FlameIcon, 
      label: '连续打卡', 
      value: `${data.streakDays}天`,
      color: colors.error 
    },
  ];

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <Card key={item.label} style={styles.card}>
          <item.Icon />
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: spacing.md,
  },
  iconText: {
    fontSize: 20,
    marginBottom: spacing.sm,
  },
  value: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  skeleton: {
    height: 60,
    backgroundColor: colors.border + '30',
    borderRadius: 8,
  },
});
