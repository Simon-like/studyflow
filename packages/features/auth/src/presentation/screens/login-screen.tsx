import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useLogin } from '../../application/hooks/use-auth';

interface LoginScreenProps {
  onRegisterClick?: () => void;
  onForgotPasswordClick?: () => void;
  onLoginSuccess?: () => void;
}

export function LoginScreen({ 
  onRegisterClick, 
  onForgotPasswordClick,
  onLoginSuccess 
}: LoginScreenProps) {
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync(formData);
      onLoginSuccess?.();
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="animate-slide-up w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl font-bold text-charcoal mb-2">
          欢迎回来
        </h2>
        <p className="text-stone">
          登录你的 StudyFlow 账号，继续学习之旅
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1.5">邮箱</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mist" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-mist rounded-xl text-charcoal-800 pl-12
                         focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
              placeholder="请输入邮箱"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1.5">密码</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mist" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-mist rounded-xl text-charcoal-800 pl-12 pr-12
                         focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
              placeholder="请输入密码"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-mist hover:text-charcoal transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-stone cursor-pointer">
            <input type="checkbox" className="rounded border-mist text-coral focus:ring-coral" />
            <span>记住我</span>
          </label>
          <button 
            type="button"
            onClick={onForgotPasswordClick}
            className="text-coral hover:text-coral-600"
          >
            忘记密码？
          </button>
        </div>

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full inline-flex items-center justify-center px-6 py-3 bg-coral text-white font-medium rounded-xl
                     transition-all duration-200 hover:bg-coral-600 active:scale-95 gap-2
                     disabled:opacity-50 disabled:pointer-events-none"
        >
          {login.isPending ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              登录
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-mist/50" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-cream text-stone">或使用以下方式登录</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button className="flex items-center justify-center py-2.5 border border-mist rounded-xl hover:bg-warm transition-colors">
          <span className="text-lg">WeChat</span>
        </button>
        <button className="flex items-center justify-center py-2.5 border border-mist rounded-xl hover:bg-warm transition-colors">
          <span className="text-lg">QQ</span>
        </button>
        <button className="flex items-center justify-center py-2.5 border border-mist rounded-xl hover:bg-warm transition-colors">
          <span className="text-lg">Google</span>
        </button>
      </div>

      <p className="mt-8 text-center text-stone">
        还没有账号？{' '}
        <button 
          onClick={onRegisterClick}
          className="text-coral hover:text-coral-600 font-medium"
        >
          立即注册
        </button>
      </p>
    </div>
  );
}
