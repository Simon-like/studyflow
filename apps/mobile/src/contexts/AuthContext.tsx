/**
 * 认证上下文
 * 提供 logout 等认证操作给所有子页面
 */

import React, { createContext, useContext } from 'react';

interface AuthContextValue {
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  logout,
}: {
  children: React.ReactNode;
  logout: () => void;
}) {
  return (
    <AuthContext.Provider value={{ logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
