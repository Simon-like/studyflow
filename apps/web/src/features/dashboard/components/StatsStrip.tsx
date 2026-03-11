import type { DashboardStats } from '../types';

interface StatsStripProps {
  stats: DashboardStats[];
}

export function StatsStrip({ stats }: StatsStripProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 shadow-soft">
          <p className="text-stone text-xs mb-1">{s.label}</p>
          <p className="font-display text-2xl font-bold text-charcoal">{s.value}</p>
          <p className="text-stone text-xs mt-0.5">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
