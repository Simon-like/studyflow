/**
 * Login Page - 路由层
 * 页面仅负责路由集成，业务逻辑下沉到模块
 */
import { useNavigate } from 'react-router-dom';
import { LoginScreen } from '@studyflow/features-auth';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <LoginScreen
      onRegisterClick={() => navigate('/auth/register')}
      onForgotPasswordClick={() => navigate('/auth/forgot-password')}
      onLoginSuccess={() => navigate('/dashboard')}
    />
  );
}
