module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // 如果使用了 react-native-reanimated，添加这个插件
      // "react-native-reanimated/plugin",

      // 配置路径别名
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@": "./src",
            // monorepo 包别名
            "@studyflow/shared": "../../packages/shared/src",
            "@studyflow/api": "../../packages/api/src",
          },
        },
      ],
    ],
  };
};
