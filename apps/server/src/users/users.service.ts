import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { DateUtil } from '../common/utils/date.util';
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
  UserStats,
  StudyCalendarData,
} from '@studyflow/shared';

/**
 * 用户服务
 * 处理用户资料和设置相关的业务逻辑
 */
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 获取用户完整资料
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      include: {
        userStreak: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const stats = await this.calculateUserStats(userId);

    return {
      id: user.id,
      username: user.username,
      email: user.email || '',
      phone: user.phone || undefined,
      pin: user.pin,
      avatar: user.avatarUrl || undefined,
      nickname: user.nickname || undefined,
      studyGoal: user.studyGoal || undefined,
      tags: ((user.tags as any[]) || []).filter(t => t && t.id && t.name),
      focusDuration: user.focusDuration,
      breakDuration: user.breakDuration,
      shortBreakDuration: user.shortBreakDuration,
      longBreakDuration: user.longBreakDuration,
      autoStartBreak: user.autoStartBreak,
      autoStartPomodoro: user.autoStartPomodoro,
      longBreakInterval: user.longBreakInterval,
      theme: user.theme as 'light' | 'dark' | 'system',
      notificationEnabled: user.notificationEnabled,
      soundEnabled: user.soundEnabled,
      vibrationEnabled: user.vibrationEnabled,
      language: user.language,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      stats,
    };
  }

  /**
   * 更新用户资料
   */
  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UserProfile> {
    // 检查手机号是否已被其他用户使用（手机号唯一）
    if (dto.phone) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          phone: dto.phone,
          NOT: { id: userId },
          deletedAt: null,
        },
      });

      if (existingUser) {
        throw new BadRequestException('手机号已被其他用户使用');
      }
    }

    // 检查邮箱是否已被其他用户使用（邮箱可选，但如果提供则必须唯一）
    if (dto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
          NOT: { id: userId },
          deletedAt: null,
        },
      });

      if (existingUser) {
        throw new BadRequestException('邮箱已被其他用户使用');
      }
    }

    const updateData: Record<string, unknown> = {};

    if (dto.nickname !== undefined) updateData.nickname = dto.nickname;
    if (dto.avatar !== undefined) updateData.avatarUrl = dto.avatar;
    if (dto.studyGoal !== undefined) updateData.studyGoal = dto.studyGoal;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.tags !== undefined) {
      // 过滤无效标签，序列化为纯 JSON 数组，确保 Prisma 正确持久化 JSONB
      updateData.tags = dto.tags
        .filter(t => t && t.id && t.name && t.type)
        .map(t => ({ id: t.id, name: t.name, type: t.type }));
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return this.getUserProfile(userId);
  }

  /**
   * 获取番茄钟设置
   */
  async getPomodoroSettings(userId: string): Promise<PomodoroSettings> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: {
        focusDuration: true,
        breakDuration: true,
        shortBreakDuration: true,
        longBreakDuration: true,
        autoStartBreak: true,
        autoStartPomodoro: true,
        longBreakInterval: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return {
      focusDuration: user.focusDuration,
      breakDuration: user.breakDuration,
      shortBreakDuration: user.shortBreakDuration,
      longBreakDuration: user.longBreakDuration,
      autoStartBreak: user.autoStartBreak,
      autoStartPomodoro: user.autoStartPomodoro,
      longBreakInterval: user.longBreakInterval,
    };
  }

  /**
   * 更新番茄钟设置
   */
  async updatePomodoroSettings(
    userId: string,
    dto: UpdatePomodoroSettingsDto,
  ): Promise<PomodoroSettings> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        focusDuration: dto.focusDuration,
        breakDuration: dto.breakDuration,
        shortBreakDuration: dto.shortBreakDuration ?? dto.breakDuration,
        longBreakDuration: dto.longBreakDuration ?? dto.breakDuration,
        autoStartBreak: dto.autoStartBreak ?? false,
        autoStartPomodoro: dto.autoStartPomodoro ?? false,
        longBreakInterval: dto.longBreakInterval ?? 4,
      },
    });

    return this.getPomodoroSettings(userId);
  }

  /**
   * 获取系统设置
   */
  async getSystemSettings(userId: string): Promise<SystemSettings> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: {
        theme: true,
        notificationEnabled: true,
        soundEnabled: true,
        vibrationEnabled: true,
        language: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return {
      theme: user.theme as 'light' | 'dark' | 'system',
      notificationEnabled: user.notificationEnabled,
      soundEnabled: user.soundEnabled,
      vibrationEnabled: user.vibrationEnabled,
      language: user.language,
    };
  }

  /**
   * 更新系统设置
   */
  async updateSystemSettings(
    userId: string,
    dto: UpdateSystemSettingsDto,
  ): Promise<SystemSettings> {
    const updateData: Record<string, unknown> = {};

    if (dto.theme !== undefined) updateData.theme = dto.theme;
    if (dto.notificationEnabled !== undefined)
      updateData.notificationEnabled = dto.notificationEnabled;
    if (dto.soundEnabled !== undefined) updateData.soundEnabled = dto.soundEnabled;
    if (dto.vibrationEnabled !== undefined)
      updateData.vibrationEnabled = dto.vibrationEnabled;
    if (dto.language !== undefined) updateData.language = dto.language;

    await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return this.getSystemSettings(userId);
  }

  /**
   * 修改密码
   */
  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<void> {
    // 检查两次输入的新密码是否一致
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('两次输入的新密码不一致');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: { passwordHash: true },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 验证当前密码
    const isCurrentPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('当前密码错误');
    }

    // 加密新密码
    const bcryptRounds = Number(this.configService.get('BCRYPT_ROUNDS', '12'));
    const newPasswordHash = await bcrypt.hash(dto.newPassword, bcryptRounds);

    // 更新密码
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });
  }

  /**
   * 获取学习日历
   */
  async getCalendar(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<StudyCalendarData[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 获取日期范围内的每日统计
    const stats = await this.prisma.pomodoroDailyStat.findMany({
      where: {
        userId,
        statDate: {
          gte: start,
          lte: end,
        },
      },
      select: {
        statDate: true,
        completedCount: true,
        totalFocusSeconds: true,
      },
    });

    // 获取每日任务统计
    const taskStats = await this.prisma.taskDailyStat.findMany({
      where: {
        userId,
        statDate: {
          gte: start,
          lte: end,
        },
      },
      select: {
        statDate: true,
        completedCount: true,
      },
    });

    // 创建日期映射
    const statsMap = new Map<string, { pomodoros: number; focusSeconds: number }>(
      stats.map((s) => [
        DateUtil.format(s.statDate, 'YYYY-MM-DD'),
        { pomodoros: s.completedCount, focusSeconds: s.totalFocusSeconds },
      ]),
    );

    const taskStatsMap = new Map<string, number>(
      taskStats.map((s) => [
        DateUtil.format(s.statDate, 'YYYY-MM-DD'),
        s.completedCount,
      ]),
    );

    // 生成完整的日期范围
    const dateRange = DateUtil.getDateRange(startDate, endDate);

    return dateRange.map((date) => {
      const stat = statsMap.get(date) ?? null;
      const taskCount = taskStatsMap.get(date) || 0;

      return {
        date,
        focusMinutes: stat ? Math.floor(stat.focusSeconds / 60) : 0,
        pomodoros: stat?.pomodoros || 0,
        tasks: taskCount,
        hasStudy: !!stat && stat.pomodoros > 0,
      };
    });
  }

  /**
   * 删除账号（软删除）
   */
  async deleteAccount(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        username: `deleted_${userId}_${Date.now()}`, // 释放用户名
        email: null, // 释放邮箱
        phone: null, // 释放手机号
      },
    });
  }

  /**
   * 计算用户统计数据
   */
  private async calculateUserStats(userId: string): Promise<UserStats> {
    const todayDate = DateUtil.localDateAsUTC();

    // 并行查询统计数据
    const [
      pomodoroStats,
      taskStats,
      todayPomodoroStat,
      todayTaskStat,
      streak,
    ] = await Promise.all([
      // 累计番茄统计
      this.prisma.pomodoroRecord.aggregate({
        where: {
          userId,
          status: 'completed',
        },
        _sum: {
          actualDuration: true,
        },
        _count: {
          id: true,
        },
      }),
      // 累计任务统计
      this.prisma.task.aggregate({
        where: {
          userId,
          deletedAt: null,
        },
        _count: {
          id: true,
        },
      }),
      // 今日番茄统计
      this.prisma.pomodoroDailyStat.findUnique({
        where: {
          userId_statDate: {
            userId,
            statDate: todayDate,
          },
        },
      }),
      // 今日任务统计
      this.prisma.taskDailyStat.findUnique({
        where: {
          userId_statDate: {
            userId,
            statDate: todayDate,
          },
        },
      }),
      // 连续学习记录
      this.prisma.userStreak.findUnique({
        where: { userId },
      }),
    ]);

    // 计算已完成任务数
    const completedTasksCount = await this.prisma.task.count({
      where: {
        userId,
        status: 'completed',
        deletedAt: null,
      },
    });

    // 计算有学习记录的天数
    const studyDays = await this.prisma.pomodoroDailyStat.count({
      where: {
        userId,
        completedCount: { gt: 0 },
      },
    });

    const totalFocusMinutes = Math.floor(
      (pomodoroStats._sum.actualDuration || 0) / 60,
    );

    return {
      totalFocusMinutes,
      totalPomodoros: pomodoroStats._count.id,
      totalTasks: taskStats._count.id,
      completedTasks: completedTasksCount,
      currentStreak: streak?.currentStreak || 0,
      longestStreak: streak?.longestStreak || 0,
      studyDays,
      todayFocusMinutes: todayPomodoroStat
        ? Math.floor(todayPomodoroStat.totalFocusSeconds / 60)
        : 0,
      todayPomodoros: todayPomodoroStat?.completedCount || 0,
      todayTasks: todayTaskStat?.completedCount || 0,
    };
  }
}
