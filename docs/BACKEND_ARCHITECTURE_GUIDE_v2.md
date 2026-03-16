# StudyFlow 后端架构指导文档 v2.0

> **版本**: 2.0.0  
> **日期**: 2026-03-15  
> **目标读者**: 后端开发人员 / 软件工程毕设项目  
> **技术栈**: Spring Boot + MyBatis-Plus + MySQL 8.0 + Redis 7  
> **架构**: 单体应用 + Maven多模块（为微服务演进预留）

---

## 📋 文档说明

本文档基于开题报告的技术选型进行优化，整合：
- 开题报告中的技术承诺（MySQL、MyBatis-Plus）
- PRD产品需求
- API接口规范
- 实际前端业务代码分析

**设计理念**：
1. **务实**：采用单体应用而非微服务（适合毕设周期）
2. **渐进**：Maven多模块组织，未来可平滑演进为微服务
3. **国产优先**：MyBatis-Plus、Knife4j等国内主流技术栈

---

## 1. 技术栈选型

### 1.1 核心技术栈

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **框架** | Spring Boot | 3.2.x | 主框架 |
| **语言** | Java | 21 | LTS版本 |
| **数据库** | MySQL | 8.0 | 开题报告承诺 |
| **ORM** | MyBatis-Plus | 3.5.5 | 开题报告承诺 |
| **缓存** | Redis | 7.x | 会话 + 热点数据 |
| **安全** | Spring Security + JWT | 6.2.x | 认证授权 |
| **API文档** | Knife4j | 4.4.x | 国人开发的Swagger增强 |
| **构建工具** | Maven | 3.9.x | 多模块管理 |
| **数据库迁移** | Flyway | 10.x | 版本化脚本 |

### 1.2 为什么选择这些技术？

#### MyBatis-Plus vs JPA

**选择MyBatis-Plus的原因**：
- ✅ 开题报告中已承诺
- ✅ 国内最流行，参考资料丰富
- ✅ 代码生成器强大，适合快速开发
- ✅ SQL可控，出问题易调试

**学习资源**：
- 官方文档：https://baomidou.com
- 示例项目：https://github.com/baomidou/mybatis-plus-samples

#### MySQL 8.0 vs PostgreSQL

**选择MySQL的原因**：
- ✅ 开题报告中已承诺
- ✅ 国内云服务商支持好（阿里云RDS）
- ✅ 你的参考文献都是MySQL
- ✅ 部署运维更简单

**MySQL 8.0新特性使用建议**：
- 使用Window Functions（窗口函数）做排行榜
- 使用CTE（公用表表达式）做递归查询（如任务树）
- 使用JSON类型存储灵活配置

#### 单体应用 vs 微服务

**选择单体应用的原因**：
- ✅ 开发周期短（3-4个月毕设时间）
- ✅ 部署简单（一个Jar包）
- ✅ 调试方便（IDE一键启动）
- ✅ 答辩演示稳定

**如何向导师解释**：
> "系统采用单体模块化架构，通过Maven多模块组织代码，各模块职责清晰耦合低。当未来业务规模扩大时，可平滑拆分为微服务架构。"

---

## 2. 项目结构（Maven多模块）

### 2.1 目录结构

```
studyflow-backend/
├── pom.xml                                    # 父POM，统一版本管理
├── studyflow-common/                          # 公共模块（被所有模块依赖）
│   ├── pom.xml
│   └── src/
│       └── java/com/studyflow/common/
│           ├── config/                        # 公共配置
│           ├── entity/                        # 基础实体
│           ├── result/                        # 统一响应封装
│           ├── exception/                     # 全局异常
│           └── util/                          # 工具类
│
├── studyflow-user/                            # 用户模块
│   ├── pom.xml
│   └── src/
│       ├── java/com/studyflow/user/
│       │   ├── controller/                    # API接口
│       │   ├── service/                       # 业务逻辑
│       │   ├── mapper/                        # MyBatis-Plus Mapper
│       │   ├── entity/                        # 实体类
│       │   └── dto/                           # 数据传输对象
│       └── resources/
│           └── mapper/                        # XML映射文件
│
├── studyflow-task/                            # 任务模块
├── studyflow-pomodoro/                        # 番茄钟模块
├── studyflow-stats/                           # 统计模块
├── studyflow-ai/                              # AI模块（预留）
│
└── studyflow-server/                          # 启动模块
    ├── pom.xml
    └── src/
        └── java/com/studyflow/server/
            └── StudyFlowApplication.java      # SpringBoot启动类
```

