/**
 * 页面刷新指示器组件
 * 
 * 柔和的页面加载动画，包含：
 * - 品牌Logo脉冲动画
 * - 三个圆点弹跳动画
 * - 平滑的淡入淡出效果
 */

import { useEffect, useState } from 'react';
import { loadingAnimation } from '@studyflow/theme';

export interface PageRefreshIndicatorProps {
  /** 是否可见 */
  visible: boolean;
  /** 提示文字 */
  text?: string;
  /** 尺寸：small | medium | large */
  size?: 'small' | 'medium' | 'large';
  /** 是否全屏遮罩 */
  fullscreen?: boolean;
  /** 背景透明度 */
  backgroundOpacity?: number;
}

const SIZE_CONFIG = {
  small: {
    container: 'w-8 h-8 rounded-lg',
    icon: 'w-4 h-4',
    dots: 'w-1.5 h-1.5',
  },
  medium: {
    container: 'w-14 h-14 rounded-2xl',
    icon: 'w-7 h-7',
    dots: 'w-2 h-2',
  },
  large: {
    container: 'w-20 h-20 rounded-3xl',
    icon: 'w-10 h-10',
    dots: 'w-2.5 h-2.5',
  },
};

export function PageRefreshIndicator({
  visible,
  text = '加载中...',
  size = 'medium',
  fullscreen = true,
  backgroundOpacity = 0.8,
}: PageRefreshIndicatorProps) {
  const [shouldRender, setShouldRender] = useState(visible);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsExiting(false);
      setShouldRender(true);
    } else {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, loadingAnimation.pageRefresh.fadeOutDuration);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!shouldRender) return null;

  const sizeConfig = SIZE_CONFIG[size];
  const fadeDuration = loadingAnimation.pageRefresh.fadeOutDuration;

  return (
    <div
      className={`${fullscreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10'} flex flex-col items-center justify-center transition-all duration-${fadeDuration}`}
      style={{
        backgroundColor: fullscreen 
          ? `rgba(253, 248, 243, ${backgroundOpacity})` // cream color with opacity
          : 'rgba(253, 248, 243, 0.95)',
        opacity: isExiting ? 0 : 1,
        backdropFilter: fullscreen ? 'blur(4px)' : undefined,
      }}
    >
      {/* Logo 容器 */}
      <div
        className={`${sizeConfig.container} bg-coral flex items-center justify-center shadow-coral animate-pulse-soft`}
        style={{
          animationDuration: `${loadingAnimation.skeleton.pulseDuration}ms`,
        }}
      >
        <svg
          className={`${sizeConfig.icon} text-white`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </div>

      {/* 弹跳圆点 */}
      <div className="flex gap-1.5 mt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${sizeConfig.dots} bg-coral rounded-full animate-bounce`}
            style={{
              animationDelay: `${i * loadingAnimation.spinner.bounceDelay}ms`,
              animationDuration: '600ms',
            }}
          />
        ))}
      </div>

      {/* 文字提示 */}
      {text && (
        <p className="mt-4 text-sm text-stone animate-pulse-soft">
          {text}
        </p>
      )}
    </div>
  );
}

export default PageRefreshIndicator;
