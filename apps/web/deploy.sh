#!/bin/bash
# Web 端部署脚本 - 部署到阿里云服务器

set -e

echo "🚀 StudyFlow Web 端部署脚本"
echo "=============================="

# 配置
SERVER_IP="${1:-your-server-ip}"
SERVER_USER="${2:-root}"
REMOTE_DIR="/opt/studyflow-web"
NGINX_CONF="/etc/nginx/conf.d/studyflow-web.conf"

if [ "$SERVER_IP" = "your-server-ip" ]; then
  echo "❌ 请提供服务器 IP 地址"
  echo "用法: ./deploy.sh <服务器IP> [用户名]"
  exit 1
fi

echo "📡 目标服务器: $SERVER_USER@$SERVER_IP"

# 1. 构建项目
echo "📦 构建项目..."
pnpm install
pnpm build

# 2. 创建远程目录
echo "📁 创建远程目录..."
ssh "$SERVER_USER@$SERVER_IP" "mkdir -p $REMOTE_DIR"

# 3. 上传文件
echo "⬆️  上传文件..."
rsync -avz --delete dist/ "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/"

# 4. 配置 Nginx
echo "🔧 配置 Nginx..."
ssh "$SERVER_USER@$SERVER_IP" "cat > $NGINX_CONF" << 'EOF'
server {
    listen 80;
    server_name _;  # 替换为你的域名

    root /opt/studyflow-web;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 前端路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理到后端
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# 5. 测试并重载 Nginx
echo "🔄 重载 Nginx..."
ssh "$SERVER_USER@$SERVER_IP" "nginx -t && systemctl reload nginx"

echo "✅ Web 端部署完成!"
echo "🌐 访问地址: http://$SERVER_IP"
