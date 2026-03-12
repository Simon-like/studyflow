import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { TaskCard } from '../../../components/business/TaskCard';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { colors, radius, spacing, fontWeight } from '../../../theme';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  error?: Error | null;
  onToggleTask: (id: string) => void;
  onAddTask: () => void;
  onRefresh?: () => void;
}

// 将 Task 状态映射为 TaskCard 状态
type TaskCardStatus = 'active' | 'completed' | 'todo';

function getTaskCardStatus(task: Task): TaskCardStatus {
  if (task.status === 'completed') return 'completed';
  if (task.status === 'in_progress') return 'active';
  return 'todo';
}

// 格式化任务副标题
function formatTaskSubtitle(task: Task): string {
  const parts: string[] = [];
  
  if (task.category) {
    parts.push(task.category);
  }
  
  parts.push(`${task.completedPomodoros}/${task.estimatedPomodoros} 番茄`);
  
  return parts.join(' · ');
}

export function TaskList({ 
  tasks, 
  isLoading, 
  error, 
  onToggleTask, 
  onAddTask,
  onRefresh 
}: TaskListProps) {
  // 计算已完成任务数
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  
  // 加载状态
  if (isLoading) {
    return (
      <View style={styles.container}>
        <SectionHeader title="今日任务" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }
  
  // 错误状态
  if (error) {
    return (
      <View style={styles.container}>
        <SectionHeader title="今日任务" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.emptyTitle}>加载失败</Text>
          <Text style={styles.emptyDesc}>点击重试</Text>
        </View>
        {onRefresh && (
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryText}>重试</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <SectionHeader
        title="今日任务"
        right={<Text style={styles.progress}>{completedCount}/{tasks.length} 已完成</Text>}
      />
      
      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>暂无待办任务</Text>
          <Text style={styles.emptyDesc}>添加任务开始今天的学习吧</Text>
        </View>
      ) : (
        tasks.map(task => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            subtitle={formatTaskSubtitle(task)}
            status={getTaskCardStatus(task)}
            onToggle={() => onToggleTask(task.id)}
          />
        ))
      )}
      
      <TouchableOpacity style={styles.addButton} onPress={onAddTask} activeOpacity={0.7}>
        <Text style={styles.addText}>+ 添加新任务</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  progress: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  loadingContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptyDesc: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  addButton: {
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  addText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  retryText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: fontWeight.semibold,
  },
});
