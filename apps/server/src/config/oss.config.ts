/**
 * 阿里云 OSS 配置
 */

export const OSS_CONFIG = {
  // OSS 地域（请根据你的 Bucket 所在地域修改）
  // 常见地域：
  // - 华东1(杭州): oss-cn-hangzhou
  // - 华东2(上海): oss-cn-shanghai  
  // - 华北1(青岛): oss-cn-qingdao
  // - 华北2(北京): oss-cn-beijing
  // - 华南1(深圳): oss-cn-shenzhen
  // - 西南1(成都): oss-cn-chengdu
  region: process.env.OSS_REGION || 'oss-cn-chengdu',
  
  // Bucket 名称（请修改为你的 Bucket 名）
  bucket: process.env.OSS_BUCKET || 'simonicole',
  
  // AccessKey ID
  accessKeyId: process.env.OSS_ACCESS_KEY_ID || '',
  
  // AccessKey Secret
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || '',
  
  // 访问域名（如果绑定了自定义域名，可以修改）
  get domain() {
    return `https://${this.bucket}.${this.region}.aliyuncs.com`;
  },
  
  // 头像存储路径前缀
  avatarPrefix: 'avatars',
  
  // 图片上传限制
  maxSize: 2 * 1024 * 1024, // 2MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};

/**
 * 检查 OSS 配置是否完整
 */
export function validateOSSConfig(): boolean {
  return !!(
    OSS_CONFIG.accessKeyId &&
    OSS_CONFIG.accessKeySecret &&
    OSS_CONFIG.bucket &&
    OSS_CONFIG.region
  );
}
