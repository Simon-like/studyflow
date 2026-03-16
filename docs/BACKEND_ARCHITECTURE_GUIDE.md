# StudyFlow 后端架构指导文档

> **版本**: 1.0.0  
> **日期**: 2026-03-15  
> **目标读者**: 后端开发人员 / IDEA + AI 辅助开发  
> **适用场景**: 基于本指导文档，在 IDEA 中使用 AI 助手完成 StudyFlow 后端开发

---

## 📋 文档说明

本文档是 StudyFlow 后端开发的**唯一权威指导文档**，整合了：
- PRD（产品需求文档）
- API_SPEC（接口规范）
- DATABASE（数据库设计）
- ARCHITECTURE（系统架构）
- 前端业务代码分析（实际已开发的业务模块）

**使用方法**：将本文档作为上下文输入给 IDEA 的 AI 助手，它可以帮你：
1. 生成完整的 Spring Boot 项目结构
2. 创建所有 Entity、Repository、Service、Controller
3. 生成数据库迁移脚本（Flyway）
4. 编写单元测试和集成测试

---

## 1. 技术栈选型

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **框架** | Spring Boot | 3.2.x | 主框架 |
| **语言** | Java | 21 | LTS版本，使用新特性 |
| **数据库** | PostgreSQL | 16 | 主数据库 |
| **缓存** | Redis | 7.x | Token存储、热点数据缓存 |
| **ORM** | Spring Data JPA | 3.2.x | 数据访问层 |
| **安全** | Spring Security + JWT | 6.2.x | 认证授权 |
| **API文档** | SpringDoc OpenAPI | 2.3.x | 自动生成Swagger文档 |
| **构建工具** | Maven | 3.9.x | 项目管理 |
| **数据库迁移** | Flyway | 10.x | 版本化数据库脚本 |

---

## 2. 项目结构

```
studyflow-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/studyflow/
│   │   │       ├── StudyFlowApplication.java          # 启动类
│   │   │       ├── config/                            # 配置类
│   │   │       │   ├── SecurityConfig.java           # 安全配置
│   │   │       │   ├── JwtConfig.java                # JWT配置
│   │   │       │   ├── RedisConfig.java              # Redis配置
│   │   │       │   └── WebConfig.java                # Web配置
│   │   │       ├── common/                            # 公共组件
│   │   │       │   ├── entity/                       # 基础实体
│   │   │       │   ├── exception/                    # 全局异常
│   │   │       │   ├── response/                     # 统一响应
│   │   │       │   └── util/                         # 工具类
│   │   │       ├── auth/                              # 认证授权模块
│   │   │       │   ├── controller/
│   │   │       │   ├── service/
│   │   │       │   ├── dto/
│   │   │       │   └── security/
│   │   │       ├── user/                              # 用户模块
│   │   │       │   ├── controller/
│   │   │       │   ├── service/
│   │   │       │   ├── repository/
│   │   │       │   ├── entity/
│   │   │       │   └── dto/
│   │   │       ├── task/                              # 任务模块
│   │   │       │   ├── controller/
│   │   │       │   ├── service/
│   │   │       │   ├── repository/
│   │   │       │   ├── entity/
│   │   │       │   └── dto/
│   │   │       ├── pomodoro/                          # 番茄钟模块
│   │   │       │   ├── controller/
│   │   │       │   ├── service/
│   │   │       │   ├── repository/
│   │   │       │   ├── entity/
│   │   │       │   └── dto/
│   │   │       ├── stats/                             # 统计模块
│   │   │       │   ├── controller/
│   │   │       │   ├── service/
│   │   │       │   ├── repository/
│   │   │       │   └── dto/
│   │   │       ├── companion/                         # AI数字人(预留)
│   │   │       └── community/                         # 社区(预留)
│   │   └── resources/
│   │       ├── application.yml                       # 主配置
│   │       ├── application-dev.yml                   # 开发环境
│   │       ├── application-prod.yml                  # 生产环境
│   │       └── db/migration/                         # Flyway迁移脚本
│   │           ├── V1__init.sql                      # 初始schema
│   │           └── V2__seed_data.sql                 # 种子数据
│   └── test/
│       └── java/com/studyflow/
│           ├── integration/                           # 集成测试
│           └── unit/                                  # 单元测试
├── pom.xml
└── README.md
```

---

## 3. 数据库设计（核心表）

### 3.1 用户表 (users)

```sql
CREATE TABLE users (
    id                  VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 登录凭证
    username            VARCHAR(50) NOT NULL,
    email               VARCHAR(100),
    phone               VARCHAR(20),
    password_hash       VARCHAR(255) NOT NULL,
    
    -- 个人资料
    nickname            VARCHAR(50),
    avatar_url          VARCHAR(500),
    study_goal          VARCHAR(200),
    
    -- 番茄钟个性化设置（单位：秒）
    focus_duration      INT DEFAULT 1500,       -- 专注时长，默认25分钟
    short_break_duration INT DEFAULT 300,       -- 短休息时长，默认5分钟
    long_break_duration INT DEFAULT 900,        -- 长休息时长，默认15分钟
    auto_start_break    BOOLEAN DEFAULT false,
    auto_start_pomodoro BOOLEAN DEFAULT false,
    long_break_interval INT DEFAULT 4,
    
    -- 系统设置
    theme               VARCHAR(20) DEFAULT 'light',
    notification_enabled BOOLEAN DEFAULT true,
    sound_enabled       BOOLEAN DEFAULT true,
    vibration_enabled   BOOLEAN DEFAULT true,
    language            VARCHAR(10) DEFAULT 'zh-CN',
    
    -- 时间戳
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP WITH TIME ZONE,  -- 软删除
    
    -- 约束
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT uq_users_phone UNIQUE (phone),
    CONSTRAINT chk_focus_duration CHECK (focus_duration BETWEEN 60 AND 3600),
    CONSTRAINT chk_short_break CHECK (short_break_duration BETWEEN 60 AND 1800),
    CONSTRAINT chk_long_break CHECK (long_break_duration BETWEEN 60 AND 3600),
    CONSTRAINT chk_long_break_interval CHECK (long_break_interval BETWEEN 1 AND 10),
    CONSTRAINT chk_theme CHECK (theme IN ('light', 'dark', 'system'))
);

CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL AND email IS NOT NULL;
```

