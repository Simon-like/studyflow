import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  type SharedValue,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import type { Task } from '@studyflow/shared';
import { TaskCard } from '../../../components/business/TaskCard';
import { SectionHeader } from '../../../components/layout/SectionHeader';
import { colors, radius, spacing, fontWeight } from '../../../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TASK_ITEM_HEIGHT = 72; // 任务项高度（包括 margin）

interface SortableTaskItemProps {
  task: Task;
  index: number;
  isFirst: boolean;
  isDragging: boolean;
  onToggle: () => void;
  onDragStart: () => void;
  onDragEnd: (fromIndex: number, toIndex: number) => void;
  positions: SharedValue<number[]>;
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

function SortableTaskItem({
  task,
  index,
  isFirst,
  isDragging,
  onToggle,
  onDragStart,
  onDragEnd,
  positions,
}: SortableTaskItemProps) {
  const translateY = useSharedValue(0);
  const isActive = useSharedValue(false);
  const itemHeight = TASK_ITEM_HEIGHT;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      zIndex: isActive.value ? 100 : 1,
      elevation: isActive.value ? 10 : 1,
      opacity: isDragging && !isActive.value ? 0.5 : 1,
    };
  });

  const panGesture = Gesture.Pan()
    .activateAfterLongPress(200) // 长按 200ms 后激活拖拽
    .onStart(() => {
      isActive.value = true;
      runOnJS(onDragStart)();
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;

      // 计算目标位置
      const newIndex = Math.round(
        (event.translationY + index * itemHeight) / itemHeight
      );
      const clampedIndex = Math.max(0, Math.min(newIndex, positions.value.length - 1));

      if (clampedIndex !== index) {
        // 更新其他项目的位置
        const newPositions = [...positions.value];
        const [removed] = newPositions.splice(index, 1);
        newPositions.splice(clampedIndex, 0, removed);
        positions.value = newPositions;
      }
    })
    .onEnd(() => {
      isActive.value = false;
      translateY.value = withSpring(0);

      // 计算最终位置
      const finalIndex = Math.round(translateY.value / itemHeight) + index;
      const clampedFinalIndex = Math.max(
        0,
        Math.min(finalIndex, positions.value.length - 1)
      );

      if (clampedFinalIndex !== index) {
        runOnJS(onDragEnd)(index, clampedFinalIndex);
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.taskItem, animatedStyle]}>
        <View style={styles.taskContainer}>
          {/* 拖拽指示器 */}
          <View style={styles.dragHandle}>
            <View style={styles.dragIndicator} />
            {isFirst && task.status !== 'completed' && (
              <View style={styles.firstTaskBadge}>
                <Text style={styles.firstTaskText}>专注</Text>
              </View>
            )}
          </View>

          {/* 任务卡片 */}
          <View style={styles.taskCardWrapper}>
            <TaskCard
              id={task.id}
              title={task.title}
              subtitle={formatTaskSubtitle(task)}
              status={getTaskCardStatus(task)}
              onToggle={onToggle}
            />
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
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
  isPomodoroRunning,
  onResetPomodoro,
}: SortableTaskListProps) {
  const [items, setItems] = useState<Task[]>(tasks);
  const [isDragging, setIsDragging] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [pendingReorder, setPendingReorder] = useState<Task[] | null>(null);
  const positions = useSharedValue<number[]>(tasks.map((_, i) => i));

  // 同步外部 tasks 变化
  if (JSON.stringify(items.map((t) => t.id)) !== JSON.stringify(tasks.map((t) => t.id))) {
    setItems(tasks);
    positions.value = tasks.map((_, i) => i);
  }

  const completedCount = items.filter((t) => t.status === 'completed').length;

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(
    (fromIndex: number, toIndex: number) => {
      setIsDragging(false);

      if (fromIndex === toIndex) return;

      // 检查是否正在移动第一个任务且番茄钟正在运行
      const firstTask = items[0];
      const isMovingFirstTask = fromIndex === 0 || toIndex === 0;
      
      if (isMovingFirstTask && isPomodoroRunning && firstTask?.status === 'in_progress') {
        // 保存待执行的排序
        const newItems = [...items];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);
        setPendingReorder(newItems);
        setShowResetConfirm(true);
        return;
      }

      // 直接执行排序
      const newItems = [...items];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      setItems(newItems);
      onReorder?.(newItems);
    },
    [items, isPomodoroRunning, onReorder]
  );

  const handleConfirmReset = () => {
    onResetPomodoro?.();
    if (pendingReorder) {
      setItems(pendingReorder);
      onReorder?.(pendingReorder);
    }
    setShowResetConfirm(false);
    setPendingReorder(null);
  };

  const handleCancelReset = () => {
    setShowResetConfirm(false);
    setPendingReorder(null);
    // 恢复原始顺序
    setItems(tasks);
    positions.value = tasks.map((_, i) => i);
  };

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
    <GestureHandlerRootView style={styles.container}>
      {/* 番茄钟重置确认弹窗 */}
      <Modal
        visible={showResetConfirm}
        transparent
        animationType="fade"
        onRequestClose={handleCancelReset}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Text style={styles.modalIconText}>⚠️</Text>
            </View>
            <Text style={styles.modalTitle}>当前任务正在专注中</Text>
            <Text style={styles.modalDesc}>
              重新排序任务将会重置当前番茄钟进度，是否继续？
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={handleCancelReset}
              >
                <Text style={styles.modalButtonCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleConfirmReset}
              >
                <Text style={styles.modalButtonConfirmText}>重置并继续</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <SectionHeader
        title="今日任务"
        right={
          <View style={styles.headerRight}>
            <Text style={styles.dragHint}>长按拖动排序</Text>
            <Text style={styles.progress}>{completedCount}/{items.length} 已完成</Text>
          </View>
        }
      />

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>暂无待办任务</Text>
          <Text style={styles.emptyDesc}>添加任务开始今天的学习吧</Text>
        </View>
      ) : (
        <View style={styles.taskList}>
          {items.map((task, index) => (
            <SortableTaskItem
              key={task.id}
              task={task}
              index={index}
              isFirst={index === 0}
              isDragging={isDragging}
              onToggle={() => onToggleTask(task.id)}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              positions={positions}
            />
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={onAddTask} activeOpacity={0.7}>
        <Text style={styles.addText}>+ 添加新任务</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dragHint: {
    fontSize: 11,
    color: colors.primary,
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  progress: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  taskList: {
    minHeight: 100,
  },
  taskItem: {
    marginBottom: spacing.md,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dragHandle: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  firstTaskBadge: {
    position: 'absolute',
    top: -8,
    backgroundColor: colors.primary,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: radius.sm,
  },
  firstTaskText: {
    fontSize: 8,
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  taskCardWrapper: {
    flex: 1,
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
    alignItems: 'center',
  },
  modalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.warning + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalIconText: {
    fontSize: 28,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
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
