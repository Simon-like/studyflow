/**
 * 字体/排版系统
 */

import { TextStyle } from 'react-native';
import { colors } from './colors';

// 字体大小
export const fontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 15,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 22,
  '4xl': 24,
  '5xl': 32,
} as const;

// 字重
export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// 行高
export const lineHeight = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
} as const;

// 预设文本样式
export const typography: Record<string, TextStyle> = {
  // 标题
  h1: {
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    color: colors.text,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  h3: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  h4: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  // 正文
  body: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    color: colors.text,
    lineHeight: fontSize.base * lineHeight.normal,
  },
  bodySmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    color: colors.text,
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  // 标签/说明
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    color: colors.textMuted,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  // 按钮
  button: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  buttonSmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  // 特殊
  statValue: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  timer: {
    fontSize: 42,
    fontWeight: fontWeight.bold,
    color: colors.text,
    letterSpacing: -1,
  },
  price: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
} as const;
