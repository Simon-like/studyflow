# StudyFlow 社区模块后端契约

> 本文件是 `packages/shared/src/types/community.ts` 的 Java 端映射。
> 后端 Spring Boot 项目的 Entity / DTO / VO 必须与此结构保持一致。

## 目录结构建议

```
apps/server/src/main/java/com/studyflow/community/
├── controller/
│   ├── PostController.java
│   ├── CommentController.java
│   └── StudyGroupController.java
├── service/
│   ├── PostService.java
│   ├── CommentService.java
│   └── StudyGroupService.java
├── repository/
│   ├── PostRepository.java
│   ├── CommentRepository.java
│   ├── LikeRepository.java
│   ├── StudyGroupRepository.java
│   └── GroupMemberRepository.java
├── entity/
│   ├── Post.java
│   ├── Comment.java
│   ├── Like.java
│   ├── StudyGroup.java
│   └── GroupMember.java
├── dto/
│   ├── PostDTO.java
│   ├── CommentDTO.java
│   ├── StudyGroupDTO.java
│   ├── CreatePostRequest.java
│   ├── CreateCommentRequest.java
│   ├── CreateGroupRequest.java
│   └── LikeResponse.java
└── vo/
    └── PostAuthorVO.java
```

---

## Entity（JPA 实体）

### Post.java

```java
@Entity
@Table(name = "community_posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false, length = 2000)
    private String content;

    @ElementCollection
    @CollectionTable(name = "post_images", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "image_url")
    private List<String> images;

    @ElementCollection
    @CollectionTable(name = "post_tags", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "tag")
    private List<String> tags;

    // 关联学习数据（可选）
    @Column(name = "study_time")
    private Integer studyTime;      // 专注时长（分钟）

    @Column(name = "task_count")
    private Integer taskCount;

    @Column(name = "pomodoro_count")
    private Integer pomodoroCount;

    @Column(name = "like_count")
    private Integer likeCount = 0;

    @Column(name = "comment_count")
    private Integer commentCount = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### Comment.java

```java
@Entity
@Table(name = "community_comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "post_id", nullable = false)
    private String postId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false, length = 1000)
    private String content;

    @Column(name = "parent_id")
    private String parentId;        // 回复某条评论时使用

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

### Like.java

```java
@Entity
@Table(name = "community_likes",
       uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "user_id"}))
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "post_id", nullable = false)
    private String postId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

### StudyGroup.java

```java
@Entity
@Table(name = "study_groups")
public class StudyGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "creator_id", nullable = false)
    private String creatorId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "cover_image")
    private String coverImage;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "member_count")
    private Integer memberCount = 1;    // 创建者自动加入

    @Column(name = "max_members")
    private Integer maxMembers = 100;

    @Column(name = "daily_goal", length = 20)
    private String dailyGoal;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### GroupMember.java

```java
@Entity
@Table(name = "group_members",
       uniqueConstraints = @UniqueConstraint(columnNames = {"group_id", "user_id"}))
public class GroupMember {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "group_id", nullable = false)
    private String groupId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
    }
}
```

---

## DTO（数据传输对象）

### PostAuthorVO.java

```java
@Data
public class PostAuthorVO {
    private String id;
    private String username;
    private String nickname;
    private String avatarUrl;
}
```

### PostDTO.java

```java
@Data
@Builder
public class PostDTO {
    private String id;
    private String userId;
    private PostAuthorVO author;
    private String content;
    private List<String> images;
    private List<String> tags;
    private Integer studyTime;
    private Integer taskCount;
    private Integer pomodoroCount;
    private Integer likeCount;
    private Integer commentCount;
    private Boolean isLiked;
    private String createdAt;   // ISO 8601
    private String updatedAt;
}
```

### CommentDTO.java

```java
@Data
@Builder
public class CommentDTO {
    private String id;
    private String postId;
    private String userId;
    private PostAuthorVO author;
    private String content;
    private String parentId;
    private List<CommentDTO> replies;   // 前3条回复
    private Integer replyCount;
    private String createdAt;
}
```

### StudyGroupDTO.java

```java
@Data
@Builder
public class StudyGroupDTO {
    private String id;
    private String creatorId;
    private PostAuthorVO creator;
    private String name;
    private String description;
    private String coverImage;
    private String category;
    private Integer memberCount;
    private Integer maxMembers;
    private Boolean isJoined;
    private String dailyGoal;
    private String createdAt;
    private String updatedAt;
}
```

### CreatePostRequest.java

```java
@Data
public class CreatePostRequest {
    @NotBlank(message = "内容不能为空")
    @Size(max = 2000, message = "内容最多2000字")
    private String content;
    private List<String> images;
    private List<String> tags;
    private Boolean attachStudyData;
}
```

### CreateCommentRequest.java

```java
@Data
public class CreateCommentRequest {
    @NotBlank(message = "评论内容不能为空")
    @Size(max = 1000, message = "评论最多1000字")
    private String content;
    private String parentId;
}
```

### CreateGroupRequest.java

```java
@Data
public class CreateGroupRequest {
    @NotBlank(message = "小组名称不能为空")
    @Size(max = 100, message = "名称最多100字")
    private String name;
    @Size(max = 500, message = "描述最多500字")
    private String description;
    private String coverImage;
    @NotBlank(message = "分类不能为空")
    private String category;
    private Integer maxMembers;
}
```

### LikeResponse.java

```java
@Data
@AllArgsConstructor
public class LikeResponse {
    private Boolean liked;
    private Integer likeCount;
}
```

---

## API 端点

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/community/posts` | 发布帖子 |
| GET | `/community/posts?page=0&size=20&tag=考研` | 帖子列表 |
| GET | `/community/posts/{id}` | 帖子详情 |
| PUT | `/community/posts/{id}` | 更新帖子 |
| DELETE | `/community/posts/{id}` | 删除帖子 |
| POST | `/community/posts/{id}/like` | 点赞/取消点赞 |
| POST | `/community/posts/{id}/comments` | 发表评论 |
| GET | `/community/posts/{id}/comments` | 评论列表 |
| POST | `/community/groups` | 创建小组 |
| GET | `/community/groups?category=考研` | 小组列表 |
| POST | `/community/groups/{id}/join` | 加入小组 |
| POST | `/community/groups/{id}/leave` | 离开小组 |

---

## 关键设计决策

1. **点赞高并发**：使用 Redis 缓存 `post:{id}:likes` 计数，定时刷回数据库。`Like` 表有唯一约束 `(post_id, user_id)` 兜底。
2. **评论嵌套**：一级评论按时间倒序，回复（parent_id != null）只返回前3条，`replyCount` 表示总数。
3. **Feeds 性能**：MVP 阶段按 `createdAt DESC` 分页，后续可引入 Redis Sorted Set 做热帖排行。
4. **学习数据关联**：发帖时 `attachStudyData=true`，后端自动取用户当日学习数据填充 `studyTime/taskCount/pomodoroCount`。
