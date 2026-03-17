import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '@studyflow/shared';

export class CreateTaskDto {
  @ApiProperty({ description: '任务标题', example: '高等数学 - 极限与连续' })
  @IsString()
  @MinLength(1, { message: '标题不能为空' })
  @MaxLength(200, { message: '标题最多 200 个字符' })
  title: string;

  @ApiPropertyOptional({ description: '任务描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '优先级', enum: ['low', 'medium', 'high'], default: 'medium' })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'], { message: '优先级必须是 low、medium 或 high' })
  priority?: TaskPriority;

  @ApiPropertyOptional({ description: '截止日期', example: '2026-03-20' })
  @IsOptional()
  @IsDateString({}, { message: '日期格式不正确' })
  dueDate?: string;

  @ApiPropertyOptional({ description: '父任务 ID' })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ description: '任务标题' })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: '标题不能为空' })
  @MaxLength(200, { message: '标题最多 200 个字符' })
  title?: string;

  @ApiPropertyOptional({ description: '任务描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '优先级', enum: ['low', 'medium', 'high'] })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'], { message: '优先级必须是 low、medium 或 high' })
  priority?: TaskPriority;

  @ApiPropertyOptional({ description: '任务状态', enum: ['todo', 'in_progress', 'completed', 'abandoned'] })
  @IsOptional()
  @IsEnum(['todo', 'in_progress', 'completed', 'abandoned'], {
    message: '状态必须是 todo、in_progress、completed 或 abandoned',
  })
  status?: TaskStatus;

  @ApiPropertyOptional({ description: '截止日期', example: '2026-03-20' })
  @IsOptional()
  @IsDateString({}, { message: '日期格式不正确' })
  dueDate?: string;

  @ApiPropertyOptional({ description: '是否今日任务' })
  @IsOptional()
  @IsString()
  isToday?: string;
}

export class TaskQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页数量', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number = 20;

  @ApiPropertyOptional({ description: '状态筛选', enum: ['todo', 'in_progress', 'completed', 'abandoned'] })
  @IsOptional()
  @IsEnum(['todo', 'in_progress', 'completed', 'abandoned'])
  status?: TaskStatus;

  @ApiPropertyOptional({ description: '优先级筛选', enum: ['low', 'medium', 'high'] })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: TaskPriority;

  @ApiPropertyOptional({ description: '关键词搜索' })
  @IsOptional()
  @IsString()
  keyword?: string;
}

class TaskOrderItemDto {
  @ApiProperty({ description: '任务 ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: '排序序号' })
  @IsInt()
  order: number;
}

export class ReorderTasksDto {
  @ApiProperty({ description: '任务排序列表', type: [TaskOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskOrderItemDto)
  taskOrders: TaskOrderItemDto[];
}