### 3.2 任务表 (tasks)

```sql
CREATE TABLE tasks (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    category        VARCHAR(50),               -- 学科分类
    
    priority        VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status          VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'abandoned')),
    
    display_order   INT DEFAULT 0,
    due_date        DATE,
    parent_id       VARCHAR(36) REFERENCES tasks(id) ON DELETE CASCADE,
    is_today        BOOLEAN DEFAULT true,
    
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at    TIMESTAMP WITH TIME ZONE,
    deleted_at      TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_tasks_user_status ON tasks(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_user_today ON tasks(user_id, is_today) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_user_created ON tasks(user_id, created_at DESC) WHERE deleted_at IS NULL;
```

### 3.3 番茄钟记录表 (pomodoro_records)

```sql
CREATE TABLE pomodoro_records (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id         VARCHAR(36) REFERENCES tasks(id) ON DELETE SET NULL,
    
    start_time      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time        TIMESTAMP WITH TIME ZONE,
    
    planned_duration    INT NOT NULL,         -- 计划时长（秒）
    actual_duration     INT,                  -- 实际时长（秒）
    
    status          VARCHAR(20) DEFAULT 'running' CHECK (status IN ('running', 'paused', 'completed', 'stopped')),
    is_locked       BOOLEAN DEFAULT false,
    abandon_reason  VARCHAR(500),
    
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pomodoro_user_created ON pomodoro_records(user_id, created_at DESC);
CREATE INDEX idx_pomodoro_user_date ON pomodoro_records(user_id, DATE(start_time)) 
    WHERE status = 'completed';
```

### 3.4 统计预聚合表

```sql
-- 每日番茄统计
CREATE TABLE pomodoro_daily_stats (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stat_date       DATE NOT NULL,
    completed_count INT DEFAULT 0,
    total_focus_seconds INT DEFAULT 0,
    stopped_count   INT DEFAULT 0,
    related_task_count INT DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, stat_date)
);

-- 用户连续学习记录
CREATE TABLE user_streaks (
    id                  VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             VARCHAR(36) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_streak      INT DEFAULT 0,
    longest_streak      INT DEFAULT 0,
    last_study_date     DATE,
    streak_start_date   DATE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. 核心实体类 (Entity)

### 4.1 User Entity

```java
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Where(clause = "deleted_at IS NULL")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(unique = true)
    private String email;
    
    @Column(unique = true)
    private String phone;
    
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    private String nickname;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    @Column(name = "study_goal")
    private String studyGoal;
    
    // 番茄钟设置
    @Column(name = "focus_duration")
    @Builder.Default
    private Integer focusDuration = 1500;
    
    @Column(name = "short_break_duration")
    @Builder.Default
    private Integer shortBreakDuration = 300;
    
    @Column(name = "long_break_duration")
    @Builder.Default
    private Integer longBreakDuration = 900;
    
    @Column(name = "auto_start_break")
    @Builder.Default
    private Boolean autoStartBreak = false;
    
    @Column(name = "auto_start_pomodoro")
    @Builder.Default
    private Boolean autoStartPomodoro = false;
    
    @Column(name = "long_break_interval")
    @Builder.Default
    private Integer longBreakInterval = 4;
    
    // 系统设置
    @Builder.Default
    private String theme = "light";
    
    @Column(name = "notification_enabled")
    @Builder.Default
    private Boolean notificationEnabled = true;
    
    @Column(name = "sound_enabled")
    @Builder.Default
    private Boolean soundEnabled = true;
    
    @Column(name = "vibration_enabled")
    @Builder.Default
    private Boolean vibrationEnabled = true;
    
    @Builder.Default
    private String language = "zh-CN";
    
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private Instant createdAt;
    
    @Column(name = "updated_at")
    @UpdateTimestamp
    private Instant updatedAt;
    
    @Column(name = "deleted_at")
    private Instant deletedAt;
}
```

### 4.2 Task Entity

```java
@Entity
@Table(name = "tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Where(clause = "deleted_at IS NULL")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String category;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TaskPriority priority = TaskPriority.medium;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TaskStatus status = TaskStatus.todo;
    
    @Column(name = "display_order")
    @Builder.Default
    private Integer order = 0;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Column(name = "parent_id")
    private String parentId;
    
    @Column(name = "is_today")
    @Builder.Default
    private Boolean isToday = true;
    
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private Instant createdAt;
    
    @Column(name = "updated_at")
    @UpdateTimestamp
    private Instant updatedAt;
    
    @Column(name = "completed_at")
    private Instant completedAt;
    
    @Column(name = "deleted_at")
    private Instant deletedAt;
}

