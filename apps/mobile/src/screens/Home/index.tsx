/**
 * Home 页面
 * 番茄钟 + 任务管理
 * 与 Web Dashboard 数据架构保持一致
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
import { POMODORO_CONFIG } from '../../constants';

const PRIORITY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  high: { label: '高', color: colors.error, bg: colors.error + '15' },
  medium: { label: '中', color: colors.warning, bg: colors.warning + '15' },
  low: { label: '低', color: colors.success, bg: colors.success + '15' },
};

export default function HomeScreen() {
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
  } = useHomeScreen();

  // 任务详情弹窗
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  const handleShowTaskDetail = useCallback(() => {
    if (displayTask) {
      setShowTaskDetail(true);
    }
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
              {displayTask.category ? (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>分类</Text>
                  <Text style={styles.detailText}>{displayTask.category}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>状态</Text>
              <View style={[styles.detailBadge, {
                backgroundColor: pomodoro.status === 'running' ? colors.primary + '15' :
                  pomodoro.status === 'paused' ? colors.warning + '15' :
                  selectedTask?.id === displayTask.id ? colors.warm : colors.warm,
              }]}>
                <Text style={[styles.detailBadgeText, {
                  color: pomodoro.status === 'running' ? colors.primary :
                    pomodoro.status === 'paused' ? colors.warning :
                    colors.text,
                }]}>
                  {pomodoro.status === 'running' ? '进行中' :
                   pomodoro.status === 'paused' ? '已暂停' :
                   selectedTask?.id === displayTask.id ? '已选中' :
                   '待开始'}
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
              <Text style={styles.link} onPress={viewStats}>
                查看统计
              </Text>
            }
          />
          <PomodoroTimer
            timeLeft={pomodoro.timeLeft}
            totalTime={POMODORO_CONFIG.DEFAULT_DURATION}
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
  // 任务详情
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
  detailText: {
    fontSize: 14,
    color: colors.text,
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
