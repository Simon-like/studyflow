import { Card, CardHeader } from '@/components/ui';
import { SubjectDistribution as SubjectDistributionChart } from '@/components/business';
import type { SubjectDistribution as SubjectData } from '@/types';

interface SubjectDistributionProps {
  data: SubjectData[];
}

export function SubjectDistribution({ data }: SubjectDistributionProps) {
  return (
    <Card>
      <CardHeader title="科目分布" />
      <SubjectDistributionChart data={data} />
    </Card>
  );
}
