import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { TokenResponse, UserProfile, LoginRequest } from '@studyflow/shared';

/**
 * 认证服务
 * 处理登录注册逻辑、JWT 令牌管理
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
   */
  async login(dto: LoginDto): Promise<TokenResponse & { user: UserProfile }> {
    // 查找用户（支持用户名/邮箱/手机号登录）
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: dto.username },
          { email: dto.username },
          { phone: dto.username },
        ],
        deletedAt: null,
      },
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
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
   */
  async register(dto: RegisterDto): Promise<TokenResponse & { user: UserProfile }> {
    // 检查用户名是否已存在
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: dto.username },
          ...(dto.email ? [{ email: dto.email }] : []),
          ...(dto.phone ? [{ phone: dto.phone }] : []),
        ],
        deletedAt: null,
      },
    });

    if (existingUser) {
      if (existingUser.username === dto.username) {
        throw new ConflictException('用户名已存在');
      }
      if (dto.email && existingUser.email === dto.email) {
        throw new ConflictException('邮箱已被注册');
      }
      if (dto.phone && existingUser.phone === dto.phone) {
        throw new ConflictException('手机号已被注册');
      }
    }

    // 加密密码
    const bcryptRounds = this.configService.get<number>('BCRYPT_ROUNDS', 12);
    const passwordHash = await bcrypt.hash(dto.password, bcryptRounds);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        passwordHash,
        nickname: dto.nickname || dto.username,
        email: dto.email,
        phone: dto.phone,
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
