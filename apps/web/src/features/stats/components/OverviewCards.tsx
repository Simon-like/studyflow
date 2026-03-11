import { StatCard } from '@/components/business';
import { OVERVIEW_DATA } from '../constants';

export function OverviewCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {OVERVIEW_DATA.map((card) => (
        <StatCard
          key={card.label}
          icon={card.icon}
          label={card.label}
          value={card.value}
          change={card.change}
          isPositive={card.isPositive}
          color={card.isPositive ? 'coral' : 'sage'}
        />
      ))}
    </div>
  );
}
