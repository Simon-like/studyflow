import type { DashboardStats } from '../types';

interface StatsStripProps {
  stats: DashboardStats[];
  isLoading?: boolean;
}

function StatCard({ stat, isLoading }: { stat: DashboardStats; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-soft animate-pulse">
        <div className="h-3 bg-mist/30 rounded w-16 mb-2" />
        <div className="h-8 bg-mist/20 rounded w-20 mb-1" />
        <div className="h-3 bg-mist/20 rounded w-12" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-soft">
      <p className="text-stone text-xs mb-1">{stat.label}</p>
      <p className="font-display text-2xl font-bold text-charcoal">{stat.value}</p>
      <p className="text-stone text-xs mt-0.5">{stat.sub}</p>
    </div>
  );
}

export function StatsStrip({ stats, isLoading }: StatsStripProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {stats.map((stat, i) => (
        <StatCard key={i} stat={stat} isLoading={isLoading} />
      ))}
    </div>
  );
}
