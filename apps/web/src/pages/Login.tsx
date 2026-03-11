import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@studyflow/shared';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const mockUser: User = {
      id: '1',
      username: form.username || '应东林',
      nickname: form.username || '应东林',
      email: `${form.username || 'user'}@studyflow.com`,
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
      {/* Left: Branding Panel */}
      <div className="flex-1 hidden lg:flex items-center justify-center p-12">
        <div className="max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-coral to-coral-300 rounded-2xl flex items-center justify-center shadow-strong mb-8 animate-float">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="font-display text-4xl font-bold text-charcoal mb-4">StudyFlow</h1>
          <p className="text-xl text-stone mb-10">你的智能学习伙伴，陪伴每一次专注</p>
          <div className="space-y-5 text-stone">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-coral/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>AI 智能规划学习计划</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-sage/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>番茄钟专注管理</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-coral/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>虚拟学伴实时互动</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="w-full lg:w-[420px] bg-white flex items-center justify-center p-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-coral rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold text-charcoal">StudyFlow</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-charcoal mb-1">欢迎回来</h2>
          <p className="text-stone mb-8">登录开始今天的学习之旅</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-stone font-medium">手机号 / 邮箱</label>
              <input
                type="text"
                placeholder="请输入"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full mt-2 px-4 py-3 bg-warm rounded-xl text-charcoal placeholder-mist focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all"
              />
            </div>
            <div>
              <label className="text-sm text-stone font-medium">密码</label>
              <input
                type="password"
                placeholder="请输入密码"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full mt-2 px-4 py-3 bg-warm rounded-xl text-charcoal placeholder-mist focus:outline-none focus:ring-2 focus:ring-coral/40 transition-all"
              />
            </div>
            <div className="flex justify-end">
              <button type="button" className="text-sm text-coral font-medium hover:text-coral-700 transition-colors">
                忘记密码？
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-coral text-white font-semibold py-3.5 rounded-xl shadow-coral hover:bg-coral-600 transition-all duration-200 active:scale-95 disabled:opacity-70"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-mist" />
            <span className="text-stone text-sm">或</span>
            <div className="flex-1 h-px bg-mist" />
          </div>

          <div className="flex justify-center gap-4">
            <button className="w-12 h-12 bg-warm rounded-xl flex items-center justify-center hover:bg-mist/30 transition-all active:scale-95">
              <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.32.32 0 00.186-.063l1.918-1.13a.595.595 0 01.49-.044c.913.258 1.888.398 2.903.398.228 0 .453-.01.676-.027-.193-.619-.297-1.27-.297-1.943 0-3.732 3.554-6.76 7.938-6.76.294 0 .584.016.87.044C16.68 4.822 13.043 2.188 8.691 2.188z" />
              </svg>
            </button>
            <button className="w-12 h-12 bg-warm rounded-xl flex items-center justify-center hover:bg-mist/30 transition-all active:scale-95">
              <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.001 2C6.477 2 2 6.477 2 12.001c0 5.523 4.477 10 10.001 10C17.524 22 22 17.523 22 12.001 22 6.477 17.524 2 12.001 2z" />
              </svg>
            </button>
            <button className="w-12 h-12 bg-warm rounded-xl flex items-center justify-center hover:bg-mist/30 transition-all active:scale-95">
              <svg className="w-6 h-6 text-charcoal" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z" />
              </svg>
            </button>
          </div>

          <p className="text-center text-stone text-sm mt-8">
            还没有账号？{' '}
            <Link to="/auth/register" className="text-coral font-semibold hover:text-coral-700 transition-colors">
              立即注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
