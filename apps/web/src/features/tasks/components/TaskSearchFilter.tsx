import { Search } from 'lucide-react';
import { Tabs } from '@/components/ui';
import type { TaskFilter, TaskCounts } from '../types';
import { FILTER_OPTIONS } from '../constants';

interface TaskSearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  counts: TaskCounts;
}

export function TaskSearchFilter({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  counts,
}: TaskSearchFilterProps) {
  const tabItems = FILTER_OPTIONS.map((opt) => ({
    key: opt.key,
    label: opt.label,
    count: counts[opt.key],
  }));

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
        <input
          type="text"
          placeholder="搜索任务..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-mist rounded-xl text-charcoal placeholder-mist focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral transition-all text-sm"
        />
      </div>
      <Tabs items={tabItems} activeKey={filter} onChange={onFilterChange} />
    </div>
  );
}
