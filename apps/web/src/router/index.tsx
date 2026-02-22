import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingScreen } from '@/components/LoadingScreen';

// 懒加载页面
const LoginPage = lazy(() => import('@/pages/Login'));
const RegisterPage = lazy(() => import('@/pages/Register'));
const DashboardPage = lazy(() => import('@/pages/Dashboard'));
const TasksPage = lazy(() => import('@/pages/Tasks'));
const StatsPage = lazy(() => import('@/pages/Stats'));
const CompanionPage = lazy(() => import('@/pages/Companion'));
const CommunityPage = lazy(() => import('@/pages/Community'));
const ProfilePage = lazy(() => import('@/pages/Profile'));
const SettingsPage = lazy(() => import('@/pages/Settings'));

// 包装组件，添加 Suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
);

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  // 认证路由
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: withSuspense(LoginPage),
      },
      {
        path: 'register',
        element: withSuspense(RegisterPage),
      },
    ],
  },
  // 受保护路由
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: withSuspense(DashboardPage),
      },
      {
        path: 'tasks',
        element: withSuspense(TasksPage),
      },
      {
        path: 'stats',
        element: withSuspense(StatsPage),
      },
      {
        path: 'companion',
        element: withSuspense(CompanionPage),
      },
      {
        path: 'community',
        element: withSuspense(CommunityPage),
      },
      {
        path: 'profile',
        element: withSuspense(ProfilePage),
      },
      {
        path: 'settings',
        element: withSuspense(SettingsPage),
      },
    ],
  },
]);