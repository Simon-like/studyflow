import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { api, TEST_ACCOUNT } from '@studyflow/api';
import { authValidators } from '@studyflow/shared';

interface FieldErrors {
  account?: string;
  password?: string;
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-stone font-medium">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setAuthenticated } = useAuthStore();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');

  const runValidation = useCallback(() => {
    const e: FieldErrors = {
      account: authValidators.account(account),
      password: authValidators.loginPassword(password),
    };
    setErrors(e);
    return !e.account && !e.password;
  }, [account, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    if (!runValidation()) return;

    setIsLoading(true);
    try {
      const res = await api.auth.login({ username: account, password });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = res.data as any;
      if (data?.user) {
        setUser(data.user);
      }
      setAuthenticated(true);
      navigate('/dashboard');
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      setServerError(error?.response?.data?.message || '登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = 'w-full mt-2 px-4 py-3 bg-warm rounded-xl text-charcoal placeholder-mist focus:outline-none focus:ring-2 focus:ring-coral/40 border-[1.5px]';
  const inputNormal = `${inputBase} border-transparent`;
  const inputErr = `${inputBase} border-red-400`;

  return (
    <>
      <h2 className="font-display text-2xl font-bold text-charcoal mb-2">欢迎回来</h2>
      <p className="text-stone mb-8">登录开始今天的学习之旅</p>

      {/* 测试账号提示 */}
      <div className="bg-sage/10 text-charcoal text-xs rounded-xl px-4 py-3 mb-6 leading-relaxed">
        <span className="font-semibold text-sage">测试账号：</span>
        {TEST_ACCOUNT.username} / {TEST_ACCOUNT.password}
      </div>

      {serverError && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-4" noValidate>
        <FormField label="手机号/邮箱" error={errors.account}>
          <input
            type="text"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className={errors.account ? inputErr : inputNormal}
            placeholder="请输入"
          />
        </FormField>
        <FormField label="密码" error={errors.password}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? inputErr : inputNormal}
            placeholder="请输入密码"
          />
        </FormField>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-coral text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-coral-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? '登录中...' : '登录'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-mist" />
          <span className="text-stone text-sm">或</span>
          <div className="flex-1 h-px bg-mist" />
        </div>

        {/* Social Login */}
        <div className="flex justify-center gap-4">
          <button type="button" className="w-12 h-12 bg-warm rounded-xl flex items-center justify-center hover:bg-mist/30 transition-colors">
            <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.32.32 0 00.186-.063l1.918-1.13a.595.595 0 01.49-.044c.913.258 1.888.398 2.903.398.228 0 .453-.01.676-.027-.193-.619-.297-1.27-.297-1.943 0-3.732 3.554-6.76 7.938-6.76.294 0 .584.016.87.044C16.68 4.822 13.043 2.188 8.691 2.188z" />
            </svg>
          </button>
          <button type="button" className="w-12 h-12 bg-warm rounded-xl flex items-center justify-center hover:bg-mist/30 transition-colors">
            <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.001 2C6.477 2 2 6.477 2 12.001c0 5.523 4.477 10 10.001 10C17.524 22 22 17.523 22 12.001 22 6.477 17.524 2 12.001 2z" />
            </svg>
          </button>
          <button type="button" className="w-12 h-12 bg-warm rounded-xl flex items-center justify-center hover:bg-mist/30 transition-colors">
            <svg className="w-6 h-6 text-charcoal" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z" />
            </svg>
          </button>
        </div>
      </form>

      <p className="text-center text-stone text-sm mt-8">
        还没有账号？
        <Link to="/auth/register" className="text-coral font-semibold cursor-pointer">立即注册</Link>
      </p>
    </>
  );
}
