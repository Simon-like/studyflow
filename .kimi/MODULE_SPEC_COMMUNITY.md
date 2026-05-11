# StudyFlow — 学习社区模块详细规范

> **版本**：v1.0  
> **更新日期**：2026-05-11  
> **用途**：学习社区模块（Community）的开发蓝图。包含数据库设计、API 定义、业务逻辑、Feeds 流设计和前端交互规范。  
> **状态**：🔄 Phase 1 已完成（统一共享类型契约 + 后端 DTO 契约文档）→ 待 Phase 2（后端核心实现）  
> **当前现状**：Web 和 Mobile 的 community 页面已有 UI 壳子和 Mock 数据

---

## 1. 模块概述

### 1.1 功能定位

学习社区是 StudyFlow 的**社交激励核心**，通过同伴激励、经验分享、学习打卡等机制提升用户学习动力。

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 帖子发布 | 文字 + 图片多媒体发布，可关联学习数据 | P0 |
| Feeds 流 | 基于时间线的动态流 | P0 |
| 帖子详情 | 查看帖子完整内容和互动数据 | P0 |
| 点赞 | 点赞/取消点赞，实时计数 | P0 |
| 评论 | 一级评论 + 二级回复 | P0 |
| 学习小组 | 兴趣小组的创建、加入、管理 | P1 |
| 排行榜 | 学习时长、连续天数排行 | P2 |

### 1.2 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                        学习社区模块架构                      │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Web + Mobile)                                    │
│  ├── Community 页面（Feeds + 小组 Tab）                      │
│  ├── PostDetail 页面（帖子详情 + 评论）                      │
│  ├── CreatePost 页面（发布帖子）                             │
│  └── GroupDetail 页面（小组详情）                            │
├─────────────────────────────────────────────────────────────┤
│  Backend (Spring Boot)                                      │
│  ├── CommunityController  ← REST API 入口                    │
│  ├── PostService          ← 帖子 CRUD + Feeds 流             │
│  ├── CommentService       ← 评论系统                         │
│  ├── LikeService          ← 点赞（Redis 计数）               │
│  ├── StudyGroupService    ← 学习小组管理                     │
│  └── FeedService          ← Feeds 流缓存（Redis）            │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure                                             │
│  ├── PostgreSQL (主数据)                                    │
│  ├── Redis (计数缓存 / Feeds 缓存 / 分布式锁)                 │
│  └── Aliyun OSS (图片上传)                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 数据库设计

### 2.1 实体关系

```
User (1)
 ├── Post (N)
 │    ├── Comment (N)
 │    └── Like (N)
 ├── StudyGroup (N) [作为创建者]
 └── GroupMember (N) [作为成员]

StudyGroup (1)
 └── GroupMember (N)
```

### 2.2 Post —— 帖子

```java
@Entity
@Table(name = "posts", indexes = {
    @Index(name = "idx_posts_user_created", columnList = "user_id, created_at"),
    @Index(name = "idx_posts_created", columnList = "created_at"),
    @Index(name = "idx_posts_deleted", columnList = "is_deleted")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @ElementCollection
    @CollectionTable(name = "post_images", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Column(name = "study_time")
    private Integer studyTime; // 关联的学习时长（分钟）

    @Column(name = "task_count")
    private Integer taskCount; // 完成的任务数

    @Column(name = "pomodoro_count")
    private Integer pomodoroCount; // 完成的番茄数

    @Column(name = "like_count", nullable = false)
    @Builder.Default
    private Integer likeCount = 0;

    @Column(name = "comment_count", nullable = false)
    @Builder.Default
    private Integer commentCount = 0;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Like> likes = new ArrayList<>();

    // 业务方法
    public void incrementLikeCount() { this.likeCount++; }
    public void decrementLikeCount() { if (this.likeCount > 0) this.likeCount--; }
    public void incrementCommentCount() { this.commentCount++; }
    public void decrementCommentCount() { if (this.commentCount > 0) this.commentCount--; }
}
```

