#!/bin/bash

# ==========================================
# StudyFlow 阿里云部署脚本
# ==========================================

set -e

echo "🚀 开始部署 StudyFlow 到阿里云..."

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 检查 .env 文件
if [ ! -f .env ]; then
    echo -e "${RED}❌ 错误: 未找到 .env 文件${NC}"
    echo "请执行: cp .env.example .env 并修改配置"
    exit 1
fi

# 加载环境变量
export $(grep -v '^#' .env | xargs)

echo -e "${YELLOW}📦 步骤 1/5: 拉取最新代码...${NC}"
git pull origin main || echo "没有远程仓库，跳过拉取"

echo -e "${YELLOW}🐳 步骤 2/5: 构建并启动服务...${NC}"
docker-compose -f docker-compose.aliyun.yml down 2>/dev/null || true
docker-compose -f docker-compose.aliyun.yml build --no-cache
docker-compose -f docker-compose.aliyun.yml up -d

echo -e "${YELLOW}⏳ 步骤 3/5: 等待数据库就绪...${NC}"
sleep 15

echo -e "${YELLOW}🔄 步骤 4/5: 执行数据库迁移...${NC}"
docker-compose -f docker-compose.aliyun.yml exec -T server npx prisma migrate deploy || echo "迁移可能已完成"

echo -e "${YELLOW}🧹 步骤 5/5: 清理旧镜像...${NC}"
docker image prune -f

echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""
echo "📊 服务状态:"
docker-compose -f docker-compose.aliyun.yml ps
echo ""
echo "🔗 访问地址:"
echo "  前端: http://8.137.96.45:3020"
echo "  后端: http://8.137.96.45:3010/api/v1"
echo ""
echo "📋 常用命令:"
echo "  查看日志: docker-compose -f docker-compose.aliyun.yml logs -f"
echo "  停止服务: docker-compose -f docker-compose.aliyun.yml down"
echo "  重启服务: docker-compose -f docker-compose.aliyun.yml restart"
