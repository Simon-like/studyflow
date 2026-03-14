const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const fs = require("fs");

// 获取默认配置
const config = getDefaultConfig(__dirname);

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

// 检查是否存在 embedded-packages（EAS 构建环境）
const embeddedPackagesDir = path.join(projectRoot, "embedded-packages");
const useEmbeddedPackages = fs.existsSync(embeddedPackagesDir);

console.log('Metro config:', useEmbeddedPackages ? 'Using embedded packages' : 'Using workspace packages');

// ==================== 关键配置 1: 添加额外的 node_modules 路径 ====================
// 确保能解析到根目录的 node_modules（包含 expo-modules-core）
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// ==================== 关键配置 2: 配置 workspace 包路径解析 ====================
if (useEmbeddedPackages) {
  // EAS 构建环境：使用 embedded-packages
  config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    "@studyflow/shared": path.join(embeddedPackagesDir, "shared"),
    "@studyflow/api": path.join(embeddedPackagesDir, "api"),
    "@studyflow/theme": path.join(embeddedPackagesDir, "theme"),
  };
} else {
  // 本地开发环境：使用 workspace packages
  config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    "@studyflow/shared": path.resolve(workspaceRoot, "packages/shared"),
    "@studyflow/api": path.resolve(workspaceRoot, "packages/api"),
    "@studyflow/theme": path.resolve(workspaceRoot, "packages/theme"),
  };
  
  // 本地开发时监视 packages 目录
  config.watchFolders = [path.resolve(workspaceRoot, "packages")];
}

// ==================== 关键配置 3: 确保 Metro 能解析所有文件类型 ====================
config.resolver.sourceExts = ["ts", "tsx", "js", "jsx", "json", "cjs", "mjs"];

// ==================== 关键配置 4: 启用 symlinks 支持 (pnpm 需要) ====================
config.resolver.unstable_enableSymlinks = true;

// ==================== 关键配置 5: 确保正确解析 monorepo 中的模块 ====================
config.resolver.disableHierarchicalLookup = false;

module.exports = config;
