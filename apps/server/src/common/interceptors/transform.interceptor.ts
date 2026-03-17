import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '@studyflow/shared';

/**
 * 全局响应转换拦截器
 * 将所有成功响应转换为统一格式 { code, message, data, timestamp }
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        code: 200,
        message: 'success',
        data: data ?? null,
        timestamp: Date.now(),
      })),
    );
  }
}
