/**
 * Tab 切换过渡包装组件
 * 
 * 用于包裹 Tab 内容，在切换时显示平滑的加载动画
 * 
 * @example
 * ```typescript
 * function MainLayout() {
 *   const location = useLocation();
 *   const { isTabLoading, startTabTransition, endTabTransition } = useTabTransition();
 *   
 *   useEffect(() => {
 *     startTabTransition(location.pathname);
 *   }, [location.pathname]);
 *   
 *   return (
 *     <TabTransitionWrapper
 *       tabKey={location.pathname}
 *       isLoading={isTabLoading}
 *       onTransitionEnd={endTabTransition}
 *     >
 *       <Outlet />
 *     </TabTransitionWrapper>
 *   );
 * }
 * ```
 */

import { ReactNode, useEffect, useState } from 'react';
import { loadingAnimation } from '@studyflow/theme';
import { PageRefreshIndicator } from './PageRefreshIndicator';

export interface TabTransitionWrapperProps {
  /** 子组件 */
  children: ReactNode;
  /** 当前 Tab 的 key */
  tabKey: string;
  /** 是否正在加载 */
  isLoading?: boolean;
  /** 切换动画结束回调 */
  onTransitionEnd?: () => void;
  /** 过渡动画时长（毫秒） */
  transitionDuration?: number;
}

export function TabTransitionWrapper({
  children,
  tabKey,
  isLoading = false,
  onTransitionEnd,
  transitionDuration = loadingAnimation.pageRefresh.fadeOutDuration,
}: TabTransitionWrapperProps) {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTabKey, setCurrentTabKey] = useState(tabKey);

  useEffect(() => {
    if (tabKey !== currentTabKey) {
      // Tab 切换开始
      setIsTransitioning(true);
      
      // 延迟更新内容，让退出动画播放
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setCurrentTabKey(tabKey);
        
        // 进入动画
        setTimeout(() => {
          setIsTransitioning(false);
          onTransitionEnd?.();
        }, transitionDuration);
      }, transitionDuration / 2);

      return () => clearTimeout(timer);
    } else {
      // 同一 Tab 内更新
      setDisplayChildren(children);
    }
  }, [tabKey, children, currentTabKey, transitionDuration, onTransitionEnd]);

  return (
    <div className="relative w-full h-full">
      {/* 内容区域 */}
      <div
        className="transition-all"
        style={{
          opacity: isTransitioning || isLoading ? 0.3 : 1,
          transform: isTransitioning ? 'translateY(8px)' : 'translateY(0)',
          transitionDuration: `${transitionDuration}ms`,
          transitionTimingFunction: 'ease-out',
          filter: isLoading ? 'blur(2px)' : 'none',
        }}
      >
        {displayChildren}
      </div>

      {/* 加载指示器 */}
      <PageRefreshIndicator
        visible={isLoading}
        text="加载中..."
        fullscreen={false}
        size="small"
        backgroundOpacity={0.6}
      />
    </div>
  );
}

export default TabTransitionWrapper;
