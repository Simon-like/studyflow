# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- **mobile**: 初始化移动端应用，配置 React Navigation 导航架构
- **mobile**: 实现 Root/Main 工程范式的导航结构
- **mobile**: 添加 Zustand 鉴权状态管理 (`useAuthStore`)
- **mobile**: 创建完整的页面组件（首页、任务、统计、AI伙伴、社区、个人中心）
- **mobile**: 实现番茄钟计时器页面
- **docs**: 新增 Git Commit 提交规范文档
- **docs**: 新增 CI/CD 操作手册（新人指南）

### Changed

- **shared**: 添加认证相关类型定义（`LoginRequest`, `RegisterRequest`, `TokenResponse`）
- **api**: 修复 `import.meta.env` TypeScript 类型问题
- **api**: 配置 ESM 模块支持
- **web**: 修复路由文件扩展名（`.ts` → `.tsx`）
- **web**: 创建基础页面和布局组件
- **typescript-config**: 更新 React Native 配置，支持 ESM 模块

### Fixed

- **ui**: 修复 Button 组件 `size` 类型不匹配问题
- **api**: 修复 `@studyflow/shared` 类型导出缺失问题
- **web**: 修复 CSS 导入路径错误

---

## [0.1.0] - 2026-02-22

### Added

- 项目初始架构搭建
- Monorepo 结构（pnpm workspace + turborepo）
- 基础包配置：
  - `@studyflow/shared`: 共享类型和工具
  - `@studyflow/api`: API 客户端
  - `@studyflow/ui`: UI 组件库
  - `@studyflow/typescript-config`: TypeScript 配置
  - `@studyflow/eslint-config`: ESLint 配置
- 应用初始化：
  - `apps/web`: React + Vite Web 应用
  - `apps/mobile`: Expo React Native 应用
- CI/CD 配置：
  - GitHub Actions CI 工作流
  - GitHub Actions CD 工作流

---

## 版本说明

### 版本号格式

`MAJOR.MINOR.PATCH`

- **MAJOR**: 不兼容的 API 修改
- **MINOR**: 向下兼容的功能新增
- **PATCH**: 向下兼容的问题修复

### 提交类型对应

| 提交类型 | 版本变化 |
|----------|----------|
| `feat` | minor |
| `fix` | patch |
| `feat!` / `BREAKING CHANGE` | major |

---

**查看完整提交历史：** [GitHub Commits](https://github.com/your-org/studyflow/commits/main)
