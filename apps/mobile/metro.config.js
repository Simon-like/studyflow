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
  // 添加 monorepo 中的共享包映射
  "@studyflow/shared": path.resolve(workspaceRoot, "packages/shared"),
  "@studyflow/api": path.resolve(workspaceRoot, "packages/api"),
  "@studyflow/theme": path.resolve(workspaceRoot, "packages/theme"),
};

// ==================== 关键配置 3: 监视 packages 目录的变化 ====================
config.watchFolders = [path.resolve(workspaceRoot, "packages")];

// ==================== 关键配置 4: 确保 Metro 能解析 TypeScript ====================
config.resolver.sourceExts = ["ts", "tsx", "js", "jsx", "json", "cjs", "mjs"];

// ==================== 关键配置 5: 禁用可能导致问题的缓存 ====================
config.resetCache = true;

// ==================== 关键配置 6: 确保正确解析 workspace 包 ====================
config.resolver.disableHierarchicalLookup = false;

module.exports = config;
