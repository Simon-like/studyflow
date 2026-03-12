import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import type { Task, TaskPriority } from '@studyflow/shared';
import { TaskCard } from '../../../components/business/TaskCard';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { Modal, ConfirmModal } from '../../../components/ui/Modal';
import { colors, radius, spacing, fontWeight } from '../../../theme';

// 优先级配置
const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bgColor: string }> = {
  high: { label: '高优先级', color: colors.error, bgColor: colors.error + '15' },
  medium: { label: '中优先级', color: colors.warning, bgColor: colors.warning + '15' },
  low: { label: '低优先级', color: colors.success, bgColor: colors.success + '15' },
};

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

interface SortableTaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  error?: Error | null;
  onToggleTask: (id: string) => void;
  onAddTask: () => void;
  onRefresh?: () => void;
  onReorder?: (tasks: Task[]) => Promise<void>;
  isPomodoroRunning?: boolean;
  onPausePomodoro?: () => void;
  onResetPomodoro?: () => void;
}

export function SortableTaskList({
  tasks,
  isLoading,
  error,
  onToggleTask,
  onAddTask,
  onRefresh,
  onReorder,
}: SortableTaskListProps) {
  const [items, setItems] = useState<Task[]>(tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [pendingCompleteTaskId, setPendingCompleteTaskId] = useState<string | null>(null);

  // 同步外部 tasks 变化
  if (JSON.stringify(items.map((t) => t.id)) !== JSON.stringify(tasks.map((t) => t.id))) {
    setItems(tasks);
  }

  const completedCount = items.filter((t) => t.status === 'completed').length;

  // 打开任务详情
  const handleTaskPress = useCallback((task: Task) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  }, []);

  // 关闭任务详情
  const handleCloseTaskDetail = useCallback(() => {
    setShowTaskDetail(false);
    setSelectedTask(null);
  }, []);

  // 请求完成任务（显示确认对话框）
  const handleToggleRequest = useCallback((taskId: string) => {
    const task = items.find((t) => t.id === taskId);
    if (task && task.status !== 'completed') {
      // 只有未完成的任务才需要确认
      setPendingCompleteTaskId(taskId);
      setShowCompleteConfirm(true);
    } else {
      // 已完成的任务直接切换（重新打开）
      onToggleTask(taskId);
    }
  }, [items, onToggleTask]);

  // 确认完成任务
  const handleConfirmComplete = useCallback(() => {
    if (pendingCompleteTaskId) {
      onToggleTask(pendingCompleteTaskId);
    }
    setShowCompleteConfirm(false);
    setPendingCompleteTaskId(null);
  }, [pendingCompleteTaskId, onToggleTask]);

  // 取消完成任务
  const handleCancelComplete = useCallback(() => {
    setShowCompleteConfirm(false);
    setPendingCompleteTaskId(null);
  }, []);

  // 上移任务
  const handleMoveUp = useCallback(() => {
    if (!selectedTask) return;
    const index = items.findIndex((t) => t.id === selectedTask.id);
    if (index <= 0) return;

    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setItems(newItems);
    onReorder?.(newItems);
    setSelectedTask(newItems[index - 1]);
  }, [selectedTask, items, onReorder]);

  // 下移任务
  const handleMoveDown = useCallback(() => {
    if (!selectedTask) return;
    const index = items.findIndex((t) => t.id === selectedTask.id);
    if (index >= items.length - 1) return;

    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setItems(newItems);
    onReorder?.(newItems);
    setSelectedTask(newItems[index + 1]);
  }, [selectedTask, items, onReorder]);

  // 获取选中任务的索引
  const selectedTaskIndex = selectedTask ? items.findIndex((t) => t.id === selectedTask.id) : -1;
  const canMoveUp = selectedTaskIndex > 0;
  const canMoveDown = selectedTaskIndex >= 0 && selectedTaskIndex < items.length - 1;

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
      {/* 完成任务确认弹窗 */}
      <ConfirmModal
        visible={showCompleteConfirm}
        onClose={handleCancelComplete}
        onConfirm={handleConfirmComplete}
        title="完成任务"
        message="确定要完成这个任务吗？"
        confirmText="完成"
        cancelText="取消"
      />

      {/* 任务详情弹窗 */}
      <Modal
        visible={showTaskDetail}
        onClose={handleCloseTaskDetail}
        title="任务详情"
      >
        {selectedTask && (
          <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
            {/* 任务名称 */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>任务名称</Text>
              <Text style={styles.detailTitle}>{selectedTask.title}</Text>
            </View>

            {/* 任务详情/描述 */}
            {selectedTask.description && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>任务详情</Text>
                <Text style={styles.detailDescription}>{selectedTask.description}</Text>
              </View>
            )}

            {/* 重要性标签 */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>优先级</Text>
              <View
                style={[
                  styles.priorityBadge,
                  { backgroundColor: PRIORITY_CONFIG[selectedTask.priority].bgColor },
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
                    { color: PRIORITY_CONFIG[selectedTask.priority].color },
                  ]}
                >
                  {PRIORITY_CONFIG[selectedTask.priority].label}
                </Text>
              </View>
            </View>

            {/* 分类 */}
            {selectedTask.category && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>分类</Text>
                <Text style={styles.detailText}>{selectedTask.category}</Text>
              </View>
            )}

            {/* 预计番茄数 */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>预计番茄数</Text>
              <Text style={styles.detailText}>
                {selectedTask.estimatedPomodoros} 个番茄
              </Text>
            </View>

            {/* 已完成番茄数 */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>已完成番茄数</Text>
              <Text style={styles.detailText}>
                {selectedTask.completedPomodoros} 个番茄
              </Text>
            </View>

            {/* 排序控制 */}
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>任务排序</Text>
              <View style={styles.sortButtons}>
                <TouchableOpacity
                  style={[styles.sortButton, !canMoveUp && styles.sortButtonDisabled]}
                  onPress={handleMoveUp}
                  disabled={!canMoveUp}
                >
                  <Text style={[styles.sortButtonText, !canMoveUp && styles.sortButtonTextDisabled]}>
                    ↑ 上移
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sortButton, !canMoveDown && styles.sortButtonDisabled]}
                  onPress={handleMoveDown}
                  disabled={!canMoveDown}
                >
                  <Text style={[styles.sortButtonText, !canMoveDown && styles.sortButtonTextDisabled]}>
                    ↓ 下移
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </Modal>

      <SectionHeader
        title="今日任务"
        right={<Text style={styles.progress}>{completedCount}/{items.length} 已完成</Text>}
      />

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>暂无待办任务</Text>
          <Text style={styles.emptyDesc}>添加任务开始今天的学习吧</Text>
        </View>
      ) : (
        <View style={styles.taskList}>
          {items.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              subtitle={formatTaskSubtitle(task)}
              status={getTaskCardStatus(task)}
              onPress={() => handleTaskPress(task)}
              onToggle={() => handleToggleRequest(task.id)}
            />
          ))}
        </View>
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
  taskList: {
    minHeight: 100,
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
  // Detail Modal Styles
  detailContent: {
    maxHeight: 400,
  },
  detailSection: {
    marginBottom: spacing.lg,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: fontWeight.medium,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    lineHeight: 22,
  },
  detailDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  sortButton: {
    flex: 1,
    backgroundColor: colors.primary + '15',
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  sortButtonDisabled: {
    backgroundColor: colors.warm,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
  sortButtonTextDisabled: {
    color: colors.textMuted,
  },
});
