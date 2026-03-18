#!/bin/bash

# StudyFlow 后端启动脚本

echo "🚀 正在启动 StudyFlow 后端服务..."

# 进入后端目录
cd apps/server

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    pnpm install
fi

# 构建项目
echo "🔨 正在构建项目..."
pnpm build

# 检查构建是否成功
if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

# 启动服务
echo "✅ 构建成功，正在启动服务..."
echo "📍 服务将运行在: http://localhost:3001"
echo ""
pnpm start
