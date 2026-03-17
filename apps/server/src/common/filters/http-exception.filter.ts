import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '@studyflow/shared';

/**
 * 全局 HTTP 异常过滤器
 * 统一处理所有异常并返回标准化响应格式
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    let data: unknown = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = status;
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as { message?: string | string[]; error?: string };
        message = Array.isArray(res.message) ? res.message[0] : (res.message || res.error || '请求错误');
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // 记录错误日志
    this.logger.error(
      `${request.method} ${request.url} - ${status}: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const errorResponse: ApiResponse<unknown> = {
      code,
      message,
      data,
      timestamp: Date.now(),
    };

    response.status(status).json(errorResponse);
  }
}