### 2.3 Comment —— 评论（支持二级回复）

```java
@Entity
@Table(name = "comments", indexes = {
    @Index(name = "idx_comments_post_created", columnList = "post_id, created_at"),
    @Index(name = "idx_comments_parent", columnList = "parent_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Comment parent; // 父评论（二级回复）

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Comment> replies = new ArrayList<>();

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
```

### 2.4 Like —— 点赞

```java
@Entity
@Table(name = "likes",
    uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "user_id"}),
    indexes = {
        @Index(name = "idx_likes_post", columnList = "post_id"),
        @Index(name = "idx_likes_user", columnList = "user_id")
    }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
```

### 2.5 StudyGroup —— 学习小组

```java
@Entity
@Table(name = "study_groups", indexes = {
    @Index(name = "idx_groups_category", columnList = "category")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudyGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User creator;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "cover_image", length = 500)
    private String coverImage;

    @Column(name = "category", length = 50)
    private String category; // 考研、四六级、编程、英语等

    @Column(name = "member_count", nullable = false)
    @Builder.Default
    private Integer memberCount = 1;

    @Column(name = "max_members", nullable = false)
    @Builder.Default
    private Integer maxMembers = 100;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<GroupMember> members = new ArrayList<>();

    public void incrementMemberCount() {
        if (this.memberCount < this.maxMembers) this.memberCount++;
    }
    public void decrementMemberCount() {
        if (this.memberCount > 0) this.memberCount--;
    }
}
```

### 2.6 GroupMember —— 小组成员

```java
@Entity
@Table(name = "group_members",
    uniqueConstraints = @UniqueConstraint(columnNames = {"group_id", "user_id"}),
    indexes = {
        @Index(name = "idx_group_members_group", columnList = "group_id"),
        @Index(name = "idx_group_members_user", columnList = "user_id")
    }
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GroupMember {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private StudyGroup group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    @Builder.Default
    private GroupRole role = GroupRole.MEMBER;

    @CreatedDate
    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    public enum GroupRole {
        ADMIN, MEMBER
    }
}
```

---

## 3. API 接口定义

### 3.1 帖子

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/v1/community/posts` | 获取 Feeds 流（时间线） |
| `GET` | `/api/v1/community/posts/hot` | 获取热门帖子 |
| `GET` | `/api/v1/community/posts/{postId}` | 获取帖子详情 |
| `POST` | `/api/v1/community/posts` | 发布帖子 |
| `DELETE` | `/api/v1/community/posts/{postId}` | 删除帖子（软删除） |

### 3.2 点赞

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/v1/community/posts/{postId}/like` | 点赞/取消点赞 |
| `GET` | `/api/v1/community/posts/{postId}/like/status` | 查询当前用户点赞状态 |

### 3.3 评论

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/v1/community/posts/{postId}/comments` | 获取帖子评论（一级） |
| `POST` | `/api/v1/community/posts/{postId}/comments` | 发表评论 |
| `DELETE` | `/api/v1/community/comments/{commentId}` | 删除评论 |

### 3.4 学习小组

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/v1/community/groups` | 获取小组列表 |
| `GET` | `/api/v1/community/groups/{groupId}` | 获取小组详情 |
| `POST` | `/api/v1/community/groups` | 创建小组 |
| `POST` | `/api/v1/community/groups/{groupId}/join` | 加入小组 |
| `POST` | `/api/v1/community/groups/{groupId}/leave` | 退出小组 |

### 3.5 请求/响应 DTO

