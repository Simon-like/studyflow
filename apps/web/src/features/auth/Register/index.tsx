import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@studyflow/api';
import { authValidators, storage, STORAGE_KEYS } from '@studyflow/shared';

interface FieldErrors {
  name?: string;
  account?: string;
  password?: string;
  confirmPassword?: string;
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

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser, setAuthenticated } = useAuthStore();
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const runValidation = useCallback(() => {
    const e: FieldErrors = {
      name: authValidators.name(name),
      account: authValidators.account(account),
      password: authValidators.password(password),
      confirmPassword: authValidators.confirmPassword(confirmPassword, password),
    };
    setErrors(e);
    return !e.name && !e.account && !e.password && !e.confirmPassword;
  }, [name, account, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!runValidation()) return;

    setIsLoading(true);
    try {
      const res = await api.auth.register({
        username: account,
        password,
        nickname: name,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = res.data as any;
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
      toast.error(error?.response?.data?.message || '注册失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = 'w-full mt-2 px-4 py-3 bg-warm rounded-xl text-charcoal placeholder-mist focus:outline-none focus:ring-2 focus:ring-coral/40 border-[1.5px]';
  const inputNormal = `${inputBase} border-transparent`;
  const inputError = `${inputBase} border-red-400`;

  return (
    <>
      <h2 className="font-display text-2xl font-bold text-charcoal mb-2">创建账号</h2>
      <p className="text-stone mb-8">开启你的高效学习之旅</p>

      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-4" noValidate>
        <FormField label="姓名" error={errors.name}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? inputError : inputNormal}
            placeholder="你的姓名"
          />
        </FormField>
        <FormField label="手机号/邮箱" error={errors.account}>
          <input
            type="text"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className={errors.account ? inputError : inputNormal}
            placeholder="请输入"
          />
        </FormField>
        <FormField label="密码" error={errors.password}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? inputError : inputNormal}
            placeholder="至少6位，包含字母和数字"
          />
        </FormField>
        <FormField label="确认密码" error={errors.confirmPassword}>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? inputError : inputNormal}
            placeholder="请再次输入密码"
          />
        </FormField>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-coral text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-coral-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? '注册中...' : '注册'}
        </button>
      </form>

      <p className="text-xs text-stone text-center mt-4">
        注册即表示同意<span className="text-coral cursor-pointer">《服务条款》</span>和<span className="text-coral cursor-pointer">《隐私政策》</span>
      </p>

      <p className="text-center text-stone text-sm mt-6">
        已有账号？
        <Link to="/auth/login" className="text-coral font-semibold cursor-pointer">立即登录</Link>
      </p>
    </>
  );
}
