import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TaskCardProps } from './types';
import { colors, radius, spacing, fontWeight } from '../../../theme';

export * from './types';

export function TaskCard({ title, subtitle, status, onPress, onToggle }: TaskCardProps) {
  const isDone = status === 'completed';
  const isActive = status === 'active';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive && styles.activeContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* 复选框 - 阻止事件冒泡 */}
      <TouchableOpacity
        style={[
          styles.checkbox,
          isDone && styles.checkboxDone,
          isActive && styles.checkboxActive,
        ]}
        onPress={(e) => {
          // 阻止事件冒泡，防止触发卡片的 onPress
          e.stopPropagation();
          onToggle?.();
        }}
        activeOpacity={0.7}
      >
        {isDone && <Text style={styles.checkMark}>✓</Text>}
      </TouchableOpacity>

      {/* 文本内容区域 - 点击也会触发 onPress */}
      <View style={styles.textContainer} pointerEvents="none">
        <Text style={[styles.title, isDone && styles.titleDone]}>
          {title}
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {isActive && <Text style={styles.activeTag}>进行中</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warm,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,
  },
  activeContainer: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primary + '05',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondary + '25',
  },
  checkboxActive: {
    borderColor: colors.primary,
  },
  checkMark: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: fontWeight.bold,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  titleDone: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activeTag: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
});
