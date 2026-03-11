import type { WeeklyStat } from '../types';

interface WeeklySummaryProps {
  stats: WeeklyStat[];
}

export function WeeklySummary({ stats }: WeeklySummaryProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft">
      <h2 className="font-semibold text-charcoal mb-4">本周数据</h2>
      <div className="space-y-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="flex justify-between items-center py-1.5 border-b border-mist/20 last:border-0"
          >
            <span className="text-stone text-sm">{item.label}</span>
            <span className={`font-bold ${item.accent ? 'text-coral' : 'text-charcoal'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
