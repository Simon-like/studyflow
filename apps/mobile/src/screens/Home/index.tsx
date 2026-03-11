/**
 * Home 页面
 * 番茄钟 + 任务管理
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { Card } from '../../components/ui/Card';
import { PomodoroTimer } from '../../components/business/PomodoroTimer';
import { WelcomeHeader, StatsRow, TaskList } from './components';
import { useHomeScreen } from './hooks';
import { CURRENT_TASK } from './constants';
import { colors, spacing } from '../../theme';
import { POMODORO_CONFIG } from '../../constants';

export default function HomeScreen() {
  const { tasks, stats, pomodoro, toggleTask, addTask, viewStats } = useHomeScreen();
  
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
            taskTitle={CURRENT_TASK.title}
            taskSubtitle={CURRENT_TASK.subtitle}
            taskEmoji={CURRENT_TASK.emoji}
            pomodoroCount={CURRENT_TASK.pomodoroCount}
            onStart={pomodoro.start}
            onPause={pomodoro.pause}
            onResume={pomodoro.resume}
            onStop={pomodoro.stop}
          />
        </Card>
      </View>
      
      {/* 统计行 */}
      <StatsRow stats={stats} />
      
      {/* 任务列表 */}
      <TaskList
        tasks={tasks}
        onToggleTask={toggleTask}
        onAddTask={addTask}
      />
    </ScreenContainer>
  );
}

import { Text } from 'react-native';

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
