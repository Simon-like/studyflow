import { Card, CardHeader } from '@/components/ui';

interface WeeklyChartData {
  day: string;
  pomodoros: number;
  hours: number;
}

interface WeeklyChartProps {
  data: WeeklyChartData[];
  maxValue: number;
  isLoading?: boolean;
}

export function WeeklyChart({ data, maxValue, isLoading }: WeeklyChartProps) {
  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader title="每日番茄钟" />
        <div className="flex items-end gap-3 h-40 animate-pulse">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 bg-gray-100 rounded-t-xl h-20" />
          ))}
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader title="每日番茄钟" />
        <div className="flex items-center justify-center h-40 text-stone text-sm">
          暂无数据，开始学习吧！
        </div>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader title="每日番茄钟" />
      <div className="flex items-end gap-3 h-40">
        {data.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-stone text-xs">{d.pomodoros}</span>
            <div
              className="w-full bg-coral rounded-t-xl transition-all hover:opacity-80 cursor-pointer relative group"
              style={{ height: `${(d.pomodoros / maxValue) * 120}px` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-charcoal text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {d.hours}h
              </div>
            </div>
            <span className="text-stone text-xs">{d.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
