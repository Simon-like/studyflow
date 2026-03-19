import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  RefreshControl,
  TouchableOpacity 
} from 'react-native';
import { colors, spacing, fontSize } from '../../theme';
import { useStatsScreen, getPeriodText } from './hooks';
import { PeriodSelector } from './components/PeriodSelector';
import { OverviewGrid } from './components/OverviewGrid';
import { WeeklyChart } from './components/WeeklyChart';

// 使用 SVG 代替 lucide-react-native 避免依赖问题
const RefreshIcon = () => (
  <Text style={{ fontSize: 20 }}>⟳</Text>
);

const BackIcon = () => (
  <Text style={{ fontSize: 24 }}>←</Text>
);

interface StatsScreenProps {
  onBack?: () => void;
}

export default function StatsScreen({ onBack }: StatsScreenProps) {
  const {
    period,
    setPeriod,
    chartData,
    overviewData,
    userStats,
    isLoading,
    refreshAllStats,
  } = useStatsScreen();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshAllStats();
    setRefreshing(false);
  }, [refreshAllStats]);

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <BackIcon />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>学习统计</Text>
        <TouchableOpacity 
          onPress={onRefresh}
          style={styles.refreshButton}
          disabled={refreshing}
        >
          <RefreshIcon />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 周期选择器 */}
        <View style={styles.periodContainer}>
          <PeriodSelector period={period} onChange={setPeriod} />
        </View>

        {/* 总览网格 */}
        <OverviewGrid 
          data={overviewData} 
          period={getPeriodText(period)}
          isLoading={isLoading}
        />

        {/* 学习柱状图 */}
        <View style={styles.section}>
          <WeeklyChart
            data={chartData}
            title={`${getPeriodText(period)}学习时长`}
            isLoading={isLoading}
          />
        </View>

        {/* 累计统计 */}
        {userStats && (
          <View style={styles.cumulativeSection}>
            <Text style={styles.cumulativeTitle}>累计成就</Text>
            <View style={styles.cumulativeGrid}>
              <View style={styles.cumulativeItem}>
                <Text style={styles.cumulativeValue}>
                  {Math.floor(userStats.totalFocusMinutes / 60)}h
                </Text>
                <Text style={styles.cumulativeLabel}>累计学习</Text>
              </View>
              <View style={styles.cumulativeItem}>
                <Text style={styles.cumulativeValue}>
                  {userStats.totalPomodoros}
                </Text>
                <Text style={styles.cumulativeLabel}>完成番茄</Text>
              </View>
              <View style={styles.cumulativeItem}>
                <Text style={styles.cumulativeValue}>
                  {userStats.completedTasks}
                </Text>
                <Text style={styles.cumulativeLabel}>完成任务</Text>
              </View>
              <View style={styles.cumulativeItem}>
                <Text style={styles.cumulativeValue}>
                  {userStats.studyDays}天
                </Text>
                <Text style={styles.cumulativeLabel}>学习天数</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingTop: spacing.xl,
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  refreshButton: {
    padding: spacing.sm,
  },
  rotating: {
    transform: [{ rotate: '45deg' }],
  },
  periodContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  section: {
    marginTop: spacing.lg,
  },
  cumulativeSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: 16,
  },
  cumulativeTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  cumulativeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cumulativeItem: {
    alignItems: 'center',
  },
  cumulativeValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  cumulativeLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  bottomPadding: {
    height: spacing['2xl'],
  },
});
