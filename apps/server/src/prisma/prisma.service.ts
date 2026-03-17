import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma 服务
 * 封装 PrismaClient 并提供连接生命周期管理
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });

    // 监听查询日志（仅在开发环境）
    if (process.env.NODE_ENV === 'development') {
      // @ts-expect-error - Prisma query event
      this.$on('query', (e: { query: string; params: string; duration: number }) => {
        this.logger.debug(`Query: ${e.query} (${e.duration}ms)`);
      });
    }
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('✅ 数据库连接成功');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('数据库连接已关闭');
  }

  /**
   * 清理软删除数据
   * 可定期调用此方法来物理删除已软删除的数据
   */
  async cleanSoftDeleted(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 清理软删除超过30天的数据
    await this.$transaction([
      this.task.deleteMany({
        where: {
          deletedAt: { lt: thirtyDaysAgo },
        },
      }),
      // 可以添加其他表的清理...
    ]);
  }
}
