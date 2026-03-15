/**
 * 页面加载状态管理 Hook
 * 
 * 提供统一的页面加载状态管理，包括：
 * - 延迟显示loading（避免闪烁）
 * - 最小显示时间控制
 * - 刷新模式支持
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export type PageLoadingState = 
  | 'idle'
  | 'loading'
  | 'refreshing'
  | 'success'
  | 'error';

export interface LoadingOptions {
  delay?: number;
  minDisplayTime?: number;
  refreshMode?: boolean;
}

export interface PageLoadingManager {
  state: PageLoadingState;
  isLoading: boolean;
  isRefreshing: boolean;
  startLoading: () => void;
  startRefreshing: () => void;
  markSuccess: () => void;
  markError: () => void;
  reset: () => void;
}

const DEFAULT_CONFIG = {
  delay: 150,
  minDisplayTime: 400,
};

export function usePageLoading(options: LoadingOptions = {}): PageLoadingManager {
  const { 
    delay = DEFAULT_CONFIG.delay, 
    minDisplayTime = DEFAULT_CONFIG.minDisplayTime,
    refreshMode = false 
  } = options;

  const [state, setState] = useState<PageLoadingState>('idle');
  const [isLoading, setIsLoading] = useState(false);
  
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const minDisplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loadingStartTimeRef = useRef<number>(0);

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

  const startLoading = useCallback(() => {
    clearTimers();
    setState('loading');
    loadingStartTimeRef.current = Date.now();
    
    delayTimerRef.current = setTimeout(() => {
      setIsLoading(true);
    }, delay);
  }, [delay, clearTimers]);

  const startRefreshing = useCallback(() => {
    clearTimers();
    setState('refreshing');
    loadingStartTimeRef.current = Date.now();
    
    delayTimerRef.current = setTimeout(() => {
      setIsLoading(true);
    }, delay);
  }, [delay, clearTimers]);

  const markSuccess = useCallback(() => {
    const elapsedTime = Date.now() - loadingStartTimeRef.current;
    const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

    if (delayTimerRef.current && !isLoading) {
      clearTimers();
      setState('success');
      return;
    }

    minDisplayTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      setState('success');
      delayTimerRef.current = null;
    }, remainingTime);
  }, [minDisplayTime, isLoading, clearTimers]);

  const markError = useCallback(() => {
    const elapsedTime = Date.now() - loadingStartTimeRef.current;
    const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

    minDisplayTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      setState('error');
      delayTimerRef.current = null;
    }, remainingTime);
  }, [minDisplayTime]);

  const reset = useCallback(() => {
    clearTimers();
    setIsLoading(false);
    setState('idle');
  }, [clearTimers]);

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
