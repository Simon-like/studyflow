/**
 * Auth 页面 hooks
 */

import { useState, useCallback } from 'react';
import { api } from '@studyflow/api';
import { Alert } from 'react-native';

// 表单校验规则
const VALIDATORS = {
  name: (v: string) => {
    if (!v.trim()) return '请输入姓名';
    if (v.trim().length < 2) return '姓名至少2个字符';
    if (v.trim().length > 20) return '姓名不能超过20个字符';
    return '';
  },
  account: (v: string) => {
    if (!v.trim()) return '请输入手机号或邮箱';
    const isPhone = /^1[3-9]\d{9}$/.test(v.trim());
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    if (!isPhone && !isEmail) return '请输入有效的手机号或邮箱';
    return '';
  },
  password: (v: string) => {
    if (!v) return '请输入密码';
    if (v.length < 6) return '密码至少6位';
    if (v.length > 32) return '密码不能超过32位';
    if (!/[a-zA-Z]/.test(v) || !/\d/.test(v)) return '密码需包含字母和数字';
    return '';
  },
  confirmPassword: (v: string, password: string) => {
    if (!v) return '请确认密码';
    if (v !== password) return '两次密码不一致';
    return '';
  },
};

interface FieldErrors {
  name?: string;
  account?: string;
  password?: string;
  confirmPassword?: string;
}

export function useLoginForm(onSuccess: () => void) {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = useCallback(() => {
    const e: FieldErrors = {
      account: VALIDATORS.account(account),
      password: password ? '' : '请输入密码',
    };
    setErrors(e);
    return !e.account && !e.password;
  }, [account, password]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await api.auth.login({ username: account, password });
      onSuccess();
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      const msg = error?.response?.data?.message || '登录失败，请重试';
      Alert.alert('登录失败', msg);
    } finally {
      setIsLoading(false);
    }
  }, [validate, account, password, onSuccess]);

  return {
    account, setAccount,
    password, setPassword,
    isLoading,
    errors,
    setErrors,
    handleSubmit,
  };
}

export function useRegisterForm(onSuccess: () => void) {
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = useCallback(() => {
    const e: FieldErrors = {
      name: VALIDATORS.name(name),
      account: VALIDATORS.account(account),
      password: VALIDATORS.password(password),
      confirmPassword: VALIDATORS.confirmPassword(confirmPassword, password),
    };
    setErrors(e);
    return !e.name && !e.account && !e.password && !e.confirmPassword;
  }, [name, account, password, confirmPassword]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await api.auth.register({ username: account, password, nickname: name });
      onSuccess();
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      const msg = error?.response?.data?.message || '注册失败，请重试';
      Alert.alert('注册失败', msg);
    } finally {
      setIsLoading(false);
    }
  }, [validate, name, account, password, onSuccess]);

  return {
    name, setName,
    account, setAccount,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    isLoading,
    errors,
    setErrors,
    handleSubmit,
  };
}

// 导出校验器供外部使用
export { VALIDATORS };
