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
import { api } from '@studyflow/api';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { Modal, ConfirmModal } from '../../../components/ui/Modal';
import { colors, radius, spacing, shadows, fontWeight } from '../../../theme';

// ==================== 辅助函数 ====================

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bgColor: string }> = {
  high: { label: '高优先级', color: colors.error, bgColor: colors.error + '15' },
  medium: { label: '中优先级', color: colors.warning, bgColor: colors.warning + '15' },
  low: { label: '低优先级', color: colors.success, bgColor: colors.success + '15' },
};

type TaskCardStatus = 'active' | 'completed' | 'todo';

function getTaskCardStatus(task: Task): TaskCardStatus {
  if (task.status === 'completed') return 'completed';
  if (task.status === 'in_progress') return 'active';
  return 'todo';
}

function formatTaskSubtitle(task: Task): string {
  const parts: string[] = [];
  if (task.category) parts.push(task.category);
  parts.push(`${task.completedPomodoros}/${task.estimatedPomodoros} 番茄`);
  return parts.join(' · ');
}

// ==================== 任务卡片（含排序按钮） ====================

interface TaskItemProps {
  task: Task;
  index: number;
  total: number;
  isSelected: boolean;
  onPress: (task: Task) => void;
  onToggle: (taskId: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

function TaskItem({ task, index, total, isSelected, onPress, onToggle, onMoveUp, onMoveDown }: TaskItemProps) {
  const status = getTaskCardStatus(task);
  const isDone = status === 'completed';
  const isActiveStatus = status === 'active';
  const canMoveUp = index > 0;
  const canMoveDown = index < total - 1;

  return (
    <TouchableOpacity
      style={[
        styles.taskCard,
        isSelected && styles.taskCardSelected,
        isActiveStatus && !isSelected && styles.taskCardActive,
      ]}
      onPress={() => onPress(task)}
      activeOpacity={0.8}
    >
      {/* 排序按钮 */}
      <View style={styles.sortControls}>
        <TouchableOpacity
          style={[styles.sortBtn, !canMoveUp && styles.sortBtnDisabled]}
          onPress={() => canMoveUp && onMoveUp(index)}
          disabled={!canMoveUp}
          hitSlop={{ top: 4, bottom: 2, left: 6, right: 6 }}
        >
          <Text style={[styles.sortBtnText, !canMoveUp && styles.sortBtnTextDisabled]}>▲</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortBtn, !canMoveDown && styles.sortBtnDisabled]}
          onPress={() => canMoveDown && onMoveDown(index)}
          disabled={!canMoveDown}
          hitSlop={{ top: 2, bottom: 4, left: 6, right: 6 }}
        >
          <Text style={[styles.sortBtnText, !canMoveDown && styles.sortBtnTextDisabled]}>▼</Text>
        </TouchableOpacity>
      </View>

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
          isActiveStatus && !isSelected && styles.checkboxActive,
        ]}
        onPress={() => onToggle(task.id)}
        activeOpacity={0.7}
      >
        {isDone && <Text style={styles.checkMark}>✓</Text>}
      </TouchableOpacity>

      {/* 任务内容 */}
      <View style={styles.taskContent}>
        <View style={styles.titleRow}>
          <Text style={[styles.taskTitle, isDone && styles.taskTitleDone]} numberOfLines={1}>
            {task.title}
          </Text>
          {isSelected && !isDone && (
            <View style={styles.selectedTag}>
              <Text style={styles.selectedTagText}>专注</Text>
            </View>
          )}
        </View>
        <Text style={styles.taskSubtitle} numberOfLines={1}>
          {formatTaskSubtitle(task)}
        </Text>
      </View>

      {/* 状态/优先级标签 */}
      {isActiveStatus && (
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>进行中</Text>
        </View>
      )}
      {task.priority === 'high' && !isDone && !isActiveStatus && (
        <View style={styles.priorityDot} />
      )}
    </TouchableOpacity>
  );
}

// ==================== 主组件 ====================

