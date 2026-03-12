import { useState, useCallback } from 'react';
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
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, AlertCircle } from 'lucide-react';

interface SortableTaskItemProps {
  task: Task;
  onToggle?: (id: string) => Promise<void>;
  onToggleRequest?: (id: string) => void;
  isFirst: boolean;
  isOverlay?: boolean;
}

function TaskItemContent({ task, onToggleRequest, isFirst, isOverlay }: SortableTaskItemProps) {
  const isDone = task.status === 'completed';
  const isActive = task.status === 'in_progress';

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleRequest?.(task.id);
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
        isOverlay
          ? 'bg-white shadow-xl ring-2 ring-coral rotate-2 scale-105'
          : isActive
            ? 'bg-coral/5 border-2 border-coral'
            : 'bg-warm/50 hover:bg-warm border border-transparent'
      }`}
    >
      {/* 拖拽手柄 */}
      <button
        className="touch-none p-1.5 rounded-lg hover:bg-stone/10 cursor-grab active:cursor-grabbing transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-5 h-5 text-stone/60" />
      </button>

      {/* 任务内容 */}
      <div className="flex-1 flex items-center gap-3">
        {/* 即将专注指示器（第一个未完成任务） */}
        {isFirst && !isDone && (
          <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-coral shadow-[0_0_8px_rgba(232,168,124,0.6)]" title="即将专注" />
        )}
        {(!isFirst || isDone) && <div className="flex-shrink-0 w-2.5 h-2.5" />}

        {/* 复选框 */}
        <button
          onClick={handleToggleClick}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            isDone ? 'border-sage bg-sage/20' : isActive ? 'border-coral bg-coral/10' : 'border-mist hover:border-coral'
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
        </button>

        {/* 任务信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className={`text-sm font-medium truncate ${
                isDone ? 'text-stone line-through' : 'text-charcoal'
              }`}
            >
              {task.title}
            </p>
            {isFirst && !isDone && (
              <span className="text-[10px] px-2 py-0.5 bg-coral/15 text-coral rounded-full font-semibold border border-coral/20">
                即将专注
              </span>
            )}
          </div>
          <p className="text-xs text-stone mt-1">
            {task.category} · {task.completedPomodoros}/{task.estimatedPomodoros} 番茄
          </p>
        </div>

        {/* 状态标签 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isActive && (
            <span className="text-xs font-semibold text-coral bg-coral/10 px-2.5 py-1 rounded-full border border-coral/20">
              进行中
            </span>
          )}
          {task.priority === 'high' && !isDone && (
            <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full border border-red-100">
              高优先级
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SortableTaskItem(props: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskItemContent {...props} />
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
  onPausePomodoro?: () => void;
  onResetPomodoro?: () => void;
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-warm/50 animate-pulse">
          <div className="w-5 h-5 bg-mist/30 rounded" />
          <div className="w-2.5 h-2.5 bg-mist/20 rounded-full" />
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
    <div className="text-center py-10">
      <AlertCircle className="w-12 h-12 text-mist mx-auto mb-3" />
      <p className="text-stone text-sm mb-3">加载任务失败</p>
      {onRetry && (
        <button onClick={onRetry} className="text-coral text-sm font-medium hover:text-coral-700 transition-colors">
          点击重试
        </button>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-10">
      <div className="w-14 h-14 bg-warm rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <p className="text-stone font-medium">暂无待办任务</p>
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
  onPausePomodoro,
  onResetPomodoro,
}: SortableTaskListProps) {
  const [items, setItems] = useState<Task[]>(tasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [pendingCompleteTaskId, setPendingCompleteTaskId] = useState<string | null>(null);
  const [pendingReorder, setPendingReorder] = useState<{ oldIndex: number; newIndex: number } | null>(null);

  // 同步外部 tasks 变化
  if (JSON.stringify(items.map((t) => t.id)) !== JSON.stringify(tasks.map((t) => t.id))) {
    setItems(tasks);
  }

  // 找到当前正在进行的任务索引
  const activeTaskIndex = items.findIndex((t) => t.status === 'in_progress');
  const hasActiveTask = activeTaskIndex !== -1;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // 如果番茄钟正在运行，暂停它
    if (isPomodoroRunning) {
      onPausePomodoro?.();
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) {
      // 拖拽取消，如果暂停了则恢复
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    // 检查是否拖拽到了正在进行的任务前面
    // 条件：有正在进行的任务，且新位置在 activeTaskIndex 之前（或等于，即把其他任务放到进行中任务前面）
    if (hasActiveTask && isPomodoroRunning && newIndex <= activeTaskIndex && oldIndex > activeTaskIndex) {
      // 保存待处理的排序
      setPendingReorder({ oldIndex, newIndex });
      setShowConfirm(true);
      return;
    }

    // 直接执行排序
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    onReorder?.(newItems);
  };

  const handleConfirmReset = () => {
    if (pendingReorder) {
      const { oldIndex, newIndex } = pendingReorder;
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onReorder?.(newItems);
    }
    onResetPomodoro?.();
    setShowConfirm(false);
    setPendingReorder(null);
  };

  const handleCancelReset = () => {
    setShowConfirm(false);
    setPendingReorder(null);
    // 恢复番茄钟（如果之前暂停了）
    // 注意：这里假设用户点击取消后，番茄钟应该继续
  };

  // 请求完成任务（显示确认对话框）
  const handleToggleRequest = useCallback((taskId: string) => {
    const task = items.find((t) => t.id === taskId);
    if (task && task.status !== 'completed') {
      // 只有未完成的任务才需要确认
      setPendingCompleteTaskId(taskId);
      setShowCompleteConfirm(true);
    } else {
      // 已完成的任务直接切换（重新打开）
      onToggleTask?.(taskId);
    }
  }, [items, onToggleTask]);

  // 确认完成任务
  const handleConfirmComplete = useCallback(() => {
    if (pendingCompleteTaskId) {
      onToggleTask?.(pendingCompleteTaskId);
    }
    setShowCompleteConfirm(false);
    setPendingCompleteTaskId(null);
  }, [pendingCompleteTaskId, onToggleTask]);

  // 取消完成任务
  const handleCancelComplete = useCallback(() => {
    setShowCompleteConfirm(false);
    setPendingCompleteTaskId(null);
  }, []);

  const activeTask = activeId ? items.find((t) => t.id === activeId) : null;

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
      {showConfirm && (
        <div className="absolute inset-0 bg-white/98 backdrop-blur-sm rounded-3xl z-50 flex items-center justify-center p-6">
          <div className="text-center max-w-xs">
            <div className="w-14 h-14 bg-amber/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-amber" />
            </div>
            <h3 className="text-lg font-semibold text-charcoal mb-2">当前有进行中的番茄钟</h3>
            <p className="text-sm text-stone mb-6 leading-relaxed">
              将此任务移到进行中的任务前面会重置当前番茄钟进度，是否继续？
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCancelReset}
                className="px-5 py-2.5 text-sm font-medium text-stone bg-warm hover:bg-warm/80 rounded-xl transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-5 py-2.5 text-sm font-medium text-white bg-coral hover:bg-coral-700 rounded-xl transition-colors"
              >
                重置并继续
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 完成任务确认弹窗 */}
      {showCompleteConfirm && (
        <div className="absolute inset-0 bg-white/98 backdrop-blur-sm rounded-3xl z-50 flex items-center justify-center p-6">
          <div className="text-center max-w-xs">
            <div className="w-14 h-14 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-charcoal mb-2">完成任务</h3>
            <p className="text-sm text-stone mb-6 leading-relaxed">
              确定要完成这个任务吗？
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCancelComplete}
                className="px-5 py-2.5 text-sm font-medium text-stone bg-warm hover:bg-warm/80 rounded-xl transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmComplete}
                className="px-5 py-2.5 text-sm font-medium text-white bg-sage hover:bg-sage/90 rounded-xl transition-colors"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-charcoal text-lg">今日任务</h2>
          <span className="text-[11px] text-stone bg-warm px-2.5 py-1 rounded-full font-medium">
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
            <div className="flex flex-col gap-3">
              {items.map((task, index) => (
                <SortableTaskItem
                  key={task.id}
                  task={task}
                  onToggleRequest={handleToggleRequest}
                  isFirst={index === 0}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay dropAnimation={null}>
            {activeTask ? <TaskItemContent task={activeTask} isFirst={false} isOverlay onToggleRequest={handleToggleRequest} /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
