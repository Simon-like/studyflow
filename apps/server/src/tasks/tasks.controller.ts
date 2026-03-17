import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskQueryDto,
  ReorderTasksDto,
} from './dto/task.dto';
import {
  Task,
  PaginatedData,
  TaskProgress,
  TaskOrderItem,
} from '@studyflow/shared';

@ApiTags('任务')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: '获取任务列表' })
  async getTasks(
    @CurrentUser('userId') userId: string,
    @Query() query: TaskQueryDto,
  ): Promise<PaginatedData<Task>> {
    return this.tasksService.getTasks(userId, query);
  }

  @Get('today')
  @ApiOperation({ summary: '获取今日任务' })
  async getTodayTasks(@CurrentUser('userId') userId: string): Promise<Task[]> {
    return this.tasksService.getTodayTasks(userId);
  }

  @Get('progress')
  @ApiOperation({ summary: '获取任务进度统计' })
  async getTaskProgress(
    @CurrentUser('userId') userId: string,
    @Query('period') period: string = 'week',
  ): Promise<TaskProgress> {
    return this.tasksService.getTaskProgress(userId, period);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取任务详情' })
  async getTaskById(
    @CurrentUser('userId') userId: string,
    @Param('id') taskId: string,
  ): Promise<Task> {
    return this.tasksService.getTaskById(userId, taskId);
  }

  @Post()
  @ApiOperation({ summary: '创建任务' })
  async createTask(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.createTask(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新任务' })
  async updateTask(
    @CurrentUser('userId') userId: string,
    @Param('id') taskId: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(userId, taskId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除任务' })
  async deleteTask(
    @CurrentUser('userId') userId: string,
    @Param('id') taskId: string,
  ): Promise<{ success: boolean }> {
    await this.tasksService.deleteTask(userId, taskId);
    return { success: true };
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: '切换任务状态' })
  async toggleTaskStatus(
    @CurrentUser('userId') userId: string,
    @Param('id') taskId: string,
  ): Promise<Task> {
    return this.tasksService.toggleTaskStatus(userId, taskId);
  }

  @Post(':id/start')
  @ApiOperation({ summary: '开始任务' })
  async startTask(
    @CurrentUser('userId') userId: string,
    @Param('id') taskId: string,
  ): Promise<Task> {
    return this.tasksService.startTask(userId, taskId);
  }

  @Post('reorder')
  @ApiOperation({ summary: '批量更新任务排序' })
  async reorderTasks(
    @CurrentUser('userId') userId: string,
    @Body() dto: ReorderTasksDto,
  ): Promise<{ success: boolean }> {
    await this.tasksService.reorderTasks(userId, dto.taskOrders);
    return { success: true };
  }
}
