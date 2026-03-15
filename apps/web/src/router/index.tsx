import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingScreen } from '@/components/LoadingScreen';

// 懒加载页面 - 新的特征模块路径
const LoginPage = lazy(() => import('@/features/auth/Login'));
const RegisterPage = lazy(() => import('@/features/auth/Register'));
const DashboardPage = lazy(() => import('@/features/dashboard'));
const TasksPage = lazy(() => import('@/features/tasks'));
const StatsPage = lazy(() => import('@/features/stats'));
const CompanionPage = lazy(() => import('@/features/companion'));
const CommunityPage = lazy(() => import('@/features/community'));
const ProfilePage = lazy(() => import('@/features/profile'));
const EditProfilePage = lazy(() => import('@/features/profile/EditProfilePage'));

// 保持旧的pages路径作为fallback（可选）
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
        path: 'profile/edit',
        element: withSuspense(EditProfilePage),
      },
      {
        path: 'settings',
        element: withSuspense(SettingsPage),
      },
    ],
  },
]);
