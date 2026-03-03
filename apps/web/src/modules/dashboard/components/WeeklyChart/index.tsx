interface WeeklyData {
  day: string;
  minutes: number;
}

interface WeeklyChartProps {
  data: WeeklyData[];
  maxValue?: number;
}

export function WeeklyChart({ data, maxValue = 300 }: WeeklyChartProps) {
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-charcoal mb-6">本周专注</h3>
      <div className="flex items-end justify-between h-32 gap-2">
        {data.map(({ day, minutes }) => (
          <div key={day} className="flex flex-col items-center flex-1">
            <div className="w-full relative">
              <div
                className="w-full bg-coral/30 rounded-t-lg transition-all duration-500"
                style={{ height: `${(minutes / maxValue) * 100}px` }}
              />
            </div>
            <span className="text-xs text-stone mt-2">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
