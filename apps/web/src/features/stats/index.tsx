import { useStats } from './hooks';
import { StatsHeader } from './components/StatsHeader';
import { OverviewCards } from './components/OverviewCards';
import { WeeklyChart } from './components/WeeklyChart';
import { SubjectDistribution } from './components/SubjectDistribution';
import { MonthlyHeatmap } from './components/MonthlyHeatmap';

export default function StatsPage() {
  const { period, setPeriod, chartData, maxPomodoros, subjectData, heatmapData } =
    useStats();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <StatsHeader period={period} onPeriodChange={setPeriod} />
      <OverviewCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WeeklyChart data={chartData} maxValue={maxPomodoros} />
        <SubjectDistribution data={subjectData} />
      </div>

      <MonthlyHeatmap data={heatmapData} />
    </div>
  );
}
