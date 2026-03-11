import { Card, CardHeader } from '@/components/ui';
import { HeatMap } from '@/components/business';
import type { HeatmapData } from '../types';

interface MonthlyHeatmapProps {
  data: HeatmapData[];
}

export function MonthlyHeatmap({ data }: MonthlyHeatmapProps) {
  return (
    <Card className="mt-6">
      <CardHeader title="本月打卡热图" />
      <HeatMap data={data} />
    </Card>
  );
}