### 2.2 模块依赖关系

```
studyflow-server（启动模块，打包成Jar）
    ├── studyflow-user
    │       └── studyflow-common
    ├── studyflow-task
    │       └── studyflow-common
    ├── studyflow-pomodoro
    │       └── studyflow-common
    ├── studyflow-stats
    │       └── studyflow-common
    └── studyflow-ai
            └── studyflow-common
```

### 2.3 父POM配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.studyflow</groupId>
    <artifactId>studyflow-parent</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <name>StudyFlow Parent</name>
    <description>知己学伴 - 智能学习计划系统</description>

    <!-- 模块列表 -->
    <modules>
        <module>studyflow-common</module>
        <module>studyflow-user</module>
        <module>studyflow-task</module>
        <module>studyflow-pomodoro</module>
        <module>studyflow-stats</module>
        <module>studyflow-ai</module>
        <module>studyflow-server</module>
    </modules>

    <!-- 继承Spring Boot -->
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.3</version>
        <relativePath/>
    </parent>

    <!-- 统一版本管理 -->
    <properties>
        <java.version>21</java.version>
        <mybatis-plus.version>3.5.5</mybatis-plus.version>
        <knife4j.version>4.4.0</knife4j.version>
        <jwt.version>0.12.5</jwt.version>
        <fastjson2.version>2.0.47</fastjson2.version>
    </properties>

    <!-- 依赖版本管理 -->
    <dependencyManagement>
        <dependencies>
            <!-- MyBatis-Plus -->
            <dependency>
                <groupId>com.baomidou</groupId>
                <artifactId>mybatis-plus-boot-starter</artifactId>
                <version>${mybatis-plus.version}</version>
            </dependency>
            
            <!-- Knife4j API文档 -->
            <dependency>
                <groupId>com.github.xiaoymin</groupId>
                <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
                <version>${knife4j.version}</version>
            </dependency>
            
            <!-- JWT -->
            <dependency>
                <groupId>io.jsonwebtoken</groupId>
                <artifactId>jjwt</artifactId>
                <version>${jwt.version}</version>
            </dependency>
            
            <!-- JSON处理 -->
            <dependency>
                <groupId>com.alibaba.fastjson2</groupId>
                <artifactId>fastjson2</artifactId>
                <version>${fastjson2.version}</version>
            </dependency>
            
            <!-- 内部模块依赖 -->
            <dependency>
                <groupId>com.studyflow</groupId>
                <artifactId>studyflow-common</artifactId>
                <version>${project.version}</version>
            </dependency>
            <!-- 其他模块... -->
        </dependencies>
    </dependencyManagement>

    <!-- 公共依赖（所有子模块继承） -->
    <dependencies>
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>
</project>
```

---

## 3. 数据库设计（MySQL 8.0）

### 3.1 用户表

```sql
CREATE TABLE `users` (
    `id` VARCHAR(36) PRIMARY KEY COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `email` VARCHAR(100) COMMENT '邮箱',
    `phone` VARCHAR(20) COMMENT '手机号',
    `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
    
    -- 个人资料
    `nickname` VARCHAR(50) COMMENT '昵称',
    `avatar_url` VARCHAR(500) COMMENT '头像URL',
    `study_goal` VARCHAR(200) COMMENT '学习目标',
    
    -- 番茄钟设置（单位：秒）
    `focus_duration` INT DEFAULT 1500 COMMENT '专注时长，默认25分钟',
    `short_break_duration` INT DEFAULT 300 COMMENT '短休息时长，默认5分钟',
    `long_break_duration` INT DEFAULT 900 COMMENT '长休息时长，默认15分钟',
    `auto_start_break` TINYINT(1) DEFAULT 0 COMMENT '自动开始休息',
    `auto_start_pomodoro` TINYINT(1) DEFAULT 0 COMMENT '自动开始下一个番茄',
    `long_break_interval` INT DEFAULT 4 COMMENT '长休息间隔番茄数',
    
    -- 系统设置
    `theme` VARCHAR(20) DEFAULT 'light' COMMENT '主题：light/dark/system',
    `notification_enabled` TINYINT(1) DEFAULT 1 COMMENT '通知开关',
    `sound_enabled` TINYINT(1) DEFAULT 1 COMMENT '提示音开关',
    `vibration_enabled` TINYINT(1) DEFAULT 1 COMMENT '震动开关',
    `language` VARCHAR(10) DEFAULT 'zh-CN' COMMENT '语言',
    
    -- 时间戳
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` DATETIME COMMENT '软删除时间',
    
    -- 约束
    UNIQUE KEY `uk_username` (`username`),
    UNIQUE KEY `uk_email` (`email`),
    UNIQUE KEY `uk_phone` (`phone`),
    KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

### 3.2 任务表

```sql
CREATE TABLE `tasks` (
    `id` VARCHAR(36) PRIMARY KEY COMMENT '任务ID',
    `user_id` VARCHAR(36) NOT NULL COMMENT '用户ID',
    
    `title` VARCHAR(200) NOT NULL COMMENT '任务标题',
    `description` TEXT COMMENT '任务描述',
    `category` VARCHAR(50) COMMENT '学科分类',
    
    `priority` ENUM('low', 'medium', 'high') DEFAULT 'medium' COMMENT '优先级',
    `status` ENUM('todo', 'in_progress', 'completed', 'abandoned') DEFAULT 'todo' COMMENT '状态',
    
    `display_order` INT DEFAULT 0 COMMENT '排序序号',
    `due_date` DATE COMMENT '截止日期',
    `parent_id` VARCHAR(36) COMMENT '父任务ID（支持子任务）',
    `is_today` TINYINT(1) DEFAULT 1 COMMENT '是否加入今日任务',
    
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `completed_at` DATETIME COMMENT '完成时间',
    `deleted_at` DATETIME COMMENT '软删除时间',
    
    KEY `idx_user_status` (`user_id`, `status`),
    KEY `idx_user_today` (`user_id`, `is_today`),
    KEY `idx_completed_at` (`completed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务表';
```

### 3.3 番茄钟记录表

```sql
CREATE TABLE `pomodoro_records` (
    `id` VARCHAR(36) PRIMARY KEY COMMENT '记录ID',
    `user_id` VARCHAR(36) NOT NULL COMMENT '用户ID',
    `task_id` VARCHAR(36) COMMENT '关联任务ID',
    
    `start_time` DATETIME NOT NULL COMMENT '开始时间',
    `end_time` DATETIME COMMENT '结束时间',
    
    `planned_duration` INT NOT NULL COMMENT '计划时长（秒）',
    `actual_duration` INT COMMENT '实际时长（秒）',
    
    `status` ENUM('running', 'paused', 'completed', 'stopped') DEFAULT 'running' COMMENT '状态',
    `is_locked` TINYINT(1) DEFAULT 0 COMMENT '是否锁屏模式',
    `abandon_reason` VARCHAR(500) COMMENT '放弃原因',
    
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    KEY `idx_user_created` (`user_id`, `created_at`),
    KEY `idx_user_date` (`user_id`, `start_time`),
    KEY `idx_task` (`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='番茄钟记录表';
```

### 3.4 统计预聚合表

```sql
-- 每日番茄统计
CREATE TABLE `pomodoro_daily_stats` (
    `id` VARCHAR(36) PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL COMMENT '用户ID',
    `stat_date` DATE NOT NULL COMMENT '统计日期',
    
    `completed_count` INT DEFAULT 0 COMMENT '完成番茄数',
    `total_focus_seconds` INT DEFAULT 0 COMMENT '总专注秒数',
    `stopped_count` INT DEFAULT 0 COMMENT '放弃次数',
    `related_task_count` INT DEFAULT 0 COMMENT '关联任务数',
    
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY `uk_user_date` (`user_id`, `stat_date`),
    KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='每日番茄统计';

-- 用户连续学习记录
CREATE TABLE `user_streaks` (
    `id` VARCHAR(36) PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL COMMENT '用户ID',
    
    `current_streak` INT DEFAULT 0 COMMENT '当前连续天数',
    `longest_streak` INT DEFAULT 0 COMMENT '最长连续天数',
    `last_study_date` DATE COMMENT '最后学习日期',
    `streak_start_date` DATE COMMENT '连续开始日期',
    
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY `uk_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户连续学习记录';
```

---

## 4. 实体类（MyBatis-Plus）

### 4.1 基础实体（Common模块）

```java
package com.studyflow.common.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 基础实体类
 * 所有实体类都继承此类
 */
@Data
public class BaseEntity {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime deletedAt;
}
```

### 4.2 用户实体

```java
package com.studyflow.user.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.studyflow.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户实体
 * 对应 users 表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("users")
public class User extends BaseEntity {
    
    // 登录凭证
    private String username;
    private String email;
    private String phone;
    private String passwordHash;
    
    // 个人资料
    private String nickname;
    private String avatarUrl;
    private String studyGoal;
    
    // 番茄钟设置（单位：秒）
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
}
```

### 4.3 任务实体

```java
package com.studyflow.task.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.studyflow.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 任务实体
 * 对应 tasks 表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("tasks")
public class Task extends BaseEntity {
    
    private String userId;
    private String title;
    private String description;
    private String category;
    
    private String priority;    // low, medium, high
    private String status;      // todo, in_progress, completed, abandoned
    
    private Integer displayOrder;
    private LocalDate dueDate;
    private String parentId;
    private Boolean isToday;
    
    private LocalDateTime completedAt;
}
```

---

## 5. MyBatis-Plus Mapper 设计

### 5.1 基础Mapper

```java
package com.studyflow.common.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * 基础Mapper接口
 * 继承MyBatis-Plus的BaseMapper，获得CRUD能力
 */
public interface BaseMapper<T> extends BaseMapper<T> {
    // 可以在这里添加通用的自定义SQL方法
}
```

### 5.2 用户Mapper

```java
package com.studyflow.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.studyflow.user.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * 用户Mapper
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {
    
    /**
     * 根据用户名查询用户
     */
    @Select("SELECT * FROM users WHERE username = #{username} AND deleted_at IS NULL")
    User selectByUsername(String username);
    
    /**
     * 根据邮箱查询用户
     */
    @Select("SELECT * FROM users WHERE email = #{email} AND deleted_at IS NULL")
    User selectByEmail(String email);
    
    /**
     * 查询用户统计数据（使用XML方式更复杂）
     */
    UserStatsDTO selectUserStats(String userId);
}
```

### 5.3 UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.studyflow.user.mapper.UserMapper">
    
    <!-- 查询用户统计数据 -->
    <select id="selectUserStats" resultType="com.studyflow.user.dto.UserStatsDTO">
        SELECT 
            u.id as userId,
            -- 累计统计
            COALESCE(SUM(pds.completed_count), 0) as totalPomodoros,
            COALESCE(SUM(pds.total_focus_seconds), 0) / 60 as totalFocusMinutes,
            -- 今日统计
            COALESCE(today_pds.completed_count, 0) as todayPomodoros,
            COALESCE(today_pds.total_focus_seconds, 0) / 60 as todayFocusMinutes,
            -- 连续天数
            us.current_streak as currentStreak,
            us.longest_streak as longestStreak
        FROM users u
        LEFT JOIN pomodoro_daily_stats pds ON u.id = pds.user_id
        LEFT JOIN pomodoro_daily_stats today_pds 
            ON u.id = today_pds.user_id 
            AND today_pds.stat_date = CURDATE()
        LEFT JOIN user_streaks us ON u.id = us.user_id
        WHERE u.id = #{userId}
        AND u.deleted_at IS NULL
        GROUP BY u.id
    </select>
    
</mapper>
```

---

## 6. Service 层设计

### 6.1 用户Service

```java
package com.studyflow.user.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.studyflow.common.result.ApiResponse;
import com.studyflow.user.dto.*;
import com.studyflow.user.entity.User;
import com.studyflow.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户Service
 */
@Service
@RequiredArgsConstructor
public class UserService extends ServiceImpl<UserMapper, User> {
    
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * 获取用户完整资料
     */
    public UserProfileDTO getProfile(String userId) {
        User user = getById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        UserProfileDTO dto = new UserProfileDTO();
        BeanUtils.copyProperties(user, dto);
        
        // 设置头像URL（补充完整路径）
        if (user.getAvatarUrl() != null) {
            dto.setAvatar(fileService.getFullUrl(user.getAvatarUrl()));
        }
        
        // 查询统计数据
        dto.setStats(getUserStats(userId));
        
        return dto;
    }
    
    /**
     * 更新用户资料
     */
    @Transactional(rollbackFor = Exception.class)
    public UserProfileDTO updateProfile(String userId, UpdateProfileRequest request) {
        User user = getById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        // 更新字段
        if (request.getNickname() != null) {
            user.setNickname(request.getNickname());
        }
        if (request.getAvatar() != null) {
            user.setAvatarUrl(request.getAvatar());
        }
        if (request.getStudyGoal() != null) {
            user.setStudyGoal(request.getStudyGoal());
        }
        if (request.getEmail() != null) {
            // 检查邮箱是否已被使用
            User existUser = userMapper.selectByEmail(request.getEmail());
            if (existUser != null && !existUser.getId().equals(userId)) {
                throw new BusinessException("邮箱已被使用");
            }
            user.setEmail(request.getEmail());
        }
        
        updateById(user);
        
        return getProfile(userId);
    }
    
    /**
     * 更新番茄钟设置
     */
    @Transactional(rollbackFor = Exception.class)
    public PomodoroSettingsDTO updatePomodoroSettings(String userId, PomodoroSettingsDTO settings) {
        User user = getById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        user.setFocusDuration(settings.getFocusDuration());
        user.setShortBreakDuration(settings.getShortBreakDuration());
        user.setLongBreakDuration(settings.getLongBreakDuration());
        user.setAutoStartBreak(settings.getAutoStartBreak());
        user.setAutoStartPomodoro(settings.getAutoStartPomodoro());
        user.setLongBreakInterval(settings.getLongBreakInterval());
        
        updateById(user);
        
        return settings;
    }
    
    /**
     * 获取用户统计数据
     */
    public UserStatsDTO getUserStats(String userId) {
        // 使用自定义SQL查询统计数据
        return userMapper.selectUserStats(userId);
    }
}
```

---

## 7. Controller 层设计

### 7.1 用户Controller

```java
package com.studyflow.user.controller;

import com.studyflow.common.result.ApiResponse;
import com.studyflow.common.result.ResultUtils;
import com.studyflow.user.dto.*;
import com.studyflow.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 用户Controller
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "用户", description = "用户资料和设置管理")
@SecurityRequirement(name = "Authorization")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/profile")
    @Operation(summary = "获取用户完整资料")
    public ApiResponse<UserProfileDTO> getProfile(
            @AuthenticationPrincipal UserPrincipal user) {
        return ResultUtils.success(userService.getProfile(user.getUserId()));
    }
    
    @PutMapping("/profile")
    @Operation(summary = "更新用户资料")
    public ApiResponse<UserProfileDTO> updateProfile(
            @AuthenticationPrincipal UserPrincipal user,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResultUtils.success(
            userService.updateProfile(user.getUserId(), request));
    }
    
    @GetMapping("/settings/pomodoro")
    @Operation(summary = "获取番茄钟设置")
    public ApiResponse<PomodoroSettingsDTO> getPomodoroSettings(
            @AuthenticationPrincipal UserPrincipal user) {
        return ResultUtils.success(
            userService.getPomodoroSettings(user.getUserId()));
    }
    
    @PutMapping("/settings/pomodoro")
    @Operation(summary = "更新番茄钟设置")
    public ApiResponse<PomodoroSettingsDTO> updatePomodoroSettings(
            @AuthenticationPrincipal UserPrincipal user,
            @Valid @RequestBody PomodoroSettingsDTO settings) {
        return ResultUtils.success(
            userService.updatePomodoroSettings(user.getUserId(), settings));
    }
    
    @GetMapping("/stats")
    @Operation(summary = "获取用户统计数据")
    public ApiResponse<UserStatsDTO> getUserStats(
            @AuthenticationPrincipal UserPrincipal user) {
        return ResultUtils.success(userService.getUserStats(user.getUserId()));
    }
}
```

---

## 8. 统一响应封装

### 8.1 统一响应类

```java
package com.studyflow.common.result;

import lombok.Data;

/**
 * 统一API响应
 */
@Data
public class ApiResponse<T> {
    
    private Integer code;
    private String message;
    private T data;
    private Long timestamp;
    
    public ApiResponse() {
        this.timestamp = System.currentTimeMillis();
    }
    
    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("success");
        response.setData(data);
        return response;
    }
    
    public static <T> ApiResponse<T> error(Integer code, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(code);
        response.setMessage(message);
        return response;
    }
}
```

### 8.2 响应工具类

```java
package com.studyflow.common.result;

/**
 * 响应工具类
 */
public class ResultUtils {
    
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.success(data);
    }
    
    public static <T> ApiResponse<T> success() {
        return ApiResponse.success(null);
    }
    
    public static <T> ApiResponse<T> error(ErrorCode errorCode) {
        return ApiResponse.error(errorCode.getCode(), errorCode.getMessage());
    }
    
    public static <T> ApiResponse<T> error(Integer code, String message) {
        return ApiResponse.error(code, message);
    }
}
```

### 8.3 错误码枚举

```java
package com.studyflow.common.result;

import lombok.Getter;

/**
 * 错误码枚举
 */
@Getter
public enum ErrorCode {
    
    SUCCESS(200, "成功"),
    PARAMS_ERROR(400, "请求参数错误"),
    NOT_LOGIN(401, "未登录"),
    NO_AUTH(403, "无权限"),
    NOT_FOUND(404, "资源不存在"),
    SYSTEM_ERROR(500, "系统内部异常"),
    
    // 用户相关 1000
    USER_NOT_FOUND(1001, "用户不存在"),
    USER_ALREADY_EXIST(1002, "用户已存在"),
    USERNAME_ALREADY_EXIST(1003, "用户名已存在"),
    EMAIL_ALREADY_EXIST(1004, "邮箱已存在"),
    PASSWORD_ERROR(1005, "密码错误"),
    
    // 番茄钟相关 2000
    POMODORO_NOT_FOUND(2001, "番茄钟记录不存在"),
    POMODORO_ALREADY_RUNNING(2002, "已有进行中的番茄钟");
    
    private final int code;
    private final String message;
    
    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
```

---

## 9. 全局异常处理

```java
package com.studyflow.common.exception;

import com.studyflow.common.result.ApiResponse;
import com.studyflow.common.result.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BusinessException.class)
    public ApiResponse<Void> handleBusinessException(BusinessException e) {
        log.warn("业务异常: {}", e.getMessage());
        return ApiResponse.error(e.getCode(), e.getMessage());
    }
    
    @ExceptionHandler(BindException.class)
    public ApiResponse<Void> handleBindException(BindException e) {
        log.warn("参数校验失败: {}", e.getMessage());
        return ApiResponse.error(ErrorCode.PARAMS_ERROR.getCode(), 
            "请求参数错误: " + e.getBindingResult().getFieldError().getDefaultMessage());
    }
    
    @ExceptionHandler(Exception.class)
    public ApiResponse<Void> handleException(Exception e) {
        log.error("系统异常", e);
        return ApiResponse.error(ErrorCode.SYSTEM_ERROR.getCode(), 
            "系统繁忙，请稍后重试");
    }
}
```

---

## 10. JWT 认证配置

### 10.1 JWT工具类

```java
package com.studyflow.common.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT工具类
 */
@Component
@Slf4j
public class JwtUtils {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration:7200000}")
    private Long expiration;  // 默认2小时
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
    
    /**
     * 生成Token
     */
    public String generateToken(String userId, String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        
        return Jwts.builder()
            .subject(userId)
            .claim("username", username)
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(getSigningKey())
            .compact();
    }
    
    /**
     * 从Token中获取用户ID
     */
    public String getUserIdFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.getSubject();
    }
    
    /**
     * 验证Token
     */
    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }
    
    private Claims parseToken(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
```

### 10.2 Spring Security配置

```java
package com.studyflow.common.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security配置
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 禁用CSRF（前后端分离）
            .csrf(AbstractHttpConfigurer::disable)
            
            // 无状态会话
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 权限配置
            .authorizeHttpRequests(auth -> auth
                // 公开接口
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/doc.html", "/webjars/**", "/swagger-resources/**", "/v3/api-docs/**").permitAll()
                // 其他需要认证
                .anyRequest().authenticated()
            )
            
            // 添加JWT过滤器
            .addFilterBefore(jwtAuthenticationFilter, 
                UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

---

## 11. 配置文件

### 11.1 application.yml

```yaml
server:
  port: 8080

spring:
  application:
    name: studyflow
  
  # 数据源配置
  datasource:
    url: jdbc:mysql://localhost:3306/studyflow?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: ${MYSQL_USERNAME:root}
    password: ${MYSQL_PASSWORD:root}
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000
  
  # MyBatis-Plus配置
  mybatis-plus:
    mapper-locations: classpath*:mapper/**/*.xml
    type-aliases-package: com.studyflow.**.entity
    configuration:
      map-underscore-to-camel-case: true
      log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
    global-config:
      db-config:
        logic-delete-field: deletedAt
        logic-delete-value: "CURRENT_TIMESTAMP"
        logic-not-delete-value: "null"
  
  # Flyway配置
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
    clean-disabled: true
  
  # Redis配置
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
      database: 0
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0

# JWT配置
jwt:
  secret: ${JWT_SECRET:your-secret-key-here-must-be-at-least-256-bits-long-for-security}
  expiration: 7200000  # 2小时

# Knife4j配置
knife4j:
  enable: true
  setting:
    language: zh_cn
    swagger-model-name: 实体类列表

# 日志配置
logging:
  level:
    com.studyflow: DEBUG
    com.studyflow.mapper: DEBUG
```

---

## 12. Flyway 数据库迁移脚本

### V1__init.sql

```sql
-- 用户表
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(36) PRIMARY KEY COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `email` VARCHAR(100) COMMENT '邮箱',
    `phone` VARCHAR(20) COMMENT '手机号',
    `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
    `nickname` VARCHAR(50) COMMENT '昵称',
    `avatar_url` VARCHAR(500) COMMENT '头像URL',
    `study_goal` VARCHAR(200) COMMENT '学习目标',
    `focus_duration` INT DEFAULT 1500 COMMENT '专注时长(秒)',
    `short_break_duration` INT DEFAULT 300 COMMENT '短休息时长(秒)',
    `long_break_duration` INT DEFAULT 900 COMMENT '长休息时长(秒)',
    `auto_start_break` TINYINT(1) DEFAULT 0 COMMENT '自动开始休息',
    `auto_start_pomodoro` TINYINT(1) DEFAULT 0 COMMENT '自动开始番茄',
    `long_break_interval` INT DEFAULT 4 COMMENT '长休息间隔',
    `theme` VARCHAR(20) DEFAULT 'light' COMMENT '主题',
    `notification_enabled` TINYINT(1) DEFAULT 1 COMMENT '通知开关',
    `sound_enabled` TINYINT(1) DEFAULT 1 COMMENT '声音开关',
    `vibration_enabled` TINYINT(1) DEFAULT 1 COMMENT '震动开关',
    `language` VARCHAR(10) DEFAULT 'zh-CN' COMMENT '语言',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME COMMENT '软删除时间',
    UNIQUE KEY `uk_username` (`username`),
    UNIQUE KEY `uk_email` (`email`),
    UNIQUE KEY `uk_phone` (`phone`),
    KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 任务表
CREATE TABLE IF NOT EXISTS `tasks` (
    `id` VARCHAR(36) PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL COMMENT '用户ID',
    `title` VARCHAR(200) NOT NULL COMMENT '标题',
    `description` TEXT COMMENT '描述',
    `category` VARCHAR(50) COMMENT '分类',
    `priority` ENUM('low', 'medium', 'high') DEFAULT 'medium' COMMENT '优先级',
    `status` ENUM('todo', 'in_progress', 'completed', 'abandoned') DEFAULT 'todo' COMMENT '状态',
    `display_order` INT DEFAULT 0 COMMENT '排序',
    `due_date` DATE COMMENT '截止日期',
    `parent_id` VARCHAR(36) COMMENT '父任务ID',
    `is_today` TINYINT(1) DEFAULT 1 COMMENT '是否今日任务',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `completed_at` DATETIME COMMENT '完成时间',
    `deleted_at` DATETIME COMMENT '删除时间',
    KEY `idx_user_status` (`user_id`, `status`),
    KEY `idx_user_today` (`user_id`, `is_today`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务表';

-- 番茄钟记录表
CREATE TABLE IF NOT EXISTS `pomodoro_records` (
    `id` VARCHAR(36) PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL COMMENT '用户ID',
    `task_id` VARCHAR(36) COMMENT '任务ID',
    `start_time` DATETIME NOT NULL COMMENT '开始时间',
    `end_time` DATETIME COMMENT '结束时间',
    `planned_duration` INT NOT NULL COMMENT '计划时长(秒)',
    `actual_duration` INT COMMENT '实际时长(秒)',
    `status` ENUM('running', 'paused', 'completed', 'stopped') DEFAULT 'running' COMMENT '状态',
    `is_locked` TINYINT(1) DEFAULT 0 COMMENT '是否锁屏',
    `abandon_reason` VARCHAR(500) COMMENT '放弃原因',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY `idx_user_created` (`user_id`, `created_at`),
    KEY `idx_user_date` (`user_id`, `start_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='番茄钟记录表';

-- 每日番茄统计表
CREATE TABLE IF NOT EXISTS `pomodoro_daily_stats` (
    `id` VARCHAR(36) PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL COMMENT '用户ID',
    `stat_date` DATE NOT NULL COMMENT '统计日期',
    `completed_count` INT DEFAULT 0 COMMENT '完成番茄数',
    `total_focus_seconds` INT DEFAULT 0 COMMENT '总专注秒数',
    `stopped_count` INT DEFAULT 0 COMMENT '放弃次数',
    `related_task_count` INT DEFAULT 0 COMMENT '关联任务数',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_user_date` (`user_id`, `stat_date`),
    KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='每日番茄统计';

-- 用户连续学习记录表
CREATE TABLE IF NOT EXISTS `user_streaks` (
    `id` VARCHAR(36) PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL COMMENT '用户ID',
    `current_streak` INT DEFAULT 0 COMMENT '当前连续天数',
    `longest_streak` INT DEFAULT 0 COMMENT '最长连续天数',
    `last_study_date` DATE COMMENT '最后学习日期',
    `streak_start_date` DATE COMMENT '连续开始日期',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户连续学习记录';
```

---

## 13. IDEA 创建项目步骤

### 步骤1：创建父项目

1. File → New → Project
2. 选择 **Maven Archetype**
3. 填写：
   - Name: `studyflow-backend`
   - GroupId: `com.studyflow`
   - ArtifactId: `studyflow-parent`
   - Version: `1.0.0-SNAPSHOT`

### 步骤2：创建子模块

```
右键 studyflow-backend → New → Module → Maven
依次创建：
1. studyflow-common（不需要依赖其他模块）
2. studyflow-user（依赖 studyflow-common）
3. studyflow-task（依赖 studyflow-common）
4. studyflow-pomodoro（依赖 studyflow-common）
5. studyflow-stats（依赖 studyflow-common）
6. studyflow-ai（依赖 studyflow-common）
7. studyflow-server（依赖以上所有模块）
```

### 步骤3：配置依赖关系

在每个子模块的 `pom.xml` 中添加：

```xml
<parent>
    <groupId>com.studyflow</groupId>
    <artifactId>studyflow-parent</artifactId>
    <version>1.0.0-SNAPSHOT</version>
</parent>

<artifactId>studyflow-xxx</artifactId>

<dependencies>
    <!-- 依赖common模块 -->
    <dependency>
        <groupId>com.studyflow</groupId>
        <artifactId>studyflow-common</artifactId>
    </dependency>
    
    <!-- 其他依赖... -->
</dependencies>
```

### 步骤4：使用 AI 生成代码

将本指导文档输入到 IDEA 的 AI 助手（通义灵码/Copilot），让它帮你：
1. 生成 Entity 类
2. 生成 Mapper 接口和 XML
3. 生成 Service 和 Controller
4. 生成配置文件

---

## 14. 快速开始

### 14.1 环境准备

```bash
# 1. 启动MySQL
docker run -d \
  --name studyflow-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=studyflow \
  -p 3306:3306 \
  mysql:8.0 \
  --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_unicode_ci

# 2. 启动Redis
docker run -d \
  --name studyflow-redis \
  -p 6379:6379 \
  redis:7-alpine
```

### 14.2 运行项目

```bash
# 1. 编译
mvn clean install

# 2. 运行
cd studyflow-server
mvn spring-boot:run
```

### 14.3 访问API文档

```
http://localhost:8080/doc.html
```

---

## 15. 给你的建议

### 15.1 关于技术学习

1. **MyBatis-Plus**：看官方文档的"快速开始"和"核心功能"章节，2小时上手
2. **Spring Security**：找一个完整的JWT教程跟着做，不要自己造轮子
3. **MySQL 8.0**：重点了解窗口函数（ROW_NUMBER、RANK），做排行榜很有用

### 15.2 关于毕设答辩

**如果导师问你为什么不用微服务？**
> "考虑到毕设的开发周期和团队规模，单体应用更适合快速迭代。项目采用Maven多模块组织，各模块职责清晰，未来可以平滑演进为微服务架构。"

**如果导师问你为什么用MyBatis-Plus而不是JPA？**
> "MyBatis-Plus在国内企业应用更广泛，SQL可控便于优化，且提供了强大的代码生成器，能提高开发效率。"

### 15.3 开发优先级

1. **Week 1**：用户注册/登录、JWT认证
2. **Week 2**：任务管理CRUD
3. **Week 3**：番茄钟核心功能
4. **Week 4**：数据统计
5. **Week 5**：AI对话（调用API）
6. **Week 6**：测试优化

---

*本文档针对开题报告技术选型进行了优化，采用MySQL + MyBatis-Plus + 单体应用架构，更适合毕设项目的开发节奏。*
