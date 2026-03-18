import {
  IsString,
  IsOptional,
  IsEmail,
  IsInt,
  IsBoolean,
  IsArray,
  Min,
  Max,
  MinLength,
  MaxLength,
  Matches,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 更新用户资料 DTO
 */
export class UpdateProfileDto {
  @ApiPropertyOptional({ description: '昵称', example: '小明' })
  @IsOptional()
  @IsString({ message: '昵称必须是字符串' })
  @MinLength(1, { message: '昵称至少需要 1 个字符' })
  @MaxLength(50, { message: '昵称最多 50 个字符' })
  nickname?: string;

  @ApiPropertyOptional({ description: '头像 URL', example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString({ message: '头像 URL 必须是字符串' })
  @MaxLength(500, { message: '头像 URL 最多 500 个字符' })
  avatar?: string;

  @ApiPropertyOptional({ description: '学习目标/签名', example: '每天进步一点点' })
  @IsOptional()
  @IsString({ message: '学习目标必须是字符串' })
  @MaxLength(200, { message: '学习目标最多 200 个字符' })
  studyGoal?: string;

  @ApiPropertyOptional({ description: '邮箱', example: 'user@example.com' })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  @ApiPropertyOptional({ description: '手机号', example: '13800138000' })
  @IsOptional()
  @IsString({ message: '手机号必须是字符串' })
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone?: string;

  @ApiPropertyOptional({ description: '用户标签 ID 列表', example: ['tag1', 'tag2'] })
  @IsOptional()
  @IsArray({ message: 'tags 必须是数组' })
  @IsString({ each: true, message: 'tags 中每项必须是字符串' })
  tags?: string[];
}

/**
 * 更新番茄钟设置 DTO
 */
export class UpdatePomodoroSettingsDto {
  @ApiProperty({ description: '专注时长（秒）', example: 1500, minimum: 60, maximum: 3600 })
  @IsInt({ message: '专注时长必须是整数' })
  @Min(60, { message: '专注时长至少 60 秒' })
  @Max(3600, { message: '专注时长最多 3600 秒' })
  focusDuration: number;

  @ApiProperty({ description: '休息时长（秒）', example: 300, minimum: 60, maximum: 1800 })
  @IsInt({ message: '休息时长必须是整数' })
  @Min(60, { message: '休息时长至少 60 秒' })
  @Max(1800, { message: '休息时长最多 1800 秒' })
  breakDuration: number;

  @ApiPropertyOptional({ description: '短休息时长（秒）— 兼容旧数据', example: 300 })
  @IsOptional()
  @IsInt({ message: '短休息时长必须是整数' })
  @Min(60, { message: '短休息时长至少 60 秒' })
  @Max(1800, { message: '短休息时长最多 1800 秒' })
  shortBreakDuration?: number;

  @ApiPropertyOptional({ description: '长休息时长（秒）— 兼容旧数据', example: 900 })
  @IsOptional()
  @IsInt({ message: '长休息时长必须是整数' })
  @Min(60, { message: '长休息时长至少 60 秒' })
  @Max(3600, { message: '长休息时长最多 3600 秒' })
  longBreakDuration?: number;

  @ApiPropertyOptional({ description: '是否自动开始休息', example: false })
  @IsOptional()
  @IsBoolean({ message: 'autoStartBreak 必须是布尔值' })
  autoStartBreak?: boolean;

  @ApiPropertyOptional({ description: '是否自动开始下一个番茄', example: false })
  @IsOptional()
  @IsBoolean({ message: 'autoStartPomodoro 必须是布尔值' })
  autoStartPomodoro?: boolean;

  @ApiPropertyOptional({ description: '几个番茄后长休息', example: 4, minimum: 1, maximum: 10 })
  @IsOptional()
  @IsInt({ message: 'longBreakInterval 必须是整数' })
  @Min(1, { message: '至少 1 个番茄后长休息' })
  @Max(10, { message: '最多 10 个番茄后长休息' })
  longBreakInterval?: number;
}

/**
 * 更新系统设置 DTO
 */
export class UpdateSystemSettingsDto {
  @ApiPropertyOptional({ description: '主题', example: 'light', enum: ['light', 'dark', 'system'] })
  @IsOptional()
  @IsIn(['light', 'dark', 'system'], { message: '主题必须是 light、dark 或 system' })
  theme?: 'light' | 'dark' | 'system';

  @ApiPropertyOptional({ description: '是否开启通知', example: true })
  @IsOptional()
  @IsBoolean({ message: 'notificationEnabled 必须是布尔值' })
  notificationEnabled?: boolean;

  @ApiPropertyOptional({ description: '是否开启提示音', example: true })
  @IsOptional()
  @IsBoolean({ message: 'soundEnabled 必须是布尔值' })
  soundEnabled?: boolean;

  @ApiPropertyOptional({ description: '是否开启震动', example: true })
  @IsOptional()
  @IsBoolean({ message: 'vibrationEnabled 必须是布尔值' })
  vibrationEnabled?: boolean;

  @ApiPropertyOptional({ description: '语言设置', example: 'zh-CN' })
  @IsOptional()
  @IsString({ message: '语言必须是字符串' })
  @MaxLength(10, { message: '语言代码最多 10 个字符' })
  language?: string;
}

/**
 * 修改密码 DTO
 */
export class ChangePasswordDto {
  @ApiProperty({ description: '当前密码', example: 'oldpassword123' })
  @IsString({ message: '当前密码必须是字符串' })
  @MinLength(6, { message: '当前密码至少需要 6 个字符' })
  currentPassword: string;

  @ApiProperty({ description: '新密码', example: 'newpassword123' })
  @IsString({ message: '新密码必须是字符串' })
  @MinLength(6, { message: '新密码至少需要 6 个字符' })
  @MaxLength(100, { message: '新密码最多 100 个字符' })
  newPassword: string;

  @ApiProperty({ description: '确认新密码', example: 'newpassword123' })
  @IsString({ message: '确认密码必须是字符串' })
  confirmPassword: string;
}
