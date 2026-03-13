#!/bin/bash

# StudyFlow Web 部署脚本
# 用法: ./scripts/deploy.sh [user@host] [deploy_path]

set -e

# 默认配置
DEFAULT_USER="root"
DEFAULT_HOST=""
DEFAULT_PATH="/var/www/studyflow-web"

# 解析参数
TARGET=${1:-"${DEFAULT_USER}@${DEFAULT_HOST}"}
DEPLOY_PATH=${2:-"$DEFAULT_PATH"}

if [ -z "$TARGET" ] || [ "$TARGET" = "${DEFAULT_USER}@" ]; then
    echo "❌ 错误: 请提供服务器地址"
    echo "用法: $0 [user@host] [deploy_path]"
    echo "示例: $0 root@192.168.1.100 /var/www/studyflow-web"
    exit 1
fi

echo "🚀 开始部署 StudyFlow Web..."
echo "   目标服务器: $TARGET"
echo "   部署路径: $DEPLOY_PATH"
echo ""

# 检查本地构建
echo "📦 检查构建产物..."
if [ ! -d "apps/web/dist" ]; then
    echo "   未找到构建产物，开始构建..."
    pnpm install --frozen-lockfile
    pnpm --filter "./packages/*" build
    pnpm --filter @studyflow/web build
fi

if [ ! -d "apps/web/dist" ]; then
    echo "❌ 构建失败，请检查错误日志"
    exit 1
fi

echo "   ✅ 构建产物已就绪"
echo ""

# 创建远程目录
echo "📁 创建远程目录..."
ssh "$TARGET" "mkdir -p $DEPLOY_PATH"
echo "   ✅ 目录就绪"
echo ""

# 同步文件
echo "📤 同步文件到服务器..."
rsync -avz --delete \
    --exclude="*.map" \
    apps/web/dist/ \
    "$TARGET:$DEPLOY_PATH/"
echo "   ✅ 文件同步完成"
echo ""

# 检查 Nginx 配置
echo "🔧 检查 Nginx 配置..."
if ssh "$TARGET" "which nginx" > /dev/null 2>&1; then
    echo "   发现 Nginx，检查配置..."
    ssh "$TARGET" "sudo nginx -t" && echo "   ✅ Nginx 配置正常"
    
    # 询问是否重载
    read -p "   是否重载 Nginx? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ssh "$TARGET" "sudo systemctl reload nginx"
        echo "   ✅ Nginx 已重载"
    fi
else
    echo "   ⚠️ 未检测到 Nginx，请手动配置 Web 服务器"
fi

echo ""
echo "🎉 部署完成！"
echo "   网站路径: $DEPLOY_PATH"
