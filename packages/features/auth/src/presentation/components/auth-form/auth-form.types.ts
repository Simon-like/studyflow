import type { ReactNode } from 'react';

/**
 * AuthForm 组件类型定义
 */

export interface AuthFormProps {
  /** 表单标题 */
  title: string;
  /** 表单副标题 */
  subtitle?: string;
  /** 表单内容 */
  children: ReactNode;
  /** 底部内容 */
  footer?: ReactNode;
  /** 是否显示返回按钮 */
  showBackButton?: boolean;
  /** 返回按钮点击回调 */
  onBack?: () => void;
  /** 额外的CSS类名 */
  className?: string;
}

export interface AuthFormHeaderProps {
  /** 标题 */
  title: string;
  /** 副标题 */
  subtitle?: string;
}

export interface AuthFormFooterProps {
  /** 内容 */
  children: ReactNode;
}

export interface AuthFormContainerProps {
  /** 内容 */
  children: ReactNode;
  /** 额外的CSS类名 */
  className?: string;
}

export interface SocialLoginProps {
  /** 微信登录回调 */
  onWeChatLogin?: () => void;
  /** Twitter/X 登录回调 */
  onTwitterLogin?: () => void;
  /** Google 登录回调 */
  onGoogleLogin?: () => void;
  /** 是否加载中 */
  isLoading?: boolean;
}

export interface AuthFormDividerProps {
  /** 分隔文字 */
  text?: string;
}
