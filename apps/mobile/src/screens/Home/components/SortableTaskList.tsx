import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import type { Task, TaskPriority } from '@studyflow/shared';
import type { TimerStatus } from '../../../components/business/PomodoroTimer';
import { api } from '../../../api';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { Modal } from '../../../components/ui/Modal';
import { useDialog } from '../../../providers/DialogProvider';
import { colors, radius, spacing, fontWeight } from '../../../theme';

// ==================== 辅助函数 ====================

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bgColor: string }> = {
  high: { label: '高优先级', color: colors.error, bgColor: colors.error + '15' },
  medium: { label: '中优先级', color: colors.warning, bgColor: colors.warning + '15' },
  low: { label: '低优先级', color: colors.success, bgColor: colors.success + '15' },
};

function formatTaskSubtitle(task: Task): string {
  // 只显示分类，不再显示番茄数
  return task.category || '未分类';
}

// ==================== 任务卡片 ====================

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  isTimerActive: boolean;
  onPress: (task: Task) => void;
  onToggle: (taskId: string) => void;
}

function TaskItem({ task, isSelected, isTimerActive, onPress, onToggle }: TaskItemProps) {
  const isDone = task.status === 'completed';
  // "进行中" 仅在该任务被选中且计时器正在运行/暂停时显示
  const showInProgress = isSelected && isTimerActive && !isDone;

  return (
    <TouchableOpacity
      style={[
        styles.taskCard,
        isSelected && styles.taskCardSelected,
      ]}
      onPress={() => onPress(task)}
      activeOpacity={0.8}
    >
      {/* 选中指示器 */}
      <View style={styles.indicator}>
        {isSelected && !isDone && <View style={styles.selectedDot} />}
      </View>

      {/* 复选框 */}
      <TouchableOpacity
        style={[
          styles.checkbox,
          isDone && styles.checkboxDone,
          isSelected && styles.checkboxSelected,
        ]}
        onPress={() => onToggle(task.id)}
        activeOpacity={0.7}
      >
        {isDone && <Text style={styles.checkMark}>✓</Text>}
      </TouchableOpacity>

      {/* 任务内容 */}
      <View style={styles.taskContent}>
        <View style={styles.titleRow}>
          <Text style={[styles.taskTitle, isDone && styles.taskTitleDone]} numberOfLines={3}>
            {task.title}
          </Text>
        </View>
        <Text style={styles.taskSubtitle} numberOfLines={1}>
          {formatTaskSubtitle(task)}
        </Text>
      </View>

      {/* 状态/优先级标签 */}
      {showInProgress && (
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>进行中</Text>
        </View>
      )}
      {task.priority === 'high' && !isDone && !showInProgress && (
        <View style={styles.priorityDot} />
      )}
    </TouchableOpacity>
  );
}

// ==================== 主组件 ====================

interface SortableTaskListProps {
  tasks: Task[];
  selectedTaskId?: string | null;
  pomodoroStatus?: TimerStatus;
  isLoading?: boolean;
  error?: Error | null;
  onToggleTask: (id: string) => void;
  onAddTask: () => void;
  onRefresh?: () => void;
  onReorder?: (tasks: Task[]) => Promise<void>;
  onSelectTask?: (task: Task) => void;
  isPomodoroRunning?: boolean;
  onPausePomodoro?: () => void;
  onResetPomodoro?: () => void;
}

