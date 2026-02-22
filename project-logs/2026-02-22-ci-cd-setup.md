# CI/CD 流程搭建记录

**日期**: 2026-02-22  
**作者**: Kimi Code  
**状态**: 已实施  
**相关**: .github/workflows

---

## 背景

为提升开发效率和代码质量，建立自动化的 CI/CD 流程：
- **CI**: 代码提交时自动检查质量
- **CD**: 合并后自动部署到生产环境

---

## 决策

### 使用 GitHub Actions

**原因：**
1. 与 GitHub 深度集成
2. 免费额度充足
3. 社区生态丰富
4. 支持 Matrix 多环境测试

### 工作流设计

```
┌─────────────────────────────────────────────────────────────┐
│                        CI Workflow                           │
├─────────────────────────────────────────────────────────────┤
│ 触发条件: Pull Request / Push to main                        │
│                                                              │
│ 执行步骤:                                                    │
│   1. Checkout Code      # 检出代码                           │
│   2. Setup Node.js      # 设置 Node 环境                     │
│   3. Install pnpm       # 安装包管理器                       │
│   4. Install Deps       # 安装依赖                           │
│   5. Lint Check         # ESLint 代码规范检查                │
│   6. Type Check         # TypeScript 类型检查                │
│   7. Build Packages     # 构建所有包                         │
│   8. Test               # 运行测试                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (CI 通过后)
┌─────────────────────────────────────────────────────────────┐
│                        CD Workflow                           │
├─────────────────────────────────────────────────────────────┤
│ 触发条件: Push to main (仅 CI 通过后)                        │
│                                                              │
│ 执行步骤:                                                    │
│   1. CI Checks          # 先执行完整 CI 流程                 │
│   2. Version Bump       # 自动计算版本号                     │
│   3. Build Packages     # 构建生产版本                       │
│   4. Deploy Web         # 部署 Web 应用到 Vercel            │
│   5. Deploy Storybook   # 部署组件文档到 Chromatic          │
│   6. GitHub Release     # 创建发布说明                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 实现

### 文件结构

```
.github/
└── workflows/
    ├── ci.yml    # 持续集成
    └── cd.yml    # 持续部署
```

### CI 配置要点

```yaml
# 使用 pnpm 缓存加速构建
- name: Setup pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 10

- name: Get pnpm store directory
  shell: bash
  run: |
    echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

- uses: actions/cache@v4
  with:
    path: ${{ env.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
```

### 部署平台

| 项目 | 平台 | 访问地址 |
|------|------|----------|
| Web 应用 | Vercel | https://studyflow-web.vercel.app |
| Storybook | Chromatic | https://main--xxx.chromatic.com |

---

## 文档输出

**操作手册**: `docs/guides/CI_CD_HANDBOOK.md`

内容包括：
1. CI/CD 概念介绍
2. 快速开始指南
3. 工作流详细说明
4. 环境配置说明
5. 部署流程详解
6. 常见问题解答
7. 故障排查指南
8. 最佳实践建议

---

## 后续优化

- [ ] 添加缓存策略优化构建速度
- [ ] 配置 Preview 部署（每个 PR 自动生成预览链接）
- [ ] 集成测试覆盖率报告
- [ ] 添加性能基准测试
- [ ] 配置自动化回滚机制

---

## 参考

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vercel 部署文档](https://vercel.com/docs/concepts/git/vercel-for-github)
- [Chromatic 文档](https://www.chromatic.com/docs/github-actions)
