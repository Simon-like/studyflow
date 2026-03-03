// 导出 screens
export { LoginScreen } from './screens/login-screen';
export { RegisterScreen } from './screens/register-screen';

// 导出 screen 类型
export type { LoginScreenProps } from './screens/login-screen';
export type { RegisterScreenProps } from './screens/register-screen';

// 导出 components
export {
  AuthForm,
  AuthFormContainer,
  AuthFormContent,
  AuthFormHeader,
  AuthFormFooter,
  AuthFormDivider,
  SocialLoginButtons,
  AuthFormBackButton,
} from './components/auth-form';

// 导出 component 类型
export type {
  AuthFormProps,
  AuthFormHeaderProps,
  AuthFormFooterProps,
  AuthFormContainerProps,
  SocialLoginProps,
  AuthFormDividerProps,
} from './components/auth-form';
