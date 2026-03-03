/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "./base.js",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // React 规则 - 宽松模式
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/display-name": "off",
    "react/no-unescaped-entities": "off",
    "react/no-unknown-property": "off",
    "react/jsx-key": "warn",
    "react/jsx-no-target-blank": "off",
    "react/no-children-prop": "off",
    "react/no-direct-mutation-state": "error", // 保持为 error，这是严重问题
    
    // React Hooks - 宽松模式
    "react-hooks/rules-of-hooks": "error", // 保持为 error，这是严重问题
    "react-hooks/exhaustive-deps": "off",
    
    // React Refresh - 关闭
    "react-refresh/only-export-components": "off",
  },
};
