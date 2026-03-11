/**
 * 工具函数集合
 * 
 * 注意: 通用工具函数优先从 @studyflow/shared 导入
 * 此文件仅保留移动端特有的工具函数
 */

// 复用 shared 包的所有工具函数
export {
  formatDate,
  formatDuration,
  debounce,
  throttle,
  generateId,
  deepClone,
  sleep,
  delay,
  getRelativeTime,
  truncateText,
  calculateProgress,
} from '@studyflow/shared';

/**
 * 格式化秒数为 mm:ss 格式
 * (移动端专用版本，用于番茄钟显示)
 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * 获取当前时间字符串 (HH:mm)
 */
export function getCurrentTime(): string {
  return new Date().toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}
