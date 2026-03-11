/**
 * 主题系统入口
 * 统一导出所有主题配置
 */

export * from './colors';
export * from './spacing';
export * from './typography';

// 聚合主题对象（用于需要整体主题的场景）
import { colors, alpha } from './colors';
import { spacing, radius, shadows, layout } from './spacing';
import { typography, fontSize, fontWeight } from './typography';

export const theme = {
  colors,
  alpha,
  spacing,
  radius,
  shadows,
  layout,
  typography,
  fontSize,
  fontWeight,
} as const;

export default theme;