export function SortableTaskList({
  tasks,
  selectedTaskId,
  pomodoroStatus = 'idle',
  isLoading,
  error,
  onToggleTask,
  onRefresh,
  onReorder,
  onSelectTask,
}: SortableTaskListProps) {
  const [items, setItems] = useState<Task[]>(tasks);
  const dialog = useDialog();

  const isTimerActive = pomodoroStatus === 'running' || pomodoroStatus === 'paused';

  // 添加任务弹窗状态
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');

  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // 同步外部 tasks
  useEffect(() => {
    const itemIds = items.map(t => t.id).join(',');
    const taskIds = tasks.map(t => t.id).join(',');
    if (itemIds !== taskIds) {
      setItems(tasks);
    }
  }, [tasks]);

  const completedCount = items.filter((t) => t.status === 'completed').length;

  // ===== 任务选择 =====
  const handleTaskPress = useCallback((task: Task) => {
    if (task.status === 'completed') return;

    // 移动到第一位并选中
    const currentIndex = items.findIndex((t) => t.id === task.id);
    if (currentIndex > 0) {
      const newItems = [...items];
      const [moved] = newItems.splice(currentIndex, 1);
      newItems.splice(0, 0, moved);
      setItems(newItems);
      onReorder?.(newItems);
    }
    onSelectTask?.(task);
  }, [items, onReorder, onSelectTask]);

  // ===== 完成确认 =====
  const handleToggleRequest = useCallback((taskId: string) => {
    const task = items.find((t) => t.id === taskId);
    if (task && task.status !== 'completed') {
      dialog.confirm({
        variant: 'success',
        title: '完成任务',
        message: `确定要完成任务「${task.title}」吗？`,
        confirmText: '完成',
        cancelText: '取消',
        onConfirm: () => {
          onToggleTask(taskId);
        },
      });
    } else {
      onToggleTask(taskId);
    }
  }, [items, onToggleTask, dialog]);

  // ===== 添加任务 =====
  const handleOpenAdd = useCallback(() => {
    setNewTitle('');
    setNewDescription('');
    setNewPriority('medium');

    setNewCategory('');
    setShowAddModal(true);
  }, []);

  const handleCloseAdd = useCallback(() => {
    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewPriority('medium');

    setNewCategory('');
  }, []);

  const handleAddTask = useCallback(async () => {
    if (!newTitle.trim()) return;
    setIsAdding(true);
    try {
      await api.task.createTask({
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
        priority: newPriority,

        category: newCategory.trim() || undefined,
      });
      handleCloseAdd();
      onRefresh?.();
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setIsAdding(false);
    }
  }, [newTitle, newCategory, handleCloseAdd, onRefresh]);

  // ===== 加载/错误状态 =====
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
      {/* 添加任务弹窗 */}
      <Modal
        visible={showAddModal}
        onClose={handleCloseAdd}
        title="新建任务"
        footer={
          <View style={styles.addModalButtons}>
            <TouchableOpacity style={styles.addModalCancel} onPress={handleCloseAdd}>
              <Text style={styles.addModalCancelText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addModalConfirm, (!newTitle.trim() || isAdding) && styles.addModalConfirmDisabled]}
              onPress={handleAddTask}
              disabled={!newTitle.trim() || isAdding}
            >
              <Text style={styles.addModalConfirmText}>
                {isAdding ? '添加中...' : '添加'}
              </Text>
            </TouchableOpacity>
          </View>
        }
      >
        <View>
          <Text style={styles.inputLabel}>任务名称</Text>
          <TextInput
            style={styles.input}
            placeholder="输入任务名称"
            placeholderTextColor={colors.textMuted}
            value={newTitle}
            onChangeText={setNewTitle}
            autoFocus
            returnKeyType="next"
          />
          <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>任务描述</Text>
          <TextInput
            style={styles.input}
            placeholder="简要描述任务内容"
            placeholderTextColor={colors.textMuted}
            value={newDescription}
            onChangeText={setNewDescription}
            returnKeyType="next"
          />
          <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>优先级</Text>
          <View style={styles.prioritySelector}>
            {(['high', 'medium', 'low'] as TaskPriority[]).map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityOption,
                  { borderColor: PRIORITY_CONFIG[p].color },
                  newPriority === p && { backgroundColor: PRIORITY_CONFIG[p].bgColor },
                ]}
                onPress={() => setNewPriority(p)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.priorityOptionText,
                    { color: newPriority === p ? PRIORITY_CONFIG[p].color : colors.textSecondary },
                  ]}
                >
                  {PRIORITY_CONFIG[p].label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>分类 (可选)</Text>
          <TextInput
            style={styles.input}
            placeholder="如：高等数学"
            placeholderTextColor={colors.textMuted}
            value={newCategory}
            onChangeText={setNewCategory}
            returnKeyType="done"
            onSubmitEditing={handleAddTask}
          />
        </View>
      </Modal>

      {/* 头部 */}
      <SectionHeader
        title="今日任务"
        right={<Text style={styles.progress}>{completedCount}/{items.length} 已完成</Text>}
      />

      {/* 任务列表 */}
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>暂无待办任务</Text>
          <Text style={styles.emptyDesc}>添加任务开始今天的学习吧</Text>
        </View>
      ) : (
        <View style={styles.taskList}>
          {items.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isSelected={task.id === selectedTaskId}
              isTimerActive={isTimerActive}
              onPress={handleTaskPress}
              onToggle={handleToggleRequest}
            />
          ))}
        </View>
      )}

      {/* 添加按钮 */}
      <TouchableOpacity style={styles.addButton} onPress={handleOpenAdd} activeOpacity={0.7}>
        <Text style={styles.addText}>+ 添加新任务</Text>
      </TouchableOpacity>
    </View>
  );
}

// ==================== 样式 ====================

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
    gap: spacing.sm,
  },
  addButton: {
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
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

  // ===== 任务卡片（无阴影，简洁样式） =====
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warm,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  taskCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },

  // 指示器
  indicator: {
    width: 10,
    alignItems: 'center',
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
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
  checkboxSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  checkMark: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: fontWeight.bold,
  },
  taskContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
    color: colors.text,
    flex: 1,
  },
  taskTitleDone: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  taskSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  statusBadgeText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },

  // ===== 添加任务弹窗 =====
  inputLabel: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.warm,
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  priorityOptionText: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
  },
  addModalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  addModalCancel: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    backgroundColor: colors.warm,
  },
  addModalCancelText: {
    fontSize: 15,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  addModalConfirm: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  addModalConfirmDisabled: {
    opacity: 0.5,
  },
  addModalConfirmText: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
});
