/**
 * Auth 页面 hooks
 * 
 * 表单验证逻辑（与认证逻辑分离）
 * 认证逻辑由 useAuth hook 处理
 */

import { useState, useCallback } from 'react';
import { authValidators } from '@studyflow/shared';

interface FieldErrors {
  name?: string;
  account?: string;
  password?: string;
  confirmPassword?: string;
}

/**
 * 登录表单 hook
 * 仅处理表单状态和验证
 */
export function useLoginForm() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = useCallback(() => {
    const e: FieldErrors = {
      account: authValidators.account(account),
      password: authValidators.loginPassword(password),
    };
    setErrors(e);
    return !e.account && !e.password;
  }, [account, password]);

  const handleSubmit = useCallback((): boolean => {
    return validate();
  }, [validate]);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    account, setAccount,
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
 */
export function useRegisterForm() {
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = useCallback(() => {
    const e: FieldErrors = {
      name: authValidators.name(name),
      account: authValidators.account(account),
      password: authValidators.password(password),
      confirmPassword: authValidators.confirmPassword(confirmPassword, password),
    };
    setErrors(e);
    return !e.name && !e.account && !e.password && !e.confirmPassword;
  }, [name, account, password, confirmPassword]);

  const handleSubmit = useCallback((): boolean => {
    return validate();
  }, [validate]);

  const resetForm = useCallback(() => {
    setName('');
    setAccount('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
  }, []);

  return {
    name, setName,
    account, setAccount,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    isLoading, setIsLoading,
    errors, setErrors,
    handleSubmit,
    resetForm,
  };
}

// 重新导出校验器供外部使用
export { authValidators };
