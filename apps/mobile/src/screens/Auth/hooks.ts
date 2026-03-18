/**
 * Auth 页面 hooks
 *
 * 表单验证逻辑（与认证逻辑分离）
 * 认证逻辑由 useAuth hook 处理
 */

import { useState, useCallback } from 'react';
import { authValidators, isPhoneNumber } from '@studyflow/shared';

interface LoginErrors {
  phone?: string;
  password?: string;
}

interface RegisterErrors {
  nickname?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

/**
 * 登录表单 hook
 * 仅处理表单状态和验证（仅手机号登录）
 */
export function useLoginForm() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const validate = useCallback(() => {
    const e: LoginErrors = {
      phone: validatePhone(phone),
      password: validatePassword(password),
    };
    setErrors(e);
    return !e.phone && !e.password;
  }, [phone, password]);

  const handleSubmit = useCallback((): boolean => {
    return validate();
  }, [validate]);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    phone, setPhone,
    password, setPassword,
    isLoading,
    setLoading,
    errors,
    setErrors,
    handleSubmit,
  };
}

/**
 * 注册表单 hook
 * 包含：昵称（可选）、手机号、密码、确认密码
 */
export function useRegisterForm() {
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});

  const validate = useCallback(() => {
    const e: RegisterErrors = {
      nickname: validateNickname(nickname),
      phone: validatePhone(phone),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password),
    };
    setErrors(e);
    return !e.nickname && !e.phone && !e.password && !e.confirmPassword;
  }, [nickname, phone, password, confirmPassword]);

  const handleSubmit = useCallback((): boolean => {
    return validate();
  }, [validate]);

  const resetForm = useCallback(() => {
    setNickname('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
  }, []);

  return {
    nickname, setNickname,
    phone, setPhone,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    isLoading, setIsLoading,
    errors, setErrors,
    handleSubmit,
    resetForm,
  };
}

// ——— 本地验证函数 ———

function validateNickname(v: string): string {
  if (!v.trim()) return ''; // 昵称可选
  if (v.length > 50) return '昵称不能超过50个字符';
  return '';
}

function validatePhone(v: string): string {
  if (!v.trim()) return '请输入手机号';
  if (!isPhoneNumber(v)) return '请输入正确的手机号（1开头11位）';
  return '';
}

function validatePassword(v: string): string {
  if (!v.trim()) return '请输入密码';
  if (v.length < 6) return '密码至少需要6个字符';
  return '';
}

function validateConfirmPassword(confirm: string, password: string): string {
  if (!confirm.trim()) return '请再次输入密码';
  if (confirm !== password) return '两次输入的密码不一致';
  return '';
}

// 重新导出校验器供外部使用
export { authValidators };
