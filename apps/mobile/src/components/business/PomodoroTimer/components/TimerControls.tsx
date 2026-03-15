import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, spacing, fontWeight } from '../../../../theme';
import type { TimerStatus } from '../types';

interface TimerControlsProps {
  status: TimerStatus;
  isTaskBound?: boolean;
  onToggleTimer: () => void;
  onCompleteTask: () => void;
  onAbandonTask: () => void;
}

export function TimerControls({
  status,
  isTaskBound = false,
  onToggleTimer,
  onCompleteTask,
  onAbandonTask,
}: TimerControlsProps) {
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isIdle = status === 'idle';

  const showPlay = !isRunning;
  // 完成按钮禁用条件：未绑定任务且计时器未运行（自由模式下必须开始计时后才能完成）
  const isCompleteDisabled = !isTaskBound && isIdle;

  return (
    <View style={styles.container}>
      {/* 第一行：完成、放弃任务 */}
      <View style={styles.secondaryRow}>
        {/* 提前完成任务 */}
        <TouchableOpacity
          style={[styles.secondaryButton, isCompleteDisabled && styles.secondaryButtonDisabled]}
          onPress={onCompleteTask}
          activeOpacity={isCompleteDisabled ? 1 : 0.7}
          disabled={isCompleteDisabled}
        >
          <Text style={[styles.secondaryIcon, isCompleteDisabled && styles.secondaryIconDisabled]}>✓</Text>
          <Text style={[styles.secondaryText, isCompleteDisabled && styles.secondaryTextDisabled]}>完成</Text>
        </TouchableOpacity>

        {/* 放弃任务（始终可用） */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onAbandonTask}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryIcon}>■</Text>
          <Text style={styles.secondaryText}>放弃任务</Text>
        </TouchableOpacity>
      </View>

      {/* 主操作：开始/暂停 */}
      <TouchableOpacity 
        style={[styles.primaryButton, isRunning && styles.primaryButtonPaused]} 
        onPress={onToggleTimer}
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
        <Text style={styles.primaryButtonText}>
          {isRunning ? '暂停' : isPaused ? '继续' : '开始'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: spacing.md,
  },
  // 次要操作行
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.warm,
    minWidth: 90,
  },
  secondaryButtonDisabled: {
    opacity: 0.4,
  },
  secondaryIcon: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  secondaryIconDisabled: {
    color: colors.textMuted,
  },
  secondaryText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  secondaryTextDisabled: {
    color: colors.textMuted,
  },
  // 主操作按钮
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
    alignSelf: 'center',
  },
  primaryButtonPaused: {
    backgroundColor: colors.warning,
    shadowColor: colors.warning,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
  playIcon: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.white,
    marginLeft: 2,
  },
  pauseContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  pauseBar: {
    width: 4,
    height: 16,
    backgroundColor: colors.white,
    borderRadius: 2,
  },
});
