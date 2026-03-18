#!/bin/bash

# StudyFlow 前端启动脚本

echo "🚀 正在启动 StudyFlow 前端..."

cd apps/web

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    pnpm install
fi

echo "📍 前端将运行在: http://localhost:5173"
echo ""
pnpm dev
