import { useState, useCallback } from 'react';
import type { Task } from '@studyflow/shared';
import type { TimerStatus } from '@/components/business/PomodoroTimer';
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
import { useDialog } from '@/providers/DialogProvider';

interface SortableTaskItemProps {
  task: Task;
  index: number;
  isSelected: boolean;
  isTimerActive: boolean; // timer is running or paused
  isOverlay?: boolean;
  onToggleRequest?: (id: string) => void;
  onSelectTask?: (task: Task) => void;
}

function TaskItemContent({ task, index, isSelected, isTimerActive, isOverlay, onToggleRequest, onSelectTask }: SortableTaskItemProps) {
  const isDone = task.status === 'completed';
  // "进行中" 仅在该任务被选中且计时器正在运行/暂停时显示
  const showInProgress = isSelected && isTimerActive && !isDone;

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleRequest?.(task.id);
  };

  const handleClick = () => {
    onSelectTask?.(task);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 p-4 rounded-xl transition-all cursor-pointer ${
        isOverlay
          ? 'bg-white shadow-xl ring-2 ring-coral rotate-2 scale-105'
          : isSelected
            ? 'bg-coral/8 border-2 border-coral'
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
        {/* 选中指示器 */}
        {isSelected && !isDone && (
          <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-coral shadow-[0_0_8px_rgba(232,168,124,0.6)]" />
        )}
        {(!isSelected || isDone) && <div className="flex-shrink-0 w-2.5 h-2.5" />}

        {/* 复选框 */}
        <button
          onClick={handleToggleClick}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            isDone ? 'border-sage bg-sage/20' : isSelected ? 'border-coral bg-coral/10' : 'border-mist hover:border-coral'
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
          <p
            className={`text-sm font-medium line-clamp-3 ${
              isDone ? 'text-stone line-through' : 'text-charcoal'
            }`}
          >
            {task.title}
          </p>
          <p className="text-xs text-stone mt-1">
            {task.category || '未分类'}
          </p>
        </div>

        {/* 状态标签 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {showInProgress && (
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
  selectedTaskId?: string | null;
  pomodoroStatus?: TimerStatus;
  isLoading?: boolean;
  error?: Error | null;
  onToggleTask?: (id: string) => Promise<void>;
  onReorder?: (tasks: Task[]) => Promise<void>;
  onRefresh?: () => Promise<void>;
  onSelectTask?: (task: Task) => void;
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
  selectedTaskId,
  pomodoroStatus = 'idle',
  isLoading,
  error,
  onToggleTask,
  onReorder,
  onRefresh,
  onSelectTask,
  isPomodoroRunning,
  onPausePomodoro,
  onResetPomodoro,
}: SortableTaskListProps) {
  const [items, setItems] = useState<Task[]>(tasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const dialog = useDialog();

  const isTimerActive = pomodoroStatus === 'running' || pomodoroStatus === 'paused';

  // 同步外部 tasks 变化
  if (JSON.stringify(items.map((t) => t.id)) !== JSON.stringify(tasks.map((t) => t.id))) {
    setItems(tasks);
  }

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
    if (isPomodoroRunning) {
      onPausePomodoro?.();
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    // 检查是否拖拽到了选中任务前面
    const selectedIndex = items.findIndex((t) => t.id === selectedTaskId);
    if (selectedTaskId && isPomodoroRunning && newIndex <= selectedIndex && oldIndex > selectedIndex) {
      dialog.confirm({
        variant: 'warning',
        title: '当前有进行中的番茄钟',
        message: '将此任务移到正在专注的任务前面会重置当前番茄钟进度，是否继续？',
        confirmText: '重置并继续',
        cancelText: '取消',
        onConfirm: () => {
          const newItems = arrayMove(items, oldIndex, newIndex);
          setItems(newItems);
          onReorder?.(newItems);
          onResetPomodoro?.();
        },
      });
      return;
    }

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    onReorder?.(newItems);
  };

  // 请求完成任务（显示确认对话框）
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
          onToggleTask?.(taskId);
        },
      });
    } else {
      onToggleTask?.(taskId);
    }
  }, [items, onToggleTask, dialog]);

  // 选择任务 - 移动到第一位
  const handleSelectTask = useCallback((task: Task) => {
    if (task.status === 'completed') return;

    const currentIndex = items.findIndex((t) => t.id === task.id);
    if (currentIndex > 0) {
      const newItems = arrayMove(items, currentIndex, 0);
      setItems(newItems);
      onReorder?.(newItems);
    }
    onSelectTask?.(task);
  }, [items, onReorder, onSelectTask]);

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
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-charcoal text-lg">今日任务</h2>
          <span className="text-[11px] text-stone bg-warm px-2.5 py-1 rounded-full font-medium">
            点击任务开始专注
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
                  index={index}
                  isSelected={task.id === selectedTaskId}
                  isTimerActive={isTimerActive}
                  onToggleRequest={handleToggleRequest}
                  onSelectTask={handleSelectTask}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay dropAnimation={null}>
            {activeTask ? (
              <TaskItemContent
                task={activeTask}
                index={0}
                isSelected={false}
                isTimerActive={false}
                isOverlay
                onToggleRequest={handleToggleRequest}
                onSelectTask={handleSelectTask}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
