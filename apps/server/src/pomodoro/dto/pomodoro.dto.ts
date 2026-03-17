import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartPomodoroDto {
  @ApiPropertyOptional({ description: '关联任务 ID' })
  @IsOptional()
  @IsString()
  taskId?: string;

  @ApiProperty({ description: '计划时长（秒）', example: 1500, minimum: 60, maximum: 3600 })
  @IsInt({ message: '时长必须是整数' })
  @Min(60, { message: '时长至少 60 秒' })
  @Max(3600, { message: '时长最多 3600 秒' })
  duration: number;

  @ApiPropertyOptional({ description: '是否锁屏模式', default: false })
  @IsOptional()
  @IsBoolean()
  isLocked?: boolean;
}

export class StopPomodoroDto {
  @ApiProperty({ description: '结束状态', enum: ['completed', 'stopped'] })
  @IsEnum(['completed', 'stopped'], { message: '状态必须是 completed 或 stopped' })
  status: 'completed' | 'stopped';

  @ApiPropertyOptional({ description: '放弃原因' })
  @IsOptional()
  @IsString()
  abandonReason?: string;
}
