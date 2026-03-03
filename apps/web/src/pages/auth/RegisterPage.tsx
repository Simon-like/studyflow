/**
 * Register Page - 路由层
 */
import { useNavigate } from 'react-router-dom';
import { RegisterScreen } from '@studyflow/features-auth';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <RegisterScreen
      onLoginClick={() => navigate('/auth/login')}
      onRegisterSuccess={() => navigate('/dashboard')}
    />
  );
}