```java
// ========== 请求 DTO ==========

@Data
@Schema(description = "发布帖子请求")
public class CreatePostRequest {
    @NotBlank(message = "内容不能为空")
    @Size(max = 2000, message = "内容长度不能超过2000字符")
    @Schema(description = "帖子内容", example = "今天完成了5个番茄钟，感觉效率很高！")
    private String content;

    @Schema(description = "图片 URL 列表")
    private List<String> images;

    @Schema(description = "关联学习时长（分钟）", example = "150")
    private Integer studyTime;

    @Schema(description = "关联完成任务数", example = "8")
    private Integer taskCount;

    @Schema(description = "关联完成番茄数", example = "5")
    private Integer pomodoroCount;
}

@Data
@Schema(description = "发表评论请求")
public class CreateCommentRequest {
    @NotBlank(message = "评论内容不能为空")
    @Size(max = 1000, message = "评论长度不能超过1000字符")
    @Schema(description = "评论内容")
    private String content;

    @Schema(description = "父评论 ID（二级回复时使用）")
    private UUID parentId;
}

@Data
@Schema(description = "创建小组请求")
public class CreateGroupRequest {
    @NotBlank(message = "小组名称不能为空")
    @Size(max = 100, message = "名称长度不能超过100字符")
    private String name;

    @Size(max = 500, message = "描述长度不能超过500字符")
    private String description;

    @Size(max = 50, message = "分类长度不能超过50字符")
    private String category;

    private String coverImage;

    @Min(2)
    @Max(500)
    @Builder.Default
    private Integer maxMembers = 100;
}

// ========== 响应 DTO ==========

@Data
@Schema(description = "帖子 DTO")
public class PostDto {
    private UUID id;
    private UserSummaryDto user; // 精简用户信息
    private String content;
    private List<String> images;
    private Integer studyTime;
    private Integer taskCount;
    private Integer pomodoroCount;
    private Integer likeCount;
    private Integer commentCount;
    private Boolean isLiked; // 当前用户是否点赞
    private LocalDateTime createdAt;
}

@Data
@Schema(description = "评论 DTO")
public class CommentDto {
    private UUID id;
    private UserSummaryDto user;
    private String content;
    private LocalDateTime createdAt;
    private List<CommentDto> replies; // 前3条回复
    private Integer replyCount; // 总回复数
}

@Data
@Schema(description = "小组 DTO")
public class StudyGroupDto {
    private UUID id;
    private UserSummaryDto creator;
    private String name;
    private String description;
    private String coverImage;
    private String category;
    private Integer memberCount;
    private Integer maxMembers;
    private Boolean isJoined; // 当前用户是否已加入
    private LocalDateTime createdAt;
}

@Data
@Schema(description = "点赞响应")
public class LikeResponse {
    private Boolean liked;
    private Integer likeCount;
}
```

---

## 4. 业务逻辑设计

### 4.1 Feeds 流设计

**MVP 阶段采用简单拉模式**：

```
用户请求 Feeds
    │
    ▼
[1] 查询 posts 表（isDeleted = false）
[2] 按 createdAt DESC 排序
[3] 分页返回（page, size = 20）
[4] 填充当前用户点赞状态
```

**后续优化（V2）**：

```
用户请求 Feeds
    │
    ▼
[1] 从 Redis Sorted Set 获取帖子 ID 列表（score = createdAt）
[2] 缓存未命中时从数据库加载并写入 Redis
[3] 批量查询帖子详情
[4] 合并热门内容（按 likeCount 加权）
[5] 返回并按 Redis 顺序排序
```

### 4.2 点赞高并发设计

```java
@Service
@RequiredArgsConstructor
public class LikeService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final LikeRepository likeRepository;
    private final PostRepository postRepository;

    private static final String POST_LIKE_COUNT_KEY = "post:like:count:";
    private static final String USER_LIKE_SET_KEY = "user:likes:";

    @Transactional
    public LikeResponse toggleLike(UUID postId, UUID userId) {
        String likeCountKey = POST_LIKE_COUNT_KEY + postId;
        String userLikeKey = USER_LIKE_SET_KEY + userId;

        // 1. 检查是否已点赞（Redis 快速判断）
        Boolean hasLiked = redisTemplate.opsForSet()
            .isMember(userLikeKey, postId.toString());

        if (Boolean.TRUE.equals(hasLiked)) {
            // 取消点赞
            likeRepository.deleteByPostIdAndUserId(postId, userId);
            redisTemplate.opsForSet().remove(userLikeKey, postId.toString());
            redisTemplate.opsForValue().decrement(likeCountKey);
            // 异步更新数据库计数（或定时任务同步）
            return new LikeResponse(false, getCachedLikeCount(postId));
        } else {
            // 添加点赞
            Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

            Like like = Like.builder().post(post).user(user).build();
            likeRepository.save(like);

            redisTemplate.opsForSet().add(userLikeKey, postId.toString());
            redisTemplate.opsForValue().increment(likeCountKey);
            return new LikeResponse(true, getCachedLikeCount(postId));
        }
    }

    private Integer getCachedLikeCount(UUID postId) {
        Object count = redisTemplate.opsForValue().get(POST_LIKE_COUNT_KEY + postId);
        return count != null ? Integer.parseInt(count.toString()) : 0;
    }
}
```

