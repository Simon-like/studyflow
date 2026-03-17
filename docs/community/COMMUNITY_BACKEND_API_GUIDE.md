# StudyFlow 社区模块后端接口指南（含数据库设计）

> 版本: 1.0.0
> 日期: 2026-03-17
> API 前缀: `/api/v1/community`
> 鉴权: `Authorization: Bearer <token>`

---

## 1. 设计原则

- 路径风格与现有模块一致（RESTful + 资源语义）。
- 成功响应统一走全局响应结构：`code/message/data/timestamp`。
- 写操作全部鉴权并限流，读操作首期默认鉴权。
- DTO 严格校验（class-validator），错误信息可读。

## 2. 数据库设计（对齐现有 Prisma）

当前 Prisma 已具备核心表，可直接使用：

- `posts`
- `comments`
- `likes`
- `study_groups`
- `group_members`

### 2.1 推荐补充字段（非必须，建议）
为增强排序与治理能力，建议后续补充：
- `posts.visibility`（public/group）
- `posts.group_id`（可选，组内帖关联）
- `posts.status`（normal/hidden/reviewing）
- `study_groups.is_private`（私有组）
- `group_members.status`（pending/active/rejected）

### 2.2 索引建议（在现有基础上）
- `posts(is_deleted, created_at DESC)`
- `posts(user_id, created_at DESC)`
- `comments(post_id, created_at ASC)`
- `likes(post_id, user_id)` unique
- `group_members(group_id, user_id)` unique

## 3. 统一响应与错误格式

### 3.1 成功响应
```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1710000000000
}
```

### 3.2 常见错误码（业务建议）
- `400` 参数错误
- `401` 未登录/Token 失效
- `403` 无权限操作
- `404` 资源不存在
- `409` 冲突（重复点赞、重复入组）
- `429` 触发限流
- `500` 服务器错误

## 4. DTO 设计建议

### 4.1 Post DTO
- `CreatePostDto`
  - `content: string`（1~2000）
  - `images?: string[]`（max 9）
  - `tags?: string[]`（max 5）
  - `studyTime?: number`（0~1440）
  - `taskCount?: number`（0~200）
- `PostQueryDto`
  - `cursor?: string`
  - `size?: number`（1~50）
  - `groupId?: string`
  - `keyword?: string`

### 4.2 Comment DTO
- `CreateCommentDto`
  - `content: string`（1~500）
  - `parentId?: string`

### 4.3 Group DTO
- `GroupQueryDto`
  - `category?: string`
  - `cursor?: string`
  - `size?: number`（1~50）

## 5. 接口清单（MVP）

## 5.1 动态（Posts）

### 5.1.1 发布动态
`POST /api/v1/community/posts`

请求体：
```json
{
  "content": "今天完成了6个番茄钟，复盘了高数错题。",
  "images": ["https://cdn.xxx.com/p1.jpg"],
  "tags": ["打卡", "考研"],
  "studyTime": 150,
  "taskCount": 3
}
```

返回 `data`：
```json
{
  "id": "post_uuid",
  "userId": "user_uuid",
  "content": "今天完成了6个番茄钟，复盘了高数错题。",
  "images": ["https://cdn.xxx.com/p1.jpg"],
  "tags": ["打卡", "考研"],
  "studyTime": 150,
  "taskCount": 3,
  "likeCount": 0,
  "commentCount": 0,
  "isLiked": false,
  "createdAt": "2026-03-17T10:00:00Z",
  "updatedAt": "2026-03-17T10:00:00Z"
}
```

### 5.1.2 获取动态流（分页）
`GET /api/v1/community/posts?cursor=2026-03-17T10:00:00Z_postId&size=20&groupId=xxx`

返回 `data`：
```json
{
  "list": [],
  "nextCursor": "2026-03-17T09:30:00Z_postId",
  "hasMore": true
}
```

### 5.1.3 获取动态详情
`GET /api/v1/community/posts/:postId`

### 5.1.4 删除动态（软删除）
`DELETE /api/v1/community/posts/:postId`

返回：
```json
{ "success": true }
```

## 5.2 点赞（Likes）

### 5.2.1 点赞切换（幂等）
`POST /api/v1/community/posts/:postId/like`

返回 `data`：
```json
{
  "postId": "post_uuid",
  "liked": true,
  "likeCount": 129
}
```

> 说明：使用“切换”接口可减少端侧分支；若团队偏好显式语义，也可提供 `PUT like` 与 `DELETE like`。

## 5.3 评论（Comments）

### 5.3.1 获取评论列表
`GET /api/v1/community/posts/:postId/comments?cursor=xxx&size=20`

返回 `data`：
```json
{
  "list": [
    {
      "id": "comment_uuid",
      "postId": "post_uuid",
      "userId": "user_uuid",
      "parentId": null,
      "content": "坚持太棒了！",
      "createdAt": "2026-03-17T10:05:00Z",
      "replies": []
    }
  ],
  "nextCursor": null,
  "hasMore": false
}
```

### 5.3.2 发表评论/回复
`POST /api/v1/community/posts/:postId/comments`

请求体：
```json
{
  "content": "这个方法很实用，我也试试！",
  "parentId": "comment_uuid_optional"
}
```

### 5.3.3 删除评论（软删除）
`DELETE /api/v1/community/comments/:commentId`

返回：
```json
{ "success": true }
```

## 5.4 学习小组（Groups）

### 5.4.1 获取小组列表
`GET /api/v1/community/groups?category=考研&cursor=xxx&size=20`

### 5.4.2 获取小组详情
`GET /api/v1/community/groups/:groupId`

### 5.4.3 加入小组
`POST /api/v1/community/groups/:groupId/join`

返回：
```json
{
  "groupId": "group_uuid",
  "joined": true,
  "memberCount": 329
}
```

### 5.4.4 退出小组
`POST /api/v1/community/groups/:groupId/leave`

返回：
```json
{
  "groupId": "group_uuid",
  "joined": false,
  "memberCount": 328
}
```

## 6. Service 层伪流程（关键接口）

### 6.1 点赞切换
1. 校验帖子存在且未删除。
2. 事务内查询 like 是否存在。
3. 不存在 -> create like + post.likeCount++。
4. 存在 -> delete like + post.likeCount--（下限 0）。
5. 返回 liked 与最新 likeCount。

### 6.2 评论新增
1. 校验帖子存在。
2. 若 `parentId` 存在，校验父评论属于同一帖子。
3. 事务内创建评论并更新 `commentCount`。
4. 返回评论详情。

### 6.3 入组
1. 校验小组存在。
2. 唯一约束判重。
3. 事务内创建成员与 `memberCount` 增量。
4. 返回 joined 状态。

## 7. 联调约定（前后端）

- 时间字段统一 ISO8601（UTC）。
- 前端展示“几分钟前”由端侧格式化，不在接口直接返回相对时间。
- 计数字段以接口返回为准，不在端侧猜测。
- 图片上传先走文件服务，社区接口仅接收 URL 数组。

## 8. 测试用例建议（接口级）

- 发帖参数边界（空内容、超长、图片超限）。
- 点赞并发 100 次压测（计数不为负、不重复）。
- 评论删除后计数回收。
- 入组重复请求返回一致结果。
- 非本人删除帖子/评论返回 403。

## 9. 开发落地顺序

1. `GET/POST posts`
2. `POST like`
3. `GET/POST/DELETE comments`
4. `GET groups + join/leave`
5. 详情页与分页优化
6. 限流与风控补齐

---

该接口指南与当前项目 API 风格、Prisma 社区模型一致，可直接用于后端任务拆解与前后端联调。