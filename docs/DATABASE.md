# StudyFlow 数据库设计文档

> **版本**: 3.0.0  
> **日期**: 2026-03-15  
> **数据库**: PostgreSQL 16  

---

## 1. 设计原则

1. **简洁优先**: 只保留必要字段，删除冗余
2. **扩展预留**: 为AI、社区模块预留表结构
3. **性能优化**: 合理的索引设计，预聚合统计表
4. **软删除**: 核心业务表支持软删除

---

## 2. 核心表结构

### 2.1 用户表 (users)

存储用户基本信息、个性化设置和系统设置。

```sql
CREATE TABLE users (
    -- 主键
    id                  VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 登录凭证
    username            VARCHAR(50) NOT NULL,
    email               VARCHAR(100),
    phone               VARCHAR(20),
    password_hash       VARCHAR(255) NOT NULL,
    
    -- 个人资料
    nickname            VARCHAR(50),            -- 昵称
    avatar_url          VARCHAR(500),           -- 头像URL
    study_goal          VARCHAR(200),           -- 学习目标/签名
    
    -- 番茄钟个性化设置（单位：秒）
    focus_duration      INT DEFAULT 1500,       -- 专注时长，默认25分钟
    short_break_duration INT DEFAULT 300,       -- 短休息时长，默认5分钟
    long_break_duration INT DEFAULT 900,        -- 长休息时长，默认15分钟
    auto_start_break    BOOLEAN DEFAULT false,  -- 是否自动开始休息
    auto_start_pomodoro BOOLEAN DEFAULT false,  -- 是否自动开始下一个番茄
    long_break_interval INT DEFAULT 4,          -- 几个番茄后长休息
    
    -- 系统设置
    theme               VARCHAR(20) DEFAULT 'light',   -- 主题: light | dark | system
    notification_enabled BOOLEAN DEFAULT true,         -- 通知开关
    sound_enabled       BOOLEAN DEFAULT true,          -- 提示音开关
    vibration_enabled   BOOLEAN DEFAULT true,          -- 震动开关（移动端）
    language            VARCHAR(10) DEFAULT 'zh-CN',   -- 语言设置
    
    -- 时间戳
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP WITH TIME ZONE,      -- 软删除标记
    
    -- 约束
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT uq_users_email UNIQUE (email) WHERE email IS NOT NULL,
    CONSTRAINT uq_users_phone UNIQUE (phone) WHERE phone IS NOT NULL,
    CONSTRAINT chk_focus_duration CHECK (focus_duration BETWEEN 60 AND 3600),
    CONSTRAINT chk_short_break CHECK (short_break_duration BETWEEN 60 AND 1800),
    CONSTRAINT chk_long_break CHECK (long_break_duration BETWEEN 60 AND 3600),
    CONSTRAINT chk_long_break_interval CHECK (long_break_interval BETWEEN 1 AND 10),
    CONSTRAINT chk_theme CHECK (theme IN ('light', 'dark', 'system'))
);

-- 索引
CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL AND email IS NOT NULL;
CREATE INDEX idx_users_phone ON users(phone) WHERE deleted_at IS NULL AND phone IS NOT NULL;
CREATE INDEX idx_users_created_at ON users(created_at DESC) WHERE deleted_at IS NULL;
```

