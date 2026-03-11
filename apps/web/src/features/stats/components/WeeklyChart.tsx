import { Card, CardHeader } from '@/components/ui';
import type { DailyStudyData } from '@/types';

interface WeeklyChartProps {
  data: DailyStudyData[];
  maxValue: number;
}

export function WeeklyChart({ data, maxValue }: WeeklyChartProps) {
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
