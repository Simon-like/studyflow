import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * 获取当前登录用户的装饰器
 * 用法: @CurrentUser() user: UserPayload
 */
export const CurrentUser = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as UserPayload;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);

/**
 * JWT Token 中的用户信息
 */
export interface UserPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}
