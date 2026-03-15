/**
 * StudyFlow Theme
 * 
 * 跨平台设计系统主题配置
 * 
 * @example
 * ```typescript
 * // 基础令牌
 * import { tokens, colors, spacing } from '@studyflow/theme';
 * 
 * // 平台适配
 * import { mobileTokens, webTokens } from '@studyflow/theme/adapters';
 * 
 * // 配置生成器
 * import { generateTailwindConfig, generateCSSVariables } from '@studyflow/theme/adapters';
 * ```
 */

// 基础设计令牌
export { tokens, colors, semanticColors, spacing, typography, borderRadius, shadows, animations, loadingAnimation, breakpoints, components } from './tokens';

// 平台适配器
export { mobileTokens, webTokens, generateCSSVariables, generateTailwindConfig } from './adapters';

// 类型导出
export type { Tokens, Colors, Spacing, Typography, LoadingAnimation } from './tokens';
