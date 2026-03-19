import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { RADIUS, CIRCUMFERENCE, TIMER_SIZE, CENTER } from '../constants';
import { colors, typography } from '../../../../theme';

interface TimerRingProps {
  progress: number; // 0-1
  timeDisplay: string;
  isResting?: boolean;
}

export function TimerRing({ progress, timeDisplay, isResting = false }: TimerRingProps) {
  const strokeDashoffset = CIRCUMFERENCE - progress * CIRCUMFERENCE;
  const strokeColor = isResting ? colors.success : colors.primary;
  const bgColor = isResting ? colors.success + '20' : colors.primaryLight;

  return (
    <View style={styles.container}>
      <Svg width={TIMER_SIZE} height={TIMER_SIZE}>
        {/* 背景圆环 */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke={bgColor}
          strokeWidth={8}
          fill="none"
        />
        {/* 进度圆环 */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke={strokeColor}
          strokeWidth={8}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${CENTER}, ${CENTER}`}
        />
      </Svg>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{timeDisplay}</Text>
        <Text style={styles.labelText}>{isResting ? '休息中' : '剩余时间'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  timeContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    ...typography.timer,
  },
  labelText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
