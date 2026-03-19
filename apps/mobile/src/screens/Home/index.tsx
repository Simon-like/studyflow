/**
 * Home 页面
 * 番茄钟 + 任务管理
 * 参照 web Dashboard 实现完整的专注-休息流程
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { PomodoroTimer } from '../../components/business/PomodoroTimer';
import { WelcomeHeader, StatsRow, SortableTaskList } from './components';
import { useHomeScreen } from './hooks';
import { colors, spacing, radius, fontWeight } from '../../theme';

const PRIORITY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  high: { label: '高', color: colors.error, bg: colors.error + '15' },
  medium: { label: '中', color: colors.warning, bg: colors.warning + '15' },
  low: { label: '低', color: colors.success, bg: colors.success + '15' },
};

interface HomeScreenProps {
  onNavigate?: (screen: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const {
    tasks,
    selectedTask,
    displayTask,
    setSelectedTask,
    stats,
    todayStats,
    isLoading,
    error,
    pomodoro,
    taskStatus,
    toggleTask,
    reorderTasks,
    addTask,
    viewStats,
    refresh,
    navigateTo,
    clearNavigation,
  } = useHomeScreen();

  // 处理导航请求
  React.useEffect(() => {
    if (navigateTo && onNavigate) {
      onNavigate(navigateTo);
      clearNavigation();
    }
  }, [navigateTo, onNavigate, clearNavigation]);

  // 任务详情弹窗
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  const handleShowTaskDetail = useCallback(() => {
    if (displayTask) setShowTaskDetail(true);
  }, [displayTask]);

  return (
    <ScreenContainer>
      {/* 任务详情弹窗 */}
      <Modal
        visible={showTaskDetail}
        onClose={() => setShowTaskDetail(false)}
        title="任务详情"
      >
        {displayTask && (
          <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>任务名称</Text>
              <Text style={styles.detailTitle}>{displayTask.title}</Text>
            </View>
            {displayTask.description ? (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>任务描述</Text>
                <Text style={styles.detailDesc}>{displayTask.description}</Text>
              </View>
            ) : null}
            <View style={styles.detailRow}>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>优先级</Text>
                <View style={[
                  styles.detailBadge,
                  { backgroundColor: PRIORITY_LABELS[displayTask.priority]?.bg },
                ]}>
                  <Text style={[
                    styles.detailBadgeText,
                    { color: PRIORITY_LABELS[displayTask.priority]?.color },
                  ]}>
                    {PRIORITY_LABELS[displayTask.priority]?.label}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>状态</Text>
              <View style={[styles.detailBadge, {
                backgroundColor: pomodoro.status === 'running' ? colors.primary + '15' :
                  pomodoro.status === 'paused' ? colors.warning + '15' :
                  pomodoro.status === 'resting' ? colors.success + '15' :
                  colors.warm,
              }]}>
                <Text style={[styles.detailBadgeText, {
                  color: pomodoro.status === 'running' ? colors.primary :
                    pomodoro.status === 'paused' ? colors.warning :
                    pomodoro.status === 'resting' ? colors.success :
                    colors.text,
                }]}>
                  {pomodoro.status === 'running' ? '进行中' :
                   pomodoro.status === 'paused' ? '已暂停' :
                   pomodoro.status === 'resting' ? '休息中' :
                   '已选中'}
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
      </Modal>

      {/* 欢迎头部 */}
      <WelcomeHeader />

      {/* 番茄钟卡片 */}
      <View style={styles.timerCardContainer}>
        <Card variant="elevated">
          <SectionHeader
            title="今日专注"
            right={
              <Text style={styles.link} onPress={() => onNavigate?.('stats')}>
                查看统计
              </Text>
            }
          />
          <PomodoroTimer
            timeLeft={pomodoro.timeLeft}
            totalTime={pomodoro.totalTime}
            status={pomodoro.status}
            taskTitle={taskStatus.title}
            taskSubtitle={taskStatus.subtitle}
            taskEmoji="📖"
            pomodoroCount={taskStatus.count}
            isTaskBound={!!selectedTask}
            onToggleTimer={pomodoro.toggleTimer}
            onCompleteTask={pomodoro.completeTask}
            onAbandonTask={pomodoro.abandonTask}
            onShowTaskDetail={displayTask ? handleShowTaskDetail : undefined}
            onExtendRest={pomodoro.extendRest}
            onEndRestEarly={pomodoro.endRestEarly}
            onCompleteTaskFromRest={pomodoro.completeTaskFromRest}
          />
        </Card>
      </View>

      {/* 统计行 */}
      <StatsRow />

      {/* 任务列表 */}
      <SortableTaskList
        tasks={tasks}
        selectedTaskId={selectedTask?.id}
        pomodoroStatus={pomodoro.status}
        isLoading={isLoading}
        error={error}
        onToggleTask={toggleTask}
        onAddTask={addTask}
        onRefresh={refresh}
        onReorder={reorderTasks}
        onSelectTask={setSelectedTask}
        isPomodoroRunning={pomodoro.status === 'running'}
        onPausePomodoro={() => {}}
        onResetPomodoro={() => {}}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  timerCardContainer: {
    marginHorizontal: spacing.lg,
    marginTop: -spacing.sm,
  },
  link: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  detailContent: {
    flexShrink: 1,
  },
  detailSection: {
    marginBottom: spacing.lg,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: fontWeight.medium,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    lineHeight: 22,
  },
  detailDesc: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  detailBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  detailBadgeText: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
  },
});
