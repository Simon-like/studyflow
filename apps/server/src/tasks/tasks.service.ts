import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DateUtil } from '../common/utils/date.util';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskQueryDto,
} from './dto/task.dto';
import {
  Task,
  PaginatedData,
  TaskProgress,
  TaskOrderItem,
} from '@studyflow/shared';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async getTasks(userId: string, query: TaskQueryDto): Promise<PaginatedData<Task>> {
    const { page = 1, size = 20, status, priority, keyword } = query;
    const skip = (page - 1) * size;

    const where = {
      userId,
      deletedAt: null,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(keyword && {
        title: { contains: keyword, mode: 'insensitive' as const },
      }),
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        orderBy: [
          { displayOrder: 'asc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: size,
        include: {
          subtasks: {
            where: { deletedAt: null },
            orderBy: { displayOrder: 'asc' },
          },
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      list: tasks.map(this.mapToTask),
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  async getTodayTasks(userId: string): Promise<Task[]> {
    const todayStart = DateUtil.startOfDay(new Date());
    const todayEnd = DateUtil.endOfDay(new Date());

    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        deletedAt: null,
        OR: [
          { isToday: true },
          { status: 'in_progress' },
          {
            status: 'todo',
            createdAt: { gte: todayStart, lte: todayEnd },
          },
        ],
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        subtasks: {
          where: { deletedAt: null },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    return tasks.map(this.mapToTask);
  }

  async getTaskById(userId: string, taskId: string): Promise<Task> {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
        deletedAt: null,
      },
      include: {
        subtasks: {
          where: { deletedAt: null },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('任务不存在');
    }

    return this.mapToTask(task);
  }

  async createTask(userId: string, dto: CreateTaskDto): Promise<Task> {
    // 获取当前最大排序号
    const maxOrder = await this.prisma.task.findFirst({
      where: { userId, deletedAt: null },
      orderBy: { displayOrder: 'desc' },
      select: { displayOrder: true },
    });

    const task = await this.prisma.task.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        priority: dto.priority || 'medium',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        parentId: dto.parentId || null,
        displayOrder: (maxOrder?.displayOrder || 0) + 1,
      },
      include: {
        subtasks: true,
      },
    });

    // 更新今日任务统计
    await this.updateTaskDailyStats(userId, 'create');

    return this.mapToTask(task);
  }

  async updateTask(
    userId: string,
    taskId: string,
    dto: UpdateTaskDto,
  ): Promise<Task> {
    const existingTask = await this.prisma.task.findFirst({
      where: { id: taskId, userId, deletedAt: null },
    });

    if (!existingTask) {
      throw new NotFoundException('任务不存在');
    }

    const wasCompleted = existingTask.status === 'completed';
    const willBeCompleted = dto.status === 'completed';

    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        status: dto.status,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        completedAt: willBeCompleted && !wasCompleted ? new Date() : undefined,
      },
      include: {
        subtasks: {
          where: { deletedAt: null },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    // 如果任务完成，更新统计
    if (willBeCompleted && !wasCompleted) {
      await this.updateTaskDailyStats(userId, 'complete');
    }

    return this.mapToTask(task);
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId, deletedAt: null },
    });

    if (!task) {
      throw new NotFoundException('任务不存在');
    }

    // 软删除
    await this.prisma.task.update({
      where: { id: taskId },
      data: { deletedAt: new Date() },
    });
  }

  async toggleTaskStatus(userId: string, taskId: string): Promise<Task> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId, deletedAt: null },
    });

    if (!task) {
      throw new NotFoundException('任务不存在');
    }

    const newStatus = task.status === 'completed' ? 'todo' : 'completed';

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date() : null,
      },
      include: {
        subtasks: {
          where: { deletedAt: null },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    // 更新统计：完成加1，恢复减1
    if (newStatus === 'completed') {
      await this.updateTaskDailyStats(userId, 'complete');
    } else if (task.status === 'completed') {
      await this.updateTaskDailyStats(userId, 'uncomplete');
    }

    return this.mapToTask(updatedTask);
  }

  async startTask(userId: string, taskId: string): Promise<Task> {
    // 先将其他进行中的任务改为待办
    await this.prisma.task.updateMany({
      where: {
        userId,
        status: 'in_progress',
        deletedAt: null,
      },
      data: { status: 'todo' },
    });

    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId, deletedAt: null },
    });

    if (!task) {
      throw new NotFoundException('任务不存在');
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: { status: 'in_progress' },
      include: {
        subtasks: {
          where: { deletedAt: null },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    return this.mapToTask(updatedTask);
  }

  async reorderTasks(
    userId: string,
    taskOrders: TaskOrderItem[],
  ): Promise<void> {
    await this.prisma.$transaction(
      taskOrders.map((item) =>
        this.prisma.task.updateMany({
          where: { id: item.id, userId },
          data: { displayOrder: item.order },
        }),
      ),
    );
  }

  async getTaskProgress(userId: string, period: string): Promise<TaskProgress> {
    const today = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = DateUtil.startOfDay(today);
        break;
      case 'week':
        startDate = DateUtil.startOfWeek(today);
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        startDate = DateUtil.startOfWeek(today);
    }

    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        deletedAt: null,
        createdAt: { gte: startDate },
      },
      select: {
        status: true,
      },
    });

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const todo = tasks.filter((t) => t.status === 'todo').length;

    return {
      total,
      completed,
      inProgress,
      todo,
      completionRate: total > 0 ? Math.round((completed / total) * 100 * 10) / 10 : 0,
      byCategory: [],
    };
  }

  private async updateTaskDailyStats(
    userId: string,
    action: 'create' | 'complete' | 'uncomplete',
  ): Promise<void> {
    const todayDate = DateUtil.localDateAsUTC();

    const existingStat = await this.prisma.taskDailyStat.findUnique({
      where: {
        userId_statDate: {
          userId,
          statDate: todayDate,
        },
      },
    });

    if (existingStat) {
      const data =
        action === 'create'
          ? { createdCount: { increment: 1 } }
          : action === 'complete'
          ? { completedCount: { increment: 1 } }
          : { completedCount: { decrement: 1 } };

      await this.prisma.taskDailyStat.update({
        where: { id: existingStat.id },
        data,
      });
    } else if (action !== 'uncomplete') {
      await this.prisma.taskDailyStat.create({
        data: {
          userId,
          statDate: todayDate,
          ...(action === 'create'
            ? { createdCount: 1, completedCount: 0 }
            : { createdCount: 0, completedCount: 1 }),
        },
      });
    }
  }

  private mapToTask = (prismaTask: any): Task => {
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
      subtasks: prismaTask.subtasks?.map(this.mapToTask),
      order: prismaTask.displayOrder,
      createdAt: prismaTask.createdAt.toISOString(),
      updatedAt: prismaTask.updatedAt.toISOString(),
    };
  };
}
