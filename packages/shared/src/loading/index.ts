/**
 * Loading 状态管理模块
 * 
 * 提供跨平台统一的页面加载状态管理
 * 
 * @example
 * ```typescript
 * import { usePageLoading, useTabTransition } from '@studyflow/shared/loading';
 * ```
 */

// Hooks
export { usePageLoading } from './usePageLoading';
export { useTabTransition } from './useTabTransition';

// Types
export type {
  PageLoadingState,
  LoadingOptions,
  PageLoadingManager,
  DelayedLoadingConfig,
} from './types';
