# StudyFlow — 后端开发规范

> **版本**：v1.0  
> **更新日期**：2026-05-11  
> **用途**：指导 AI 在 StudyFlow 项目中进行 Spring Boot 后端开发，确保代码风格、架构模式和数据访问的一致性。  
> **阅读时长**：约 10 分钟

---

## 1. 技术栈与版本

| 用途 | 技术 | 版本 |
|------|------|------|
| 应用框架 | Spring Boot | 4.0.6 |
| Java 版本 | Java | 21（使用虚拟线程特性） |
| Web 层 | Spring Web MVC | 7.x |
| 安全框架 | Spring Security | 7.x |
| ORM 框架 | Spring Data JPA | 4.x |
| JPA 实现 | Hibernate | 7.x |
| 缓存框架 | Spring Data Redis | 4.x |
| 实时通信 | Spring WebSocket | 4.x |
| 数据库 | PostgreSQL | 16 |
| 缓存数据库 | Redis | 7 |
| API 文档 | SpringDoc OpenAPI | 2.3.x |
| 构建工具 | Maven | 3.9.x |
| 令牌认证 | JWT (jjwt) | 0.12.x |
| 代码简化 | Lombok | 1.18.x |

---

## 2. 项目结构规范

### 2.1 包结构

```
com.studyflow/
├── config/                    # 配置类
│   ├── SecurityConfig.java
│   ├── JwtConfig.java
│   ├── JacksonConfig.java     # ObjectMapper 配置（findAndRegisterModules）
│   ├── RedisConfig.java
│   ├── OssConfig.java
│   ├── WebConfig.java
│   └── WebSocketConfig.java   # WebSocket 端点注册 + JWT 握手认证
├── controller/                # 控制层（REST API）
│   └── SyncStateController.java  # WebSocket HTTP 降级回退端点
├── service/                   # 业务逻辑层
│   ├── impl/                  # 业务实现类（可选）
├── repository/                # 数据访问层
├── entity/                    # JPA 实体类
├── dto/                       # 数据传输对象
│   ├── request/               # 请求 DTO
│   └── response/              # 响应 DTO
├── vo/                        # 视图对象（返回给前端的聚合数据）
├── security/                  # 安全相关
├── websocket/                 # WebSocket 多端实时同步模块
│   ├── message/               # 消息协议定义
│   │   ├── SyncAction.java    # 动作枚举（POMODORO_START/STOP/STATE_SYNC 等）
│   │   ├── SyncMessage.java   # 同步消息 DTO
│   │   ├── DeviceType.java    # 设备类型枚举（WEB/MOBILE）
│   │   └── DeviceSession.java # 设备会话实体
│   ├── SyncSessionManager.java    # 会话管理（连接池、心跳检测、过期清理）
│   ├── SyncWebSocketHandler.java  # WebSocket 消息路由处理器
│   └── PomodoroSyncService.java   # 番茄钟同步核心逻辑（冲突解决、状态广播）
├── exception/                 # 异常处理
├── aspect/                    # AOP 切面
├── util/                      # 工具类
└── enums/                     # 枚举类（可选）
```

### 2.2 分层职责

| 层级 | 职责 | 禁止行为 |
|------|------|----------|
| **Controller** | 接收请求、参数校验、调用 Service、返回响应 | 直接操作 Repository、写业务逻辑 |
| **Service** | 业务逻辑、事务管理、数据编排 | 直接处理 HTTP 请求/响应、跨服务直接调用数据库 |
| **Repository** | 数据访问、CRUD、查询 | 写业务逻辑、调用其他 Repository |
| **Entity** | 数据库映射、关联关系 | 包含业务方法（简单辅助方法除外） |
| **DTO** | 数据传输、参数校验 | 包含业务逻辑 |

---

## 3. 代码风格规范

### 3.1 类命名

| 类型 | 后缀 | 示例 |
|------|------|------|
| 控制器 | `Controller` | `TaskController` |
| 服务接口 | `Service` | `TaskService` |
| 服务实现 | `ServiceImpl` | `TaskServiceImpl` |
| 数据访问 | `Repository` | `TaskRepository` |
| 实体类 | 无 | `Task` |
| 请求 DTO | `Request` | `CreateTaskRequest` |
| 响应 DTO | `Response` / `Dto` | `TaskDto` / `TaskResponse` |
| 异常类 | `Exception` | `BusinessException` |

