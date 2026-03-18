import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Query,
  UseGuards,
  Request,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { OSSService } from '../common/services/oss.service';
import {
  UpdateProfileDto,
  UpdatePomodoroSettingsDto,
  UpdateSystemSettingsDto,
  ChangePasswordDto,
  UploadAvatarDto,
} from './dto/user.dto';

interface RequestWithUser {
  user: {
    userId: string;
    username: string;
  };
}

/**
 * 用户控制器
 * 处理用户资料、设置相关的 HTTP 请求
 */
@ApiTags('用户')
@Controller('/api/v1/users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly ossService: OSSService,
  ) {}

  /**
   * 获取当前用户完整资料
   */
  @Get('profile')
  @ApiOperation({ summary: '获取用户资料' })
  async getProfile(@Request() req: RequestWithUser) {
    const profile = await this.usersService.getUserProfile(req.user.userId);
    return profile;
  }

  /**
   * 更新用户资料
   */
  @Put('profile')
  @ApiOperation({ summary: '更新用户资料' })
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() dto: UpdateProfileDto,
  ) {
    const profile = await this.usersService.updateProfile(req.user.userId, dto);
    return profile;
  }

  /**
   * 上传头像到 OSS
   * 前端将图片转为 Base64 后上传，后端上传到阿里云 OSS
   */
  @Post('avatar')
  @ApiOperation({ summary: '上传头像到 OSS' })
  async uploadAvatar(
    @Request() req: RequestWithUser,
    @Body() dto: UploadAvatarDto,
  ) {
    // 如果 OSS 未配置，使用数据库存储方案
    if (!this.ossService.isAvailable()) {
      // 简单的 Base64 验证
      if (!dto.avatar || !dto.avatar.startsWith('data:image/')) {
        throw new BadRequestException('无效的图片格式，请上传 Base64 编码的图片');
      }

      // 限制图片大小（Base64 字符串长度约 2MB 限制）
      if (dto.avatar.length > 2 * 1024 * 1024 * 1.37) {
        throw new BadRequestException('图片大小不能超过 2MB');
      }

      const profile = await this.usersService.updateProfile(req.user.userId, {
        avatar: dto.avatar,
      });
      return { avatarUrl: profile.avatar };
    }

    // 使用 OSS 上传
    const avatarUrl = await this.ossService.uploadAvatar(req.user.userId, dto.avatar);
    
    // 更新用户资料中的头像 URL
    await this.usersService.updateProfile(req.user.userId, {
      avatar: avatarUrl,
    });

    return { avatarUrl };
  }

  /**
   * 获取番茄钟设置
   */
  @Get('settings/pomodoro')
  @ApiOperation({ summary: '获取番茄钟设置' })
  async getPomodoroSettings(@Request() req: RequestWithUser) {
    return this.usersService.getPomodoroSettings(req.user.userId);
  }

  /**
   * 更新番茄钟设置
   */
  @Put('settings/pomodoro')
  @ApiOperation({ summary: '更新番茄钟设置' })
  async updatePomodoroSettings(
    @Request() req: RequestWithUser,
    @Body() dto: UpdatePomodoroSettingsDto,
  ) {
    return this.usersService.updatePomodoroSettings(req.user.userId, dto);
  }

  /**
   * 获取系统设置
   */
  @Get('settings/system')
  @ApiOperation({ summary: '获取系统设置' })
  async getSystemSettings(@Request() req: RequestWithUser) {
    return this.usersService.getSystemSettings(req.user.userId);
  }

  /**
   * 更新系统设置
   */
  @Put('settings/system')
  @ApiOperation({ summary: '更新系统设置' })
  async updateSystemSettings(
    @Request() req: RequestWithUser,
    @Body() dto: UpdateSystemSettingsDto,
  ) {
    return this.usersService.updateSystemSettings(req.user.userId, dto);
  }

  /**
   * 修改密码
   */
  @Put('password')
  @ApiOperation({ summary: '修改密码' })
  async changePassword(
    @Request() req: RequestWithUser,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(req.user.userId, dto);
    return { success: true };
  }

  /**
   * 获取用户统计
   */
  @Get('stats')
  @ApiOperation({ summary: '获取用户统计' })
  async getUserStats(@Request() req: RequestWithUser) {
    const profile = await this.usersService.getUserProfile(req.user.userId);
    return profile.stats;
  }

  /**
   * 获取学习日历
   */
  @Get('calendar')
  @ApiOperation({ summary: '获取学习日历' })
  async getStudyCalendar(
    @Request() req: RequestWithUser,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.usersService.getCalendar(
      req.user.userId,
      startDate,
      endDate,
    );
  }

  /**
   * 删除账号
   */
  @Delete('account')
  @ApiOperation({ summary: '删除账号' })
  async deleteAccount(@Request() req: RequestWithUser) {
    await this.usersService.deleteAccount(req.user.userId);
    return { success: true };
  }
}
