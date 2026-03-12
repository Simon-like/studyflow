import { Plus } from 'lucide-react';
import { Button } from '@/components/ui';

interface TaskHeaderProps {
  onAddClick: () => void;
}

export function TaskHeader({ onAddClick }: TaskHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">任务管理</h1>
        <p className="text-stone text-sm mt-0.5">管理你的学习任务，保持高效专注</p>
      </div>
      <Button leftIcon={<Plus className="w-4 h-4" />} onClick={onAddClick}>
        添加任务
      </Button>
    </div>
  );
}
