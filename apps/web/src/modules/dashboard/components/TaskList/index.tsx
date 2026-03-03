import { CheckCircle2, Play } from 'lucide-react';
import type { Task } from '@/modules/shared/types/api';

interface TaskListProps {
  tasks: Task[];
}

function TaskItem({ task }: { task: Task }) {
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';

  const containerClass = isInProgress
    ? 'border-2 border-coral bg-coral/5'
    : isCompleted
    ? 'bg-warm'
    : 'border border-mist';

  const checkboxClass = isCompleted
    ? 'border-sage bg-sage'
    : isInProgress
    ? 'border-coral'
    : 'border-mist';

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl ${containerClass}`}>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${checkboxClass}`}>
        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
      </div>
      <div className="flex-1">
        <p className={`text-sm ${isCompleted ? 'text-stone line-through' : 'text-charcoal font-medium'}`}>
          {task.title}
        </p>
        <p className="text-xs text-stone">
          {task.completedPomodoros}/{task.estimatedPomodoros || '?'} 番茄
        </p>
      </div>
      {!isCompleted && <Play className="w-4 h-4 text-mist" />}
    </div>
  );
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-charcoal">今日任务</h3>
        <span className="text-coral text-sm cursor-pointer">查看全部</span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
