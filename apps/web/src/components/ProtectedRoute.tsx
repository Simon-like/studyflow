import { Navigate } from 'react-router-dom';
import { useAuthStore, selectAuthLoading, selectIsAuthenticated } from '@studyflow/features-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isLoading = useAuthStore(selectAuthLoading);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}
