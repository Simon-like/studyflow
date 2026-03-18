import { Module, Global } from '@nestjs/common';
import { OSSService } from './services/oss.service';

/**
 * 通用模块
 * 提供全局可用的通用服务
 */
@Global()
@Module({
  providers: [OSSService],
  exports: [OSSService],
})
export class CommonModule {}
