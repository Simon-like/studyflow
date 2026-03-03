import type { User, LoginCredentials, RegisterData, AuthTokens } from '../entities/user';

/**
 * 认证仓库接口
 * 定义认证相关的数据访问契约
 */
export interface IAuthRepository {
  /**
   * 用户登录
   */
  login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }>;

  /**
   * 用户注册
   */
  register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }>;

  /**
   * 刷新令牌
   */
  refreshTokens(refreshToken: string): Promise<AuthTokens>;

  /**
   * 登出
   */
  logout(refreshToken: string): Promise<void>;

  /**
   * 获取当前用户信息
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * 更新用户信息
   */
  updateProfile(userId: string, data: Partial<User>): Promise<User>;

  /**
   * 上传头像
   */
  uploadAvatar(userId: string, file: File): Promise<string>;

  /**
   * 修改密码
   */
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;

  /**
   * 发送重置密码邮件
   */
  sendPasswordResetEmail(email: string): Promise<void>;
}
