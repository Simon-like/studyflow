/**
 * 主题颜色配置
 * 
 * ⚠️ 注意: 此文件保留是为了向后兼容
 * 新项目请直接从 @studyflow/theme 导入
 * 
 * @deprecated 请使用 `import { mobileTokens } from '@studyflow/theme'`
 */

import { mobileTokens } from '@studyflow/theme';

// 从 theme 包重新导出，保持兼容性
export const coral = mobileTokens.colors.coral;
export const sage = mobileTokens.colors.sage;
export const neutral = mobileTokens.colors.neutral;
export const semantic = {
  success: mobileTokens.colors.success,
  warning: mobileTokens.colors.warning,
  error: mobileTokens.colors.error,
  info: mobileTokens.colors.info,
};

// 快捷访问
export const colors = {
  primary: mobileTokens.colors.primary,
  primaryLight: mobileTokens.colors.primaryLight,
  primaryDark: mobileTokens.colors.primaryDark,
  secondary: mobileTokens.colors.secondary,
  secondaryDark: mobileTokens.colors.secondaryDark,
  background: mobileTokens.colors.background,
  surface: mobileTokens.colors.surface,
  white: mobileTokens.colors.surface, // 别名：白色/表面色
  warm: mobileTokens.colors.surfaceWarm,
  text: mobileTokens.colors.text,
  textSecondary: mobileTokens.colors.textSecondary,
  textMuted: mobileTokens.colors.textMuted,
  border: mobileTokens.colors.border,
  success: mobileTokens.colors.success,
  warning: mobileTokens.colors.warning,
  error: mobileTokens.colors.error,
  info: mobileTokens.colors.info,
} as const;

// 透明度变体生成器
const hexToAlpha = (hex: string, alpha: number): string => {
  const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return `${hex}${alphaHex}`;
};

export const alpha = {
  primary10: hexToAlpha(colors.primary, 0.1),
  primary15: hexToAlpha(colors.primary, 0.15),
  primary20: hexToAlpha(colors.primary, 0.2),
  primary25: hexToAlpha(colors.primary, 0.25),
  secondary20: hexToAlpha(colors.secondary, 0.2),
  secondary25: hexToAlpha(colors.secondary, 0.25),
  mist25: hexToAlpha(colors.border, 0.25),
  mist30: hexToAlpha(colors.border, 0.3),
  mist50: hexToAlpha(colors.border, 0.5),
  mist60: hexToAlpha(colors.border, 0.6),
  white80: hexToAlpha(colors.surface, 0.8),
  error10: hexToAlpha(colors.error, 0.1),
  error20: hexToAlpha(colors.error, 0.2),
} as const;

// 推荐：直接导出 theme 包的所有颜色
export { mobileTokens };