### 3.2 方法命名

| 操作 | Controller | Service | Repository |
|------|------------|---------|------------|
| 查询列表 | `getList` / `list` | `findAll` / `findList` | `findByXxx` |
| 查询单个 | `getById` / `detail` | `findById` | `findById` |
| 创建 | `create` | `create` / `save` | `save` |
| 更新 | `update` | `update` | `save` |
| 删除 | `delete` / `remove` | `delete` | `deleteById` |
| 切换状态 | `toggleXxx` | `toggleXxx` | - |

### 3.3 注入方式

**强制使用构造函数注入**，禁止字段注入：

```java
@Service
@RequiredArgsConstructor  // Lombok 生成构造函数
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserService userService;
}
```

---

## 4. Controller 规范

### 4.1 标准模板

```java
@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
@Tag(name = "任务管理", description = "任务的增删改查")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "获取任务列表")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getList(
            @CurrentUser UUID userId,
            @RequestParam(required = false) TaskStatus status) {
        List<TaskDto> tasks = taskService.findAll(userId, status);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取任务详情")
    public ResponseEntity<ApiResponse<TaskDto>> getById(
            @PathVariable UUID id) {
        TaskDto task = taskService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(task));
    }

    @PostMapping
    @Operation(summary = "创建任务")
    public ResponseEntity<ApiResponse<TaskDto>> create(
            @CurrentUser UUID userId,
            @RequestBody @Valid CreateTaskRequest request) {
        TaskDto task = taskService.create(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(task));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新任务")
    public ResponseEntity<ApiResponse<TaskDto>> update(
            @PathVariable UUID id,
            @RequestBody @Valid UpdateTaskRequest request) {
        TaskDto task = taskService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(task));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除任务")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        taskService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "删除成功"));
    }
}
```

### 4.2 注解规范

| 注解 | 用途 |
|------|------|
| `@RestController` | 标记 REST 控制器 |
| `@RequestMapping("/api/v1/xxx")` | 模块基础路径 |
| `@GetMapping` / `@PostMapping` / `@PutMapping` / `@DeleteMapping` / `@PatchMapping` | HTTP 方法映射 |
| `@PathVariable` | URL 路径参数 |
| `@RequestParam` | URL 查询参数 |
| `@RequestBody` | 请求体 JSON |
| `@Valid` | 触发请求体参数校验 |
| `@CurrentUser` | 自定义注解，从 SecurityContext 获取当前用户 ID |
| `@Operation` | Swagger 接口描述 |
| `@Tag` | Swagger 模块分组 |
| `@PreAuthorize("isAuthenticated()")` | 方法级权限控制 |

---

## 5. Service 规范

### 5.1 标准模板

```java
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)  // 类级别默认只读
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<TaskDto> findAll(UUID userId, TaskStatus status) {
        // 查询逻辑
        return tasks.stream()
                .map(this::convertToDto)
                .toList();
    }

    public TaskDto findById(UUID id) {
        return taskRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new BusinessException(ErrorCode.TASK_NOT_FOUND));
    }

    @Transactional  // 写操作覆盖为可写
    public TaskDto create(UUID userId, CreateTaskRequest request) {
        log.info("用户 {} 创建任务", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Task task = new Task();
        task.setUser(user);
        task.setTitle(request.getTitle());
        // ...

        Task saved = taskRepository.save(task);
        return convertToDto(saved);
    }

    @Transactional
    public TaskDto update(UUID id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.TASK_NOT_FOUND));

        // 部分更新
        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        // ...

        return convertToDto(task);
    }

    @Transactional
    public void delete(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.TASK_NOT_FOUND));
        taskRepository.delete(task);
    }

    // DTO 转换（简单场景可用 MapStruct，当前项目手动转换）
    private TaskDto convertToDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        // ...
        return dto;
    }
}
```

### 5.2 事务规范

