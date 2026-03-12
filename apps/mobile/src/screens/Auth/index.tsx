/**
 * Auth 模块入口
 * 管理登录/注册页面切换
 */

import React, { useState } from 'react';
import { LoginScreen } from './LoginScreen';
import { RegisterScreen } from './RegisterScreen';
import type { AuthScreen } from './constants';

interface AuthModuleProps {
  onAuthSuccess: () => void;
}

export default function AuthModule({ onAuthSuccess }: AuthModuleProps) {
  const [screen, setScreen] = useState<AuthScreen>('login');

  if (screen === 'register') {
    return (
      <RegisterScreen
        onRegister={onAuthSuccess}
        onGoLogin={() => setScreen('login')}
      />
    );
  }

  return (
    <LoginScreen
      onLogin={onAuthSuccess}
      onGoRegister={() => setScreen('register')}
    />
  );
}
