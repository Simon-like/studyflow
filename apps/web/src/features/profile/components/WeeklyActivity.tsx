import { Card, CardHeader } from '@/components/ui';
import { WEEKLY_DATA } from '../constants';

export function WeeklyActivity() {
  const maxHours = Math.max(...WEEKLY_DATA.map((d) => d.hours));
  const totalHours = WEEKLY_DATA.reduce((sum, d) => sum + d.hours, 0);

  return (
    <Card className="h-full">
      <CardHeader title="本周学习时长" />
      <div className="flex items-end gap-2 h-32">
        {WEEKLY_DATA.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-coral/20 rounded-t-lg relative overflow-hidden"
              style={{ height: `${(d.hours / maxHours) * 100}%` }}
            >
              <div className="absolute bottom-0 left-0 right-0 bg-coral rounded-t-lg transition-all h-full" />
            </div>
            <span className="text-stone text-xs">{d.day}</span>
          </div>
        ))}
      </div>
      <p className="text-stone text-xs mt-3 text-center">
        本周共学习 <span className="text-coral font-semibold">{totalHours} 小时</span>
      </p>
    </Card>
  );
}
