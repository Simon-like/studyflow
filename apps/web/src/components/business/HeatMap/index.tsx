import type { HeatMapProps, HeatMapDataItem } from './types';

const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六'];

export function HeatMap({
  data,
  color = '232, 168, 124', // coral color
  className = '',
  showWeekDays = true,
}: HeatMapProps) {
  const getOpacity = (value: number): string => {
    const opacities = ['0.08', '0.25', '0.45', '0.65', '0.85', '1'];
    return opacities[Math.min(value, 5)] || '0.08';
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-7 gap-2">
        {showWeekDays &&
          WEEK_DAYS.map((d) => (
            <div key={d} className="text-center text-stone text-xs pb-1">
              {d}
            </div>
          ))}
        {data.map(({ day, value, label }) => {
          const opacity = getOpacity(value);
          return (
            <div
              key={day}
              className="aspect-square rounded-lg flex items-center justify-center text-xs cursor-pointer group relative transition-all hover:scale-110"
              style={{ backgroundColor: `rgba(${color}, ${opacity})` }}
              title={label || `${day}日: ${value * 2}h`}
            >
              <span className={`font-medium ${value > 2 ? 'text-white' : 'text-charcoal'}`}>
                {day}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 mt-4 justify-end">
        <span className="text-stone text-xs">少</span>
        {[0.1, 0.3, 0.5, 0.7, 1].map((o) => (
          <div key={o} className="w-4 h-4 rounded" style={{ backgroundColor: `rgba(${color}, ${o})` }} />
        ))}
        <span className="text-stone text-xs">多</span>
      </div>
    </div>
  );
}

export { type HeatMapProps, type HeatMapDataItem } from './types';
