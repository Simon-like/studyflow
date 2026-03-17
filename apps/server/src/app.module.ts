import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { JwtConfigModule } from './common/jwt-config.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { PomodoroModule } from './pomodoro/pomodoro.module';
import { StatsModule } from './stats/stats.module';
import { HealthController } from './common/health.controller';

/**
 * 应用主模块
 * 导入所有功能模块
 */
@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local', '.env.development'],
    }),
    // 全局 JWT（供 JwtAuthGuard 使用）
    JwtConfigModule,
    // 数据库和缓存
    PrismaModule,
    RedisModule,
    // 业务模块
    AuthModule,
    UsersModule,
    TasksModule,
    PomodoroModule,
    StatsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
