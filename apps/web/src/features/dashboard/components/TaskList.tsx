import { Link } from 'react-router-dom';
import type { TodayTask } from '../types';

interface TaskListProps {
  tasks: TodayTask[];
}

function TaskItem({ task }: { task: TodayTask }) {
  const isDone = task.status === 'completed';
  const isActive = task.active;

  return (
    <div
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
        <p className="text-xs text-stone mt-0.5">{task.description}</p>
      </div>
      {isActive && <span className="text-xs text-coral font-medium flex-shrink-0">进行中</span>}
    </div>
  );
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="mt-8 bg-white rounded-3xl p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-charcoal">今日任务</h2>
        <Link to="/tasks" className="text-coral text-sm font-medium hover:text-coral-700">
          + 添加任务
        </Link>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
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
