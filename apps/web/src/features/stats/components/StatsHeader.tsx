import { Tabs } from '@/components/ui';
import type { Period } from '../types';
import { PERIOD_OPTIONS } from '../constants';

interface StatsHeaderProps {
  period: Period;
  onPeriodChange: (period: Period) => void;
}

export function StatsHeader({ period, onPeriodChange }: StatsHeaderProps) {
  const tabItems = PERIOD_OPTIONS.map((opt) => ({
    key: opt.key,
    label: opt.label,
  }));

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">学习统计</h1>
        <p className="text-stone text-sm mt-0.5">了解你的学习习惯，持续优化效率</p>
      </div>
      <Tabs items={tabItems} activeKey={period} onChange={onPeriodChange} />
    </div>
  );
}
