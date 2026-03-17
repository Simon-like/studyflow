import { Link } from 'react-router-dom';
import type { Task } from '@studyflow/shared';

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  error?: Error | null;
  onToggleTask?: (id: string) => Promise<void>;
  onRefresh?: () => Promise<void>;
}

function TaskItem({ 
  task, 
  onToggle 
}: { 
  task: Task; 
  onToggle?: (id: string) => Promise<void>;
}) {
  const isDone = task.status === 'completed';
  const isActive = task.status === 'in_progress';

  const handleClick = async () => {
    if (onToggle) {
      await onToggle(task.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer ${
        isActive ? 'bg-coral/5 border border-coral' : 'bg-warm/50 hover:bg-warm'
      }`}
    >
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
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${isDone ? 'text-stone line-through' : 'text-charcoal'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-stone mt-0.5 truncate">
            {task.description}
          </p>
        )}
      </div>
      {isActive && <span className="text-xs text-coral font-medium flex-shrink-0">进行中</span>}
      {task.priority === 'high' && !isDone && (
        <span className="text-xs text-red-500 font-medium flex-shrink-0">高优先级</span>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-warm/50 animate-pulse">
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p className="text-stone text-sm mb-3">加载任务失败</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-coral text-sm font-medium hover:text-coral-700"
        >
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p className="text-stone text-sm">暂无待办任务</p>
      <p className="text-mist text-xs mt-1">添加任务开始今天的学习吧</p>
    </div>
  );
}

export function TaskList({ 
  tasks, 
  isLoading, 
  error, 
  onToggleTask,
  onRefresh 
}: TaskListProps) {
  return (
    <div className="mt-8 bg-white rounded-3xl p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-charcoal">今日任务</h2>
        <Link to="/tasks" className="text-coral text-sm font-medium hover:text-coral-700">
          + 添加任务
        </Link>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState onRetry={onRefresh} />
      ) : tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3 flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggleTask} />
          ))}
        </div>
      )}

      <Link
        to="/tasks"
        className="w-full mt-4 py-3.5 border-2 border-dashed border-mist rounded-2xl text-stone text-sm hover:border-coral hover:text-coral transition-colors flex items-center justify-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        添加新任务
      </Link>
    </div>
  );
}
