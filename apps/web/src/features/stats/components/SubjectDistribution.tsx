import { Card, CardHeader } from '@/components/ui';

interface SubjectData {
  name: string;
  hours: number;
  percent: number;
  color: string;
}

interface SubjectDistributionProps {
  data: SubjectData[];
  isLoading?: boolean;
}

export function SubjectDistribution({ data, isLoading }: SubjectDistributionProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader title="学科分布" />
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader title="学科分布" />
        <div className="flex items-center justify-center h-32 text-stone text-sm">
          暂无数据
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="学科分布" />
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-sm text-charcoal flex-1">{item.name}</span>
            <span className="text-sm text-stone">{item.hours}h</span>
            <span className="text-sm text-stone w-10 text-right">{item.percent}%</span>
          </div>
        ))}
      </div>
      
      {/* 环形图占位 */}
      <div className="mt-6 flex justify-center">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            {data.map((item, index) => {
              const prevPercent = data
                .slice(0, index)
                .reduce((sum, d) => sum + d.percent, 0);
              return (
                <circle
                  key={item.name}
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke={getColorValue(item.color)}
                  strokeWidth="3"
                  strokeDasharray={`${item.percent} ${100 - item.percent}`}
                  strokeDashoffset={-prevPercent}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-charcoal">
              {data.reduce((sum, d) => sum + d.hours, 0)}h
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// 将 Tailwind 颜色类转换为 stroke 颜色值
function getColorValue(colorClass: string): string {
  const colorMap: Record<string, string> = {
    'bg-coral': '#f4a261',
    'bg-sage': '#2a9d8f',
    'bg-coral/60': 'rgba(244, 162, 97, 0.6)',
    'bg-sage/60': 'rgba(42, 157, 143, 0.6)',
    'bg-coral/40': 'rgba(244, 162, 97, 0.4)',
    'bg-sage/40': 'rgba(42, 157, 143, 0.4)',
  };
  return colorMap[colorClass] || '#ccc';
}