public enum TaskStatus {
    todo, in_progress, completed, abandoned
}

public enum TaskPriority {
    low, medium, high
}
```

### 4.3 PomodoroRecord Entity

```java
@Entity
@Table(name = "pomodoro_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PomodoroRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "task_id")
    private String taskId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", insertable = false, updatable = false)
    private Task task;
    
    @Column(name = "start_time", nullable = false)
    private Instant startTime;
    
    @Column(name = "end_time")
    private Instant endTime;
    
    @Column(name = "planned_duration", nullable = false)
    private Integer plannedDuration;
    
    @Column(name = "actual_duration")
    private Integer actualDuration;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PomodoroStatus status = PomodoroStatus.running;
    
    @Column(name = "is_locked")
    @Builder.Default
    private Boolean isLocked = false;
    
    @Column(name = "abandon_reason")
    private String abandonReason;
    
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private Instant createdAt;
    
    @Column(name = "updated_at")
    @UpdateTimestamp
    private Instant updatedAt;
}

public enum PomodoroStatus {
    running, paused, completed, stopped
}
```

---

## 5. DTO 设计

### 5.1 统一响应格式

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private Integer code;
    private String message;
    private T data;
    private Long timestamp;
    
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
            .code(200)
            .message("success")
            .data(data)
            .timestamp(System.currentTimeMillis())
            .build();
    }
    
    public static <T> ApiResponse<T> error(Integer code, String message) {
        return ApiResponse.<T>builder()
            .code(code)
            .message(message)
            .timestamp(System.currentTimeMillis())
            .build();
    }
}
```

### 5.2 用户相关 DTO

```java
// 注册请求
@Data
public class RegisterRequest {
    @NotBlank @Size(min = 3, max = 50)
    private String username;
    
    @NotBlank @Size(min = 6, max = 100)
    private String password;
    
    private String nickname;
    private String email;
    private String phone;
}

// 登录请求
@Data
public class LoginRequest {
    @NotBlank
    private String username;
    
    @NotBlank
    private String password;
}

// Token响应
@Data
@Builder
public class TokenResponse {
    private String accessToken;
    private String refreshToken;
    private Long expiresIn;
    private UserProfileDTO user;
}

// 用户完整资料（包含设置和统计）
@Data
@Builder
public class UserProfileDTO {
    private String id;
    private String username;
    private String nickname;
    private String email;
    private String phone;
    private String avatar;
    private String studyGoal;
    
    // 番茄钟设置
    private Integer focusDuration;
    private Integer shortBreakDuration;
    private Integer longBreakDuration;
    private Boolean autoStartBreak;
    private Boolean autoStartPomodoro;
    private Integer longBreakInterval;
    
    // 系统设置
    private String theme;
    private Boolean notificationEnabled;
    private Boolean soundEnabled;
    private Boolean vibrationEnabled;
    private String language;
    
    // 统计数据
    private UserStatsDTO stats;
    
    private Instant createdAt;
    private Instant updatedAt;
}

// 用户统计
@Data
@Builder
public class UserStatsDTO {
    private Integer totalFocusMinutes;
    private Integer totalPomodoros;
    private Integer totalTasks;
    private Integer completedTasks;
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer studyDays;
    private Integer todayFocusMinutes;
    private Integer todayPomodoros;
    private Integer todayTasks;
}

// 更新资料请求
@Data
public class UpdateProfileRequest {
    @Size(max = 50)
    private String nickname;
    
    private String avatar;
    
    @Size(max = 200)
    private String studyGoal;
    
    @Email
    private String email;
    
    private String phone;
}

// 番茄钟设置
@Data
public class PomodoroSettingsDTO {
    @Min(60) @Max(3600)
    private Integer focusDuration;
    
    @Min(60) @Max(1800)
    private Integer shortBreakDuration;
    
    @Min(60) @Max(3600)
    private Integer longBreakDuration;
    
    private Boolean autoStartBreak;
    private Boolean autoStartPomodoro;
    
    @Min(1) @Max(10)
    private Integer longBreakInterval;
}
```

### 5.3 任务相关 DTO

```java
// 创建任务
@Data
public class CreateTaskRequest {
    @NotBlank @Size(max = 200)
    private String title;
    
    private String description;
    private String category;
    
    @EnumValidator(enumClass = TaskPriority.class)
    private String priority;
    
    private LocalDate dueDate;
    private String parentId;
}

// 更新任务
@Data
public class UpdateTaskRequest {
    @Size(max = 200)
    private String title;
    
    private String description;
    private String category;
    private String priority;
    private String status;
    private LocalDate dueDate;
    private Boolean isToday;
}

// 任务响应
@Data
@Builder
public class TaskDTO {
    private String id;
    private String title;
    private String description;
    private String category;
    private String priority;
    private String status;
    private Integer order;
    private LocalDate dueDate;
    private Boolean isToday;
    private Instant createdAt;
    private Instant updatedAt;
}

// 任务进度统计
@Data
@Builder
public class TaskProgressDTO {
    private Integer total;
    private Integer completed;
    private Integer inProgress;
    private Integer todo;
    private Double completionRate;
    private List<CategoryProgress> byCategory;
}
```

### 5.4 番茄钟相关 DTO

