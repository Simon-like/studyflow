import { Card } from '@/components/ui';
import type { StatCardProps } from './types';

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  isPositive = true,
  color = 'coral',
  className = '',
}: StatCardProps) {
  const iconBgClass = color === 'coral' ? 'bg-coral/10' : 'bg-sage/10';
  const iconColorClass = color === 'coral' ? 'text-coral' : 'text-sage';
  const changeColorClass = isPositive ? 'text-sage' : 'text-red-400';

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 ${iconBgClass} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-4.5 h-4.5 ${iconColorClass}`} />
        </div>
        {change && (
          <span className={`text-xs font-medium ${changeColorClass}`}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      <p className="font-display text-2xl font-bold text-charcoal">{value}</p>
      <p className="text-stone text-xs mt-0.5">{label}</p>
    </Card>
  );
}

export { type StatCardProps } from './types';
