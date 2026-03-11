import { Card, Avatar } from '@/components/ui';
import { Button } from '@/components/ui';
import type { GroupCardProps, Group } from './types';

export function GroupCard({
  id,
  name,
  members,
  goal,
  color,
  onJoin,
}: GroupCardProps) {
  const colorClass = color === 'coral' ? 'bg-coral' : 'bg-sage';

  return (
    <Card hover className="h-full">
      <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center mb-4 shadow-soft`}>
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>
      <h3 className="font-semibold text-charcoal mb-1">{name}</h3>
      <p className="text-stone text-xs mb-3">
        {members} 人正在学习 · {goal}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {['A', 'B', 'C'].map((name, i) => (
            <Avatar key={i} name={name} size="sm" className="border-2 border-white" />
          ))}
          <div className="w-7 h-7 bg-warm rounded-full border-2 border-white flex items-center justify-center text-xs text-stone">
            +{members - 3}
          </div>
        </div>
        <Button size="sm" onClick={() => onJoin?.(id)}>
          加入
        </Button>
      </div>
    </Card>
  );
}

export { type GroupCardProps, type Group } from './types';
