export const DEFAULT_TOTAL_TIME = 25 * 60; // 25 minutes in seconds
export const CIRCUMFERENCE = 2 * Math.PI * 90; // For SVG circle progress

export const STATUS_TEXT = {
  idle: '准备开始',
  running: '专注中...',
  paused: '已暂停',
} as const;

export const STATUS_COLORS = {
  idle: '#F5C9A8',
  running: '#E8A87C',
  paused: '#E8A87C',
} as const;
