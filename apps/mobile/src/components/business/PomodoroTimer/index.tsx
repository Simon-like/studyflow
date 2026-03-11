import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PomodoroTimerProps } from './types';
import { TimerRing } from './components/TimerRing';
import { TimerControls } from './components/TimerControls';
import { TaskInfo } from './components/TaskInfo';
import { formatTime } from '../../../utils';

export * from './types';

export function PomodoroTimer({
  timeLeft,
  totalTime,
  isRunning,
  isPaused,
  taskTitle = '当前任务',
  taskSubtitle = '暂无任务',
  taskEmoji = '📖',
  pomodoroCount = '0/0',
  onStart,
  onPause,
  onResume,
  onStop,
  onSkip,
}: PomodoroTimerProps) {
  const progress = (totalTime - timeLeft) / totalTime;
  const timeDisplay = formatTime(timeLeft);
  
  const handleMainAction = () => {
    if (!isRunning) {
      onStart();
    } else if (isPaused) {
      onResume();
    } else {
      onPause();
    }
  };
  
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
        isRunning={isRunning}
        isPaused={isPaused}
        onMainAction={handleMainAction}
        onStop={onStop}
        onSkip={onSkip}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
