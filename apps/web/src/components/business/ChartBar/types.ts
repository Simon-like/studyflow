export interface ChartDataItem {
  label: string;
  value: number;
  displayValue?: string;
}

export interface ChartBarProps {
  data: ChartDataItem[];
  maxValue: number;
  height?: number;
  showTooltip?: boolean;
  barColor?: string;
  className?: string;
}

export interface BarChartProps {
  data: ChartDataItem[];
  height?: number;
  showValues?: boolean;
  className?: string;
}
