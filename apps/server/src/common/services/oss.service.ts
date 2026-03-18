import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import OSS from 'ali-oss';
import { OSS_CONFIG, validateOSSConfig } from '../../config/oss.config';

/**
 * 阿里云 OSS 服务
 * 处理文件上传、删除等操作
 */
@Injectable()
export class OSSService {
  private client: OSS;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = validateOSSConfig();
    
    if (this.isEnabled) {
      this.client = new OSS({
        region: OSS_CONFIG.region,
        accessKeyId: OSS_CONFIG.accessKeyId,
        accessKeySecret: OSS_CONFIG.accessKeySecret,
        bucket: OSS_CONFIG.bucket,
        // 开启 HTTPS
        secure: true,
        // 设置超时
        timeout: 60000,
      });
      console.log('✅ OSS 服务已初始化');
    } else {
      console.warn('⚠️ OSS 配置不完整，头像上传将使用备用方案');
    }
  }

  /**
   * 检查 OSS 是否可用
   */
  isAvailable(): boolean {
    return this.isEnabled;
  }

  /**
   * 上传头像
   * @param userId 用户ID
   * @param base64Image Base64 编码的图片
   * @returns 图片访问 URL
   */
  async uploadAvatar(userId: string, base64Image: string): Promise<string> {
    if (!this.isEnabled) {
      throw new InternalServerErrorException('OSS 服务未配置');
    }

    // 验证图片格式
    const match = base64Image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      throw new BadRequestException('无效的图片格式');
    }

    const [, mimeType, base64Data] = match;
    
    // 检查图片类型
    if (!OSS_CONFIG.allowedTypes.includes(mimeType)) {
      throw new BadRequestException(`不支持的图片格式: ${mimeType}，仅支持 jpeg、png、gif、webp`);
    }

    // 将 Base64 转为 Buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // 检查图片大小
    if (buffer.length > OSS_CONFIG.maxSize) {
      throw new BadRequestException(`图片大小超过限制，最大 ${OSS_CONFIG.maxSize / 1024 / 1024}MB`);
    }

    // 生成文件扩展名
    const ext = this.getExtensionFromMimeType(mimeType);
    
    // 生成文件名: avatars/{userId}/{timestamp}.ext
    const filename = `${OSS_CONFIG.avatarPrefix}/${userId}/${Date.now()}.${ext}`;

    try {
      // 上传到 OSS
      const result = await this.client.put(filename, buffer, {
        headers: {
          'Content-Type': mimeType,
          // 设置缓存控制
          'Cache-Control': 'public, max-age=31536000',
        },
      });

      // 返回完整的访问 URL
      return result.url;
    } catch (error) {
      console.error('OSS 上传失败:', error);
      throw new InternalServerErrorException('头像上传失败，请稍后重试');
    }
  }

  /**
   * 删除头像
   * @param avatarUrl 头像 URL
   */
  async deleteAvatar(avatarUrl: string): Promise<void> {
    if (!this.isEnabled) return;

    try {
      // 从 URL 中提取文件名
      const url = new URL(avatarUrl);
      const filename = url.pathname.slice(1); // 去掉开头的 /
      
      await this.client.delete(filename);
    } catch (error) {
      console.error('删除 OSS 文件失败:', error);
      // 删除失败不抛出异常，避免影响用户体验
    }
  }

  /**
   * 生成缩略图 URL（通过 OSS 图片处理服务）
   * @param avatarUrl 原图 URL
   * @param size 目标尺寸
   * @returns 处理后的 URL
   */
  getThumbnailUrl(avatarUrl: string, size: number = 200): string {
    if (!avatarUrl || !this.isEnabled) return avatarUrl;
    
    // 添加 OSS 图片处理参数
    const separator = avatarUrl.includes('?') ? '&' : '?';
    return `${avatarUrl}${separator}x-oss-process=image/resize,m_fill,w_${size},h_${size},limit_0`;
  }

  /**
   * 根据 MIME 类型获取文件扩展名
   */
  private getExtensionFromMimeType(mimeType: string): string {
    const map: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };
    return map[mimeType] || 'jpg';
  }
}
