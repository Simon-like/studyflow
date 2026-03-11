export interface HeatMapDataItem {
  day: number;
  value: number;
  label?: string;
}

export interface HeatMapProps {
  data: HeatMapDataItem[];
  color?: string;
  className?: string;
  showWeekDays?: boolean;
}
