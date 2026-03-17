#!/bin/bash

# ==========================================
# StudyFlow 开发环境启动脚本
# ==========================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 StudyFlow 开发环境启动脚本${NC}"
echo "========================================"

# 检查命令
command -v docker-compose >/dev/null 2>&1 || { echo -e "${RED}❌ 需要 docker-compose${NC}"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo -e "${RED}❌ 需要 pnpm${NC}"; exit 1; }

# 函数：等待服务就绪
wait_for_service() {
    local service=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}⏳ 等待 ${service} 就绪...${NC}"
    while ! nc -z localhost $port 2>/dev/null; do
        if [ $attempt -eq $max_attempts ]; then
            echo -e "${RED}❌ ${service} 启动超时${NC}"
            exit 1
        fi
        sleep 1
        ((attempt++))
    done
    echo -e "${GREEN}✅ ${service} 已就绪${NC}"
}

# 步骤 1: 启动数据库
echo ""
echo -e "${BLUE}[1/5] 启动数据库服务...${NC}"
docker-compose up -d postgres redis
wait_for_service "PostgreSQL" 5432
wait_for_service "Redis" 6379

# 步骤 2: 安装依赖
echo ""
echo -e "${BLUE}[2/5] 安装依赖...${NC}"
pnpm install

# 步骤 3: 生成 Prisma Client 并执行迁移
echo ""
echo -e "${BLUE}[3/5] 数据库迁移...${NC}"
cd apps/server
pnpm db:generate
pnpm db:migrate
cd ../..

# 步骤 4: 可选：填充测试数据
echo ""
echo -e "${YELLOW}[4/5] 是否填充测试数据? (y/n)${NC}"
read -r seed_data
if [ "$seed_data" = "y" ] || [ "$seed_data" = "Y" ]; then
    echo -e "${BLUE}🌱 填充测试数据...${NC}"
    cd apps/server
    pnpm db:seed
    cd ../..
fi

# 步骤 5: 启动所有服务
echo ""
echo -e "${BLUE}[5/5] 启动所有服务...${NC}"
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  服务将启动在:${NC}"
echo -e "${GREEN}    - 后端 API: http://localhost:3001${NC}"
echo -e "${GREEN}    - API 文档: http://localhost:3001/api/docs${NC}"
echo -e "${GREEN}    - Web 应用: http://localhost:5173${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

# 使用 concurrently 或 turbo 并行启动
if command -v concurrently >/dev/null 2>&1; then
    concurrently \
        -n "SERVER,WEB" \
        -c "bgBlue,bgGreen" \
        "pnpm dev:server" \
        "sleep 3 && pnpm dev:web"
else
    echo -e "${YELLOW}提示: 安装 concurrently 可以获得更好的输出体验${NC}"
    echo -e "  npm install -g concurrently"
    echo ""
    pnpm dev
fi
