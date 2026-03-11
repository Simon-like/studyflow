import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { RADIUS, CIRCUMFERENCE, TIMER_SIZE, CENTER } from '../constants';
import { colors, typography } from '../../../../theme';

interface TimerRingProps {
  progress: number; // 0-1
  timeDisplay: string;
}

export function TimerRing({ progress, timeDisplay }: TimerRingProps) {
  const strokeDashoffset = CIRCUMFERENCE - progress * CIRCUMFERENCE;
  
  return (
    <View style={styles.container}>
      <Svg width={TIMER_SIZE} height={TIMER_SIZE}>
        {/* 背景圆环 */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke={colors.primaryLight}
          strokeWidth={8}
          fill="none"
        />
        {/* 进度圆环 */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke={colors.primary}
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
        <Text style={styles.labelText}>剩余时间</Text>
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
