import { Clock, Flag, MoreHorizontal } from 'lucide-react';
import { Card } from '@/components/ui';
import type { TaskCardProps } from './types';
import { PRIORITY_CONFIG, STATUS_CONFIG } from './constants';

export function TaskCard({
  id,
  title,
  description,
  priority,
  status,
  category,
  dueDate,
  onToggleStatus,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const priorityConfig = PRIORITY_CONFIG[priority];
  const statusConfig = STATUS_CONFIG[status];
  const isCompleted = status === 'completed';

  return (
    <Card hover className={isCompleted ? 'opacity-70' : ''}>
      <div className="flex items-center gap-4">
        {/* Status Toggle */}
        <button
          onClick={() => onToggleStatus(id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            isCompleted
              ? 'border-sage bg-sage/20'
              : status === 'in_progress'
              ? 'border-coral'
              : 'border-mist hover:border-coral'
          }`}
        >
          {isCompleted && (
            <svg className="w-3.5 h-3.5 text-sage" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Task Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`font-medium text-sm ${isCompleted ? 'line-through text-stone' : 'text-charcoal'}`}>
              {title}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityConfig.bg} ${priorityConfig.color}`}>
              <Flag className="w-2.5 h-2.5 inline mr-1" />
              {priorityConfig.label}优先
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
          <p className="text-stone text-xs mt-1 truncate">{category ? `${category} · ` : ''}{description}</p>
        </div>

        {/* Meta & Actions */}
        <div className="flex items-center gap-4 flex-shrink-0 text-xs text-stone">
          {dueDate && <span>{dueDate}</span>}
          <button className="p-1 hover:bg-warm rounded-lg transition-all">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}

export { type TaskCardProps, type Task, type Priority, type TaskStatus } from './types';
export { PRIORITY_CONFIG, STATUS_CONFIG } from './constants';
