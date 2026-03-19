import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@studyflow/api';
import { storage, STORAGE_KEYS } from '@studyflow/shared';

interface FieldErrors {
  nickname?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
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
 * 验证昵称
 */
function validateNickname(nickname: string): string | undefined {
  if (!nickname) return undefined; // 昵称可选
  if (nickname.length > 50) return '昵称最多 50 个字符';
  return undefined;
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

/**
 * 验证确认密码
 */
function validateConfirmPassword(confirmPassword: string, password: string): string | undefined {
  if (!confirmPassword) return '请再次输入密码';
  if (confirmPassword !== password) return '两次输入的密码不一致';
  return undefined;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setUser, setAuthenticated } = useAuthStore();
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const runValidation = useCallback(() => {
    const e: FieldErrors = {
      nickname: validateNickname(nickname),
      phone: validatePhone(phone),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password),
    };
    setErrors(e);
    return !e.nickname && !e.phone && !e.password && !e.confirmPassword;
  }, [nickname, phone, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!runValidation()) return;

    setIsLoading(true);
    try {
      const res = await api.auth.register({
        phone,
        password,
        nickname: nickname || undefined,
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
        // 显示注册成功信息，包含自动生成的账号和 PIN
        const { username, pin } = data.user;
        toast.success(
          <div>
            <p>注册成功！</p>
            <p className="text-sm mt-1">您的账号: <strong>{username}</strong></p>
            <p className="text-sm">您的 PIN: <strong>{pin}</strong></p>
            <p className="text-xs mt-1 text-gray-300">请牢记您的账号和 PIN</p>
          </div>,
          { duration: 6000 }
        );
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

  const inputBase = 'w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-warm rounded-xl text-charcoal placeholder-mist focus:outline-none focus:ring-2 focus:ring-coral/40 border-[1.5px] text-sm sm:text-base';
  const inputNormal = `${inputBase} border-transparent`;
  const inputError = `${inputBase} border-red-400`;

  return (
    <>
      <h2 className="font-display text-xl sm:text-2xl font-bold text-charcoal mb-1 sm:mb-2">创建账号</h2>
      <p className="text-stone text-sm sm:text-base mb-6 sm:mb-8">开启你的高效学习之旅</p>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 flex flex-col gap-4" noValidate>
        <FormField label="昵称" error={errors.nickname}>
          <input
            type="text"
            name="nickname"
            autoComplete="off"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={errors.nickname ? inputError : inputNormal}
            placeholder="设置一个昵称"
          />
        </FormField>
        <FormField label="手机号" error={errors.phone}>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={errors.phone ? inputError : inputNormal}
            placeholder="请输入手机号"
            maxLength={11}
          />
        </FormField>
        <FormField label="密码" error={errors.password}>
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? inputError : inputNormal}
            placeholder="至少6位"
          />
        </FormField>
        <FormField label="确认密码" error={errors.confirmPassword}>
          <input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? inputError : inputNormal}
            placeholder="请再次输入密码"
          />
        </FormField>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-coral text-white font-semibold py-2.5 sm:py-3 rounded-xl shadow-lg hover:bg-coral-600 transition-colors disabled:opacity-50 text-sm sm:text-base mt-2"
        >
          {isLoading ? '注册中...' : '注册'}
        </button>
      </form>

      <p className="text-xs text-stone text-center mt-3 sm:mt-4 px-2">
        注册即表示同意<span className="text-coral cursor-pointer hover:underline">《服务条款》</span>和<span className="text-coral cursor-pointer hover:underline">《隐私政策》</span>
      </p>

      <p className="text-center text-stone text-sm mt-4 sm:mt-6">
        已有账号？
        <Link to="/auth/login" className="text-coral font-semibold cursor-pointer hover:underline">立即登录</Link>
      </p>
    </>
  );
}
