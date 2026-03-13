/**
 * Auth 模块入口
 * 管理登录/注册页面切换
 * 
 * 集成双 Token 认证：
 * - 登录成功后自动保存 token
 * - 使用 AuthContext 管理状态
 */

import React, { useState } from 'react';
import { LoginScreen } from './LoginScreen';
import { RegisterScreen } from './RegisterScreen';
import type { AuthScreen } from './constants';

export default function AuthModule() {
  const [screen, setScreen] = useState<AuthScreen>('login');

  if (screen === 'register') {
    return (
      <RegisterScreen
        onGoLogin={() => setScreen('login')}
      />
    );
  }

  return (
    <LoginScreen
      onGoRegister={() => setScreen('register')}
    />
  );
}