**字段说明:**

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| id | VARCHAR(36) | gen_random_uuid() | 主键，UUID |
| username | VARCHAR(50) | - | 用户名，唯一，3-50字符 |
| email | VARCHAR(100) | NULL | 邮箱，唯一，可选 |
| phone | VARCHAR(20) | NULL | 手机号，唯一，可选 |
| password_hash | VARCHAR(255) | - | 密码哈希（bcrypt） |
| nickname | VARCHAR(50) | NULL | 昵称，1-50字符 |
| avatar_url | VARCHAR(500) | NULL | 头像URL |
| study_goal | VARCHAR(200) | NULL | 学习目标/签名 |
| focus_duration | INT | 1500 | 专注时长（秒），60-3600 |
| short_break_duration | INT | 300 | 短休息（秒），60-1800 |
| long_break_duration | INT | 900 | 长休息（秒），60-3600 |
| auto_start_break | BOOLEAN | false | 自动开始休息 |
| auto_start_pomodoro | BOOLEAN | false | 自动开始下一个番茄 |
| long_break_interval | INT | 4 | 长休息间隔番茄数，1-10 |
| theme | VARCHAR(20) | 'light' | 主题：light/dark/system |
| notification_enabled | BOOLEAN | true | 通知开关 |
| sound_enabled | BOOLEAN | true | 提示音开关 |
| vibration_enabled | BOOLEAN | true | 震动开关 |
| language | VARCHAR(10) | 'zh-CN' | 语言代码 |
| created_at | TIMESTAMP | CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | CURRENT_TIMESTAMP | 更新时间 |
| deleted_at | TIMESTAMP | NULL | 软删除时间 |

### 2.2 任务表 (tasks)

```sql
CREATE TABLE tasks (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- 基本信息
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    category        VARCHAR(50),               -- 学科分类
    
    -- 状态管理
    priority        VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status          VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'abandoned')),
    
    -- 排序与组织
    display_order   INT DEFAULT 0,
    due_date        DATE,
    parent_id       VARCHAR(36) REFERENCES tasks(id) ON DELETE CASCADE,
    is_today        BOOLEAN DEFAULT true,
    
    -- 时间戳
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at    TIMESTAMP WITH TIME ZONE,
    deleted_at      TIMESTAMP WITH TIME ZONE,
    
    -- 索引
    CONSTRAINT fk_task_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_task_parent FOREIGN KEY (parent_id) REFERENCES tasks(id)
);

-- 索引设计
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_user_today ON tasks(user_id, is_today) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_user_created ON tasks(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_completed_at ON tasks(completed_at) WHERE status = 'completed';
CREATE INDEX idx_tasks_user_category ON tasks(user_id, category) WHERE deleted_at IS NULL;
```

### 2.3 番茄钟记录表 (pomodoro_records)

```sql
CREATE TABLE pomodoro_records (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id         VARCHAR(36) REFERENCES tasks(id) ON DELETE SET NULL,
    
    -- 时间记录
    start_time      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time        TIMESTAMP WITH TIME ZONE,
    
    -- 时长（秒）
    planned_duration    INT NOT NULL,
    actual_duration     INT,
    
    -- 状态与模式
    status          VARCHAR(20) DEFAULT 'running' CHECK (status IN ('running', 'paused', 'completed', 'stopped')),
    is_locked       BOOLEAN DEFAULT false,
    abandon_reason  VARCHAR(500),
    
    -- 时间戳
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 索引
    CONSTRAINT fk_pomodoro_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_pomodoro_task FOREIGN KEY (task_id) REFERENCES tasks(id)
);

-- 索引设计
CREATE INDEX idx_pomodoro_user_created ON pomodoro_records(user_id, created_at DESC);
CREATE INDEX idx_pomodoro_user_status ON pomodoro_records(user_id, status);
CREATE INDEX idx_pomodoro_task ON pomodoro_records(task_id) WHERE task_id IS NOT NULL;
CREATE INDEX idx_pomodoro_start_time ON pomodoro_records(start_time);
CREATE INDEX idx_pomodoro_user_date ON pomodoro_records(user_id, DATE(start_time)) 
    WHERE status = 'completed';
```

---

## 3. 统计预聚合表

### 3.1 每日番茄统计表 (pomodoro_daily_stats)

```sql
CREATE TABLE pomodoro_daily_stats (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stat_date       DATE NOT NULL,
    
    -- 番茄统计
    completed_count INT DEFAULT 0,
    total_focus_seconds INT DEFAULT 0,
    stopped_count   INT DEFAULT 0,
    
    -- 关联任务数（去重）
    related_task_count INT DEFAULT 0,
    
    -- 时间戳
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 唯一约束
    UNIQUE(user_id, stat_date)
);

CREATE INDEX idx_pomodoro_stats_user_date ON pomodoro_daily_stats(user_id, stat_date);
```