- 类级别标记 `@Transactional(readOnly = true)`
- 写操作（create/update/delete）方法上单独标记 `@Transactional`
- 复杂业务涉及多张表时，必须在 Service 层加 `@Transactional`
- 异步方法 (`@Async`) 调用时，事务可能失效，需注意传播

---

## 6. Repository 规范

### 6.1 标准模板

```java
@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    // 方法命名约定查询（推荐简单查询使用）
    List<Task> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Page<Task> findByUserIdAndStatusOrderByOrderAsc(UUID userId, TaskStatus status, Pageable pageable);

    // 复杂查询使用 @Query
    @Query("SELECT t.status, COUNT(t) FROM Task t WHERE t.user.id = :userId GROUP BY t.status")
    List<Object[]> countByStatusGrouped(@Param("userId") UUID userId);

    // 模糊搜索
    @Query("""
        SELECT t FROM Task t
        WHERE t.user.id = :userId
        AND (:status IS NULL OR t.status = :status)
        AND (:keyword IS NULL OR t.title LIKE %:keyword%)
        ORDER BY t.createdAt DESC
        """)
    List<Task> searchTasks(@Param("userId") UUID userId,
                           @Param("status") TaskStatus status,
                           @Param("keyword") String keyword);

    // 存在性查询
    boolean existsByUserIdAndTitle(UUID userId, String title);

    // 统计查询
    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.status = 'completed'")
    Long countCompletedByUserId(@Param("userId") UUID userId);
}
```

### 6.2 查询策略选择

| 场景 | 推荐方式 | 示例 |
|------|----------|------|
| 简单等值查询 | 方法命名 | `findByUserId` |
| 多条件等值 | 方法命名 | `findByUserIdAndStatus` |
| 排序分页 | 方法命名 | `findByUserIdOrderByCreatedAtDesc` |
| 模糊查询 | `@Query` | `title LIKE %:keyword%` |
| 聚合统计 | `@Query` | `COUNT / GROUP BY` |
| 原生 SQL | `@Query(nativeQuery = true)` | 复杂报表查询 |
| 动态条件 | JPA Criteria / QueryDSL | 条件不确定的查询 |

---

## 7. Entity 规范

### 7.1 标准模板

```java
@Entity
@Table(name = "tasks", indexes = {
    @Index(name = "idx_tasks_user_status", columnList = "user_id, status"),
    @Index(name = "idx_tasks_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TaskStatus status = TaskStatus.TODO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TaskPriority priority = TaskPriority.MEDIUM;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "is_today")
    @Builder.Default
    private Boolean isToday = false;

    @Column(name = "task_order")
    private Integer order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Task parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Task> subtasks = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 简单业务辅助方法（可选）
    public boolean isCompleted() {
        return this.status == TaskStatus.COMPLETED;
    }
}
```

### 7.2 Entity 设计原则

- **主键**：统一使用 `UUID`，`@GeneratedValue(strategy = GenerationType.UUID)`
- **关联关系**：默认使用 `FetchType.LAZY`，避免 N+1 问题
- **级联操作**：谨慎使用 `CascadeType.ALL`，通常只用于父子强关联
- **时间字段**：使用 `@CreatedDate` / `@LastModifiedDate` + `@EntityListeners(AuditingEntityListener.class)`
- **默认值**：使用 `@Builder.Default` 或字段初始化
- **软删除**：用 `isDeleted` 字段 + `@Where(clause = "is_deleted = false")`（如需要）

---

## 8. DTO 与参数校验

### 8.1 请求 DTO 模板

```java
@Data
@Schema(description = "创建任务请求")
public class CreateTaskRequest {

    @NotBlank(message = "任务标题不能为空")
    @Size(max = 200, message = "标题长度不能超过200字符")
    @Schema(description = "任务标题", example = "完成数学作业")
    private String title;

    @Size(max = 2000, message = "描述长度不能超过2000字符")
    @Schema(description = "任务描述", example = "第3章练习题1-10")
    private String description;

    @Schema(description = "任务状态", example = "TODO")
    private TaskStatus status = TaskStatus.TODO;

    @Schema(description = "优先级", example = "HIGH")
    private TaskPriority priority = TaskPriority.MEDIUM;

    @Schema(description = "截止日期", example = "2026-05-20")
    private LocalDate dueDate;
}
```

