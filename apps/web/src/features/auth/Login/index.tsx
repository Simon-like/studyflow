import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    await new Promise((r) => setTimeout(r, 1000));
    setAuthenticated(true);
    navigate('/dashboard');
  };

  return (
    <>
      <h2 className="font-display text-xl font-bold text-charcoal mb-2">欢迎回来</h2>
      <p className="text-stone text-sm mb-6">登录你的 StudyFlow 账号</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">邮箱</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-warm rounded-xl text-charcoal focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all text-sm"
            placeholder="your@email.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-warm rounded-xl text-charcoal focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all text-sm"
            placeholder="••••••••"
            required
          />
        </div>

        <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
          登录
        </Button>
      </form>

      <p className="text-center text-sm text-stone mt-6">
        还没有账号？{' '}
        <Link to="/auth/register" className="text-coral hover:underline">
          立即注册
        </Link>
      </p>
    </>
  );
}
