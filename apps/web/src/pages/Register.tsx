import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@studyflow/shared';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('两次密码不一致');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const mockUser: User = {
      id: '1',
      username: form.username,
      nickname: form.username,
      email: form.email || `${form.username}@studyflow.com`,
      focusDuration: 25 * 60,
      shortBreakDuration: 5 * 60,
      longBreakDuration: 15 * 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUser(mockUser);
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-warm to-cream flex">
      {/* Left: Branding */}
      <div className="flex-1 hidden lg:flex items-center justify-center p-12">
        <div className="max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-coral to-coral-300 rounded-2xl flex items-center justify-center shadow-strong mb-8 animate-float">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="font-display text-4xl font-bold text-charcoal mb-4">StudyFlow</h1>
          <p className="text-xl text-stone mb-10">开始你的智能学习之旅</p>
          <div className="space-y-5 text-stone">
            {[
              { label: '个性化学习计划，AI 智能定制', color: 'coral' },
              { label: '实时专注数据追踪分析', color: 'sage' },
              { label: '虚拟学伴鼓励陪伴进步', color: 'coral' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full bg-${item.color} flex-shrink-0`} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Register Form */}
      <div className="w-full lg:w-[460px] bg-white flex items-center justify-center p-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-coral rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold text-charcoal">StudyFlow</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-charcoal mb-1">创建账号</h2>
          <p className="text-stone mb-8">加入 StudyFlow，开启高效学习</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-stone font-medium">用户名</label>
              <input
                type="text"
                placeholder="请输入用户名"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full mt-2 px-4 py-3 bg-warm rounded-xl text-charcoal placeholder-mist focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all"
              />
            </div>
            <div>
              <label className="text-sm text-stone font-medium">邮箱（选填）</label>
              <input
                type="email"
                placeholder="请输入邮箱"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full mt-2 px-4 py-3 bg-warm rounded-xl text-charcoal placeholder-mist focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all"
              />
            </div>
            <div>
              <label className="text-sm text-stone font-medium">密码</label>
              <input
                type="password"
                placeholder="请输入密码（至少6位）"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full mt-2 px-4 py-3 bg-warm rounded-xl text-charcoal placeholder-mist focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all"
              />
            </div>
            <div>
              <label className="text-sm text-stone font-medium">确认密码</label>
              <input
                type="password"
                placeholder="请再次输入密码"
                required
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="w-full mt-2 px-4 py-3 bg-warm rounded-xl text-charcoal placeholder-mist focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-coral text-white font-semibold py-3.5 rounded-xl shadow-coral hover:bg-coral-600 transition-all duration-200 active:scale-95 disabled:opacity-70 mt-2"
            >
              {loading ? '注册中...' : '立即注册'}
            </button>
          </form>

          <p className="text-center text-stone text-sm mt-8">
            已有账号？{' '}
            <Link to="/auth/login" className="text-coral font-semibold hover:text-coral-700 transition-colors">
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
