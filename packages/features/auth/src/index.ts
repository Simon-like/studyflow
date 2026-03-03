/**
 * Auth Feature - Public API
 * 
 * 这是 Auth 模块的唯一出口，严格控制暴露范围
 */

// Domain
export type { 
  User, 
  UserPreferences, 
  NotificationSettings,
  LoginCredentials, 
  RegisterData, 
  AuthTokens 
} from './domain/entities/user';
export { UserDomain } from './domain/entities/user';

// Application Hooks
export { useAuthStore, selectUser, selectIsAuthenticated, selectAuthLoading, selectAuthError } from './application/hooks/auth-store';
export { 
  useLogin, 
  useRegister, 
  useLogout, 
  useCurrentUser, 
  useUpdateProfile,
  useCheckAuth 
} from './application/hooks/use-auth';

// Presentation Screens
export { LoginScreen } from './presentation/screens/login-screen';
export { RegisterScreen } from './presentation/screens/register-screen';

// Repository Interface (for testing/mocking)
export type { IAuthRepository } from './domain/repositories/auth-repository.interface';
