#!/bin/bash
# EAS Build 预安装钩子
# 处理 pnpm monorepo 依赖

echo "🚀 Running EAS Build Pre-Install Hook"

# 确保在正确的目录
cd /home/expo/workingdir/build

# 安装 pnpm（EAS 环境可能没有）
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm@9.12.0
fi

# 显示环境信息
echo "Node version: $(node -v)"
echo "pnpm version: $(pnpm -v)"
echo "Current directory: $(pwd)"

# 安装根目录依赖
echo "📦 Installing root dependencies..."
pnpm install

# 构建 workspace 包
echo "🔨 Building workspace packages..."
pnpm run build:packages

echo "✅ Pre-install hook completed!"
