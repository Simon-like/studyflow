const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// 获取默认配置
const config = getDefaultConfig(__dirname);

// 找到项目根目录和工作区根目录
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

// ==================== 关键配置 1: 添加额外的 node_modules 路径 ====================
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// ==================== 关键配置 2: 配置 workspace 包路径解析 ====================
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "@studyflow/shared": path.resolve(workspaceRoot, "packages/shared"),
  "@studyflow/api": path.resolve(workspaceRoot, "packages/api"),
  "@studyflow/theme": path.resolve(workspaceRoot, "packages/theme"),
};

// ==================== 关键配置 3: 监视 packages 目录的变化 ====================
config.watchFolders = [
  path.resolve(workspaceRoot, "packages")
];

// ==================== 关键配置 4: 确保 Metro 能解析 TypeScript 源代码 ====================
config.resolver.sourceExts = ["ts", "tsx", "js", "jsx", "json", "cjs", "mjs"];

// ==================== 关键配置 5: 启用 symlinks 支持 (pnpm 需要) ====================
config.resolver.unstable_enableSymlinks = true;

// ==================== 关键配置 6: 启用 package exports 支持 ====================
config.resolver.unstable_enablePackageExports = true;

// ==================== 关键配置 7: 禁用层级查找，使用 nodeModulesPaths ====================
config.resolver.disableHierarchicalLookup = false;

module.exports = config;
