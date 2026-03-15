/**
 * StudyFlow 设计令牌 (Design Tokens)
 * 
 * 这是所有平台共享的设计系统核心。
 * 任何视觉相关的常量都应该定义在这里。
 */

// ============================================
// 颜色系统
// ============================================
export const colors = {
  // 主色调 - 珊瑚橙
  coral: {
    50: '#FDF6F1',
    100: '#FAEBE0',
    200: '#F5D6C1',
    300: '#F0C1A2',
    400: '#EBAC83',
    500: '#E8A87C',
    600: '#D4956A',
    700: '#C08258',
    800: '#AB6F46',
    900: '#965C34',
  },

  // 辅助色 - 鼠尾草绿
  sage: {
    50: '#F4F7F4',
    100: '#E9EFE9',
    200: '#D3DFD4',
    300: '#BDCFBE',
    400: '#A7C0A9',
    500: '#9DB5A0',
    600: '#7A9A7E',
    700: '#5F7F63',
    800: '#456448',
    900: '#2A492D',
  },

  // 中性色
  neutral: {
    white: '#FFFFFF',
    cream: '#FDF8F3',
    warm: '#FAF5F0',
    light: '#F0EBE6',
    mist: '#C9C5C1',
    stone: '#8A8A8A',
    charcoal: '#3D3D3D',
    black: '#1A1A1A',
  },

  // 功能色
  semantic: {
    success: '#81C784',
    warning: '#FFB74D',
    error: '#E57373',
    info: '#64B5F6',
  },
} as const;

// 语义化颜色快捷访问
export const semanticColors = {
  primary: colors.coral[500],
  primaryLight: colors.coral[200],
  primaryDark: colors.coral[600],
  secondary: colors.sage[500],
  secondaryDark: colors.sage[600],
  background: colors.neutral.cream,
  surface: colors.neutral.white,
  surfaceWarm: colors.neutral.warm,
  text: colors.neutral.charcoal,
  textSecondary: colors.neutral.stone,
  textMuted: colors.neutral.mist,
  border: colors.neutral.mist,
  ...colors.semantic,
} as const;

// ============================================
// 间距系统
// ============================================
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
} as const;

// ============================================
// 字体系统
// ============================================
export const typography = {
  fonts: {
    display: 'Outfit, sans-serif',
    body: 'Noto Sans SC, sans-serif',
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// ============================================
// 圆角系统
// ============================================
export const borderRadius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

// ============================================
// 阴影系统 (Web)
// ============================================
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

// ============================================
// 动画系统
// ============================================
export const animations = {
  duration: {
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
    pageTransition: 400,
  },
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

// ============================================
// Loading 动画配置
// ============================================
export const loadingAnimation = {
  // 页面刷新动画配置
  pageRefresh: {
    // 动画时长（毫秒）
    duration: 600,
    // 延迟显示loading的时间（避免快速响应时的闪烁）
    delay: 150,
    // 最小显示时间（避免loading一闪而过）
    minDisplayTime: 400,
    // 淡出动画时长
    fadeOutDuration: 300,
  },
  // 骨架屏配置
  skeleton: {
    // 闪烁动画时长
    shimmerDuration: 1500,
    // 脉冲动画时长
    pulseDuration: 2000,
  },
  // 加载指示器配置
  spinner: {
    // 旋转动画时长
    rotateDuration: 800,
    // 圆点数量
    dotCount: 3,
    // 圆点弹跳延迟
    bounceDelay: 150,
  },
} as const;

// ============================================
// 断点系统
// ============================================
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ============================================
// 组件特定令牌
// ============================================
export const components = {
  button: {
    sizes: {
      sm: { padding: { x: 12, y: 6 }, fontSize: 14, radius: 8 },
      md: { padding: { x: 16, y: 10 }, fontSize: 16, radius: 12 },
      lg: { padding: { x: 24, y: 12 }, fontSize: 18, radius: 16 },
    },
  },
  card: {
    radius: 16,
    padding: 20,
  },
  input: {
    radius: 12,
    padding: { x: 16, y: 12 },
  },
} as const;

// ============================================
// 统一导出
// ============================================
export const tokens = {
  colors,
  semanticColors,
  spacing,
  typography,
  borderRadius,
  shadows,
  animations,
  loadingAnimation,
  breakpoints,
  components,
} as const;

export type Tokens = typeof tokens;
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type LoadingAnimation = typeof loadingAnimation;
