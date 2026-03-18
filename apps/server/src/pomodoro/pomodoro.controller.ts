import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PomodoroService } from './pomodoro.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
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
} from '@studyflow/shared';

@ApiTags('番茄钟')
@Controller('pomodoros')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class PomodoroController {
  constructor(private readonly pomodoroService: PomodoroService) {}

  @Post('start')
  @ApiOperation({ summary: '开始番茄钟' })
  async startPomodoro(
    @CurrentUser('userId') userId: string,
    @Body() dto: StartPomodoroDto,
  ): Promise<PomodoroRecord> {
    return this.pomodoroService.startPomodoro(userId, dto);
  }

  @Get('active')
  @ApiOperation({ summary: '获取当前进行中的番茄钟' })
  async getActivePomodoro(
    @CurrentUser('userId') userId: string,
  ): Promise<PomodoroRecord | null> {
    return this.pomodoroService.getActivePomodoro(userId);
  }

  @Post(':id/stop')
  @ApiOperation({ summary: '停止番茄钟' })
  async stopPomodoro(
    @CurrentUser('userId') userId: string,
    @Param('id') pomodoroId: string,
    @Body() dto: StopPomodoroDto,
  ): Promise<PomodoroSettlement> {
    return this.pomodoroService.stopPomodoro(userId, pomodoroId, dto);
  }

  @Get('history')
  @ApiOperation({ summary: '获取番茄钟历史' })
  async getHistory(
    @CurrentUser('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = 20,
  ): Promise<PaginatedData<PomodoroRecord>> {
    return this.pomodoroService.getHistory(userId, page, size);
  }

  @Get('stats/today')
  @ApiOperation({ summary: '获取今日统计' })
  async getTodayStats(
    @CurrentUser('userId') userId: string,
  ): Promise<TodayStats> {
    return this.pomodoroService.getTodayStats(userId);
  }

  @Get('stats/weekly')
  @ApiOperation({ summary: '获取周统计' })
  async getWeeklyStats(
    @CurrentUser('userId') userId: string,
  ): Promise<{ dailyStats: DailyStat[] }> {
    return this.pomodoroService.getWeeklyStats(userId);
  }
}
