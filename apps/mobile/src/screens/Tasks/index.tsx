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
  Modal,
} from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { TaskCard } from '../../components/business/TaskCard';
import { colors, radius, spacing, fontWeight, shadows } from '../../theme';
import { api } from '@studyflow/api';
import type { Task } from '@studyflow/shared';

type FilterStatus = 'all' | 'todo' | 'in_progress' | 'completed';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
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
        category: newTaskCategory.trim() || '未分类',
        estimatedPomodoros: 1,
      });
      setTasks((prev) => [response.data, ...prev]);
      setNewTaskTitle('');
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
      <Text style={[styles.filterTabText, filter === status && styles.filterTabTextActive]}>
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
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>新建任务</Text>
            
            <TextInput
              style={styles.input}
              placeholder="任务名称"
              placeholderTextColor={colors.textMuted}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              autoFocus
            />
            
            <TextInput
              style={styles.input}
              placeholder="分类（可选）"
              placeholderTextColor={colors.textMuted}
              value={newTaskCategory}
              onChangeText={setNewTaskCategory}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowAddModal(false);
                  setNewTaskTitle('');
                  setNewTaskCategory('');
                }}
              >
                <Text style={styles.modalButtonCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleAddTask}
              >
                <Text style={styles.modalButtonConfirmText}>添加</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: spacing.md,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.warm,
  },
  filterTabActive: {
    backgroundColor: colors.primary + '15',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  filterCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterCountActive: {
    backgroundColor: colors.primary,
  },
  filterCountText: {
    fontSize: 11,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: radius['2xl'],
    padding: spacing.xl,
    width: '100%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
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