### 8.2 常用校验注解

| 注解 | 用途 |
|------|------|
| `@NotNull` | 字段不能为 null |
| `@NotBlank` | 字符串不能为 null 且 trim 后长度 > 0 |
| `@NotEmpty` | 集合/字符串不能为 null 且非空 |
| `@Size(min, max)` | 字符串/集合长度范围 |
| `@Min` / `@Max` | 数字范围 |
| `@Pattern(regexp)` | 正则匹配 |
| `@Email` | 邮箱格式 |
| `@Future` / `@Past` | 日期必须在将来/过去 |

---

## 9. 异常处理规范

### 9.1 统一响应格式

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "统一响应结构")
public class ApiResponse<T> {

    @Schema(description = "业务状态码", example = "200")
    private int code;

    @Schema(description = "提示消息", example = "操作成功")
    private String message;

    @Schema(description = "响应数据")
    private T data;

    @Schema(description = "时间戳")
    private long timestamp;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "success", data, System.currentTimeMillis());
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(200, message, data, System.currentTimeMillis());
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, message, null, System.currentTimeMillis());
    }
}
```

### 9.2 全局异常处理器

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException e) {
        log.warn("业务异常: {}", e.getMessage());
        return ResponseEntity.ok(ApiResponse.error(e.getCode(), e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(
            MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        return ResponseEntity.ok(ApiResponse.error(400, message));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        log.error("系统异常", e);
        return ResponseEntity.ok(ApiResponse.error(500, "系统繁忙，请稍后再试"));
    }
}
```

### 9.3 业务异常定义

```java
@Getter
public class BusinessException extends RuntimeException {
    private final int code;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
    }

    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.code = errorCode.getCode();
    }
}

@Getter
@AllArgsConstructor
public enum ErrorCode {
    SUCCESS(200, "操作成功"),
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未登录或登录已过期"),
    FORBIDDEN(403, "无权访问"),
    NOT_FOUND(404, "资源不存在"),
    USER_NOT_FOUND(1001, "用户不存在"),
    TASK_NOT_FOUND(2001, "任务不存在"),
    POST_NOT_FOUND(3001, "帖子不存在"),
    CONTENT_NOT_SAFE(3002, "内容包含敏感信息"),
    GROUP_NOT_FOUND(4001, "学习小组不存在"),
    GROUP_FULL(4002, "小组已满员"),
    ALREADY_JOINED(4003, "已加入该小组"),
    SYSTEM_BUSY(5001, "系统繁忙，请重试");

    private final int code;
    private final String message;
}
```

---

## 10. 新增模块的标准流程

开发新模块（如 AI 数字人、社区）时，按以下顺序创建文件：

1. **Entity** —— 数据库实体类（`entity/Xxx.java`）
2. **Repository** —— 数据访问接口（`repository/XxxRepository.java`）
3. **DTO** —— 请求/响应对象（`dto/xxx/`）
4. **Service** —— 业务逻辑（`service/XxxService.java`）
5. **Controller** —— REST API（`controller/XxxController.java`）
6. **前端类型** —— 在 `packages/shared/src/types/index.ts` 中补充类型
7. **前端 Service** —— 在 `packages/api/src/services/` 中封装 API
8. **前端 Hooks** —— 在 `packages/api/src/hooks/` 中创建 Query/Mutation
9. **前端页面** —— 在 `apps/web/src/features/` 和 `apps/mobile/src/screens/` 中开发 UI

---

## 11. 后端 API 响应数据格式参考

> **重要**：以下是后端各统计接口返回的实际字段名，前端类型定义必须与之匹配。

### 11.1 今日统计（`GET /pomodoros/stats/today`）

```json
{
  "code": 200,
  "data": {
    "focusMinutes": 45,
    "completedPomodoros": 2,
    "completedTasks": 1,
    "streakDays": 5
  }
}
```

对应前端类型：`TodayStats`

### 11.2 总览统计（`GET /stats/overview?period=week`）

```json
{
  "code": 200,
  "data": {
    "focusMinutes": 320,
    "completedPomodoros": 15,
    "completedTasks": 8,
    "streakDays": 5,
    "compareLastPeriod": {
      "focusMinutes": "+15%",
      "pomodoros": "+20%",
      "tasks": "-5%"
    }
  }
}
```

