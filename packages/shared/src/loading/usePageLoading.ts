/**
 * 页面加载状态管理 Hook
 * 
 * 提供统一的页面加载状态管理，包括：
 * - 延迟显示loading（避免闪烁）
 * - 最小显示时间控制
 * - 刷新模式支持
 * 
 * @example
 * ```typescript
 * // Web端使用
 * const { isLoading, startLoading, markSuccess } = usePageLoading();
 * 
 * useEffect(() => {
 *   startLoading();
 *   fetchData().then(() => markSuccess());
 * }, []);
 * 
 * // Mobile端使用
 * const { isLoading, isRefreshing } = usePageLoading({ delay: 100 });
 * ```
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { loadingAnimation } from '@studyflow/theme';
import type { 
  PageLoadingState, 
  LoadingOptions, 
  PageLoadingManager,
  DelayedLoadingConfig 
} from './types';

const DEFAULT_CONFIG: DelayedLoadingConfig = {
  delay: loadingAnimation.pageRefresh.delay,
  minDisplayTime: loadingAnimation.pageRefresh.minDisplayTime,
};

/**
 * 页面加载状态管理 Hook
 */
export function usePageLoading(options: LoadingOptions = {}): PageLoadingManager {
  const { 
    delay = DEFAULT_CONFIG.delay, 
    minDisplayTime = DEFAULT_CONFIG.minDisplayTime,
    refreshMode = false 
  } = options;

  const [state, setState] = useState<PageLoadingState>('idle');
  const [isLoading, setIsLoading] = useState(false);
  
  // 使用 ref 来管理定时器，避免闭包问题
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const minDisplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loadingStartTimeRef = useRef<number>(0);

  // 清理定时器
  const clearTimers = useCallback(() => {
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    if (minDisplayTimerRef.current) {
      clearTimeout(minDisplayTimerRef.current);
      minDisplayTimerRef.current = null;
    }
  }, []);

  // 开始加载
  const startLoading = useCallback(() => {
    clearTimers();
    setState('loading');
    loadingStartTimeRef.current = Date.now();
    
    // 延迟显示loading
    delayTimerRef.current = setTimeout(() => {
      setIsLoading(true);
    }, delay);
  }, [delay, clearTimers]);

  // 开始刷新（已有数据时的刷新）
  const startRefreshing = useCallback(() => {
    clearTimers();
    setState('refreshing');
    loadingStartTimeRef.current = Date.now();
    
    // 刷新模式下也延迟显示loading
    delayTimerRef.current = setTimeout(() => {
      setIsLoading(true);
    }, delay);
  }, [delay, clearTimers]);

  // 标记成功
  const markSuccess = useCallback(() => {
    const elapsedTime = Date.now() - loadingStartTimeRef.current;
    const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

    // 如果loading还没显示，直接清除定时器
    if (delayTimerRef.current && !isLoading) {
      clearTimers();
      setState('success');
      return;
    }

    // 确保最小显示时间
    minDisplayTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      setState('success');
      delayTimerRef.current = null;
    }, remainingTime);
  }, [minDisplayTime, isLoading, clearTimers]);

  // 标记失败
  const markError = useCallback(() => {
    const elapsedTime = Date.now() - loadingStartTimeRef.current;
    const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

    minDisplayTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      setState('error');
      delayTimerRef.current = null;
    }, remainingTime);
  }, [minDisplayTime]);

  // 重置状态
  const reset = useCallback(() => {
    clearTimers();
    setIsLoading(false);
    setState('idle');
  }, [clearTimers]);

  // 清理副作用
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return {
    state,
    isLoading,
    isRefreshing: state === 'refreshing',
    startLoading,
    startRefreshing,
    markSuccess,
    markError,
    reset,
  };
}

export default usePageLoading;
