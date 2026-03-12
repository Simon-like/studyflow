/**
 * Auth 页面 hooks
 */

import { useState, useCallback } from 'react';
import { api } from '@studyflow/api';
import { authValidators } from '@studyflow/shared';
import { Alert } from 'react-native';

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
      account: authValidators.account(account),
      password: authValidators.loginPassword(password),
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
      name: authValidators.name(name),
      account: authValidators.account(account),
      password: authValidators.password(password),
      confirmPassword: authValidators.confirmPassword(confirmPassword, password),
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

// 重新导出校验器供外部使用
export { authValidators };