### 3.2 每日任务统计表 (task_daily_stats)

```sql
CREATE TABLE task_daily_stats (
    id                  VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stat_date           DATE NOT NULL,
    
    -- 任务统计
    completed_count     INT DEFAULT 0,
    created_count       INT DEFAULT 0,
    
    -- 时间戳
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 唯一约束
    UNIQUE(user_id, stat_date)
);

CREATE INDEX idx_task_stats_user_date ON task_daily_stats(user_id, stat_date);
```

### 3.3 用户连续学习记录表 (user_streaks)

```sql
CREATE TABLE user_streaks (
    id                  VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             VARCHAR(36) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- 连续天数
    current_streak      INT DEFAULT 0,
    longest_streak      INT DEFAULT 0,
    
    -- 关键日期
    last_study_date     DATE,
    streak_start_date   DATE,
    
    -- 时间戳
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_streaks_user ON user_streaks(user_id);
```

---

## 4. 扩展模块预留表

### 4.1 AI数字人模块

```sql
-- AI对话会话表
CREATE TABLE chat_sessions (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(100),
    context_summary TEXT,
    message_count   INT DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_chat_session_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id, created_at DESC);

-- AI对话消息表
CREATE TABLE chat_messages (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      VARCHAR(36) NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content         TEXT NOT NULL,
    type            VARCHAR(20) DEFAULT 'text' CHECK (type IN ('text', 'plan', 'reminder')),
    metadata        JSONB,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_chat_message_session FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
);

CREATE INDEX idx_chat_messages_session ON chat_messages(session_id, created_at);

-- AI学习计划表
CREATE TABLE ai_study_plans (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200),
    description     TEXT,
    start_date      DATE,
    end_date        DATE,
    goals           JSONB,
    tasks           JSONB,
    status          VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ai_plan_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_ai_plans_user ON ai_study_plans(user_id, status);
```

### 4.2 社区模块

```sql
-- 社区动态表
CREATE TABLE posts (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    images          JSONB,                      -- 图片URL数组
    tags            JSONB,                      -- 标签数组
    study_time      INT,                        -- 本次学习时长（分钟）
    task_count      INT,                        -- 完成任务数
    like_count      INT DEFAULT 0,
    comment_count   INT DEFAULT 0,
    is_deleted      BOOLEAN DEFAULT false,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_post_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_posts_user ON posts(user_id, created_at DESC);
CREATE INDEX idx_posts_created ON posts(created_at DESC) WHERE is_deleted = false;

-- 评论表
CREATE TABLE comments (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id         VARCHAR(36) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id         VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id       VARCHAR(36) REFERENCES comments(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    is_deleted      BOOLEAN DEFAULT false,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_comment_post FOREIGN KEY (post_id) REFERENCES posts(id),
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_comment_parent FOREIGN KEY (parent_id) REFERENCES comments(id)
);

CREATE INDEX idx_comments_post ON comments(post_id, created_at);

-- 点赞表
CREATE TABLE likes (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id         VARCHAR(36) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id         VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(post_id, user_id),
    CONSTRAINT fk_like_post FOREIGN KEY (post_id) REFERENCES posts(id),
    CONSTRAINT fk_like_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_likes_post ON likes(post_id);
CREATE INDEX idx_likes_user ON likes(user_id);

-- 学习小组表
CREATE TABLE study_groups (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    cover_image     VARCHAR(500),
    category        VARCHAR(50),
    member_count    INT DEFAULT 0,
    created_by      VARCHAR(36) NOT NULL REFERENCES users(id),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_group_creator FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_study_groups_category ON study_groups(category);

-- 小组成员表
CREATE TABLE group_members (
    id              VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id        VARCHAR(36) NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id         VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role            VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(group_id, user_id),
    CONSTRAINT fk_member_group FOREIGN KEY (group_id) REFERENCES study_groups(id),
    CONSTRAINT fk_member_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_user ON group_members(user_id);
```

---

## 5. 初始化数据

