import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../../../theme';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onMainAction: () => void;
  onStop: () => void;
  onSkip?: () => void;
}

export function TimerControls({
  isRunning,
  isPaused,
  onMainAction,
  onStop,
  onSkip,
}: TimerControlsProps) {
  const showPlay = !isRunning || isPaused;
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={onStop}
        activeOpacity={0.7}
      >
        <Text style={styles.secondaryIcon}>↺</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.primaryButton} 
        onPress={onMainAction}
        activeOpacity={0.8}
      >
        {showPlay ? (
          <View style={styles.playIcon} />
        ) : (
          <View style={styles.pauseContainer}>
            <View style={styles.pauseBar} />
            <View style={styles.pauseBar} />
          </View>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={onSkip}
        activeOpacity={0.7}
      >
        <Text style={styles.secondaryIcon}>⏭</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  primaryButton: {
    width: 64,
    height: 64,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  secondaryButton: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.warm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 16,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.surface,
    marginLeft: 4,
  },
  pauseContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  pauseBar: {
    width: 5,
    height: 22,
    backgroundColor: colors.surface,
    borderRadius: 3,
  },
  secondaryIcon: {
    fontSize: 20,
    color: colors.textSecondary,
  },
});
