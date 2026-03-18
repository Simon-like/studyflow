import { useMemo } from 'react';
import type { HeatMapProps } from './types';

const DAY_LABELS = ['', '一', '', '三', '', '五', ''];
const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export function HeatMap({
  data,
  color = '232, 168, 124', // coral
  className = '',
}: HeatMapProps) {
  const getOpacity = (value: number): string => {
    if (value <= 0) return '0.08';
    return '0.75';
  };

  const { weeks, monthPositions } = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);

    const startDow = startDate.getDay();

    const weeks: (typeof data[number] | null)[][] = [];
    let currentWeek: (typeof data[number] | null)[] = new Array(7).fill(null);

    for (let i = 0; i < data.length; i++) {
      const dow = (startDow + i) % 7;
      if (i > 0 && dow === 0) {
        weeks.push(currentWeek);
        currentWeek = new Array(7).fill(null);
      }
      currentWeek[dow] = data[i];
    }
    weeks.push(currentWeek);

    // Month labels: find weeks where a new month starts
    const monthPositions: { label: string; col: number }[] = [];
    let lastMonth = -1;
    let dayCounter = 0;
    for (let w = 0; w < weeks.length; w++) {
      const firstCellIdx = weeks[w].findIndex((c) => c !== null);
      if (firstCellIdx === -1) continue;
      // Count actual days up to this week
      let count = 0;
      for (let ww = 0; ww < w; ww++) {
        count += weeks[ww].filter(Boolean).length;
      }
      count += firstCellIdx === 0 ? 0 : weeks[w].slice(0, firstCellIdx).filter(Boolean).length;
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + count);
      const month = cellDate.getMonth();
      if (month !== lastMonth) {
        monthPositions.push({ label: MONTH_LABELS[month], col: w });
        lastMonth = month;
      }
    }

    return { weeks, monthPositions };
  }, [data]);

  const totalWeeks = weeks.length;

  return (
    <div className={className}>
      <div className="flex">
        {/* Day-of-week labels */}
        <div className="flex-shrink-0 mr-2">
          <div style={{ height: '20px' }} />
          <div
            className="grid"
            style={{
              gridTemplateRows: `repeat(7, 1fr)`,
              gap: '2px',
              height: `calc((100% - 20px))`,
            }}
          >
            {DAY_LABELS.map((label, i) => (
              <div key={i} className="text-xs text-stone flex items-center justify-end pr-0.5 h-full">
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Grid area — use CSS grid so cells auto-size to fill width */}
        <div className="flex-1 min-w-0">
          {/* Month labels row */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${totalWeeks}, 1fr)`,
              gap: '2px',
              height: '20px',
            }}
          >
            {weeks.map((_, weekIdx) => {
              const mp = monthPositions.find((m) => m.col === weekIdx);
              return (
                <div key={weekIdx} className="flex items-end">
                  {mp && (
                    <span className="text-[11px] text-stone leading-none whitespace-nowrap">{mp.label}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Heatmap grid */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${totalWeeks}, 1fr)`,
              gridTemplateRows: 'repeat(7, 1fr)',
              gap: '2px',
              aspectRatio: `${totalWeeks} / 7`,
            }}
          >
            {weeks.map((week, weekIdx) =>
              week.map((cell, dayIdx) => (
                <div
                  key={`${weekIdx}-${dayIdx}`}
                  className="rounded-sm transition-colors"
                  style={{
                    backgroundColor: cell
                      ? `rgba(${color}, ${getOpacity(cell.value)})`
                      : 'transparent',
                    gridColumn: weekIdx + 1,
                    gridRow: dayIdx + 1,
                  }}
                  title={cell?.label || ''}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-stone text-xs">未打卡</span>
        <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: `rgba(${color}, 0.08)` }} />
        <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: `rgba(${color}, 0.75)` }} />
        <span className="text-stone text-xs">已打卡</span>
      </div>
    </div>
  );
}

export { type HeatMapProps, type HeatMapDataItem } from './types';
