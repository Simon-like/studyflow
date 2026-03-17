import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 登录请求 DTO
 */
export class LoginDto {
  @ApiProperty({ description: '用户名/邮箱/手机号', example: 'testuser' })
  @IsString({ message: '用户名必须是字符串' })
  @MinLength(3, { message: '用户名至少需要 3 个字符' })
  @MaxLength(50, { message: '用户名最多 50 个字符' })
  username: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码至少需要 6 个字符' })
  password: string;
}

/**
 * 注册请求 DTO
 */
export class RegisterDto {
  @ApiProperty({ description: '用户名', example: 'newuser' })
  @IsString({ message: '用户名必须是字符串' })
  @MinLength(3, { message: '用户名至少需要 3 个字符' })
  @MaxLength(50, { message: '用户名最多 50 个字符' })
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: '用户名只能包含字母、数字、下划线和横线' })
  username: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码至少需要 6 个字符' })
  @MaxLength(100, { message: '密码最多 100 个字符' })
  password: string;

  @ApiPropertyOptional({ description: '昵称', example: '小明' })
  @IsOptional()
  @IsString({ message: '昵称必须是字符串' })
  @MaxLength(50, { message: '昵称最多 50 个字符' })
  nickname?: string;

  @ApiPropertyOptional({ description: '邮箱', example: 'user@example.com' })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @ApiPropertyOptional({ description: '手机号', example: '13800138000' })
  @IsOptional()
  @IsString({ message: '手机号必须是字符串' })
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone?: string;
}

/**
 * 刷新令牌请求 DTO
 */
export class RefreshTokenDto {
  @ApiProperty({ description: '刷新令牌', example: 'eyJhbGciOiJIUzI1NiIs...' })
  @IsString({ message: '刷新令牌必须是字符串' })
  refreshToken: string;
}
