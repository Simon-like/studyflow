module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // 模块解析插件，支持 monorepo 路径
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@": "./src",
          },
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      ],
      // react-native-reanimated 插件必须放在最后
      "react-native-reanimated/plugin",
    ],
  };
};
