/**
 * 平台适配器
 * 
 * 将设计令牌转换为各平台可用的格式
 */

import { tokens } from './tokens';

// ============================================
// React Native 适配器
// ============================================
export const mobileTokens = {
  colors: {
    // 扁平化颜色对象
    primary: tokens.semanticColors.primary,
    primaryLight: tokens.semanticColors.primaryLight,
    primaryDark: tokens.semanticColors.primaryDark,
    secondary: tokens.semanticColors.secondary,
    secondaryDark: tokens.semanticColors.secondaryDark,
    background: tokens.semanticColors.background,
    surface: tokens.semanticColors.surface,
    surfaceWarm: tokens.semanticColors.surfaceWarm,
    text: tokens.semanticColors.text,
    textSecondary: tokens.semanticColors.textSecondary,
    textMuted: tokens.semanticColors.textMuted,
    border: tokens.semanticColors.border,
    success: tokens.semanticColors.success,
    warning: tokens.semanticColors.warning,
    error: tokens.semanticColors.error,
    info: tokens.semanticColors.info,
    
    // 完整色板
    coral: tokens.colors.coral,
    sage: tokens.colors.sage,
    neutral: tokens.colors.neutral,
  },
  
  spacing: tokens.spacing,
  
  typography: {
    ...tokens.typography,
    // RN 使用数字作为 fontWeight
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  borderRadius: tokens.borderRadius,
  
  // RN 阴影使用 elevation
  shadows: {
    none: { elevation: 0, shadowOpacity: 0 },
    sm: { elevation: 1, shadowOpacity: 0.05 },
    md: { elevation: 3, shadowOpacity: 0.1 },
    lg: { elevation: 6, shadowOpacity: 0.15 },
    xl: { elevation: 10, shadowOpacity: 0.2 },
  },
  
  animations: tokens.animations,
} as const;

// ============================================
// Web / Tailwind 适配器
// ============================================
export const webTokens = {
  colors: {
    // Tailwind 配置格式
    coral: {
      DEFAULT: tokens.colors.coral[500],
      ...tokens.colors.coral,
    },
    sage: {
      DEFAULT: tokens.colors.sage[500],
      ...tokens.colors.sage,
    },
    cream: {
      DEFAULT: tokens.colors.neutral.cream,
      50: tokens.colors.neutral.white,
      100: tokens.colors.neutral.cream,
      200: tokens.colors.neutral.warm,
    },
    warm: {
      DEFAULT: tokens.colors.neutral.warm,
      50: tokens.colors.neutral.white,
      100: tokens.colors.neutral.warm,
      200: tokens.colors.neutral.light,
    },
    charcoal: {
      DEFAULT: tokens.colors.neutral.charcoal,
      50: '#F5F5F5',
      100: '#E8E8E8',
      200: '#D1D1D1',
      300: '#B4B4B4',
      400: '#969696',
      500: tokens.colors.neutral.stone,
      600: '#6D6D6D',
      700: '#505050',
      800: tokens.colors.neutral.charcoal,
      900: '#2A2A2A',
    },
    stone: {
      DEFAULT: tokens.colors.neutral.stone,
      400: '#A8A8A8',
      500: tokens.colors.neutral.stone,
      600: '#6B6B6B',
    },
    mist: {
      DEFAULT: tokens.colors.neutral.mist,
      300: '#D9D5D1',
      400: tokens.colors.neutral.mist,
      500: '#B9B5B1',
    },
    success: tokens.semanticColors.success,
    warning: tokens.semanticColors.warning,
    error: tokens.semanticColors.error,
    info: tokens.semanticColors.info,
  },
  
  spacing: tokens.spacing,
  
  borderRadius: Object.fromEntries(
    Object.entries(tokens.borderRadius).map(([k, v]) => [k, `${v}px`])
  ),
  
  boxShadow: tokens.shadows,
  
  fontFamily: tokens.typography.fonts,
  
  fontSize: Object.fromEntries(
    Object.entries(tokens.typography.sizes).map(([k, v]) => [k, `${v}px`])
  ),
} as const;

// ============================================
// CSS 变量生成器
// ============================================
export function generateCSSVariables(): string {
  const lines: string[] = [':root {'];
  
  // 颜色变量
  Object.entries(tokens.colors.coral).forEach(([key, value]) => {
    lines.push(`  --color-coral-${key}: ${value};`);
  });
  
  Object.entries(tokens.colors.sage).forEach(([key, value]) => {
    lines.push(`  --color-sage-${key}: ${value};`);
  });
  
  Object.entries(tokens.colors.neutral).forEach(([key, value]) => {
    lines.push(`  --color-${key}: ${value};`);
  });
  
  Object.entries(tokens.semanticColors).forEach(([key, value]) => {
    lines.push(`  --color-${key}: ${value};`);
  });
  
  // 间距变量
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    lines.push(`  --spacing-${key}: ${value}px;`);
  });
  
  // 圆角变量
  Object.entries(tokens.borderRadius).forEach(([key, value]) => {
    lines.push(`  --radius-${key}: ${value}px;`);
  });
  
  lines.push('}');
  
  return lines.join('\n');
}

// ============================================
// Tailwind 配置生成器
// ============================================
export function generateTailwindConfig() {
  return {
    theme: {
      extend: {
        colors: webTokens.colors,
        spacing: webTokens.spacing,
        borderRadius: webTokens.borderRadius,
        boxShadow: webTokens.boxShadow,
        fontFamily: webTokens.fontFamily,
        fontSize: webTokens.fontSize,
      },
    },
  };
}
