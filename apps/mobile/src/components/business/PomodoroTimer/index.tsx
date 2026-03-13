import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { PomodoroTimerProps } from './types';
import { TimerRing } from './components/TimerRing';
import { TimerControls } from './components/TimerControls';
import { TaskInfo } from './components/TaskInfo';
import { formatTime } from '../../../utils';

export * from './types';

export function PomodoroTimer({
  timeLeft,
  totalTime,
  status,
  taskTitle = '自由任务',
  taskSubtitle = '专注当下，提升效率',
  taskEmoji = '📖',
  pomodoroCount = '自由模式',
  onToggleTimer,
  onCompleteTask,
  onResetTimer,
  onAbandonTask,
}: PomodoroTimerProps) {
  const progress = (totalTime - timeLeft) / totalTime;
  const timeDisplay = formatTime(timeLeft);
  
  return (
    <View style={styles.container}>
      <TimerRing progress={progress} timeDisplay={timeDisplay} />
      <TaskInfo
        title={taskTitle}
        subtitle={taskSubtitle}
        emoji={taskEmoji}
        pomodoroCount={pomodoroCount}
      />
      <TimerControls
        status={status}
        onToggleTimer={onToggleTimer}
        onCompleteTask={onCompleteTask}
        onResetTimer={onResetTimer}
        onAbandonTask={onAbandonTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
