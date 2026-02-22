const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// 获取默认配置
const config = getDefaultConfig(__dirname);

// Monorepo 配置
const monorepoPackages = {
  "@studyflow/ui": path.resolve(__dirname, "../../packages/ui"),
  "@studyflow/shared": path.resolve(__dirname, "../../packages/shared"),
  "@studyflow/api": path.resolve(__dirname, "../../packages/api"),
};

// 添加额外的 node_modules 路径
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  ...monorepoPackages,
};

// 监视 packages 目录
config.watchFolders = [path.resolve(__dirname, "../../packages")];

// 解决某些包的兼容问题
config.resolver.sourceExts = ["jsx", "js", "ts", "tsx", "json", "cjs"];
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg",
);

module.exports = config;
