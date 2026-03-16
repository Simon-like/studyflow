import { RefreshCw } from 'lucide-react';
import { Tabs } from '@/components/ui';
import type { Period } from '../types';
import { PERIOD_OPTIONS } from '../constants';

interface StatsHeaderProps {
  period: Period;
  onPeriodChange: (period: Period) => void;
  onRefresh?: () => void;
}

export function StatsHeader({ period, onPeriodChange, onRefresh }: StatsHeaderProps) {
  const tabItems = PERIOD_OPTIONS.map((opt) => ({
    key: opt.key,
    label: opt.label,
  }));

  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-charcoal">学习统计</h1>
        <p className="text-stone text-sm mt-0.5">了解你的学习习惯，持续优化效率</p>
      </div>
      <div className="flex items-center gap-4">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 text-stone hover:text-charcoal transition-colors rounded-lg hover:bg-gray-100"
            title="刷新数据"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        )}
        <Tabs items={tabItems} activeKey={period} onChange={(key) => onPeriodChange(key as Period)} />
      </div>
    </div>
  );
}
