import { BarChart3 } from 'lucide-react';
import { useStats } from './hooks';
import { StatsHeader } from './components/StatsHeader';
import { OverviewCards } from './components/OverviewCards';
import { WeeklyChart } from './components/WeeklyChart';
import { MonthlyHeatmap } from './components/MonthlyHeatmap';
import { EmptyState, Button } from '@/components/ui';

export default function StatsPage() {
  const {
    period,
    setPeriod,
    chartData,
    maxPomodoros,
    heatmapData,
    overviewStats,
    isLoading,
    hasAnyData,
    refreshAllStats,
  } = useStats();

  const showEmptyState = !isLoading && !hasAnyData;

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <StatsHeader
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={refreshAllStats}
      />

      {showEmptyState ? (
        <EmptyState
          icon={<BarChart3 className="w-8 h-8 text-stone" />}
          title="还没有学习统计数据"
          description="完成至少一个番茄钟后，这里会展示你的专注趋势和学科分布。"
          action={
            <Button size="sm" onClick={refreshAllStats}>
              立即刷新
            </Button>
          }
          className="mt-8"
        />
      ) : (
        <>
          <OverviewCards
            overviewStats={overviewStats}
            isLoading={isLoading}
          />

          <WeeklyChart
            data={chartData}
            maxValue={maxPomodoros}
            period={period}
            isLoading={isLoading}
          />

          <MonthlyHeatmap data={heatmapData} />
        </>
      )}
    </div>
  );
}