```java
// 开始番茄钟
@Data
public class StartPomodoroRequest {
    private String taskId;
    
    @NotNull @Min(60) @Max(3600)
    private Integer duration;
    
    private Boolean isLocked;
}

// 停止番茄钟
@Data
public class StopPomodoroRequest {
    @NotNull
    @EnumValidator(enumClass = PomodoroStatus.class)
    private String status;  // completed | abandoned
    
    private String abandonReason;
}

// 番茄钟响应
@Data
@Builder
public class PomodoroRecordDTO {
    private String id;
    private String userId;
    private String taskId;
    private TaskDTO task;
    private Instant startTime;
    private Instant endTime;
    private Integer plannedDuration;
    private Integer actualDuration;
    private String status;
    private Boolean isLocked;
    private String abandonReason;
}

// 番茄钟结算响应（停止后返回）
@Data
@Builder
public class PomodoroSettlementDTO {
    private PomodoroRecordDTO record;
    private TaskDTO task;
    private TodayStatsDTO todayStats;
}

// 今日统计
@Data
@Builder
public class TodayStatsDTO {
    private Integer focusMinutes;
    private Integer completedPomodoros;
    private Integer completedTasks;
    private Integer streakDays;
}

// 周统计
@Data
@Builder
public class WeeklyStatsDTO {
    private List<DailyStatDTO> dailyStats;
}

@Data
@Builder
public class DailyStatDTO {
    private String date;
    private Integer pomodoros;
    private Integer focusTime;  // 分钟
}
```

### 5.5 统计相关 DTO

```java
// 总览统计
@Data
@Builder
public class OverviewStatsDTO {
    private Integer focusMinutes;
    private Integer completedPomodoros;
    private Integer completedTasks;
    private Integer streakDays;
    private CompareStatsDTO compareLastPeriod;
}

@Data
@Builder
public class CompareStatsDTO {
    private String focusMinutes;
    private String pomodoros;
    private String tasks;
}

// 每日统计
@Data
@Builder
public class DailyStatsDTO {
    private String date;
    private Integer focusMinutes;
    private Integer pomodoros;
    private Integer tasks;
}

// 学科分布
@Data
@Builder
public class SubjectStatDTO {
    private String category;
    private Integer focusMinutes;
    private Double percentage;
}

// Dashboard 聚合数据
@Data
@Builder
public class DashboardSummaryDTO {
    private TodayStatsDTO todayStats;
    private WeeklyOverviewDTO weeklyStats;
    private List<TaskDTO> todayTasks;
    private PomodoroRecordDTO activePomodoro;
}

@Data
@Builder
public class WeeklyOverviewDTO {
    private Integer totalPomodoros;
    private Integer totalFocusHours;
    private Integer completionRate;
}
```

---

## 6. API 接口设计

### 6.1 认证模块 (/api/v1/auth)

```java
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "认证", description = "用户认证相关接口")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    @Operation(summary = "用户注册")
    public ResponseEntity<ApiResponse<TokenResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.register(request)));
    }
    
    @PostMapping("/login")
    @Operation(summary = "用户登录")
    public ResponseEntity<ApiResponse<TokenResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authService.login(request)));
    }
    
    @PostMapping("/refresh")
    @Operation(summary = "刷新Token")
    public ResponseEntity<ApiResponse<TokenResponse>> refresh(
            @RequestHeader("X-Refresh-Token") String refreshToken) {
        return ResponseEntity.ok(ApiResponse.success(authService.refresh(refreshToken)));
    }
    
    @PostMapping("/logout")
    @Operation(summary = "用户登出")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Void>> logout(
            @AuthenticationPrincipal UserPrincipal user) {
        authService.logout(user.getId());
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
```

### 6.2 用户模块 (/api/v1/users)

```java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "用户", description = "用户资料和设置")
@SecurityRequirement(name = "bearerAuth")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/profile")
    @Operation(summary = "获取用户完整资料")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getProfile(
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.success(
            userService.getProfile(user.getId())));
    }
    
    @PutMapping("/profile")
    @Operation(summary = "更新用户资料")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateProfile(
            @AuthenticationPrincipal UserPrincipal user,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
            userService.updateProfile(user.getId(), request)));
    }
    
    @PostMapping("/avatar")
    @Operation(summary = "上传头像")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadAvatar(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam("avatar") MultipartFile file) {
        String avatarUrl = userService.uploadAvatar(user.getId(), file);
        return ResponseEntity.ok(ApiResponse.success(
            Map.of("avatarUrl", avatarUrl)));
    }
    
    @GetMapping("/settings/pomodoro")
    @Operation(summary = "获取番茄钟设置")
    public ResponseEntity<ApiResponse<PomodoroSettingsDTO>> getPomodoroSettings(
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.success(
            userService.getPomodoroSettings(user.getId())));
    }
    
    @PutMapping("/settings/pomodoro")
    @Operation(summary = "更新番茄钟设置")
    public ResponseEntity<ApiResponse<PomodoroSettingsDTO>> updatePomodoroSettings(
            @AuthenticationPrincipal UserPrincipal user,
            @Valid @RequestBody PomodoroSettingsDTO settings) {
        return ResponseEntity.ok(ApiResponse.success(
            userService.updatePomodoroSettings(user.getId(), settings)));
    }
    
    @GetMapping("/stats")
    @Operation(summary = "获取用户统计数据")
    public ResponseEntity<ApiResponse<UserStatsDTO>> getUserStats(
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.success(
            userService.getUserStats(user.getId())));
    }
    
    @GetMapping("/calendar")
    @Operation(summary = "获取学习日历")
    public ResponseEntity<ApiResponse<List<StudyCalendarDTO>>> getStudyCalendar(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ApiResponse.success(
            userService.getStudyCalendar(user.getId(), startDate, endDate)));
    }
}
```