```sql
-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 软删除触发器函数
CREATE OR REPLACE FUNCTION update_deleted_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.deleted_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 6. ER 关系图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              核心表关系图                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐                                                          │
│   │    users     │                                                          │
│   │              │◄────────────────────────────────────────────────────┐    │
│   │  id (PK)     │                                                     │    │
│   │  username    │                                                     │    │
│   │  settings... │                                                     │    │
│   └──────┬───────┘                                                     │    │
│          │ 1:N                                                         │    │
│          ▼                                                            │    │
│   ┌──────────────┐     0..1    ┌──────────────────┐                   │    │
│   │    tasks     │◄────────────│ pomodoro_records │                   │    │
│   │              │             │                  │                   │    │
│   │  id (PK)     │             │  id (PK)         │                   │    │
│   │  user_id(FK) │◄────────────│  user_id(FK)     │                   │    │
│   │  status      │             │  task_id(FK)     │                   │    │
│   │  category    │             │  status          │                   │    │
│   └──────────────┘             └──────────────────┘                   │    │
│          │                                                            │    │
│          ▼                                                            │    │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │    │
│   │pomodoro_daily_stats│  │task_daily_stats  │  │  user_streaks    │   │    │
│   └──────────────────┘  └──────────────────┘  └──────────────────┘   │    │
│                                                                       │    │
│   ════════════════════════════════════════════════════════════════════│════│
│   扩展表                                                              │    │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │    │
│   │chat_sessions │  │    posts     │  │ study_groups │               │    │
│   └──────────────┘  └──────────────┘  └──────────────┘               │    │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │    │
│   │chat_messages │  │   comments   │  │group_members │               │    │
│   └──────────────┘  └──────────────┘  └──────────────┘               │    │
│   ┌──────────────┐  ┌──────────────┐                                  │    │
│   │ai_study_plans│  │    likes     │                                  │    │
│   └──────────────┘  └──────────────┘◄─────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. 索引策略总结

### 7.1 用户相关索引

| 表名 | 索引名 | 字段 | 用途 | 条件 |
|------|--------|------|------|------|
| users | idx_users_username | username | 用户名登录查询 | deleted_at IS NULL |
| users | idx_users_email | email | 邮箱登录/找回密码 | deleted_at IS NULL AND email IS NOT NULL |
| users | idx_users_phone | phone | 手机号登录 | deleted_at IS NULL AND phone IS NOT NULL |
| users | idx_users_created_at | created_at DESC | 用户列表排序 | deleted_at IS NULL |

### 7.2 任务相关索引

| 表名 | 索引名 | 字段 | 用途 | 条件 |
|------|--------|------|------|------|
| tasks | idx_tasks_user_status | user_id, status | 任务列表查询 | deleted_at IS NULL |
| tasks | idx_tasks_user_today | user_id, is_today | 今日任务查询 | deleted_at IS NULL |
| tasks | idx_tasks_completed_at | completed_at | 统计查询 | status = 'completed' |
| tasks | idx_tasks_user_category | user_id, category | 学科分类查询 | deleted_at IS NULL |

### 7.3 番茄钟相关索引

| 表名 | 索引名 | 字段 | 用途 | 条件 |
|------|--------|------|------|------|
| pomodoro_records | idx_pomodoro_user_created | user_id, created_at DESC | 历史记录查询 | - |
| pomodoro_records | idx_pomodoro_user_status | user_id, status | 活跃记录查询 | - |
| pomodoro_records | idx_pomodoro_task | task_id | 任务关联查询 | task_id IS NOT NULL |
| pomodoro_records | idx_pomodoro_user_date | user_id, DATE(start_time) | 按日期统计 | status = 'completed' |

### 7.4 统计表索引

| 表名 | 索引名 | 字段 | 用途 |
|------|--------|------|------|
| pomodoro_daily_stats | idx_pomodoro_stats_user_date | user_id, stat_date | 每日统计查询 |
| task_daily_stats | idx_task_stats_user_date | user_id, stat_date | 任务统计查询 |
| user_streaks | idx_user_streaks_user | user_id | 连续天数查询 |

---

*文档结束*
