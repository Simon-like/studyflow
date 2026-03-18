import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DateUtil } from '../common/utils/date.util';
import {
  StartPomodoroDto,
  StopPomodoroDto,
} from './dto/pomodoro.dto';
import {
  PomodoroRecord,
  PomodoroSettlement,
  TodayStats,
  PaginatedData,
  DailyStat,
  Task,
} from '@studyflow/shared';

@Injectable()
export class PomodoroService {
  constructor(private readonly prisma: PrismaService) {}

  async startPomodoro(
    userId: string,
    dto: StartPomodoroDto,
  ): Promise<PomodoroRecord> {
    // 自动清理超时的 running 记录（超过计划时长 2 倍视为过期）
    await this.cleanupStalePomodoros(userId);

    // 检查是否有进行中的番茄钟
    const runningPomodoro = await this.prisma.pomodoroRecord.findFirst({
      where: {
        userId,
        status: 'running',
      },
    });

    if (runningPomodoro) {
      throw new ConflictException('已有进行中的番茄钟，请先结束它');
    }

    // 如果有关联任务，检查任务是否存在
    if (dto.taskId) {
      const task = await this.prisma.task.findFirst({
        where: {
          id: dto.taskId,
          userId,
          deletedAt: null,
        },
      });

      if (!task) {
        throw new NotFoundException('关联任务不存在');
      }
    }

    const pomodoro = await this.prisma.pomodoroRecord.create({
      data: {
        userId,
        taskId: dto.taskId || null,
        plannedDuration: dto.duration,
        isLocked: dto.isLocked || false,
        status: 'running',
      },
      include: {
        task: true,
      },
    });

    return this.mapToPomodoroRecord(pomodoro);
  }

  async stopPomodoro(
    userId: string,
    pomodoroId: string,
    dto: StopPomodoroDto,
  ): Promise<PomodoroSettlement> {
    const pomodoro = await this.prisma.pomodoroRecord.findFirst({
      where: {
        id: pomodoroId,
        userId,
        status: 'running',
      },
      include: {
        task: true,
      },
    });

    if (!pomodoro) {
      throw new NotFoundException('未找到进行中的番茄钟');
    }

    const now = new Date();
    const actualDuration = Math.floor(
      (now.getTime() - pomodoro.startTime.getTime()) / 1000,
    );

    // 更新番茄钟记录
    const updatedPomodoro = await this.prisma.pomodoroRecord.update({
      where: { id: pomodoroId },
      data: {
        status: dto.status,
        endTime: now,
        actualDuration,
        abandonReason: dto.abandonReason || null,
      },
      include: {
        task: true,
      },
    });

    let updatedTask: Task | null = null;

    // 如果番茄钟完成，更新任务和统计
    if (dto.status === 'completed') {
      // 更新关联任务
      if (pomodoro.taskId) {
        const task = await this.prisma.task.update({
          where: { id: pomodoro.taskId },
          data: {
            status: 'in_progress',
          },
        });
        updatedTask = this.mapToTask(task);
      }

      // 更新每日统计
      await this.updatePomodoroStats(userId, actualDuration, pomodoro.taskId);

      // 更新连续学习天数
      await this.updateUserStreak(userId);
    }

    // 获取今日统计
    const todayStats = await this.getTodayStats(userId);

    return {
      record: this.mapToPomodoroRecord(updatedPomodoro),
      task: updatedTask,
      todayStats,
    };
  }