### 6.3 任务模块 (/api/v1/tasks)

```java
@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
@Tag(name = "任务", description = "任务管理")
@SecurityRequirement(name = "bearerAuth")
public class TaskController {
    
    private final TaskService taskService;
    
    @GetMapping
    @Operation(summary = "获取任务列表")
    public ResponseEntity<ApiResponse<PageResult<TaskDTO>>> getTasks(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(ApiResponse.success(
            taskService.getTasks(user.getId(), page, size, status, priority, keyword)));
    }
    
    @GetMapping("/today")
    @Operation(summary = "获取今日任务")
    public ResponseEntity<ApiResponse<List<TaskDTO>>> getTodayTasks(
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.success(
            taskService.getTodayTasks(user.getId())));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "获取任务详情")
    public ResponseEntity<ApiResponse<TaskDTO>> getTask(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(
            taskService.getTask(user.getId(), id)));
    }
    
    @PostMapping
    @Operation(summary = "创建任务")
    public ResponseEntity<ApiResponse<TaskDTO>> createTask(
            @AuthenticationPrincipal UserPrincipal user,
            @Valid @RequestBody CreateTaskRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
            taskService.createTask(user.getId(), request)));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "更新任务")
    public ResponseEntity<ApiResponse<TaskDTO>> updateTask(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String id,
            @Valid @RequestBody UpdateTaskRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
            taskService.updateTask(user.getId(), id, request)));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "删除任务")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String id) {
        taskService.deleteTask(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
    
    @PatchMapping("/{id}/toggle")
    @Operation(summary = "切换任务状态")
    public ResponseEntity<ApiResponse<TaskDTO>> toggleTaskStatus(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(
            taskService.toggleStatus(user.getId(), id)));
    }
    
    @PostMapping("/reorder")
    @Operation(summary = "批量更新任务排序")
    public ResponseEntity<ApiResponse<List<TaskDTO>>> reorderTasks(
            @AuthenticationPrincipal UserPrincipal user,
            @Valid @RequestBody ReorderTasksRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
            taskService.reorderTasks(user.getId(), request)));
    }
}
```

### 6.4 番茄钟模块 (/api/v1/pomodoros)

```java
@RestController
@RequestMapping("/api/v1/pomodoros")
@RequiredArgsConstructor
@Tag(name = "番茄钟", description = "番茄钟管理")
@SecurityRequirement(name = "bearerAuth")
public class PomodoroController {
    
    private final PomodoroService pomodoroService;
    
    @PostMapping("/start")
    @Operation(summary = "开始番茄钟")
    public ResponseEntity<ApiResponse<PomodoroRecordDTO>> startPomodoro(
            @AuthenticationPrincipal UserPrincipal user,
            @Valid @RequestBody StartPomodoroRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
            pomodoroService.start(user.getId(), request)));
    }
    
    @PostMapping("/{id}/stop")
    @Operation(summary = "停止番茄钟")
    public ResponseEntity<ApiResponse<PomodoroSettlementDTO>> stopPomodoro(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String id,
            @Valid @RequestBody StopPomodoroRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
            pomodoroService.stop(user.getId(), id, request)));
    }
    
    @GetMapping("/history")
    @Operation(summary = "获取番茄钟历史")
    public ResponseEntity<ApiResponse<PageResult<PomodoroRecordDTO>>> getHistory(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        return ResponseEntity.ok(ApiResponse.success(
            pomodoroService.getHistory(user.getId(), page, size)));
    }
    
    @GetMapping("/stats/today")
    @Operation(summary = "获取今日统计")
    public ResponseEntity<ApiResponse<TodayStatsDTO>> getTodayStats(
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.success(
            pomodoroService.getTodayStats(user.getId())));
    }
    
    @GetMapping("/stats/weekly")
    @Operation(summary = "获取周统计")
    public ResponseEntity<ApiResponse<WeeklyStatsDTO>> getWeeklyStats(
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.success(
            pomodoroService.getWeeklyStats(user.getId())));
    }
}
```

### 6.5 统计模块 (/api/v1/stats)

```java
@RestController
@RequestMapping("/api/v1/stats")
@RequiredArgsConstructor
@Tag(name = "统计", description = "学习数据统计")
@SecurityRequirement(name = "bearerAuth")
public class StatsController {
    
    private final StatsService statsService;
    
    @GetMapping("/overview")
    @Operation(summary = "获取总览统计")
    public ResponseEntity<ApiResponse<OverviewStatsDTO>> getOverview(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam(defaultValue = "week") String period) {
        return ResponseEntity.ok(ApiResponse.success(
            statsService.getOverview(user.getId(), period)));
    }
    
    @GetMapping("/daily")
    @Operation(summary = "获取每日统计数据")
    public ResponseEntity<ApiResponse<List<DailyStatsDTO>>> getDailyStats(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(ApiResponse.success(
            statsService.getDailyStats(user.getId(), startDate, endDate)));
    }
    
    @GetMapping("/subjects")
    @Operation(summary = "获取学科分布统计")
    public ResponseEntity<ApiResponse<List<SubjectStatDTO>>> getSubjectStats(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam(defaultValue = "week") String period) {
        return ResponseEntity.ok(ApiResponse.success(
            statsService.getSubjectStats(user.getId(), period)));
    }
}
```

