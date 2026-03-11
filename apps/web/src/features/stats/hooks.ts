import { useState, useMemo } from 'react';
import type { Period } from './types';
import { WEEK_DATA, SUBJECT_DATA, generateMonthHeatmap } from './constants';

export function useStats() {
  const [period, setPeriod] = useState<Period>('week');

  const chartData = useMemo(() => {
    // In real app, fetch data based on period
    return WEEK_DATA;
  }, [period]);

  const maxPomodoros = useMemo(
    () => Math.max(...chartData.map((d) => d.pomodoros)),
    [chartData]
  );

  const heatmapData = useMemo(() => generateMonthHeatmap(), []);

  return {
    period,
    setPeriod,
    chartData,
    maxPomodoros,
    subjectData: SUBJECT_DATA,
    heatmapData,
  };
}
