import { Card, CardHeader } from '@/components/ui';

interface ChartData {
  day: string;
  pomodoros: number;
  hours: number;
}

interface WeeklyChartProps {
  data: ChartData[];
  maxValue: number;
  period: string;
  isLoading?: boolean;
}

const PERIOD_TITLES: Record<string, string> = {
  week: '每日番茄钟',
  month: '每周番茄钟',
  year: '每月番茄钟',
};

export function WeeklyChart({ data, maxValue, period, isLoading }: WeeklyChartProps) {
  const title = PERIOD_TITLES[period] || '番茄钟统计';

  if (isLoading) {
    return (
      <Card>
        <CardHeader title={title} />
        <div className="flex items-end gap-3 h-48 animate-pulse">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 bg-gray-100 rounded-t-xl h-20" />
          ))}
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader title={title} />
        <div className="flex items-center justify-center h-48 text-stone text-sm">
          暂无数据，开始学习吧！
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={title} />
      <div className="flex items-end gap-2 h-48">
        {data.map((d) => {
          const barHeight = maxValue > 0 ? (d.pomodoros / maxValue) * 160 : 0;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
              <span className="text-stone text-xs">{d.pomodoros}</span>
              <div
                className="w-full bg-coral rounded-t-xl transition-all hover:opacity-80 cursor-pointer relative group min-h-[4px]"
                style={{ height: `${Math.max(barHeight, 4)}px` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-charcoal text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {d.hours}h
                </div>
              </div>
              <span className="text-stone text-xs truncate w-full text-center">{d.day}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
