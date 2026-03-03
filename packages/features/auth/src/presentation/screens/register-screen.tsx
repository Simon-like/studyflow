import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { useRegister } from '../../application/hooks/use-auth';

interface RegisterScreenProps {
  onLoginClick?: () => void;
  onRegisterSuccess?: () => void;
}

export function RegisterScreen({ 
  onLoginClick,
  onRegisterSuccess 
}: RegisterScreenProps) {
  const register = useRegister();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    studyGoal: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        return;
      }
      setStep(2);
      return;
    }

    try {
      await register.mutateAsync({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        studyGoal: formData.studyGoal,
      });
      onRegisterSuccess?.();
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="animate-slide-up w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl font-bold text-charcoal mb-2">
          {step === 1 ? '创建账号' : '完善信息'}
        </h2>
        <p className="text-stone">
          {step === 1 ? '开启你的高效学习之旅' : '让我们更好地了解你的学习目标'}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-coral' : 'bg-mist/50'}`} />
        <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-coral' : 'bg-mist/50'}`} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {step === 1 ? (
          <>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">昵称</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mist" />
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-mist rounded-xl text-charcoal-800 pl-12
                             focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
                  placeholder="请输入昵称"
                  required
                />
              </div>
            </div>

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
                  placeholder="请输入密码（至少6位）"
                  minLength={6}
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

            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">确认密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mist" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-mist rounded-xl text-charcoal-800 pl-12
                             focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral"
                  placeholder="请再次输入密码"
                  required
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-stone cursor-pointer">
              <input type="checkbox" className="mt-0.5 rounded border-mist text-coral focus:ring-coral" required />
              <span>
                我已阅读并同意服务条款和隐私政策
              </span>
            </label>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-3">你的学习目标是什么？</label>
              <div className="grid grid-cols-2 gap-3">
                {['考研', '考证', '职场进修', '语言学习', '兴趣爱好', '其他'].map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setFormData({ ...formData, studyGoal: goal })}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      formData.studyGoal === goal
                        ? 'border-coral bg-coral/5 text-coral'
                        : 'border-mist/50 text-charcoal hover:border-coral/50'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-sage/10 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                <div className="text-sm text-charcoal-700">
                  <p className="font-medium mb-1">提示</p>
                  <p className="text-stone">
                    设定明确的学习目标有助于我们为你提供更个性化的学习计划和陪伴建议。
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex gap-3">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-warm text-charcoal font-medium rounded-xl
                         transition-all duration-200 hover:bg-coral/10"
            >
              上一步
            </button>
          )}
          <button
            type="submit"
            disabled={register.isPending || (step === 2 && !formData.studyGoal)}
            className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-coral text-white font-medium rounded-xl
                       transition-all duration-200 hover:bg-coral-600 active:scale-95 gap-2
                       disabled:opacity-50 disabled:pointer-events-none"
          >
            {register.isPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {step === 1 ? '下一步' : '完成注册'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-stone">
        已有账号？{' '}
        <button 
          onClick={onLoginClick}
          className="text-coral hover:text-coral-600 font-medium"
        >
          立即登录
        </button>
      </p>
    </div>
  );
}