### 6.6 Dashboard 聚合接口 (/api/v1/dashboard)

```java
@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "首页聚合数据")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    @GetMapping("/summary")
    @Operation(summary = "获取Dashboard摘要")
    public ResponseEntity<ApiResponse<DashboardSummaryDTO>> getSummary(
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.success(
            dashboardService.getSummary(user.getId())));
    }
}
```

---

## 7. 核心业务逻辑

### 7.1 番茄钟结算流程

```java
@Service
@RequiredArgsConstructor
public class PomodoroService {
    
    private final PomodoroRecordRepository pomodoroRepository;
    private final TaskRepository taskRepository;
    private final StatsService statsService;
    private final UserStreakRepository streakRepository;
    
    @Transactional
    public PomodoroSettlementDTO stop(String userId, String pomodoroId, StopPomodoroRequest request) {
        // 1. 获取番茄钟记录
        PomodoroRecord record = pomodoroRepository
            .findByIdAndUserId(pomodoroId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Pomodoro not found"));
        
        // 2. 验证状态
        if (record.getStatus() != PomodoroStatus.running && 
            record.getStatus() != PomodoroStatus.paused) {
            throw new BusinessException("Pomodoro is not active");
        }
        
        // 3. 更新记录
        record.setEndTime(Instant.now());
        record.setStatus(PomodoroStatus.valueOf(request.getStatus()));
        record.setActualDuration(calculateActualDuration(record));
        record.setAbandonReason(request.getAbandonReason());
        pomodoroRepository.save(record);
        
        // 4. 更新关联任务
        Task task = null;
        if (record.getTaskId() != null && request.getStatus().equals("completed")) {
            task = taskRepository.findById(record.getTaskId()).orElse(null);
            if (task != null) {
                task.setStatus(TaskStatus.in_progress);
                taskRepository.save(task);
            }
        }
        
        // 5. 更新统计（如果是完成状态）
        TodayStatsDTO todayStats = null;
        if (request.getStatus().equals("completed")) {
            todayStats = statsService.recordCompletedPomodoro(userId, record);
            updateUserStreak(userId);
        }
        
        // 6. 返回结算摘要
        return PomodoroSettlementDTO.builder()
            .record(mapToDTO(record))
            .task(task != null ? mapToDTO(task) : null)
            .todayStats(todayStats)
            .build();
    }
    
    private void updateUserStreak(String userId) {
        UserStreak streak = streakRepository.findByUserId(userId)
            .orElseGet(() -> UserStreak.builder().userId(userId).build());
        
        LocalDate today = LocalDate.now();
        LocalDate lastStudyDate = streak.getLastStudyDate();
        
        if (lastStudyDate == null || lastStudyDate.isBefore(today.minusDays(1))) {
            // 断开了，重新开始
            streak.setCurrentStreak(1);
            streak.setStreakStartDate(today);
        } else if (lastStudyDate.isBefore(today)) {
            // 连续
            streak.setCurrentStreak(streak.getCurrentStreak() + 1);
        }
        // 否则今天已经学习过，不重复计算
        
        streak.setLastStudyDate(today);
        
        if (streak.getCurrentStreak() > streak.getLongestStreak()) {
            streak.setLongestStreak(streak.getCurrentStreak());
        }
        
        streakRepository.save(streak);
    }
}
```

### 7.2 统计计算服务

