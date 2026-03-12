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
import { PomodoroTimer } from '../../components/business/PomodoroTimer';
import { WelcomeHeader, StatsRow, SortableTaskList } from './components';
import { useHomeScreen } from './hooks';
import { colors, spacing } from '../../theme';
import { POMODORO_CONFIG } from '../../constants';

export default function HomeScreen() {
  const { 
    tasks, 
    stats, 
    todayStats,
    isLoading, 
    error,
    pomodoro, 
    toggleTask, 
    reorderTasks,
    addTask, 
    viewStats,
    refresh 
  } = useHomeScreen();
  
  // 获取当前活跃任务用于番茄钟显示（排序后的第一个未完成任务）
  const activeTask = tasks.find(t => t.status === 'in_progress') || 
                     tasks.find(t => t.status !== 'completed') || 
                     tasks[0];
  
  const taskTitle = activeTask?.title || '专注学习';
  const taskSubtitle = activeTask?.category || '选择任务开始专注';
  const pomodoroCount = activeTask 
    ? `${activeTask.completedPomodoros}/${activeTask.estimatedPomodoros}`
    : '0/0';
  
  return (
    <ScreenContainer>
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
            isRunning={pomodoro.isRunning}
            isPaused={pomodoro.isPaused}
            taskTitle={taskTitle}
            taskSubtitle={taskSubtitle}
            taskEmoji="📖"
            pomodoroCount={pomodoroCount}
            onStart={pomodoro.start}
            onPause={pomodoro.pause}
            onResume={pomodoro.resume}
            onStop={pomodoro.stop}
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
        isLoading={isLoading}
        error={error}
        onToggleTask={toggleTask}
        onAddTask={addTask}
        onRefresh={refresh}
        onReorder={reorderTasks}
        isPomodoroRunning={pomodoro.isRunning}
        onResetPomodoro={pomodoro.stop}
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
