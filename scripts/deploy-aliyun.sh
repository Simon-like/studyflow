#!/bin/bash
# StudyFlow 阿里云部署脚本
# 用法: ./scripts/deploy-aliyun.sh <服务器IP> [环境]

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 参数检查
if [ -z "$1" ]; then
    echo -e "${RED}❌ 错误: 请提供服务器的 IP 地址${NC}"
    echo "用法: ./scripts/deploy-aliyun.sh <服务器IP> [prod|staging]"
    exit 1
fi

SERVER_IP=$1
ENV=${2:-prod}
REMOTE_USER="root"
REMOTE_DIR="/opt/studyflow"
LOCAL_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo -e "${BLUE}🚀 StudyFlow 阿里云部署脚本${NC}"
echo "================================"
echo -e "服务器: ${YELLOW}$SERVER_IP${NC}"
echo -e "环境: ${YELLOW}$ENV${NC}"
echo ""

# 检查本地环境
echo -e "${BLUE}📋 检查本地环境...${NC}"

if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ 未找到 pnpm，请先安装: npm install -g pnpm${NC}"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ 未找到 git，请先安装 git${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 本地环境检查通过${NC}"

# 检查生产环境文件
echo ""
echo -e "${BLUE}📋 检查生产环境配置...${NC}"

if [ ! -f "apps/server/.env.production" ]; then
    echo -e "${YELLOW}⚠️  未找到生产环境配置文件${NC}"
    echo "请根据 apps/server/.env.example 创建 apps/server/.env.production"
    echo "必须配置以下变量："
    echo "  - DATABASE_URL (阿里云 RDS 连接地址)"
    echo "  - REDIS_URL (阿里云 Redis 连接地址)"
    echo "  - JWT_SECRET (强密码)"
    echo "  - OSS_ACCESS_KEY_ID"
    echo "  - OSS_ACCESS_KEY_SECRET"
    exit 1
fi

echo -e "${GREEN}✓ 生产环境配置已存在${NC}"

# 本地构建
echo ""
echo -e "${BLUE}🔨 开始本地构建...${NC}"

echo "📦 安装依赖..."
pnpm install

echo "🔄 生成 Prisma Client..."
pnpm db:generate

echo "🔨 构建后端服务..."
pnpm --filter @studyflow/server build

echo -e "${GREEN}✓ 本地构建完成${NC}"

# 部署到服务器
echo ""
echo -e "${BLUE}🚀 部署到服务器...${NC}"

# 检查 SSH 连接
echo "🔌 测试 SSH 连接..."
if ! ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$REMOTE_USER@$SERVER_IP" "echo 'SSH OK'" > /dev/null 2>&1; then
    echo -e "${RED}❌ 无法连接到服务器，请检查:${NC}"
    echo "  1. 服务器 IP 是否正确"
    echo "  2. SSH 密钥是否已配置"
    echo "  3. 服务器是否已开机"
    exit 1
fi

echo -e "${GREEN}✓ SSH 连接正常${NC}"

# 创建远程目录
ssh "$REMOTE_USER@$SERVER_IP" "mkdir -p $REMOTE_DIR"

# 同步代码 (排除不必要的文件)
echo "📤 同步代码到服务器..."
rsync -avz --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.expo' \
    --exclude='dist' \
    --exclude='.env' \
    --exclude='.env.local' \
    --exclude='*.log' \
    --exclude='apps/web' \
    --exclude='apps/mobile' \
    "$LOCAL_DIR/" "$REMOTE_USER@$SERVER_IP:$REMOTE_DIR/"

# 同步生产环境配置
echo "📤 同步生产环境配置..."
scp "apps/server/.env.production" "$REMOTE_USER@$SERVER_IP:$REMOTE_DIR/apps/server/"

# 在服务器上执行部署
echo ""
echo -e "${BLUE}🔧 在服务器上执行部署...${NC}"

ssh "$REMOTE_USER@$SERVER_IP" << EOF
    set -e
    
    cd $REMOTE_DIR
    
    echo "📦 安装服务器端依赖..."
    pnpm install --production
    
    echo "🔄 生成 Prisma Client..."
    cd apps/server
    pnpm db:generate
    
    echo "🔄 执行数据库迁移..."
    pnpm db:migrate:prod
    
    echo "🚀 启动/重启服务..."
    cd $REMOTE_DIR
    
    # 检查 PM2 是否安装
    if ! command -v pm2 &> /dev/null; then
        npm install -g pm2
    fi
    
    # 检查服务是否已运行
    if pm2 list | grep -q "studyflow-server"; then
        pm2 reload ecosystem.config.js --env production
    else
        # 首次部署，创建 PM2 配置
        cat > ecosystem.config.js << 'PM2CONFIG'
module.exports = {
  apps: [{
    name: 'studyflow-server',
    cwd: '/opt/studyflow/apps/server',
    script: 'dist/main.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/studyflow/err.log',
    out_file: '/var/log/studyflow/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    restart_delay: 3000,
    max_restarts: 5,
    min_uptime: '10s'
  }]
};
PM2CONFIG
        
        mkdir -p /var/log/studyflow
        pm2 start ecosystem.config.js --env production
        pm2 save
        pm2 startup systemd
    fi
    
    echo "✅ 部署完成！"
    pm2 status
EOF

echo ""
echo -e "${GREEN}🎉 部署成功！${NC}"
echo "================================"
echo -e "API 地址: ${YELLOW}http://$SERVER_IP/api/v1${NC}"
echo -e "文档地址: ${YELLOW}http://$SERVER_IP/api/docs${NC}"
echo ""
echo "查看日志: ssh $REMOTE_USER@$SERVER_IP 'pm2 logs studyflow-server'"
