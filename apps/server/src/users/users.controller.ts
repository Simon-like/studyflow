import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, UserPayload } from '../common/decorators/current-user.decorator';
import {
  UpdateProfileDto,
  UpdatePomodoroSettingsDto,
  UpdateSystemSettingsDto,
  ChangePasswordDto,
} from './dto/user.dto';
import {
  UserProfile,
  PomodoroSettings,
  SystemSettings,
  StudyCalendarData,
} from '@studyflow/shared';

/**
 * 用户控制器
 * 处理用户资料、设置相关的接口
 */
@ApiTags('用户')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 获取用户完整资料
   */
  @Get('profile')
  @ApiOperation({ summary: '获取用户完整资料' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getProfile(@CurrentUser('userId') userId: string): Promise<UserProfile> {
    return this.usersService.getUserProfile(userId);
  }

  /**
   * 更新用户资料
   */
  @Put('profile')
  @ApiOperation({ summary: '更新用户资料' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserProfile> {
    return this.usersService.updateProfile(userId, dto);
  }

  /**
   * 获取番茄钟设置
   */
  @Get('settings/pomodoro')
  @ApiOperation({ summary: '获取番茄钟设置' })
  async getPomodoroSettings(
    @CurrentUser('userId') userId: string,
  ): Promise<PomodoroSettings> {
    return this.usersService.getPomodoroSettings(userId);
  }

  /**
   * 更新番茄钟设置
   */
  @Put('settings/pomodoro')
  @ApiOperation({ summary: '更新番茄钟设置' })
  async updatePomodoroSettings(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdatePomodoroSettingsDto,
  ): Promise<PomodoroSettings> {
    return this.usersService.updatePomodoroSettings(userId, dto);
  }

  /**
   * 获取系统设置
   */
  @Get('settings/system')
  @ApiOperation({ summary: '获取系统设置' })
  async getSystemSettings(
    @CurrentUser('userId') userId: string,
  ): Promise<SystemSettings> {
    return this.usersService.getSystemSettings(userId);
  }

  /**
   * 更新系统设置
   */
  @Put('settings/system')
  @ApiOperation({ summary: '更新系统设置' })
  async updateSystemSettings(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateSystemSettingsDto,
  ): Promise<SystemSettings> {
    return this.usersService.updateSystemSettings(userId, dto);
  }

  /**
   * 修改密码
   */
  @Put('password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '修改密码' })
  @ApiResponse({ status: 200, description: '修改成功' })
  @ApiResponse({ status: 400, description: '当前密码错误' })
  async changePassword(
    @CurrentUser('userId') userId: string,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ success: boolean }> {
    await this.usersService.changePassword(userId, dto);
    return { success: true };
  }

  /**
   * 获取学习日历
   */
  @Get('calendar')
  @ApiOperation({ summary: '获取学习日历' })
  async getCalendar(
    @CurrentUser('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<StudyCalendarData[]> {
    return this.usersService.getCalendar(userId, startDate, endDate);
  }

  /**
   * 删除账号
   */
  @Delete('account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除账号（软删除）' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async deleteAccount(
    @CurrentUser('userId') userId: string,
  ): Promise<{ success: boolean }> {
    await this.usersService.deleteAccount(userId);
    return { success: true };
  }
}
