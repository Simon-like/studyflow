/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["./react.js"],
  env: {
    "react-native/react-native": true,
  },
  plugins: ["react-native"],
  rules: {
    // React Native 规则 - 宽松模式
    "react-native/no-unused-styles": "off",
    "react-native/split-platform-components": "off",
    "react-native/no-inline-styles": "off",
    "react-native/no-color-literals": "off",
    "react-native/no-raw-text": "off",
    "react-native/no-single-element-style-arrays": "off",
  },
};
