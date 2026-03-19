import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@studyflow/api';
import { storage, STORAGE_KEYS } from '@studyflow/shared';

interface FieldErrors {
  phone?: string;
  password?: string;
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5 sm:space-y-2">
      <label className="text-sm text-stone font-medium">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  );
}

/**
 * 验证手机号格式
 */
function validatePhone(phone: string): string | undefined {
  if (!phone) return '请输入手机号';
  if (!/^1[3-9]\d{9}$/.test(phone)) return '手机号格式不正确';
  return undefined;
}

/**
 * 验证密码
 */
function validatePassword(password: string): string | undefined {
  if (!password) return '请输入密码';
  if (password.length < 6) return '密码至少需要 6 个字符';
  return undefined;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setAuthenticated } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const runValidation = useCallback(() => {
    const e: FieldErrors = {
      phone: validatePhone(phone),
      password: validatePassword(password),
    };
    setErrors(e);
    return !e.phone && !e.password;
  }, [phone, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!runValidation()) return;

    setIsLoading(true);
    try {
      const res = await api.auth.login({ phone, password });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = res.data as any;
      // 保存 JWT tokens
      if (data?.accessToken) {
        storage.set(STORAGE_KEYS.TOKEN, data.accessToken);
      }
      if (data?.refreshToken) {
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
      }
      if (data?.user) {
        setUser(data.user);
      }
      setAuthenticated(true);
      navigate('/dashboard');
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      toast.error(error?.response?.data?.message || '登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = 'w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-warm rounded-xl text-charcoal placeholder-mist focus:outline-none focus:ring-2 focus:ring-coral/40 border-[1.5px] text-sm sm:text-base';
  const inputNormal = `${inputBase} border-transparent`;
  const inputErr = `${inputBase} border-red-400`;

  return (
    <>
      <h2 className="font-display text-xl sm:text-2xl font-bold text-charcoal mb-1 sm:mb-2">欢迎回来</h2>
      <p className="text-stone text-sm sm:text-base mb-6 sm:mb-8">登录开始今天的学习之旅</p>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 flex flex-col gap-4" noValidate>
        <FormField label="手机号" error={errors.phone}>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={errors.phone ? inputErr : inputNormal}
            placeholder="请输入手机号"
            maxLength={11}
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
          className="w-full bg-coral text-white font-semibold py-2.5 sm:py-3 rounded-xl shadow-lg hover:bg-coral-600 transition-colors disabled:opacity-50 text-sm sm:text-base mt-2"
        >
          {isLoading ? '登录中...' : '登录'}
        </button>
      </form>

      <p className="text-center text-stone text-sm mt-6 sm:mt-8">
        还没有账号？
        <Link to="/auth/register" className="text-coral font-semibold cursor-pointer hover:underline">立即注册</Link>
      </p>
    </>
  );
}
