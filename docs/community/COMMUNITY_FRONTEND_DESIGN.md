# StudyFlow 社区模块前端设计方案（双端）

> 版本: 1.0.0
> 日期: 2026-03-17
> 适用范围: Web + Mobile
> 对齐基线: 现有 Monorepo、`@studyflow/api`、`@studyflow/shared`、`@studyflow/theme`

---

## 1. 设计目标

- 保持 Web 与 Mobile 核心交互一致，减少学习成本。
- 复用现有基础设施：TanStack Query + 共享 API 包 + 共享类型包。
- 首期优先打通核心链路：动态流、发帖、点赞评论、小组加入。
- 为后续扩展（话题、排行榜、审核）预留状态与路由空间。

## 2. 现状评估（与代码对齐）

当前双端社区页面为“静态数据 + 本地状态”实现，已具备基础 UI 形态：
- Web 入口与结构在 `features/community`，含 feed/groups 双 tab。
- Mobile 入口在 `screens/Community`，含头部、分组筛选、帖子卡片。
- 点赞为本地 `toggleLike`，尚未对接后端。
- `@studyflow/api` 当前社区模块仍指向 mock 服务。

这意味着：UI 骨架已成熟，主要工作在于“数据层标准化 + 交互补全 + 状态一致性”。

## 3. 功能信息架构（IA）

### 3.1 页面结构（双端一致）
- 社区首页
  - Tab1: 动态广场（Feed）
  - Tab2: 学习小组（Groups）
- 发帖页（Create Post）
- 帖子详情页（Post Detail，含评论楼层）
- 小组详情页（Group Detail，首期可简化）

### 3.2 导航建议
- Web: `/community`、`/community/post/:id`、`/community/groups/:id`、`/community/create`
- Mobile: `CommunityStack`（List -> Detail -> Create -> GroupDetail）

## 4. 前端分层设计

### 4.1 Web 推荐目录
```text
apps/web/src/features/community/
├── index.tsx
├── hooks/
│   ├── useCommunityFeed.ts
│   ├── useCommunityGroups.ts
│   ├── useCreatePost.ts
│   └── usePostDetail.ts
├── components/
│   ├── feed/
│   ├── groups/
│   ├── create-post/
│   └── common/
├── services/              # 可选，若需组合多个api调用
├── constants.ts
└── types.ts               # 页面级衍生类型（尽量复用shared）
```

### 4.2 Mobile 推荐目录
```text
apps/mobile/src/screens/Community/
├── index.tsx
├── hooks/
│   ├── useCommunityFeed.ts
│   ├── useCommunityGroups.ts
│   ├── useCreatePost.ts
│   └── usePostDetail.ts
├── components/
│   ├── feed/
│   ├── groups/
│   ├── create-post/
│   └── common/
├── constants.ts
└── types.ts
```

## 5. 状态管理与缓存策略

### 5.1 服务端状态（TanStack Query）
推荐 Query Key（双端统一）：
```ts
COMMUNITY_KEYS = {
  all: ['community'],
  feed: (params) => ['community', 'feed', params],
  postDetail: (postId) => ['community', 'post', postId],
  comments: (postId, params) => ['community', 'comments', postId, params],
  groups: (params) => ['community', 'groups', params],
  groupDetail: (groupId) => ['community', 'group', groupId],
  myPosts: (params) => ['community', 'myPosts', params],
}
```

### 5.2 客户端状态（本地 UI）
- 筛选 tab、输入草稿、图片选择器状态、弹窗开关。
- 不将可远程拉取的数据持久存储到本地 store。
- 发帖草稿可选做本地缓存（防误退）。

### 5.3 失效策略
- 点赞成功：局部乐观更新 + 失败回滚。
- 发帖成功：失效 `feed` + 将新帖 prepend 到首页首屏。
- 评论成功：失效 `comments` 与 `postDetail` 的 commentCount。
- 加入小组成功：失效 `groups` 与 `groupDetail`。

## 6. 交互规范（关键）

### 6.1 动态流
- 首屏加载 skeleton（3~5 张卡片）。
- 下拉刷新重置到第一页。
- 上拉分页（cursor 优先，page 次选）。
- 图文帖展示规则：
  - 文本最多展示 6 行，超出“展开全文”。
  - 图片宫格 1/2/3/4/9 适配模板。

### 6.2 点赞与评论
- 点赞即时反馈（动效 + 数字实时更新）。
- 评论输入框最小可见，支持 @ 回复（P1）。
- 删除评论后前端展示“该评论已删除”。

### 6.3 发帖
- 内容输入实时计数（0/2000）。
- 图片上传进度可视化，失败支持重试/移除。
- 发布按钮规则：内容为空且无图时禁用。

### 6.4 小组
- 小组卡片显示：名称、分类、成员数、今日目标。
- 已加入状态展示“已加入”，避免重复操作。
- 入组失败提示具体原因（已满、风控、重复入组）。

## 7. API 接入规范（前端视角）

### 7.1 `@studyflow/api` 设计建议
新增 `communityService`，暴露方法：
- `getPosts(params)`
- `getPostDetail(postId)`
- `createPost(payload)`
- `toggleLike(postId)`
- `getComments(postId, params)`
- `createComment(postId, payload)`
- `deleteComment(commentId)`
- `getGroups(params)`
- `joinGroup(groupId)`
- `leaveGroup(groupId)`

### 7.2 Mock/Real 双模式
- 开发期默认延续 mock 支持。
- 后端联调后支持 `useMock=false` 走真实接口。
- 与现有 API 门面保持一致调用习惯，便于低成本迁移。

## 8. 类型设计建议（共享）

建议在 `@studyflow/shared` 扩展社区类型：
- `CommunityPost`
- `CommunityPostDetail`
- `CommunityComment`
- `CommunityGroup`
- `CommunityFeedQuery`
- `CreatePostRequest`
- `CreateCommentRequest`

并保持与后端 DTO 字段命名一致（camelCase）。

## 9. 性能与体验优化

- Feed 列表虚拟化（Web 可选，Mobile 长列表建议启用 FlatList）。
- 图片懒加载与缩略图优先策略。
- 点赞/评论按钮点击节流（300ms）。
- 首屏接口并行请求（feed + groups summary 可并行）。
- 错误兜底：统一 Toast + 重试按钮 + 空状态插图。

## 10. 埋点建议（最小闭环）

事件清单：
- `community_feed_exposure`
- `community_post_publish_click/success/fail`
- `community_post_like_click`
- `community_comment_publish`
- `community_group_join_click/success/fail`

关键维度：
- userId、postId、groupId、sourcePage、platform(web/mobile)

## 11. 交付清单（前端）

- 双端社区 API hooks
- 双端页面改造（静态数据 -> 远程数据）
- 发帖页与帖子详情页
- 点赞评论全链路
- 错误态/空态/加载态统一规范
- 埋点与监控接入

---

本方案可直接作为双端开发实现蓝图，建议先完成 Feed 主链路，再并行推进 Group 与 Detail。