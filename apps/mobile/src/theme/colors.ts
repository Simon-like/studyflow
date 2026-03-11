/**
 * 主题颜色配置
 * 遵循设计系统：温暖自然的配色方案
 */

// 主色调 - 珊瑚色
export const coral = {
  50: '#FDF2EC',
  100: '#F9E5D7',
  200: '#F5C9A8',
  300: '#EDA67C',
  400: '#E8A87C', // 主色
  500: '#D4956A',
  600: '#B87A52',
  700: '#945F41',
  800: '#7A4F38',
  900: '#634231',
} as const;

// 辅助色 - 鼠尾草绿
export const sage = {
  50: '#F0F4F1',
  100: '#D9E3DB',
  200: '#B8C9BB',
  300: '#9DB5A0', // 主色
  400: '#7A9A7E',
  500: '#5C7A60',
  600: '#48614B',
  700: '#3A4D3C',
  800: '#2F3E31',
  900: '#273329',
} as const;

// 中性色 - 背景/文字
export const neutral = {
  white: '#FFFFFF',
  cream: '#FDF8F3',
  warm: '#FAF5F0',
  light: '#F0EBE6',
  mist: '#C9C5C1',
  stone: '#8A8A8A',
  charcoal: '#3D3D3D',
  black: '#1A1A1A',
} as const;

// 功能色
export const semantic = {
  success: '#81C784',
  warning: '#FFB74D',
  error: '#E57373',
  info: '#64B5F6',
} as const;

// 快捷访问
export const colors = {
  primary: coral[400],
  primaryLight: coral[200],
  primaryDark: coral[500],
  secondary: sage[300],
  secondaryDark: sage[400],
  background: neutral.cream,
  surface: neutral.white,
  warm: neutral.warm,
  text: neutral.charcoal,
  textSecondary: neutral.stone,
  textMuted: neutral.mist,
  border: neutral.mist,
  ...semantic,
} as const;

// 透明度变体
export const alpha = {
  primary10: `${coral[400]}1A`, // 10%
  primary15: `${coral[400]}26`, // 15%
  primary20: `${coral[400]}33`, // 20%
  primary25: `${coral[400]}40`, // 25%
  secondary20: `${sage[300]}33`, // 20%
  secondary25: `${sage[300]}40`, // 25%
  mist25: `${neutral.mist}40`, // 25%
  mist30: `${neutral.mist}4D`, // 30%
  mist50: `${neutral.mist}80`, // 50%
  mist60: `${neutral.mist}99`, // 60%
  white80: `${neutral.white}CC`, // 80%
} as const;
