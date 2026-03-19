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
  onExtendRest?: () => void;
  onEndRestEarly?: () => void;
  onCompleteTaskFromRest?: () => void;
}

export function TimerControls({
  status,
  isTaskBound = false,
  onToggleTimer,
  onCompleteTask,
  onAbandonTask,
  onExtendRest,
  onEndRestEarly,
  onCompleteTaskFromRest,
}: TimerControlsProps) {
  const isResting = status === 'resting';

  // 休息状态的操作区域
  if (isResting) {
    return (
      <View style={styles.container}>
        {/* 延长休息 5 分钟（主按钮） */}
        <TouchableOpacity
          style={[styles.primaryButton, styles.restButton]}
          onPress={onExtendRest}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>延长5min</Text>
        </TouchableOpacity>

        {/* 次要操作 */}
        <View style={styles.secondaryRow}>
          {isTaskBound ? (
            <>
              {/* 任务模式：完成任务 + 结束休息 */}
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onCompleteTaskFromRest}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryIcon}>✓</Text>
                <Text style={styles.secondaryText}>完成任务</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onEndRestEarly}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryIcon}>■</Text>
                <Text style={styles.secondaryText}>结束休息</Text>
              </TouchableOpacity>
            </>
          ) : (
            /* 自由模式：仅结束休息 */
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onEndRestEarly}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryIcon}>■</Text>
              <Text style={styles.secondaryText}>结束休息</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // 专注状态的操作区域
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isIdle = status === 'idle';
  const isCompleteDisabled = !isTaskBound && isIdle;

  return (
    <View style={styles.container}>
      {/* 第一行：完成、放弃任务 */}
      <View style={styles.secondaryRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, isCompleteDisabled && styles.secondaryButtonDisabled]}
          onPress={onCompleteTask}
          activeOpacity={isCompleteDisabled ? 1 : 0.7}
          disabled={isCompleteDisabled}
        >
          <Text style={[styles.secondaryIcon, isCompleteDisabled && styles.secondaryIconDisabled]}>✓</Text>
          <Text style={[styles.secondaryText, isCompleteDisabled && styles.secondaryTextDisabled]}>完成</Text>
        </TouchableOpacity>

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
        {!isRunning ? (
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
  restButton: {
    backgroundColor: colors.success,
    shadowColor: colors.success,
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
