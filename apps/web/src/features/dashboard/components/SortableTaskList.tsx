import { useState } from 'react';
import type { Task } from '@studyflow/shared';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableTaskItemProps {
  task: Task;
  onToggle?: (id: string) => Promise<void>;
  isFirst: boolean;
  isDragging: boolean;
}

function SortableTaskItem({ task, onToggle, isFirst, isDragging }: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isItemDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isItemDragging ? 50 : 'auto',
  };

  const isDone = task.status === 'completed';
  const isActive = task.status === 'in_progress';

  const handleClick = async () => {
    if (onToggle && !isItemDragging) {
      await onToggle(task.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 rounded-xl transition-all ${
        isItemDragging
          ? 'bg-white shadow-lg ring-2 ring-coral opacity-90'
          : isActive
            ? 'bg-coral/5 border border-coral'
            : 'bg-warm/50 hover:bg-warm'
      }`}
    >
      {/* 拖拽手柄 */}
      <button
        className="touch-none p-1 rounded hover:bg-stone/10 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4 text-stone" />
      </button>

      {/* 任务内容 */}
      <div
        onClick={handleClick}
        className="flex-1 flex items-center gap-3 cursor-pointer"
      >
        {/* 优先级指示器（第一个任务） */}
        {isFirst && !isDone && (
          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-coral animate-pulse" title="即将专注" />
        )}

        {/* 复选框 */}
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            isDone ? 'border-sage bg-sage/20' : isActive ? 'border-coral' : 'border-mist'
          }`}
        >
          {isDone && (
            <svg className="w-3.5 h-3.5 text-sage" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* 任务信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={`text-sm font-medium ${
                isDone ? 'text-stone line-through' : 'text-charcoal'
              }`}
            >
              {task.title}
            </p>
            {isFirst && !isDone && (
              <span className="text-[10px] px-1.5 py-0.5 bg-coral/10 text-coral rounded-full font-medium">
                即将专注
              </span>
            )}
          </div>
          <p className="text-xs text-stone mt-0.5">
            {task.category} · {task.completedPomodoros}/{task.estimatedPomodoros} 番茄
          </p>
        </div>

        {/* 状态标签 */}
        {isActive && <span className="text-xs text-coral font-medium flex-shrink-0">进行中</span>}
        {task.priority === 'high' && !isDone && (
          <span className="text-xs text-red-500 font-medium flex-shrink-0">高优先级</span>
        )}
      </div>
    </div>
  );
}

interface SortableTaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  error?: Error | null;
  onToggleTask?: (id: string) => Promise<void>;
  onReorder?: (tasks: Task[]) => Promise<void>;
  onRefresh?: () => Promise<void>;
  isPomodoroRunning?: boolean;
  onResetPomodoro?: () => void;
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-warm/50 animate-pulse">
          <div className="w-4 h-4 bg-mist/30 rounded" />
          <div className="w-6 h-6 rounded-full border-2 border-mist bg-mist/20" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-mist/30 rounded w-3/4" />
            <div className="h-3 bg-mist/20 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry?: () => Promise<void> }) {
  return (
    <div className="text-center py-8">
      <svg className="w-12 h-12 text-mist mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <p className="text-stone text-sm mb-3">加载任务失败</p>
      {onRetry && (
        <button onClick={onRetry} className="text-coral text-sm font-medium hover:text-coral-700">
          点击重试
        </button>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-8">
      <svg className="w-12 h-12 text-mist mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <p className="text-stone text-sm">暂无待办任务</p>
      <p className="text-mist text-xs mt-1">添加任务开始今天的学习吧</p>
    </div>
  );
}

export function SortableTaskList({
  tasks,
  isLoading,
  error,
  onToggleTask,
  onReorder,
  onRefresh,
  isPomodoroRunning,
  onResetPomodoro,
}: SortableTaskListProps) {
  const [items, setItems] = useState<Task[]>(tasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // 同步外部 tasks 变化
  if (JSON.stringify(items.map((t) => t.id)) !== JSON.stringify(tasks.map((t) => t.id))) {
    setItems(tasks);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 需要移动 8px 才触发拖拽，避免误触
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // 检查是否正在拖拽第一个任务且番茄钟正在运行
    const firstTask = items[0];
    if (firstTask && active.id === firstTask.id && isPomodoroRunning) {
      setShowResetConfirm(true);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onReorder?.(newItems);
    }

    setShowResetConfirm(false);
  };

  const handleConfirmReset = () => {
    onResetPomodoro?.();
    setShowResetConfirm(false);
  };

  const handleCancelReset = () => {
    setShowResetConfirm(false);
    // 取消拖拽，恢复原顺序
    setItems(tasks);
  };

  if (isLoading) {
    return (
      <div className="mt-8 bg-white rounded-3xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-charcoal">今日任务</h2>
        </div>
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 bg-white rounded-3xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-charcoal">今日任务</h2>
        </div>
        <ErrorState onRetry={onRefresh} />
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white rounded-3xl p-6 shadow-soft relative">
      {/* 番茄钟重置确认弹窗 */}
      {showResetConfirm && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl z-50 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-charcoal mb-2">当前任务正在专注中</h3>
            <p className="text-sm text-stone mb-6">
              重新排序任务将会重置当前番茄钟进度，是否继续？
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCancelReset}
                className="px-4 py-2 text-sm font-medium text-stone hover:text-charcoal transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 text-sm font-medium text-white bg-coral rounded-xl hover:bg-coral-700 transition-colors"
              >
                重置进度并继续
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-charcoal">今日任务</h2>
          <span className="text-xs text-stone bg-warm px-2 py-0.5 rounded-full">
            拖动排序
          </span>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((task, index) => (
                <SortableTaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggleTask}
                  isFirst={index === 0}
                  isDragging={activeId === task.id}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
