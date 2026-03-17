import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Redis 服务
 * 封装常用的 Redis 操作
 */
@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  /**
   * 获取值
   */
  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  /**
   * 设置值
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.redis.setex(key, ttlSeconds, value);
    } else {
      await this.redis.set(key, value);
    }
  }

  /**
   * 设置 JSON 值
   */
  async setJSON<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const jsonString = JSON.stringify(value);
    await this.set(key, jsonString, ttlSeconds);
  }

  /**
   * 获取 JSON 值
   */
  async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  /**
   * 删除键
   */
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  /**
   * 检查键是否存在
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  /**
   * 设置过期时间
   */
  async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.redis.expire(key, ttlSeconds);
  }

  /**
   * 获取剩余过期时间
   */
  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  // ==================== 黑名单相关 ====================

  /**
   * 将 Token 加入黑名单
   */
  async blacklistToken(token: string, expSeconds: number): Promise<void> {
    const key = `blacklist:${token}`;
    await this.set(key, '1', expSeconds);
  }

  /**
   * 检查 Token 是否在黑名单中
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`;
    return this.exists(key);
  }

  // ==================== 缓存相关 ====================

  /**
   * 生成缓存键
   */
  buildKey(...parts: (string | number)[]): string {
    return parts.join(':');
  }

  /**
   * 清空缓存（按前缀）
   */
  async clearCache(prefix: string): Promise<void> {
    const keys = await this.redis.keys(`${prefix}:*`);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
