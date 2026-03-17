import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  OverviewStats,
  DailyStat,
  SubjectStat,
} from '@studyflow/shared';

@ApiTags('统计')
@Controller('stats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('overview')
  @ApiOperation({ summary: '获取总览统计' })
  async getOverview(
    @CurrentUser('userId') userId: string,
    @Query('period') period: string = 'week',
  ): Promise<OverviewStats> {
    return this.statsService.getOverview(userId, period);
  }

  @Get('daily')
  @ApiOperation({ summary: '获取每日统计数据' })
  async getDailyStats(
    @CurrentUser('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<DailyStat[]> {
    return this.statsService.getDailyStats(userId, startDate, endDate);
  }

  @Get('subjects')
  @ApiOperation({ summary: '获取学科分布统计' })
  async getSubjectStats(
    @CurrentUser('userId') userId: string,
    @Query('period') period: string = 'week',
  ): Promise<SubjectStat[]> {
    return this.statsService.getSubjectStats(userId, period);
  }
}
