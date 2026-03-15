/**
 * 页面刷新容器组件
 * 
 * 自动处理页面加载状态的容器组件，配合 usePageLoading hook 使用
 * 
 * @example
 * ```typescript
 * function DashboardPage() {
 *   const { isLoading, startLoading, markSuccess } = usePageLoading();
 *   
 *   useEffect(() => {
 *     startLoading();
 *     fetchData().then(() => markSuccess());
 *   }, []);
 *   
 *   return (
 *     <PageRefreshContainer isLoading={isLoading}>
 *       <DashboardContent />
 *     </PageRefreshContainer>
 *   );
 * }
 * ```
 */

import { ReactNode } from 'react';
import { PageRefreshIndicator } from './PageRefreshIndicator';

export interface PageRefreshContainerProps {
  /** 子组件 */
  children: ReactNode;
  /** 是否显示加载状态 */
  isLoading: boolean;
  /** 加载提示文字 */
  loadingText?: string;
  /** 是否使用局部加载（非全屏） */
  local?: boolean;
  /** 最小高度（用于局部加载时保持布局） */
  minHeight?: string;
  /** 额外的 className */
  className?: string;
}

export function PageRefreshContainer({
  children,
  isLoading,
  loadingText = '加载中...',
  local = false,
  minHeight = '200px',
  className = '',
}: PageRefreshContainerProps) {
  return (
    <div 
      className={`relative ${className}`}
      style={local ? { minHeight } : undefined}
    >
      {children}
      <PageRefreshIndicator
        visible={isLoading}
        text={loadingText}
        fullscreen={!local}
        size={local ? 'small' : 'medium'}
      />
    </div>
  );
}

export default PageRefreshContainer;
