/**
 * 全局 Providers
 * 统一包裹所有 Context 和 Provider
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DialogProvider } from './DialogProvider';

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5分钟
      refetchOnWindowFocus: false,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <DialogProvider>
        {children}
      </DialogProvider>
    </QueryClientProvider>
  );
}