对应前端类型：`OverviewStats`。`compareLastPeriod` 中的值为格式化百分比字符串。

### 11.3 每日统计（`GET /stats/daily?startDate=...&endDate=...`）

```json
{
  "code": 200,
  "data": [
    { "date": "2026-05-10", "focusMinutes": 45, "pomodoros": 2, "tasks": 1 }
  ]
}
```

对应前端类型：`DailyStat[]`

### 11.4 学科分布（`GET /stats/subjects?period=week`）

```json
{
  "code": 200,
  "data": [
    { "category": "数学", "focusMinutes": 120, "percentage": 40 }
  ]
}
```

对应前端类型：`SubjectStat[]`

### 11.5 用户累计统计（`GET /users/stats`）

```json
{
  "code": 200,
  "data": {
    "totalFocusMinutes": 5000,
    "totalPomodoros": 200,
    "totalTasks": 80,
    "completedTasks": 80,
    "currentStreak": 5,
    "longestStreak": 15,
    "studyDays": 60,
    "todayFocusMinutes": 45,
    "todayPomodoros": 2,
    "todayTasks": 1
  }
}
```

对应前端类型：`UserStats`

### 11.6 番茄钟停止/结算（`POST /pomodoros/{id}/stop`）

```json
{
  "code": 200,
  "data": {
    "record": { "id": "...", "status": "completed", "actualDuration": 1500, ... },
    "task": null,
    "todayStats": { "focusMinutes": 45, "completedPomodoros": 2, ... }
  }
}
```

前端可直接用 `data.todayStats` 更新 TanStack Query 缓存。

---

## 12. WebSocket 多端实时同步

### 12.1 连接端点

```
ws://localhost:8080/ws/sync?token={JWT_ACCESS_TOKEN}&deviceId={DEVICE_ID}&deviceType={WEB|MOBILE}
```

支持 3 种 Token 传递方式：
1. URL Query 参数：`?token=xxx`
2. Authorization Header：`Bearer xxx`
3. Sec-WebSocket-Protocol Header：`access_token, {token}`

### 12.2 消息协议

```json
{
  "action": "POMODORO_START | POMODORO_PAUSE | POMODORO_RESUME | POMODORO_STOP | STATE_SYNC | STATE_REQUEST | HEARTBEAT | DATA_CHANGED | ...",
  "actionId": "uuid-for-idempotency",
  "deviceId": "device-uuid",
  "timestamp": 1715000000000,
  "payload": { ... },
  "error": null
}
```

### 12.3 降级策略

| 等级 | 条件 | 策略 |
|------|------|------|
| L1 | WebSocket 正常 | 实时双向同步 |
| L2 | 断连 <30s | 自动重连 + STATE_REQUEST 补偿 |
| L3 | 断连 >30s | HTTP 轮询 `GET /sync/state` |
| L4 | 网络离线 | 本地操作，恢复后全量同步 |

### 12.4 HTTP 降级端点

- `GET /sync/state`：获取当前番茄钟状态（活跃记录 + 今日统计 + 在线设备列表）
- `GET /sync/devices`：获取当前在线设备列表

### 12.5 设置变更广播

当用户通过 REST API 修改番茄钟设置或系统设置时，后端自动通过 WebSocket 广播 `DATA_CHANGED` 消息给该用户所有在线设备：

```json
{ "action": "DATA_CHANGED", "payload": { "dataType": "POMODORO_SETTINGS" } }
{ "action": "DATA_CHANGED", "payload": { "dataType": "SYSTEM_SETTINGS" } }
```

---

## 13. 变更日志

| 日期 | 版本 | 变更内容 | 变更者 |
|------|------|----------|--------|
| 2026-05-11 | v1.0 | 初始创建，整合 ARCHITECTURE.md 和迁移指南后端规范 | Kimi Code CLI |
| 2026-05-11 | v1.1 | 更新 Spring Boot 版本为 4.0.6，添加 WebSocket 模块文档、API 响应格式参考、包结构更新 | Claude Code |

---

**最后更新**：2026-05-11  
**版本**：v1.1