```java
@Service
@RequiredArgsConstructor
public class StatsService {
    
    private final PomodoroDailyStatsRepository dailyStatsRepository;
    private final PomodoroRecordRepository pomodoroRepository;
    private final TaskRepository taskRepository;
    private final UserStreakRepository streakRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    
    /**
     * 记录完成的番茄钟，更新统计
     */
    @Transactional
    public TodayStatsDTO recordCompletedPomodoro(String userId, PomodoroRecord record) {
        LocalDate today = LocalDate.now();
        
        // 获取或创建今日统计
        PomodoroDailyStats dailyStats = dailyStatsRepository
            .findByUserIdAndStatDate(userId, today)
            .orElseGet(() -> PomodoroDailyStats.builder()
                .userId(userId)
                .statDate(today)
                .build());
        
        // 更新统计
        dailyStats.setCompletedCount(dailyStats.getCompletedCount() + 1);
        dailyStats.setTotalFocusSeconds(
            dailyStats.getTotalFocusSeconds() + record.getActualDuration());
        if (record.getTaskId() != null) {
            dailyStats.setRelatedTaskCount(
                dailyStats.getRelatedTaskCount() + 1);
        }
        
        dailyStatsRepository.save(dailyStats);
        
        // 清除缓存
        redisTemplate.delete("stats:today:" + userId);
        
        return getTodayStats(userId);
    }
    
    public TodayStatsDTO getTodayStats(String userId) {
        // 尝试从缓存获取
        String cacheKey = "stats:today:" + userId;
        TodayStatsDTO cached = (TodayStatsDTO) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached;
        }
        
        // 从数据库计算
        LocalDate today = LocalDate.now();
        PomodoroDailyStats pomodoroStats = dailyStatsRepository
            .findByUserIdAndStatDate(userId, today)
            .orElse(PomodoroDailyStats.builder()
                .completedCount(0)
                .totalFocusSeconds(0)
                .build());
        
        UserStreak streak = streakRepository.findByUserId(userId)
            .orElse(UserStreak.builder()
                .currentStreak(0)
                .build());
        
        // 统计今日完成任务
        Integer completedTasks = taskRepository.countByUserIdAndStatusAndCompletedAtAfter(
            userId, TaskStatus.completed, today.atStartOfDay());
        
        TodayStatsDTO stats = TodayStatsDTO.builder()
            .focusMinutes(pomodoroStats.getTotalFocusSeconds() / 60)
            .completedPomodoros(pomodoroStats.getCompletedCount())
            .completedTasks(completedTasks != null ? completedTasks : 0)
            .streakDays(streak.getCurrentStreak())
            .build();
        
        // 缓存60秒
        redisTemplate.opsForValue().set(cacheKey, stats, Duration.ofSeconds(60));
        
        return stats;
    }
    
    public UserStatsDTO getUserStats(String userId) {
        // 计算累计数据
        Integer totalFocusSeconds = pomodoroRepository
            .sumActualDurationByUserIdAndStatus(userId, PomodoroStatus.completed);
        Long totalPomodoros = pomodoroRepository
            .countByUserIdAndStatus(userId, PomodoroStatus.completed);
        
        Long totalTasks = taskRepository.countByUserId(userId);
        Long completedTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.completed);
        
        Integer studyDays = dailyStatsRepository.countDistinctStatDateByUserId(userId);
        
        UserStreak streak = streakRepository.findByUserId(userId)
            .orElse(UserStreak.builder()
                .currentStreak(0)
                .longestStreak(0)
                .build());
        
        TodayStatsDTO today = getTodayStats(userId);
        
        return UserStatsDTO.builder()
            .totalFocusMinutes(totalFocusSeconds != null ? totalFocusSeconds / 60 : 0)
            .totalPomodoros(totalPomodoros != null ? totalPomodoros.intValue() : 0)
            .totalTasks(totalTasks != null ? totalTasks.intValue() : 0)
            .completedTasks(completedTasks != null ? completedTasks.intValue() : 0)
            .currentStreak(streak.getCurrentStreak())
            .longestStreak(streak.getLongestStreak())
            .studyDays(studyDays != null ? studyDays : 0)
            .todayFocusMinutes(today.getFocusMinutes())
            .todayPomodoros(today.getCompletedPomodoros())
            .todayTasks(today.getCompletedTasks())
            .build();
    }
}
```

---

## 8. 安全配置

### 8.1 JWT 配置

```java
@Configuration
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtConfig {
    private String secret;
    private Long accessTokenExpiration = 7200000L;  // 2小时
    private Long refreshTokenExpiration = 604800000L;  // 7天
}

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
    
    private final JwtConfig jwtConfig;
    
    public String generateAccessToken(UserPrincipal user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtConfig.getAccessTokenExpiration());
        
        return Jwts.builder()
            .setSubject(user.getId())
            .claim("username", user.getUsername())
            .claim("type", "access")
            .setIssuedAt(now)
            .setExpiration(expiry)
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }
    
    public String generateRefreshToken(UserPrincipal user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtConfig.getRefreshTokenExpiration());
        
        return Jwts.builder()
            .setSubject(user.getId())
            .claim("type", "refresh")
            .setIssuedAt(now)
            .setExpiration(expiry)
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    
    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
        return claims.getSubject();
    }
    
    private Key getSigningKey() {
        byte[] keyBytes = jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

### 8.2 Spring Security 配置

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(
                new JwtAuthenticationFilter(tokenProvider, userDetailsService),
                UsernamePasswordAuthenticationFilter.class
            );
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

---

## 9. 配置文件

### 9.1 application.yml

```yaml
server:
  port: 8080

spring:
  application:
    name: studyflow
  
  datasource:
    url: jdbc:postgresql://localhost:5432/studyflow
    username: ${DB_USERNAME:studyflow}
    password: ${DB_PASSWORD:studyflow}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
  
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    show-sql: true
  
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
  
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      database: 0
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0

jwt:
  secret: ${JWT_SECRET:your-secret-key-here-must-be-at-least-256-bits-long}
  access-token-expiration: 7200000  # 2小时
  refresh-token-expiration: 604800000  # 7天

logging:
  level:
    com.studyflow: DEBUG
    org.springframework.security: DEBUG
```

---

## 10. 数据库迁移脚本

### V1__init.sql

```sql
-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户表
CREATE TABLE users (
    id                  VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    username            VARCHAR(50) NOT NULL,
    email               VARCHAR(100),
    phone               VARCHAR(20),
    password_hash       VARCHAR(255) NOT NULL,
    nickname            VARCHAR(50),
    avatar_url          VARCHAR(500),
    study_goal          VARCHAR(200),
    focus_duration      INT DEFAULT 1500,
    short_break_duration INT DEFAULT 300,
    long_break_duration INT DEFAULT 900,
    auto_start_break    BOOLEAN DEFAULT false,
    auto_start_pomodoro BOOLEAN DEFAULT false,
    long_break_interval INT DEFAULT 4,
    theme               VARCHAR(20) DEFAULT 'light',
    notification_enabled BOOLEAN DEFAULT true,
    sound_enabled       BOOLEAN DEFAULT true,
    vibration_enabled   BOOLEAN DEFAULT true,
    language            VARCHAR(10) DEFAULT 'zh-CN',
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT uq_users_phone UNIQUE (phone),
    CONSTRAINT chk_focus_duration CHECK (focus_duration BETWEEN 60 AND 3600),
    CONSTRAINT chk_short_break CHECK (short_break_duration BETWEEN 60 AND 1800),
    CONSTRAINT chk_long_break CHECK (long_break_duration BETWEEN 60 AND 3600),
    CONSTRAINT chk_theme CHECK (theme IN ('light', 'dark', 'system'))
);

