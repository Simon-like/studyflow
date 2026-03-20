#!/bin/bash

# ==========================================
# StudyFlow 生产环境部署脚本
# ==========================================

set -e

echo "🚀 开始部署 StudyFlow..."

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 .env 文件
if [ ! -f .env ]; then
    echo -e "${RED}❌ 错误: 未找到 .env 文件${NC}"
    echo "请复制 .env.example 为 .env 并配置"
    exit 1
fi

# 加载环境变量
export $(grep -v '^#' .env | xargs)

echo -e "${YELLOW}📦 步骤 1/5: 拉取最新代码...${NC}"
git pull origin main

echo -e "${YELLOW}🐳 步骤 2/5: 构建并启动服务...${NC}"
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

echo -e "${YELLOW}⏳ 步骤 3/5: 等待数据库就绪...${NC}"
sleep 10

echo -e "${YELLOW}🔄 步骤 4/5: 执行数据库迁移...${NC}"
docker-compose -f docker-compose.prod.yml exec -T server npx prisma migrate deploy

echo -e "${YELLOW}🧹 步骤 5/5: 清理旧镜像...${NC}"
docker image prune -f

echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""
echo "📊 服务状态:"
docker-compose -f docker-compose.prod.yml ps
