import type { ChartBarProps, BarChartProps, ChartDataItem } from './types';

export function ChartBar({
  data,
  maxValue,
  height = 120,
  showTooltip = true,
  barColor = 'bg-coral',
  className = '',
}: ChartBarProps) {
  return (
    <div className={`flex items-end gap-3 h-${height / 4}`} style={{ height }}>
      {data.map((item) => (
        <div key={item.label} className="flex-1 flex flex-col items-center gap-1.5">
          <span className="text-stone text-xs">{item.displayValue || item.value}</span>
          <div
            className={`w-full ${barColor} rounded-t-xl transition-all hover:opacity-80 cursor-pointer relative group`}
            style={{ height: `${(item.value / maxValue) * (height - 40)}px` }}
          >
            {showTooltip && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-charcoal text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.displayValue || item.value}
              </div>
            )}
          </div>
          <span className="text-stone text-xs">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function SubjectDistribution({
  data,
  className = '',
}: {
  data: Array<{ name: string; hours: number; percent: number; color: string }>;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {data.map((item) => (
        <div key={item.name}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-charcoal font-medium">{item.name}</span>
            <span className="text-stone">
              {item.hours}h ({item.percent}%)
            </span>
          </div>
          <div className="w-full bg-mist/30 rounded-full h-2">
            <div
              className={`${item.color} h-2 rounded-full transition-all`}
              style={{ width: `${item.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export { type ChartBarProps, type BarChartProps, type ChartDataItem } from './types';