-- 任务表
CREATE TABLE tasks (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    category        VARCHAR(50),
    priority        VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status          VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'abandoned')),
    display_order   INT DEFAULT 0,
    due_date        DATE,
    parent_id       VARCHAR(36) REFERENCES tasks(id) ON DELETE CASCADE,
    is_today        BOOLEAN DEFAULT true,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at    TIMESTAMP WITH TIME ZONE,
    deleted_at      TIMESTAMP WITH TIME ZONE
);

-- 番茄钟记录表
CREATE TABLE pomodoro_records (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id         VARCHAR(36) REFERENCES tasks(id) ON DELETE SET NULL,
    start_time      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time        TIMESTAMP WITH TIME ZONE,
    planned_duration    INT NOT NULL,
    actual_duration     INT,
    status          VARCHAR(20) DEFAULT 'running' CHECK (status IN ('running', 'paused', 'completed', 'stopped')),
    is_locked       BOOLEAN DEFAULT false,
    abandon_reason  VARCHAR(500),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 每日番茄统计表
CREATE TABLE pomodoro_daily_stats (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stat_date       DATE NOT NULL,
    completed_count INT DEFAULT 0,
    total_focus_seconds INT DEFAULT 0,
    stopped_count   INT DEFAULT 0,
    related_task_count INT DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, stat_date)
);

-- 用户连续学习记录表
CREATE TABLE user_streaks (
    id                  VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             VARCHAR(36) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_streak      INT DEFAULT 0,
    longest_streak      INT DEFAULT 0,
    last_study_date     DATE,
    streak_start_date   DATE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL AND email IS NOT NULL;

CREATE INDEX idx_tasks_user_status ON tasks(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_user_today ON tasks(user_id, is_today) WHERE deleted_at IS NULL;

CREATE INDEX idx_pomodoro_user_created ON pomodoro_records(user_id, created_at DESC);
CREATE INDEX idx_pomodoro_user_date ON pomodoro_records(user_id, DATE(start_time)) WHERE status = 'completed';

CREATE INDEX idx_pomodoro_stats_user_date ON pomodoro_daily_stats(user_id, stat_date);
```

---

## 11. 关键注意事项

### 11.1 用户资料与设置的数据一致性

**重要**：`GET /api/v1/users/profile` 必须返回完整数据，包括：
- 基础用户信息
- 番茄钟设置
- 系统设置
- 统计数据

当用户更新设置时（`PUT /api/v1/users/settings/pomodoro` 或 `PUT /api/v1/users/settings/system`），后端必须：
1. 更新对应的字段
2. 同时更新 `users` 表的 `updated_at` 字段
3. 确保 `GET /api/v1/users/profile` 返回的数据包含最新设置

### 11.2 统计数据实时性

- **今日统计**：实时计算，Redis缓存60秒
- **周统计**：准实时，Redis缓存5分钟
- **累计统计**：可容忍延迟，使用预聚合表

### 11.3 番茄钟结算原子性

番茄钟停止时的结算操作必须在一个事务中完成：
1. 更新番茄钟记录
2. 更新关联任务状态（可选）
3. 更新每日统计
4. 更新连续学习天数
5. 清除相关缓存

### 11.4 API 路径一致性

注意以下路径差异：
- API常量中：`/api/v1/pomodoro/*`（单数）
- 文档中：应该统一为 `/api/v1/pomodoros/*`（复数，RESTful规范）

**建议**：统一使用复数形式 `/api/v1/pomodoros/*`

---

## 12. AI 助手提示词模板

将以下内容复制到 IDEA 的 AI 助手（如 GitHub Copilot、Codeium、通义灵码等）中：

```
请帮我生成 StudyFlow 后端项目代码。

项目需求：
1. 技术栈：Spring Boot 3.2 + Java 21 + PostgreSQL 16 + Redis 7 + JPA + JWT + Flyway
2. 功能模块：用户认证、用户资料/设置、任务管理、番茄钟、数据统计
3. 已提供完整的数据库设计、Entity定义、DTO定义、API接口设计

请按以下顺序生成代码：
1. 首先生成完整的 pom.xml 依赖
2. 然后生成 application.yml 配置文件
3. 生成 Flyway 迁移脚本 V1__init.sql
4. 生成所有 Entity 类（使用 Lombok + JPA注解）
5. 生成所有 DTO 类
6. 生成 Repository 接口
7. 生成 Service 层（包含业务逻辑）
8. 生成 Controller 层（包含 Swagger 注解）
9. 生成安全配置（JWT + Spring Security）

参考文档：
- 数据库设计：users, tasks, pomodoro_records, pomodoro_daily_stats, user_streaks 表
- 核心业务：番茄钟结算时要同时更新统计和连续天数
- API规范：统一响应格式 ApiResponse<T>

请确保代码完整可运行，包含所有必要的注解和依赖注入。
```

---

*文档结束 - 如有问题请参考 `docs/PRD.md`, `docs/API_SPEC.md`, `docs/DATABASE.md` 获取更详细信息*
