# Git Commit 规范制定记录

**日期**: 2026-02-22  
**作者**: Kimi Code  
**状态**: 已实施  
**相关**: 全项目

---

## 背景

随着项目规模扩大和团队成员增加，需要统一的提交规范来：
- 自动生成 CHANGELOG
- 提高代码审查效率
- 便于追踪问题来源
- 支持自动化版本发布

---

## 决策

### 采用 Conventional Commits 规范

**核心原则：**
- 结构化的提交消息
- 机器可读的格式
- 与 SemVer 版本管理配合

**提交格式：**
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型定义

| 类型 | 用途 | 版本影响 |
|------|------|----------|
| feat | 新功能 | minor |
| fix | Bug 修复 | patch |
| docs | 文档更新 | none |
| style | 代码格式 | none |
| refactor | 重构 | patch |
| perf | 性能优化 | patch |
| test | 测试相关 | none |
| chore | 构建/工具 | none |
| ci | CI/CD | none |
| revert | 回滚 | patch |

### Monorepo 作用域规范

```
root      # 根目录配置
web       # Web 应用
mobile    # 移动端应用
api       # API 客户端
ui        # UI 组件库
shared    # 共享工具
config    # 配置文件
deps      # 依赖更新
docs      # 文档
```

---

## 实施

### 文档输出

1. **规范文档**: `docs/standards/GIT_COMMIT_CONVENTION.md`
   - 详细的类型说明
   - 使用示例
   - IDE 配置指南

2. **CHANGELOG**: `CHANGELOG.md`
   - 按版本记录变更
   - 自动化生成基础

### 后续计划

- [ ] 集成 commitlint 进行提交前检查
- [ ] 配置 Commitizen 交互式提交
- [ ] 设置 GitHub Action 验证提交格式
- [ ] 添加自动化 CHANGELOG 生成

---

## 示例

### 功能开发
```bash
feat(mobile): 添加番茄钟计时器页面

- 实现倒计时圆环动画
- 添加开始/暂停/停止控制
- 集成任务关联功能

Closes #156
```

### Bug 修复
```bash
fix(api): 修复 token 刷新时接口 401 错误

刷新 token 时未正确更新请求头导致接口调用失败。
现在会在刷新成功后重新发送失败请求。

Fixes #123
```

---

## 参考

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
