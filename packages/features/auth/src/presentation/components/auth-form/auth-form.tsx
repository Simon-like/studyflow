import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import type {
  AuthFormProps,
  AuthFormHeaderProps,
  AuthFormFooterProps,
  AuthFormContainerProps,
  SocialLoginProps,
  AuthFormDividerProps,
} from './auth-form.types';

/**
 * AuthFormHeader - 表单标题组件
 */
export function AuthFormHeader({ title, subtitle }: AuthFormHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h2 className="font-display text-2xl font-bold text-charcoal mb-2">{title}</h2>
      {subtitle && <p className="text-stone">{subtitle}</p>}
    </div>
  );
}

/**
 * AuthFormContainer - 表单容器组件
 */
export function AuthFormContainer({ children, className = '' }: AuthFormContainerProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg shadow-coral/5 p-8 ${className}`}>
      {children}
    </div>
  );
}

/**
 * AuthFormContent - 表单内容包装器
 */
export function AuthFormContent({ children }: { children: ReactNode }) {
  return <div className="space-y-5">{children}</div>;
}

/**
 * AuthFormFooter - 表单底部组件
 */
export function AuthFormFooter({ children }: AuthFormFooterProps) {
  return <div className="mt-8">{children}</div>;
}

/**
 * AuthFormDivider - 分隔线组件
 */
export function AuthFormDivider({ text = '或使用以下方式登录' }: AuthFormDividerProps) {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-mist/50" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-white text-stone">{text}</span>
      </div>
    </div>
  );
}

/**
 * SocialLoginButtons - 社交登录按钮组
 */
export function SocialLoginButtons({
  onWeChatLogin,
  onTwitterLogin,
  onGoogleLogin,
  isLoading = false,
}: SocialLoginProps) {
  const buttonClass =
    'flex items-center justify-center py-2.5 border border-mist rounded-xl hover:bg-warm transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* WeChat */}
      <button
        type="button"
        onClick={onWeChatLogin}
        disabled={isLoading}
        className={buttonClass}
        aria-label="微信登录"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#07C160">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z" />
        </svg>
      </button>

      {/* Twitter/X */}
      <button
        type="button"
        onClick={onTwitterLogin}
        disabled={isLoading}
        className={buttonClass}
        aria-label="Twitter 登录"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1DA1F2">
          <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
        </svg>
      </button>

      {/* Google */}
      <button
        type="button"
        onClick={onGoogleLogin}
        disabled={isLoading}
        className={buttonClass}
        aria-label="Google 登录"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 5.04c1.54 0 2.92.56 4 1.48l2.96-2.96C16.64 1.84 14.44 1 12 1 7.38 1 3.35 3.6 1.42 7.44l3.42 2.64C6.16 7.12 8.82 5.04 12 5.04z" />
          <path fill="#4285F4" d="M23.52 12.24c0-.72-.06-1.4-.18-2.08H12v4.06h6.46c-.28 1.48-1.12 2.74-2.38 3.58l3.84 2.98c2.24-2.06 3.52-5.1 3.52-8.54z" />
          <path fill="#FBBC05" d="M5.84 14.08l-3.42 2.64C4.04 19.92 7.76 22 12 22c2.88 0 5.3-.96 7.06-2.6l-3.84-2.98c-.96.66-2.18 1.04-3.62 1.04-2.78 0-5.14-1.88-5.98-4.4z" />
          <path fill="#34A853" d="M5.84 9.92c-.4 1.18-.64 2.44-.64 3.76s.24 2.58.64 3.76l3.42-2.64c-.2-.58-.32-1.2-.32-1.84s.12-1.26.32-1.84L5.84 9.92z" />
        </svg>
      </button>
    </div>
  );
}

/**
 * AuthFormBackButton - 返回按钮组件
 */
export function AuthFormBackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="absolute left-0 top-0 p-2 text-stone hover:text-charcoal transition-colors"
      aria-label="返回"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}

/**
 * AuthForm - 认证表单主组件
 *
 * 提供统一的认证表单布局，包括：
 * - 标题区域
 * - 内容区域
 * - 分隔线
 * - 社交登录
 * - 底部链接
 */
export function AuthForm({
  title,
  subtitle,
  children,
  footer,
  showBackButton = false,
  onBack,
  className = '',
}: AuthFormProps) {
  return (
    <div className={`animate-slide-up relative ${className}`}>
      {showBackButton && onBack && <AuthFormBackButton onBack={onBack} />}
      <AuthFormHeader title={title} subtitle={subtitle} />
      {children}
      {footer && <AuthFormFooter>{footer}</AuthFormFooter>}
    </div>
  );
}

// 子组件挂载
AuthForm.Container = AuthFormContainer;
AuthForm.Content = AuthFormContent;
AuthForm.Header = AuthFormHeader;
AuthForm.Footer = AuthFormFooter;
AuthForm.Divider = AuthFormDivider;
AuthForm.SocialLogin = SocialLoginButtons;
AuthForm.BackButton = AuthFormBackButton;
