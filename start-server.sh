#!/bin/bash

# StudyFlow 后端启动脚本
# 用法: ./start-server.sh

echo "🚀 正在启动 StudyFlow 后端服务..."

# 获取脚本所在目录的绝对路径
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# 进入后端目录
cd apps/server

echo "📂 当前目录: $(pwd)"

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    pnpm install
fi

# 检查是否安装了 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ 请先安装 pnpm: npm install -g pnpm"
    exit 1
fi

# 构建并启动
echo "🔨 正在构建项目..."
pnpm dev
