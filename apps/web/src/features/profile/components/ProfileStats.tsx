import { Card } from '@/components/ui';
import type { ProfileStats } from '../types';

interface ProfileStatsProps {
  stats: ProfileStats[];
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const bgClass = stat.color === 'coral' ? 'bg-coral/10' : 'bg-sage/10';
        const colorClass = stat.color === 'coral' ? 'text-coral' : 'text-sage';

        return (
          <Card key={stat.label} className="text-center">
            <div className={`w-10 h-10 ${bgClass} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <Icon className={`w-5 h-5 ${colorClass}`} />
            </div>
            <p className="font-display text-xl font-bold text-charcoal">{stat.value}</p>
            <p className="text-stone text-xs mt-0.5">{stat.label}</p>
          </Card>
        );
      })}
    </div>
  );
}
