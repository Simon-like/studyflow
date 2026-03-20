#!/bin/bash
# 后端服务部署脚本 - 部署到阿里云服务器

set -e

echo "🚀 StudyFlow 后端部署脚本"
echo "=============================="

# 配置
SERVER_IP="${1:-your-server-ip}"
SERVER_USER="${2:-root}"
REMOTE_DIR="/opt/studyflow"

if [ "$SERVER_IP" = "your-server-ip" ]; then
  echo "❌ 请提供服务器 IP 地址"
  echo "用法: ./deploy.sh <服务器IP> [用户名]"
  exit 1
fi

echo "📡 目标服务器: $SERVER_USER@$SERVER_IP"

# 1. 本地构建
echo "📦 本地构建..."
cd "$(dirname "$0")"
pnpm install
pnpm run build

# 2. 上传代码
echo "⬆️  上传代码到服务器..."
ssh "$SERVER_USER@$SERVER_IP" "mkdir -p $REMOTE_DIR"
rsync -avz --exclude='node_modules' --exclude='.git' \
  . "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/"

# 3. 服务器端安装和启动
echo "🔧 服务器端安装依赖..."
ssh "$SERVER_USER@$SERVER_IP" << EOF
cd $REMOTE_DIR

# 安装依赖
pnpm install --production

# 生成 Prisma Client
pnpm db:generate

# 执行数据库迁移
pnpm db:migrate:prod || echo "迁移可能已执行过"

# 创建 PM2 配置
cat > ecosystem.config.js << 'PM2EOF'
module.exports = {
  apps: [{
    name: 'studyflow-server',
    script: 'dist/main.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/studyflow/err.log',
    out_file: '/var/log/studyflow/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    restart_delay: 3000,
    autorestart: true
  }]
};
PM2EOF

# 创建日志目录
mkdir -p /var/log/studyflow

# 使用 PM2 启动/重启
if pm2 list | grep -q "studyflow-server"; then
  echo "🔄 重启服务..."
  pm2 reload ecosystem.config.js
else
  echo "🚀 启动服务..."
  pm2 start ecosystem.config.js
fi

pm2 save
EOF

echo "✅ 后端部署完成!"
echo "📡 API 地址: http://$SERVER_IP:3001/api/v1"
echo "📖 文档地址: http://$SERVER_IP:3001/api/docs"
