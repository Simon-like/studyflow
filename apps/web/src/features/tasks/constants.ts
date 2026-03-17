import type { FilterOption } from './types';

export const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: '全部' },
  { key: 'todo', label: '待开始' },
  { key: 'in_progress', label: '进行中' },
  { key: 'completed', label: '已完成' },
];

export const DEFAULT_FORM_DATA = {
  title: '',
  description: '',
  priority: 'medium' as const,
};