### 4.3 评论查询优化

```java
// 一级评论分页查询
@Query("SELECT c FROM Comment c WHERE c.post.id = :postId AND c.parent IS NULL AND c.isDeleted = false ORDER BY c.createdAt DESC")
Page<Comment> findRootCommentsByPostId(@Param("postId") UUID postId, Pageable pageable);

// 查询评论的前3条回复
@Query("SELECT c FROM Comment c WHERE c.parent.id = :parentId AND c.isDeleted = false ORDER BY c.createdAt ASC")
List<Comment> findRepliesByParentId(@Param("parentId") UUID parentId, Pageable pageable);
```

### 4.4 小组加入并发控制

```java
@Transactional
public void joinGroup(UUID groupId, UUID userId) {
    String lockKey = "group:join:" + groupId;

    Boolean locked = redisTemplate.opsForValue()
        .setIfAbsent(lockKey, "1", Duration.ofSeconds(10));

    if (!Boolean.TRUE.equals(locked)) {
        throw new BusinessException(ErrorCode.SYSTEM_BUSY, "系统繁忙，请重试");
    }

    try {
        StudyGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new BusinessException(ErrorCode.GROUP_NOT_FOUND));

        if (group.getMemberCount() >= group.getMaxMembers()) {
            throw new BusinessException(ErrorCode.GROUP_FULL, "小组已满员");
        }

        if (groupMemberRepository.existsByGroupIdAndUserId(groupId, userId)) {
            throw new BusinessException(ErrorCode.ALREADY_JOINED, "已加入该小组");
        }

        GroupMember member = GroupMember.builder()
            .group(group)
            .user(userRepository.findById(userId).orElseThrow())
            .role(GroupRole.MEMBER)
            .build();
        groupMemberRepository.save(member);

        group.incrementMemberCount();
        groupRepository.save(group);
    } finally {
        redisTemplate.delete(lockKey);
    }
}
```

---

## 5. 前端交互设计

### 5.1 Web 端 Community 页面

```
┌─────────────────────────────────────────┐
│  学习社区                 [+] 发布       │  Header
├─────────────────────────────────────────┤
│  [🔥 热门] [📰 最新] [👥 小组]         │  Tab 切换
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐    │
│  │ 👤 小明           ⏱️ 150分钟     │    │
│  │                                 │    │
│  │ 今天完成了5个番茄钟，背了100个   │    │  PostCard
│  │ 单词，感觉效率爆棚！             │    │
│  │                                 │    │
│  │ [📷] [📊]                       │    │
│  │                                 │    │
│  │ ❤️ 24    💬 8     🕒 2小时前    │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ 👤 小红                         │    │  PostCard
│  │ ...                             │    │
│  └─────────────────────────────────┘    │
│              ↓ 加载更多                 │
└─────────────────────────────────────────┘
```

### 5.2 Mobile 端 Community 页面

```
┌─────────────────┐
│ 学习社区         │
├─────────────────┤
│ [🔥] [📰] [👥] │  Tab
├─────────────────┤
│ ┌─────────────┐ │
│ │ PostCard... │ │
│ └─────────────┘ │
│ ┌─────────────┐ │
│ │ PostCard... │ │
│ └─────────────┘ │
├─────────────────┤
│  [发布]         │  FAB 按钮
└─────────────────┘
```

