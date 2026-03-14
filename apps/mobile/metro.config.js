const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// 获取默认配置
const config = getDefaultConfig(__dirname);

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

// ==================== 关键配置 1: 添加额外的 node_modules 路径 ====================
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// ==================== 关键配置 2: 配置 embedded packages 路径解析 ====================
const embeddedPackagesDir = path.join(projectRoot, "embedded-packages");
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "@studyflow/shared": path.join(embeddedPackagesDir, "shared"),
  "@studyflow/api": path.join(embeddedPackagesDir, "api"),
  "@studyflow/theme": path.join(embeddedPackagesDir, "theme"),
};

// ==================== 关键配置 3: 本地开发时监视 workspace packages ====================
const fs = require("fs");
if (fs.existsSync(path.resolve(workspaceRoot, "packages"))) {
  config.watchFolders = [path.resolve(workspaceRoot, "packages")];
}

// ==================== 关键配置 4: 确保 Metro 能解析所有文件类型 ====================
config.resolver.sourceExts = ["ts", "tsx", "js", "jsx", "json", "cjs", "mjs"];

// ==================== 关键配置 5: 启用 symlinks 支持 ====================
config.resolver.unstable_enableSymlinks = true;

// ==================== 关键配置 6: 确保正确解析 monorepo 中的模块 ====================
config.resolver.disableHierarchicalLookup = false;

module.exports = config;