  async getHistory(
    userId: string,
    page: number = 1,
    size: number = 20,
  ): Promise<PaginatedData<PomodoroRecord>> {
    const skip = (page - 1) * size;

    const [records, total] = await Promise.all([
      this.prisma.pomodoroRecord.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: size,
        include: {
          task: true,
        },
      }),
      this.prisma.pomodoroRecord.count({ where: { userId } }),
    ]);

    return {
      list: records.map(this.mapToPomodoroRecord),
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  async getActivePomodoro(userId: string): Promise<PomodoroRecord | null> {
    await this.cleanupStalePomodoros(userId);

    const running = await this.prisma.pomodoroRecord.findFirst({
      where: { userId, status: 'running' },
      include: { task: true },
    });

    return running ? this.mapToPomodoroRecord(running) : null;
  }

  async getTodayStats(userId: string): Promise<TodayStats> {
    const todayDate = DateUtil.localDateAsUTC();

    const stats = await this.prisma.pomodoroDailyStat.findUnique({
      where: {
        userId_statDate: {
          userId,
          statDate: todayDate,
        },
      },
    });

    const streak = await this.prisma.userStreak.findUnique({
      where: { userId },
    });

    const todayCompletedTasks = await this.prisma.task.count({
      where: {
        userId,
        status: 'completed',
        completedAt: {
          gte: DateUtil.startOfDay(new Date()),
          lte: DateUtil.endOfDay(new Date()),
        },
      },
    });

    return {
      focusMinutes: stats && stats.totalFocusSeconds > 0
        ? Math.max(1, Math.round(stats.totalFocusSeconds / 60))
        : 0,
      completedPomodoros: stats?.completedCount || 0,
      completedTasks: todayCompletedTasks,
      streakDays: streak?.currentStreak || 0,
    };
  }

  async getWeeklyStats(userId: string): Promise<{ dailyStats: DailyStat[] }> {
    const today = new Date();
    // @db.Date 字段需要 UTC 午夜，避免时区偏移
    const startOfWeek = DateUtil.localDateAsUTC(DateUtil.startOfWeek(today));
    const endOfWeek = DateUtil.localDateAsUTC(DateUtil.endOfWeek(today));

    const stats = await this.prisma.pomodoroDailyStat.findMany({
      where: {
        userId,
        statDate: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      orderBy: { statDate: 'asc' },
    });

    const taskStats = await this.prisma.taskDailyStat.findMany({
      where: {
        userId,
        statDate: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
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

    // 生成完整的一周数据
    const dateRange = DateUtil.getDateRange(
      DateUtil.format(startOfWeek, 'YYYY-MM-DD'),
      DateUtil.format(endOfWeek, 'YYYY-MM-DD'),
    );

    const dailyStats: DailyStat[] = dateRange.map((date) => {
      const stat = statsMap.get(date) ?? null;
      const taskCount = taskStatsMap.get(date) || 0;

      return {
        date,
        focusMinutes: stat ? Math.floor(stat.focusSeconds / 60) : 0,
        pomodoros: stat?.pomodoros || 0,
        tasks: taskCount,
      };
    });

    return { dailyStats };
  }

  private async updatePomodoroStats(
    userId: string,
    focusSeconds: number,
    taskId?: string,
  ): Promise<void> {
    const todayDate = DateUtil.localDateAsUTC();

    const existingStat = await this.prisma.pomodoroDailyStat.findUnique({
      where: {
        userId_statDate: {
          userId,
          statDate: todayDate,
        },
      },
    });

    if (existingStat) {
      await this.prisma.pomodoroDailyStat.update({
        where: { id: existingStat.id },
        data: {
          completedCount: { increment: 1 },
          totalFocusSeconds: { increment: focusSeconds },
          ...(taskId ? { relatedTaskCount: { increment: 1 } } : {}),
        },
      });
    } else {
      await this.prisma.pomodoroDailyStat.create({
        data: {
          userId,
          statDate: todayDate,
          completedCount: 1,
          totalFocusSeconds: focusSeconds,
          relatedTaskCount: taskId ? 1 : 0,
        },
      });
    }
  }

  private async updateUserStreak(userId: string): Promise<void> {
    const todayDate = DateUtil.localDateAsUTC();

    const streak = await this.prisma.userStreak.findUnique({
      where: { userId },
    });

    if (!streak) {
      // 创建新的连续记录
      await this.prisma.userStreak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastStudyDate: todayDate,
          streakStartDate: todayDate,
        },
      });
      return;
    }

    // 如果今天已经学习过，不重复计算
    if (
      streak.lastStudyDate &&
      DateUtil.isToday(streak.lastStudyDate)
    ) {
      return;
    }

    // 判断是否是连续学习（lastStudyDate 是前一天 → 连续）
    const isConsecutive =
      streak.lastStudyDate &&
      DateUtil.isConsecutive(streak.lastStudyDate, todayDate);

    const newCurrentStreak = isConsecutive
      ? streak.currentStreak + 1
      : 1;

    await this.prisma.userStreak.update({
      where: { userId },
      data: {
        currentStreak: newCurrentStreak,
        longestStreak: Math.max(streak.longestStreak, newCurrentStreak),
        lastStudyDate: todayDate,
        ...(isConsecutive ? {} : { streakStartDate: todayDate }),
      },
    });
  }

  /**
   * 清理超时的 running 番茄钟
   * 如果 running 记录已经超过计划时长的 2 倍，自动标记为 stopped
   */
  private async cleanupStalePomodoros(userId: string): Promise<void> {
    const staleRecords = await this.prisma.pomodoroRecord.findMany({
      where: {
        userId,
        status: 'running',
      },
    });

    const now = new Date();
    for (const record of staleRecords) {
      const elapsed = (now.getTime() - record.startTime.getTime()) / 1000;
      // 超过计划时长 2 倍视为过期（至少 30 分钟）
      const threshold = Math.max(record.plannedDuration * 2, 1800);
      if (elapsed > threshold) {
        await this.prisma.pomodoroRecord.update({
          where: { id: record.id },
          data: {
            status: 'stopped',
            endTime: new Date(record.startTime.getTime() + record.plannedDuration * 1000),
            actualDuration: record.plannedDuration,
            abandonReason: 'auto_cleanup_stale',
          },
        });
      }
    }
  }

  private mapToPomodoroRecord(prismaRecord: any): PomodoroRecord {
    return {
      id: prismaRecord.id,
      userId: prismaRecord.userId,
      taskId: prismaRecord.taskId || undefined,
      task: prismaRecord.task ? this.mapToTask(prismaRecord.task) : undefined,
      startTime: prismaRecord.startTime.toISOString(),
      endTime: prismaRecord.endTime?.toISOString(),
      duration: prismaRecord.plannedDuration,
      actualDuration: prismaRecord.actualDuration || undefined,
      status: prismaRecord.status,
      isLocked: prismaRecord.isLocked,
      abandonReason: prismaRecord.abandonReason || undefined,
    };
  }

  private mapToTask(prismaTask: any): Task {
    return {
      id: prismaTask.id,
      userId: prismaTask.userId,
      title: prismaTask.title,
      description: prismaTask.description || undefined,
      priority: prismaTask.priority,
      status: prismaTask.status,
      dueDate: prismaTask.dueDate
        ? prismaTask.dueDate.toISOString().split('T')[0]
        : undefined,
      parentId: prismaTask.parentId || undefined,
      order: prismaTask.displayOrder,
      createdAt: prismaTask.createdAt.toISOString(),
      updatedAt: prismaTask.updatedAt.toISOString(),
    };
  }
}