### 5.3 前端关键组件

| 组件 | 位置 | 说明 |
|------|------|------|
| `PostCard` | `components/business/PostCard.tsx` | 帖子卡片（Web/Mobile 已存在） |
| `FeedTab` | `features/community/components/FeedTab.tsx` | Feeds 流（Web 已存在） |
| `GroupsTab` | `features/community/components/GroupsTab.tsx` | 小组列表（Web 已存在） |
| `CommunityHeader` | `features/community/components/CommunityHeader.tsx` | 社区头部 |
| `CreateGroupCard` | `features/community/components/CreateGroupCard.tsx` | 创建小组卡片 |
| `GroupBanner` | `screens/Community/components/GroupBanner.tsx` | 小组横幅（Mobile） |

### 5.4 前端状态管理

```typescript
// 使用 TanStack Query 管理社区数据
export const queryKeys = {
  community: {
    all: ['community'] as const,
    posts: (filter: 'latest' | 'hot', page: number) => 
      [...queryKeys.community.all, 'posts', filter, page] as const,
    postDetail: (id: string) => [...queryKeys.community.all, 'post', id] as const,
    comments: (postId: string, page: number) => 
      [...queryKeys.community.all, 'comments', postId, page] as const,
    groups: (page: number) => [...queryKeys.community.all, 'groups', page] as const,
    groupDetail: (id: string) => [...queryKeys.community.all, 'group', id] as const,
  },
};
```

---

## 6. 内容安全

### 6.1 敏感词过滤（MVP）

```java
@Component
public class ContentCheckUtil {

    private static final Set<String> SENSITIVE_WORDS = Set.of(
        "脏话1", "脏话2", "敏感政治词汇" // 实际使用更完整的词库
    );

    public static boolean isContentSafe(String content) {
        if (content == null || content.isBlank()) return true;
        String lower = content.toLowerCase();
        return SENSITIVE_WORDS.stream().noneMatch(lower::contains);
    }
}
```

### 6.2 后续优化

- 接入第三方内容审核 API（阿里云内容安全、腾讯云天御）
- 图片审核（OCR + 图像识别）
- 用户举报机制

---

## 7. 开发检查清单

### 7.1 后端开发

- [ ] Post / Comment / Like / StudyGroup / GroupMember Entity 创建
- [ ] Repository 接口（分页、关联查询、存在性判断）
- [ ] PostService（CRUD + Feeds 流 + 软删除）
- [ ] CommentService（一级评论 + 二级回复）
- [ ] LikeService（Redis 缓存 + 原子操作）
- [ ] StudyGroupService（小组管理 + 成员管理）
- [ ] CommunityController（REST API）
- [ ] 内容安全过滤集成
- [ ] Swagger 注解补全

### 7.2 前端开发

- [x] packages/shared 补充 Community 相关类型（`packages/shared/src/types/community.ts`）
- [x] packages/api 对齐 communityService 类型契约（从 `@studyflow/shared` 导入）
- [x] Mobile API 层对齐共享类型契约
- [ ] Web community 页面接入真实 API（Feeds / 发布 / 点赞 / 评论）
- [ ] Mobile community 页面接入真实 API
- [ ] 图片上传集成（复用已有 OSS 上传能力）
- [ ] 发布帖子页面
- [ ] 帖子详情页面（含评论）

---

## 8. 变更日志

| 日期 | 版本 | 变更内容 | 变更者 |
|------|------|----------|--------|
| 2026-05-11 | v1.0 | 初始创建，整合论文第 4.3 章设计和当前 UI 现状 | Kimi Code CLI |
| 2026-05-11 | v1.1 | Phase 1：统一共享类型契约，创建 `community.ts` 类型真相源；更新 API 层对齐；创建后端 Java DTO 契约文档 | Kimi Code CLI |

---

**最后更新**：2026-05-11  
**版本**：v1.0
