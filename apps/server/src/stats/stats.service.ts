import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DateUtil } from '../common/utils/date.util';
import {
  OverviewStats,
  DailyStat,
  SubjectStat,
} from '@studyflow/shared';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(userId: string, period: string): Promise<OverviewStats> {
    const { startDate, endDate } = this.getPeriodDates(period);
    const prevPeriodDates = this.getPrevPeriodDates(period);

    // 当前周期统计
    const currentStats = await this.getStatsInRange(userId, startDate, endDate);

    // 上一周期统计（用于对比）
    const prevStats = await this.getStatsInRange(
      userId,
      prevPeriodDates.startDate,
      prevPeriodDates.endDate,
    );

    // 计算对比百分比
    const calculateChange = (current: number, prev: number): string => {
      if (prev === 0) return current > 0 ? '+100%' : '0%';
      const change = ((current - prev) / prev) * 100;
      const sign = change >= 0 ? '+' : '';
      return `${sign}${Math.round(change * 10) / 10}%`;
    };

    const streak = await this.prisma.userStreak.findUnique({
      where: { userId },
    });

    return {
      focusMinutes: currentStats.focusMinutes,
      completedPomodoros: currentStats.pomodoros,
      completedTasks: currentStats.tasks,
      streakDays: streak?.currentStreak || 0,
      compareLastPeriod: {
        focusMinutes: calculateChange(currentStats.focusMinutes, prevStats.focusMinutes),
        pomodoros: calculateChange(currentStats.pomodoros, prevStats.pomodoros),
        tasks: calculateChange(currentStats.tasks, prevStats.tasks),
      },
    };
  }

  async getDailyStats(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<DailyStat[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const pomodoroStats = await this.prisma.pomodoroDailyStat.findMany({
      where: {
        userId,
        statDate: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { statDate: 'asc' },
    });

    const taskStats = await this.prisma.taskDailyStat.findMany({
      where: {
        userId,
        statDate: {
          gte: start,
          lte: end,
        },
      },
    });

    // 创建映射
    const pomodoroMap = new Map<string, { pomodoros: number; focusSeconds: number }>(
      pomodoroStats.map((s) => [
        DateUtil.format(s.statDate, 'YYYY-MM-DD'),
        { pomodoros: s.completedCount, focusSeconds: s.totalFocusSeconds },
      ]),
    );

    const taskMap = new Map<string, number>(
      taskStats.map((s) => [
        DateUtil.format(s.statDate, 'YYYY-MM-DD'),
        s.completedCount,
      ]),
    );

    // 生成完整日期范围
    const dateRange = DateUtil.getDateRange(startDate, endDate);

    return dateRange.map((date) => {
      const pomodoro = pomodoroMap.get(date) ?? null;
      const tasks = taskMap.get(date) || 0;

      return {
        date,
        focusMinutes: pomodoro ? Math.floor(pomodoro.focusSeconds / 60) : 0,
        pomodoros: pomodoro?.pomodoros || 0,
        tasks,
      };
    });
  }

  async getSubjectStats(
    userId: string,
    period: string,
  ): Promise<SubjectStat[]> {
    const { startDate, endDate } = this.getPeriodDates(period);

    // 获取番茄钟记录并按分类统计
    const records = await this.prisma.pomodoroRecord.findMany({
      where: {
        userId,
        status: 'completed',
        endTime: {
          gte: startDate,
          lte: endDate,
        },
        task: {
          category: { not: null },
        },
      },
      include: {
        task: {
          select: { category: true },
        },
      },
    });

    // 按分类聚合
    const categoryMap = new Map<string, number>();
    let totalFocusSeconds = 0;

    records.forEach((record) => {
      if (record.task?.category) {
        const category = record.task.category;
        const current = categoryMap.get(category) || 0;
        categoryMap.set(category, current + (record.actualDuration || 0));
        totalFocusSeconds += record.actualDuration || 0;
      }
    });

    // 转换为数组并计算百分比
    const result: SubjectStat[] = Array.from(categoryMap.entries()).map(
      ([category, focusSeconds]) => ({
        category,
        focusMinutes: Math.floor(focusSeconds / 60),
        percentage:
          totalFocusSeconds > 0
            ? Math.round((focusSeconds / totalFocusSeconds) * 100 * 10) / 10
            : 0,
      }),
    );

    // 按专注时长降序排序
    return result.sort((a, b) => b.focusMinutes - a.focusMinutes);
  }

  private getPeriodDates(period: string): { startDate: Date; endDate: Date } {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = DateUtil.startOfDay(new Date());
        break;
      case 'week':
        startDate = DateUtil.startOfWeek(new Date());
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        startDate = DateUtil.startOfWeek(new Date());
    }

    return { startDate, endDate: today };
  }

  private getPrevPeriodDates(period: string): { startDate: Date; endDate: Date } {
    const today = new Date();

    switch (period) {
      case 'today':
        return {
          startDate: new Date(today.getTime() - 24 * 60 * 60 * 1000),
          endDate: today,
        };
      case 'week':
        return {
          startDate: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
          endDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        };
      case 'month':
        const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return { startDate: prevMonth, endDate: thisMonth };
      case 'year':
        const prevYear = new Date(today.getFullYear() - 1, 0, 1);
        const thisYear = new Date(today.getFullYear(), 0, 1);
        return { startDate: prevYear, endDate: thisYear };
      default:
        return {
          startDate: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
          endDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        };
    }
  }

  private async getStatsInRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{ focusMinutes: number; pomodoros: number; tasks: number }> {
    const [pomodoroStats, taskStats] = await Promise.all([
      this.prisma.pomodoroRecord.aggregate({
        where: {
          userId,
          status: 'completed',
          endTime: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: {
          actualDuration: true,
        },
        _count: {
          id: true,
        },
      }),
      this.prisma.task.count({
        where: {
          userId,
          status: 'completed',
          completedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
    ]);

    return {
      focusMinutes: Math.floor((pomodoroStats._sum.actualDuration || 0) / 60),
      pomodoros: pomodoroStats._count.id,
      tasks: taskStats,
    };
  }
}
