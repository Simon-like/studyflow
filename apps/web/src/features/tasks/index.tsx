import { TaskCard } from '@/components/business';
import { EmptyState } from '@/components/ui';
import { useTasks, useTaskModal } from './hooks';
import { TaskHeader } from './components/TaskHeader';
import { TaskSearchFilter } from './components/TaskSearchFilter';
import { AddTaskModal } from './components/AddTaskModal';

export default function TasksPage() {
  const {
    tasks,
    counts,
    filter,
    setFilter,
    search,
    setSearch,
    addTask,
    toggleStatus,
  } = useTasks();

  const modal = useTaskModal();

  const handleSubmit = () => {
    addTask(modal.formData);
    modal.close();
  };

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <TaskHeader onAddClick={modal.open} />

      <TaskSearchFilter
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        counts={counts}
      />

      {/* Task List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-8 h-8 text-mist" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
            title="暂无任务"
            description="点击右上角添加你的第一个学习任务"
          />
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onToggleStatus={toggleStatus}
            />
          ))
        )}
      </div>

      <AddTaskModal
        isOpen={modal.isOpen}
        formData={modal.formData}
        onClose={modal.close}
        onSubmit={handleSubmit}
        onFieldChange={modal.updateField}
      />
    </div>
  );
}
