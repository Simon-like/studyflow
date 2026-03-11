import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { designSystem } from '../../theme/design-system';

export interface TimerProps {
  initialMinutes?: number;
  initialSeconds?: number;
  onComplete?: () => void;
  onTick?: (minutes: number, seconds: number) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Timer: React.FC<TimerProps> = ({
  initialMinutes = 25,
  initialSeconds = 0,
  onComplete,
  onTick,
  style,
  textStyle,
  showProgress = true,
  size = 'md',
}) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  const totalSeconds = initialMinutes * 60 + initialSeconds;
  const currentSeconds = minutes * 60 + seconds;
  const progress = showProgress ? (totalSeconds - currentSeconds) / totalSeconds : 0;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
          onTick?.(minutes, seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
          onTick?.(minutes - 1, 59);
        }
      }, 1000);
    } else if (minutes === 0 && seconds === 0 && isActive) {
      setIsActive(false);
      onComplete?.();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, onComplete, onTick]);

  const start = useCallback(() => setIsActive(true), []);
  const pause = useCallback(() => setIsActive(false), []);
  const reset = useCallback(() => {
    setIsActive(false);
    setMinutes(initialMinutes);
    setSeconds(initialSeconds);
  }, [initialMinutes, initialSeconds]);

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timerStyles = [
    styles.container,
    styles.sizes[size],
    style,
  ];

  const timeStyles = [
    styles.time,
    styles.timeSizes[size],
    textStyle,
  ];

  return (
    <View style={timerStyles}>
      {showProgress && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      )}
      
      <Text style={timeStyles}>{formatTime(minutes, seconds)}</Text>
      
      <View style={styles.controls}>
        {!isActive ? (
          <Text style={styles.controlButton} onPress={start}>开始</Text>
        ) : (
          <Text style={styles.controlButton} onPress={pause}>暂停</Text>
        )}
        <Text style={styles.controlButton} onPress={reset}>重置</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  sizes: {
    sm: {
      padding: 12,
    },
    md: {
      padding: 20,
    },
    lg: {
      padding: 28,
    },
  },
  progressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: designSystem.colors.mist,
    borderRadius: 2,
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: designSystem.colors.coral.DEFAULT,
    borderRadius: 2,
  },
  time: {
    fontFamily: designSystem.fonts.display,
    fontWeight: '700',
    color: designSystem.colors.charcoal,
    marginBottom: 16,
  },
  timeSizes: {
    sm: {
      fontSize: 32,
    },
    md: {
      fontSize: 48,
    },
    lg: {
      fontSize: 64,
    },
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
  },
  controlButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: designSystem.colors.coral.DEFAULT,
    color: '#FFFFFF',
    borderRadius: 8,
    fontFamily: designSystem.fonts.body,
    fontWeight: '500',
  },
});