interface SortableTaskListProps {
  tasks: Task[];
  selectedTaskId?: string | null;
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
  isLoading,
  error,
  onToggleTask,
  onRefresh,
  onReorder,
  onSelectTask,
}: SortableTaskListProps) {
  const [items, setItems] = useState<Task[]>(tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [pendingCompleteTaskId, setPendingCompleteTaskId] = useState<string | null>(null);

  // 添加任务弹窗状态
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newPomodoros, setNewPomodoros] = useState(1);
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

  // ===== 排序 =====
  const moveItem = useCallback((from: number, to: number) => {
    setItems((prev) => {
      const newItems = [...prev];
      const [moved] = newItems.splice(from, 1);
      newItems.splice(to, 0, moved);
      onReorder?.(newItems);
      return newItems;
    });
  }, [onReorder]);

  const handleMoveUp = useCallback((index: number) => {
    if (index > 0) moveItem(index, index - 1);
  }, [moveItem]);

  const handleMoveDown = useCallback((index: number) => {
    if (index < items.length - 1) moveItem(index, index + 1);
  }, [moveItem, items.length]);

  // ===== 任务选择 =====
  const handleTaskPress = useCallback((task: Task) => {
    if (task.status === 'completed') {
      // 已完成的任务显示详情
      setSelectedTask(task);
      setShowTaskDetail(true);
      return;
    }
    
    // 未完成的任务：移动到第一位并选中
    const currentIndex = items.findIndex((t) => t.id === task.id);
    if (currentIndex > 0) {
      moveItem(currentIndex, 0);
    }
    onSelectTask?.(task);
  }, [items, moveItem, onSelectTask]);

  const handleCloseTaskDetail = useCallback(() => {
    setShowTaskDetail(false);
    setSelectedTask(null);
  }, []);

  // ===== 完成确认 =====
  const handleToggleRequest = useCallback((taskId: string) => {
    const task = items.find((t) => t.id === taskId);
    if (task && task.status !== 'completed') {
      setPendingCompleteTaskId(taskId);
      setShowCompleteConfirm(true);
    } else {
      onToggleTask(taskId);
    }
  }, [items, onToggleTask]);

  const handleConfirmComplete = useCallback(() => {
    if (pendingCompleteTaskId) {
      onToggleTask(pendingCompleteTaskId);
    }
    setShowCompleteConfirm(false);
    setPendingCompleteTaskId(null);
  }, [pendingCompleteTaskId, onToggleTask]);

  const handleCancelComplete = useCallback(() => {
    setShowCompleteConfirm(false);
    setPendingCompleteTaskId(null);
  }, []);

  // ===== 添加任务 =====
  const handleOpenAdd = useCallback(() => {
    setNewTitle('');
    setNewDescription('');
    setNewPriority('medium');
    setNewPomodoros(1);
    setNewCategory('');
    setShowAddModal(true);
  }, []);

  const handleCloseAdd = useCallback(() => {
    setShowAddModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewPriority('medium');
    setNewPomodoros(1);
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
        estimatedPomodoros: newPomodoros,
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
      {/* 完成确认弹窗 */}
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
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>任务名称</Text>
              <Text style={styles.detailTitle}>{selectedTask.title}</Text>
            </View>

            {selectedTask.description && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>任务详情</Text>
                <Text style={styles.detailDescription}>{selectedTask.description}</Text>
              </View>
            )}

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

            {selectedTask.category && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>分类</Text>
                <Text style={styles.detailText}>{selectedTask.category}</Text>
              </View>
            )}

            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>番茄进度</Text>
              <Text style={styles.detailText}>
                {selectedTask.completedPomodoros} / {selectedTask.estimatedPomodoros} 个番茄
              </Text>
            </View>
          </ScrollView>
        )}
      </Modal>

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
          <View style={styles.formRow}>
            <View style={styles.formHalf}>
              <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>预估番茄数</Text>
              <View style={styles.pomodoroStepper}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setNewPomodoros((v) => Math.max(1, v - 1))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{newPomodoros}</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setNewPomodoros((v) => Math.min(20, v + 1))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.formHalf}>
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
          </View>
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
          {items.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              index={index}
              total={items.length}
              isSelected={task.id === selectedTaskId}
              onPress={handleTaskPress}
              onToggle={handleToggleRequest}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
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

  // ===== 任务卡片 =====
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
    ...shadows.sm,
  },
  taskCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  taskCardActive: {
    borderWidth: 1.5,
    borderColor: colors.primary + '80',
    backgroundColor: colors.primary + '05',
  },

  // 排序按钮
  sortControls: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  sortBtn: {
    width: 22,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.warm,
  },
  sortBtnDisabled: {
    opacity: 0.3,
  },
  sortBtnText: {
    fontSize: 8,
    color: colors.textSecondary,
  },
  sortBtnTextDisabled: {
    color: colors.textMuted,
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
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
  checkboxActive: {
    borderColor: colors.primary + '80',
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
  selectedTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  selectedTagText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: fontWeight.semibold,
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

  // ===== 详情弹窗 =====
  detailContent: {
    flexShrink: 1,
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
  formRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  formHalf: {
    flex: 1,
  },
  pomodoroStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.warm,
    overflow: 'hidden',
  },
  stepperBtn: {
    width: 40,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 18,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },
  stepperValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: fontWeight.semibold,
    color: colors.text,
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
