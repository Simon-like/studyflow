/**
 * 任务管理页面
 * 用于查看和管理所有任务
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { TaskCard } from '../../components/business/TaskCard';
import { Modal as AppModal } from '../../components/ui/Modal';
import { colors, radius, spacing, fontWeight, shadows } from '../../theme';
import { api } from '@studyflow/api';
import type { Task, TaskPriority } from '@studyflow/shared';

type FilterStatus = 'all' | 'todo' | 'in_progress' | 'completed';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);
  const [newTaskCategory, setNewTaskCategory] = useState('');

  // 获取任务列表
  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.task.getTasks();
      setTasks(response.data.list);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 添加新任务
  const handleAddTask = useCallback(async () => {
    if (!newTaskTitle.trim()) return;
    
    try {
      const response = await api.task.createTask({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined,
        priority: newTaskPriority,
        estimatedPomodoros: newTaskPomodoros,
        category: newTaskCategory.trim() || undefined,
      });
      setTasks((prev) => [response.data, ...prev]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
      setNewTaskPomodoros(1);
      setNewTaskCategory('');
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  }, [newTaskTitle, newTaskCategory]);

  // 切换任务状态
  const handleToggleTask = useCallback(async (taskId: string) => {
    try {
      const response = await api.task.toggleStatus(taskId);
      const updatedTask = response.data;
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      );
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  }, []);

  // 过滤任务
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  // 统计
  const stats = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  // 渲染过滤标签
  const FilterTab = ({ status, label, count }: { status: FilterStatus; label: string; count: number }) => (
    <TouchableOpacity
      style={[styles.filterTab, filter === status && styles.filterTabActive]}
      onPress={() => setFilter(status)}
      activeOpacity={0.8}
    >
      <Text style={[styles.filterTabText, filter === status && styles.filterTabTextActive]} numberOfLines={1}>
        {label}
      </Text>
      <View style={[styles.filterCount, filter === status && styles.filterCountActive]}>
        <Text style={[styles.filterCountText, filter === status && styles.filterCountTextActive]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>任务管理</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+ 新建任务</Text>
        </TouchableOpacity>
      </View>

      {/* 过滤器 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        <FilterTab status="all" label="全部" count={stats.all} />
        <FilterTab status="todo" label="待办" count={stats.todo} />
        <FilterTab status="in_progress" label="进行中" count={stats.in_progress} />
        <FilterTab status="completed" label="已完成" count={stats.completed} />
      </ScrollView>

      {/* 任务列表 */}
      <ScrollView style={styles.taskList} contentContainerStyle={styles.taskListContent}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyTitle}>暂无任务</Text>
            <Text style={styles.emptyDesc}>点击右上角添加新任务</Text>
          </View>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              subtitle={`${task.category || '未分类'} · ${task.completedPomodoros}/${task.estimatedPomodoros} 番茄`}
              status={
                task.status === 'completed'
                  ? 'completed'
                  : task.status === 'in_progress'
                    ? 'active'
                    : 'todo'
              }
              onToggle={() => handleToggleTask(task.id)}
            />
          ))
        )}
      </ScrollView>

      {/* 添加任务弹窗 */}
      <AppModal
        visible={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewTaskTitle('');
          setNewTaskDescription('');
          setNewTaskPriority('medium');
          setNewTaskPomodoros(1);
          setNewTaskCategory('');
        }}
        title="新建任务"
        footer={
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={() => {
                setShowAddModal(false);
                setNewTaskTitle('');
                setNewTaskDescription('');
                setNewTaskPriority('medium');
                setNewTaskPomodoros(1);
                setNewTaskCategory('');
              }}
            >
              <Text style={styles.modalButtonCancelText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonConfirm, !newTaskTitle.trim() && { opacity: 0.5 }]}
              onPress={handleAddTask}
              disabled={!newTaskTitle.trim()}
            >
              <Text style={styles.modalButtonConfirmText}>添加</Text>
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
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            autoFocus
            returnKeyType="next"
          />
          <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>任务描述</Text>
          <TextInput
            style={styles.input}
            placeholder="简要描述任务内容"
            placeholderTextColor={colors.textMuted}
            value={newTaskDescription}
            onChangeText={setNewTaskDescription}
            returnKeyType="next"
          />
          <Text style={[styles.inputLabel, { marginTop: spacing.md }]}>优先级</Text>
          <View style={styles.prioritySelector}>
            {([
              { key: 'high' as TaskPriority, label: '高', color: '#E53E3E', bg: '#E53E3E15' },
              { key: 'medium' as TaskPriority, label: '中', color: '#DD6B20', bg: '#DD6B2015' },
              { key: 'low' as TaskPriority, label: '低', color: '#38A169', bg: '#38A16915' },
            ]).map((p) => (
              <TouchableOpacity
                key={p.key}
                style={[
                  styles.priorityOption,
                  { borderColor: p.color },
                  newTaskPriority === p.key && { backgroundColor: p.bg },
                ]}
                onPress={() => setNewTaskPriority(p.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.priorityOptionText,
                    { color: newTaskPriority === p.key ? p.color : colors.textSecondary },
                  ]}
                >
                  {p.label}优先级
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
                  onPress={() => setNewTaskPomodoros((v) => Math.max(1, v - 1))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{newTaskPomodoros}</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setNewTaskPomodoros((v) => Math.min(20, v + 1))}
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
                value={newTaskCategory}
                onChangeText={setNewTaskCategory}
                returnKeyType="done"
              />
            </View>
          </View>
        </View>
      </AppModal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    ...shadows.sm,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: fontWeight.semibold,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
    paddingTop: spacing.xs,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    width: 100,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  filterTabActive: {
    backgroundColor: colors.primary + '12',
    borderColor: colors.primary + '40',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    flex: 1,
  },
  filterTabTextActive: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  filterCount: {
    width: 20,
    height: 20,
    borderRadius: 8,
    backgroundColor: colors.warm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterCountActive: {
    backgroundColor: colors.primary,
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
    color: colors.textMuted,
  },
  filterCountTextActive: {
    color: colors.white,
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing['3xl'],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptyDesc: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  // Form styles
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
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.warm,
  },
  modalButtonCancelText: {
    fontSize: 15,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  modalButtonConfirm: {
    backgroundColor: colors.primary,
  },
  modalButtonConfirmText: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
});
