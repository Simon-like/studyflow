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
  isTaskBound = false,
  onToggleTimer,
  onCompleteTask,
  onAbandonTask,
  onShowTaskDetail,
  onExtendRest,
  onEndRestEarly,
  onCompleteTaskFromRest,
}: PomodoroTimerProps) {
  const isResting = status === 'resting';
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const timeDisplay = formatTime(timeLeft);

  return (
    <View style={styles.container}>
      <TimerRing progress={progress} timeDisplay={timeDisplay} isResting={isResting} />
      <TaskInfo
        title={isResting ? '休息时间' : taskTitle}
        subtitle={isResting ? '放松一下，准备下一轮' : taskSubtitle}
        emoji={isResting ? '☕' : taskEmoji}
        pomodoroCount={isResting ? '休息中' : pomodoroCount}
        onShowDetail={isResting ? undefined : onShowTaskDetail}
      />
      <TimerControls
        status={status}
        isTaskBound={isTaskBound}
        onToggleTimer={onToggleTimer}
        onCompleteTask={onCompleteTask}
        onAbandonTask={onAbandonTask}
        onExtendRest={onExtendRest}
        onEndRestEarly={onEndRestEarly}
        onCompleteTaskFromRest={onCompleteTaskFromRest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
