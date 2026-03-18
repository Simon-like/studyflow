import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { TokenResponse, UserProfile } from '@studyflow/shared';

/**
 * 生成唯一PIN码（8位数字）
 */
function generatePin(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

/**
 * 生成唯一用户名
 * 格式：user_时间戳后6位_随机数
 */
function generateUsername(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);
  return `user_${timestamp}_${random}`;
}

/**
 * 认证服务
 * 处理登录注册逻辑、JWT 令牌管理
 * 
 * 新流程：
 * - 注册：手机号必填，自动生成账号(username)和PIN，昵称可重复
 * - 登录：仅使用手机号登录
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 用户登录
   * 仅支持手机号登录
   */
  async login(dto: LoginDto): Promise<TokenResponse & { user: UserProfile }> {
    // 查找用户（仅通过手机号）
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException('手机号或密码错误');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('手机号或密码错误');
    }

    // 生成令牌
    const tokens = await this.generateTokens(user.id, user.username);

    // 获取完整用户信息
    const userProfile = await this.usersService.getUserProfile(user.id);

    return {
      ...tokens,
      user: userProfile,
    };
  }

  /**
   * 用户注册
   * - 手机号必填且唯一
   * - 自动生成账号(username)和PIN
   * - 昵称可重复，不传则使用默认昵称
   */
  async register(dto: RegisterDto): Promise<TokenResponse & { user: UserProfile }> {
    // 检查手机号是否已存在
    const existingUser = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (existingUser) {
      throw new ConflictException('该手机号已被注册');
    }

    // 加密密码
    const bcryptRounds = Number(this.configService.get('BCRYPT_ROUNDS', '12'));
    const passwordHash = await bcrypt.hash(dto.password, bcryptRounds);

    // 生成唯一用户名和PIN
    let username = generateUsername();
    let usernameExists = true;
    let attempts = 0;
    
    // 确保用户名唯一
    while (usernameExists && attempts < 10) {
      const existing = await this.prisma.user.findUnique({
        where: { username },
      });
      if (!existing) {
        usernameExists = false;
      } else {
        username = generateUsername();
        attempts++;
      }
    }

    if (usernameExists) {
      throw new ConflictException('无法生成唯一账号，请稍后重试');
    }

    // 生成唯一PIN
    let pin = generatePin();
    let pinExists = true;
    attempts = 0;
    
    while (pinExists && attempts < 10) {
      const existingPin = await this.prisma.user.findUnique({
        where: { pin },
      });
      if (!existingPin) {
        pinExists = false;
      } else {
        pin = generatePin();
        attempts++;
      }
    }

    if (pinExists) {
      throw new ConflictException('无法生成唯一PIN码，请稍后重试');
    }

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        username,
        phone: dto.phone,
        passwordHash,
        pin,
        nickname: dto.nickname || `用户${pin.slice(-4)}`,
      },
    });

    // 初始化用户连续学习记录
    await this.prisma.userStreak.create({
      data: {
        userId: user.id,
      },
    });

    // 生成令牌
    const tokens = await this.generateTokens(user.id, user.username);

    // 获取完整用户信息
    const userProfile = await this.usersService.getUserProfile(user.id);

    return {
      ...tokens,
      user: userProfile,
    };
  }

  /**
   * 刷新访问令牌
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      // 验证刷新令牌
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // 检查刷新令牌是否在黑名单中
      const isBlacklisted = await this.redis.isTokenBlacklisted(refreshToken);
      if (isBlacklisted) {
        throw new UnauthorizedException('刷新令牌已失效');
      }

      // 检查用户是否存在
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId, deletedAt: null },
      });

      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }

      // 生成新的令牌对
      return this.generateTokens(user.id, user.username);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('刷新令牌已过期，请重新登录');
      }
      throw new UnauthorizedException('无效的刷新令牌');
    }
  }

  /**
   * 用户登出 — 不依赖 access token，只需 refresh token
   */
  async logout(refreshToken?: string): Promise<void> {
    if (refreshToken) {
      try {
        // 验证刷新令牌并加入黑名单
        const payload = await this.jwtService.verifyAsync(refreshToken, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });

        // 计算剩余过期时间
        const expSeconds = Math.floor(payload.exp - Date.now() / 1000);
        if (expSeconds > 0) {
          await this.redis.blacklistToken(refreshToken, expSeconds);
        }
      } catch {
        // Token 已过期或无效，忽略错误
      }
    }

    // 可以在这里执行其他登出逻辑，如清除用户缓存等
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(userId: string): Promise<UserProfile> {
    return this.usersService.getUserProfile(userId);
  }

  /**
   * 生成访问令牌和刷新令牌
   */
  private async generateTokens(
    userId: string,
    username: string,
  ): Promise<TokenResponse> {
    const payload = { userId, username };

    const accessExpiration = this.configService.get<string>('JWT_ACCESS_EXPIRATION', '2h');
    const refreshExpiration = this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d');

    // 解析过期时间为秒数
    const accessExpSeconds = this.parseExpirationToSeconds(accessExpiration);
    const refreshExpSeconds = this.parseExpirationToSeconds(refreshExpiration);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: accessExpiration,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: refreshExpiration,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: accessExpSeconds,
    };
  }

  /**
   * 解析过期时间为秒数
   */
  private parseExpirationToSeconds(expiration: string): number {
    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) return 7200; // 默认 2 小时

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    return value * (multipliers[unit] || 3600);
  }
}
