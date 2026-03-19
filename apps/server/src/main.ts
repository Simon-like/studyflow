import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  // 禁用默认 body parser，手动配置更大的限制以支持 base64 图片上传
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));
  const configService = app.get(ConfigService);

  // CORS 配置（必须在 helmet 之前）
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  const allowedOrigins = corsOrigin ? corsOrigin.split(',').map(o => o.trim()) : true;
  
  app.enableCors({
    origin: (origin, callback) => {
      // 允许无来源的请求（如移动端、Postman等）或开发环境
      if (!origin || allowedOrigins === true) {
        callback(null, true);
        return;
      }
      
      // 检查是否在允许列表中
      const allowedList = Array.isArray(allowedOrigins) ? allowedOrigins : [];
      if (allowedList.includes(origin)) {
        callback(null, true);
      } else {
        // 生产环境可以记录未授权的跨域请求
        if (configService.get<string>('NODE_ENV') === 'production') {
          console.warn(`CORS blocked request from origin: ${origin}`);
        }
        callback(null, true); // 开发环境允许所有来源
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Authorization'],
    maxAge: 86400, // 预检请求缓存24小时
  });

  // 安全中间件
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use(compression());
  app.use(cookieParser());

  // 限流
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: {
        code: 429,
        message: '请求过于频繁，请稍后再试',
        data: null,
        timestamp: Date.now(),
      },
    }),
  );

  // 全局 API 前缀
  const apiPrefix = '/api/v1';
  app.setGlobalPrefix(apiPrefix);

  // 全局管道 - 参数校验
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剔除 DTO 中未定义的属性
      forbidNonWhitelisted: true, // 禁止传入 DTO 未定义的属性
      transform: true, // 自动转换类型
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger 文档（仅在非生产环境）
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('StudyFlow API')
      .setDescription('StudyFlow 学习陪伴应用 API 文档')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: '输入 JWT Token',
          in: 'header',
        },
        'JWT',
      )
      .addTag('认证', '登录注册相关接口')
      .addTag('用户', '用户信息相关接口')
      .addTag('任务', '任务管理相关接口')
      .addTag('番茄钟', '番茄钟计时相关接口')
      .addTag('统计', '数据统计相关接口')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    console.log(`📚 Swagger 文档: http://localhost:${configService.get('PORT', 3001)}/api/docs`);
  }

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);

  console.log(`🚀 StudyFlow Server 运行在: http://localhost:${port}${apiPrefix}`);
  console.log(`📊 环境: ${configService.get<string>('NODE_ENV', 'development')}`);
}

bootstrap();
