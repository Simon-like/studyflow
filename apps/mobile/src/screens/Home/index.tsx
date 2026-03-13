/**
 * Home 页面
 * 番茄钟 + 任务管理
 * 与 Web Dashboard 数据架构保持一致
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Card } from '../../components/ui/Card';
import { ConfirmModal } from '../../components/ui/Modal';
import { PomodoroTimer } from '../../components/business/PomodoroTimer';
import { WelcomeHeader, StatsRow, SortableTaskList } from './components';
import { useHomeScreen } from './hooks';
import { colors, spacing } from '../../theme';
import { POMODORO_CONFIG } from '../../constants';

export default function HomeScreen() {
  const {
    tasks,
    selectedTask,
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
    switchConfirm,
  } = useHomeScreen();

  return (
    <ScreenContainer>
      {/* 任务切换确认弹窗 */}
      <ConfirmModal
        visible={switchConfirm.visible}
        onClose={switchConfirm.onCancel}
        onConfirm={switchConfirm.onConfirm}
        title="更换当前任务？"
        message={`当前正在专注「${switchConfirm.currentTaskTitle}」，切换后计时数据将被清零。确定要更换为「${switchConfirm.pendingTaskTitle}」吗？`}
        confirmText="确认更换"
        cancelText="继续当前任务"
      />

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
            onToggleTimer={pomodoro.toggleTimer}
            onCompleteTask={pomodoro.completeTask}
            onResetTimer={pomodoro.resetTimer}
            onAbandonTask={pomodoro.abandonTask}
          />
        </Card>
      </View>

      {/* 统计行 */}
      <StatsRow
        stats={stats}
        isLoading={isLoading}
        todayStats={todayStats}
      />

      {/* 任务列表 */}
      <SortableTaskList
        tasks={tasks}
        selectedTaskId={selectedTask?.id}
        isLoading={isLoading}
        error={error}
        onToggleTask={toggleTask}
        onAddTask={addTask}
        onRefresh={refresh}
        onReorder={reorderTasks}
        onSelectTask={setSelectedTask}
        isPomodoroRunning={pomodoro.status === 'running'}
        onPausePomodoro={() => {}}
        onResetPomodoro={pomodoro.resetTimer}
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
});
