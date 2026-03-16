import { Clock, Target, CheckCircle, Flame } from 'lucide-react';
import { StatCard } from '@/components/business';
import { useOverviewCards } from '../hooks';
import type { OverviewStats } from '@studyflow/shared';

interface OverviewCardsProps {
  overviewStats?: OverviewStats;
  isLoading?: boolean;
}

const iconMap = {
  Clock,
  Target,
  CheckCircle,
  Flame,
};

export function OverviewCards({ overviewStats, isLoading }: OverviewCardsProps) {
  const cards = useOverviewCards(overviewStats);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i} 
            className="bg-white rounded-2xl p-5 h-28 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((card) => {
        const IconComponent = iconMap[card.icon as keyof typeof iconMap];
        return (
          <StatCard
            key={card.label}
            icon={IconComponent}
            label={card.label}
            value={card.value}
            change={card.change}
            isPositive={card.isPositive}
            color={card.isPositive ? 'coral' : 'sage'}
          />
        );
      })}
    </div>
  );
}
