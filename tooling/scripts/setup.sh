#!/bin/bash

set -e

echo "🚀 Setting up StudyFlow Frontend Monorepo..."

# 检查 Node.js 版本
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# 安装依赖
echo "📦 Installing dependencies..."
pnpm install

# 构建共享包
echo "🔨 Building shared packages..."
pnpm --filter "@studyflow/typescript-config" build 2>/dev/null || true
pnpm --filter "@studyflow/eslint-config" build 2>/dev/null || true
pnpm --filter "@studyflow/shared" build
pnpm --filter "@studyflow/theme" build
pnpm --filter "@studyflow/api" build

echo ""
echo "✅ Setup complete!"
echo ""
echo "Available commands:"
echo "  pnpm dev          - Start development servers"
echo "  pnpm build        - Build all packages"
echo "  pnpm lint         - Run ESLint"
echo "  pnpm type-check   - Run TypeScript type checking"
echo ""
echo "To start the web app:"
echo "  pnpm --filter @studyflow/web dev"
echo ""
echo "To start the mobile app:"
echo "  pnpm --filter @studyflow/mobile start"