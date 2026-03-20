#!/bin/bash

# ==========================================
# StudyFlow 阿里云服务器初始化脚本
# ==========================================

set -e

echo "🚀 开始初始化 StudyFlow 服务器..."

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. 安装 Docker Compose
echo -e "${YELLOW}📦 安装 Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose 安装成功${NC}"
else
    echo -e "${GREEN}✅ Docker Compose 已存在${NC}"
fi

docker-compose --version

# 2. 安装 Git
echo -e "${YELLOW}📦 安装 Git...${NC}"
if command -v yum &> /dev/null; then
    sudo yum install -y git
elif command -v apt &> /dev/null; then
    sudo apt update && sudo apt install -y git
fi

echo -e "${GREEN}✅ Git 安装成功${NC}"

# 3. 创建项目目录
echo -e "${YELLOW}📁 创建项目目录...${NC}"
sudo mkdir -p /opt/studyflow
sudo chown $(whoami):$(whoami) /opt/studyflow

# 4. 创建备份目录
sudo mkdir -p /backups/studyflow

# 5. 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

echo -e "${GREEN}✅ 服务器初始化完成！${NC}"
echo ""
echo "下一步："
echo "  1. cd /opt/studyflow"
echo "  2. git clone https://github.com/your-username/studyflow.git ."
echo "  3. cp .env.example .env"
echo "  4. nano .env  # 修改配置"
echo "  5. ./scripts/deploy.sh"
