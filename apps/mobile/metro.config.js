const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// 获取默认配置
const config = getDefaultConfig(__dirname);

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

// ==================== Monorepo 配置 (Expo SDK 55 官方推荐) ====================

// 1. 监视 workspace packages 目录（开发热更新）
config.watchFolders = [workspaceRoot];

// 2. 配置 node_modules 解析路径
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. 确保 Metro 能解析所有文件类型
config.resolver.sourceExts = ["ts", "tsx", "js", "jsx", "json", "cjs", "mjs"];

// 4. 启用 symlinks 支持 (pnpm 必需)
config.resolver.unstable_enableSymlinks = true;

// 5. 禁用层级查找以避免重复模块问题
config.resolver.disableHierarchicalLookup = false;

// ==================== Reanimated 配置 ====================
// Reanimated 插件在 babel.config.js 中配置，不需要在 metro 中额外配置

module.exports = config;
