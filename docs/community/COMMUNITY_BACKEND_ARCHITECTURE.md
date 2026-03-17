# StudyFlow 社区模块后端架构设计（NestJS）

> 版本: 1.0.0
> 日期: 2026-03-17
> 技术基线: NestJS + Prisma + PostgreSQL + Redis

---

## 1. 架构目标

- 与现有后端风格一致：`Controller -> Service -> Prisma`。
- 保证社区高频读写场景下的一致性与可扩展性。
- 首期支持动态流 + 互动 + 小组，后续可平滑扩展话题、审核、推荐。

## 2. 模块边界与职责

建议新增 `community` 模块，内部按领域拆分子服务：

```text
apps/server/src/community/
├── community.module.ts
├── community.controller.ts               # 聚合路由（也可拆分为多个controller）
├── dto/
│   ├── post.dto.ts
│   ├── comment.dto.ts
│   └── group.dto.ts
├── services/
│   ├── post.service.ts
│   ├── comment.service.ts
│   ├── like.service.ts
│   └── group.service.ts
├── mappers/
│   └── community.mapper.ts
└── types/
    └── community.types.ts
```

**职责划分**
- PostService: 发帖、删帖、动态流、详情。
- CommentService: 评论新增、删除、分页查询。
- LikeService: 点赞幂等切换、计数维护。
- GroupService: 小组列表、详情、入组退组。

## 3. 接口层设计原则

- 路由前缀沿用 `/api/v1/community/*`。
- 全部写接口走 JWT 鉴权，读接口默认也鉴权（可后续开放部分匿名读）。
- 入参通过 DTO + `class-validator` 严格校验。
- 响应格式走全局拦截器统一结构：
  - `code`
  - `message`
  - `data`
  - `timestamp`

## 4. 领域模型与数据流

### 4.1 领域对象
- Post（动态）
- Comment（评论）
- Like（点赞）
- StudyGroup（学习小组）
- GroupMember（小组成员）

### 4.2 核心事务流

1) 点赞切换事务（toggle）
- 查询 Like 是否存在
- 不存在则创建 + Post.like_count +1
- 存在则删除 + Post.like_count -1（不低于 0）
- 返回当前点赞态与最新计数

2) 评论新增事务
- 创建 Comment
- Post.comment_count +1
- 返回评论对象与最新评论数

3) 入组事务
- 检查 `group_members(group_id, user_id)` 唯一性
- 创建成员记录
- StudyGroup.member_count +1

## 5. 数据一致性策略

- 计数字段采用“明细表 + 冗余计数”模式：
  - 明细：likes/comments/group_members
  - 冗余：posts.like_count/comment_count、study_groups.member_count
- 所有涉及计数变化的写操作必须在事务内完成。
- 对历史脏数据预留修复任务（按日离线重算计数）。

## 6. 并发与性能策略

- 点赞并发：依赖唯一键 `(post_id, user_id)` 避免重复点赞。
- 动态流查询：按 `created_at DESC` + `cursor` 分页，避免深分页性能下降。
- 评论查询：按 `post_id + created_at` 索引命中。
- 小组列表：按 `category` + 活跃度字段（P1 可加）排序。
- Redis 预留：
  - 热门帖子缓存（短 TTL）
  - 小组榜单缓存（分钟级）

## 7. 安全与风控

- 鉴权：复用 `JwtAuthGuard`。
- 内容安全：
  - 发帖/评论入库前做敏感词扫描（首期可简单黑名单）。
  - 图片上传走白名单类型与大小校验。
- 访问控制：
  - 删帖/删评论仅本人或管理员可操作。
- 限流：
  - 发帖、评论、点赞设置用户维度限流阈值（防刷）。

## 8. 可观测性

- 日志维度：
  - userId、postId、groupId、action、latency、result
- 指标：
  - `community_post_create_qps`
  - `community_like_toggle_qps`
  - `community_comment_create_qps`
  - `community_feed_p95_latency`
- 告警：
  - 接口错误率 > 2%
  - P95 响应 > 800ms（连续 5 分钟）

## 9. 与现有模块协作

- Auth: 获取当前 userId。
- Users: 获取用户昵称/头像用于卡片展示。
- Stats: 发布打卡时回填学习快照（studyTime/taskCount）。
- Prisma: 复用现有事务与连接池管理。

## 10. 演进路线

### Phase 1（当前）
- 动态、点赞评论、小组加入退组闭环。

### Phase 2
- 话题标签聚合、热门排序、基础推荐。

### Phase 3
- 审核后台、举报流转、内容质量评分。

---

该架构在不改变当前项目技术栈的前提下可直接实施，且与已存在的 Prisma 社区表结构天然兼容。