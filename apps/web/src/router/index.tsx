import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MainLayout } from '@/components/layout/MainLayout';

// Lazy load pages by module
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('@/modules/dashboard/pages/DashboardPage'));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
);

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: '/auth',
    children: [
      { path: 'login', element: withSuspense(LoginPage) },
      { path: 'register', element: withSuspense(RegisterPage) },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: withSuspense(DashboardPage) },
    ],
  },
]);
