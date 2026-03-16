# StudyFlow 后端开发最终指导文档

> **版本**: Final  
> **日期**: 2026-03-15  
> **适用**: 软件工程毕设 / 基于开题报告技术选型

---

## 📖 文档导航

根据你的开题报告，我为你准备了以下文档：

| 文档 | 用途 | 优先级 |
|------|------|--------|
| `BACKEND_ARCHITECTURE_GUIDE_v2.md` | **后端开发权威指南**（用这个！） | ⭐⭐⭐⭐⭐ |
| `BACKEND_OPTIMIZATION_ANALYSIS.md` | 技术选型分析对比 | ⭐⭐⭐ |
| `DOCUMENT_FIXES_SUMMARY.md` | 文档修正记录 | ⭐⭐ |
| `DATABASE.md` | 数据库设计（需参考，但用MySQL语法） | ⭐⭐⭐ |
| `API_SPEC.md` | API接口规范（已更新） | ⭐⭐⭐⭐ |

---

## 🎯 核心结论

### 技术栈确认（基于你的开题报告优化）

```
✅ Java 21 + Spring Boot 3.2.x
✅ MySQL 8.0（你开题报告承诺的）
✅ MyBatis-Plus 3.5.x（你开题报告承诺的）
✅ Redis 7.x
✅ Maven多模块（单体应用，非微服务）
✅ Knife4j（Swagger增强）
```

### 为什么不完全按照开题报告？

| 开题报告 | 建议 | 原因 |
|----------|------|------|
| Spring Cloud 微服务 | **单体应用** | 毕设时间有限，单体更适合 |
| MongoDB | **只用MySQL+Redis** | 毕设阶段数据量不大 |
| 自己训练AI模型 | **调用大模型API** | 算力、数据、时间都不够 |

**向导师解释的话术**：
> "系统采用单体模块化架构，通过Maven多模块组织代码，各模块职责清晰耦合低。当未来业务规模扩大时，可平滑演进为微服务架构。"

---

## 🚀 快速开始（3步走）

### Step 1：环境准备（10分钟）

```bash
# 1. 启动MySQL 8.0
docker run -d --name studyflow-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=studyflow \
  -p 3306:3306 mysql:8.0

# 2. 启动Redis 7
docker run -d --name studyflow-redis \
  -p 6379:6379 redis:7-alpine
```

### Step 2：IDEA创建项目（20分钟）

1. **创建父项目**：
   ```
   File → New → Project → Maven
   Name: studyflow-backend
   GroupId: com.studyflow
   ArtifactId: studyflow-parent
   ```

2. **创建子模块**：
   ```
   右键 → New → Module（依次创建）
   - studyflow-common
   - studyflow-user
   - studyflow-task
   - studyflow-pomodoro
   - studyflow-stats
   - studyflow-ai（预留）
   - studyflow-server
   ```

3. **复制父POM**：
   从 `BACKEND_ARCHITECTURE_GUIDE_v2.md` 第2.3节复制父POM配置

### Step 3：使用AI生成代码（核心）

1. 打开IDEA的AI助手（通义灵码/GitHub Copilot）
2. 复制以下提示词：

```
请帮我生成StudyFlow后端代码，基于以下技术栈：
- Spring Boot 3.2 + Java 21
- MyBatis-Plus 3.5.5 + MySQL 8.0
- Maven多模块项目

请按以下顺序生成：

1. 首先在studyflow-common模块中生成：
   - BaseEntity（基础实体，包含id, createdAt, updatedAt, deletedAt）
   - ApiResponse（统一响应类）
   - ResultUtils（响应工具类）
   - BusinessException（业务异常）
   - GlobalExceptionHandler（全局异常处理器）

2. 然后在studyflow-user模块中生成：
   - User实体类（对应users表）
   - UserMapper接口
   - UserService（包含getProfile, updateProfile方法）
   - UserController（包含GET/PUT /api/v1/users/profile接口）

参考数据库表结构：
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(50),
    avatar_url VARCHAR(500),
    study_goal VARCHAR(200),
    focus_duration INT DEFAULT 1500,
    short_break_duration INT DEFAULT 300,
    long_break_duration INT DEFAULT 900,
    auto_start_break TINYINT(1) DEFAULT 0,
    auto_start_pomodoro TINYINT(1) DEFAULT 0,
    long_break_interval INT DEFAULT 4,
    theme VARCHAR(20) DEFAULT 'light',
    notification_enabled TINYINT(1) DEFAULT 1,
    sound_enabled TINYINT(1) DEFAULT 1,
    vibration_enabled TINYINT(1) DEFAULT 1,
    language VARCHAR(10) DEFAULT 'zh-CN',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME
);
```

要求：
- 使用Lombok简化代码
- 使用MyBatis-Plus的注解（@TableName, @TableId等）
- 包含完整的注释
- 使用中文注释
```

3. 让AI逐步生成其他模块代码

---

## 📚 关键知识点速查

### MyBatis-Plus 常用注解

```java
@TableName("users")          // 指定表名
@TableId(type = IdType.ASSIGN_UUID)  // UUID主键
@TableField("user_name")     // 指定字段名
@TableLogic                  // 逻辑删除
```

### MyBatis-Plus 常用方法

```java
// Service层继承 ServiceImpl<Mapper, Entity>
// 自动获得以下方法：
save(entity)                 // 插入
updateById(entity)           // 根据ID更新
getById(id)                  // 根据ID查询
removeById(id)               // 根据ID删除
list()                       // 查询所有
list(queryWrapper)           // 条件查询
```

### 统一响应格式

```java
// 成功
ApiResponse.success(data)

// 失败
ApiResponse.error(400, "参数错误")
```

---

## ⚠️ 常见坑点提醒

### 1. MySQL 8.0 认证问题

如果使用MySQL 8.0，可能会遇到认证插件问题：

```sql
-- 修改认证方式为mysql_native_password
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
FLUSH PRIVILEGES;
```

### 2. 时区问题

在 `application.yml` 中指定时区：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/studyflow?serverTimezone=Asia/Shanghai
```

### 3. Mapper扫描问题

在启动类上添加Mapper扫描：

```java
@SpringBootApplication
@MapperScan("com.studyflow.**.mapper")
public class StudyFlowApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudyFlowApplication.class, args);
    }
}
```

### 4. 跨域问题

添加跨域配置：

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("*")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*");
    }
}
```

---

## 📝 开发检查清单

### 基础功能
- [ ] 用户注册/登录
- [ ] JWT认证
- [ ] 获取用户资料
- [ ] 更新用户资料
- [ ] 更新番茄钟设置

### 任务模块
- [ ] 创建任务
- [ ] 查询任务列表
- [ ] 更新任务
- [ ] 删除任务
- [ ] 任务排序

### 番茄钟模块
- [ ] 开始番茄钟
- [ ] 停止番茄钟
- [ ] 今日统计
- [ ] 周统计

### 统计模块
- [ ] 累计统计
- [ ] 学习日历
- [ ] 连续天数计算

---

## 🆘 求助资源

| 问题 | 解决方案 |
|------|----------|
| MyBatis-Plus不会用 | 官方文档：https://baomidou.com |
| Spring Security配置 | 搜索"Spring Security JWT 教程" |
| 报错不会解决 | 复制错误信息问ChatGPT |
| 紧急问题 | 联系导师/同学 |

---

## 💡 最后的建议

### 关于你的不足（非批评，是建议）

你说"不是专业的后端"，这很正常。作为软件工程学生，你的优势在于：

1. **产品思维强**：你的前端Monorepo组织得很好，开题报告写得详细
2. **学习能力强**：能快速掌握React Native等新技术
3. **有完整规划**：开题报告功能模块清晰

**需要提升的地方**：
1. **后端技术深度**：需要花时间理解MyBatis-Plus和Spring Security
2. **架构认知**：理解为什么要分层，为什么要用设计模式
3. **调试能力**：学会看日志，学会用IDEA调试

### 学习路线建议

1. **本周**：跟着AI生成的代码，理解每个类的作用
2. **下周**：尝试自己写一个简单的CRUD接口
3. **第三周**：理解事务、缓存、安全等高级特性

### 给导师的好印象

1. **代码规范**：使用统一的代码风格，写好注释
2. **文档完整**：API文档（Knife4j）、数据库文档齐全
3. **演示流畅**：答辩时准备好演示数据，功能能跑通

---

**祝你毕设顺利！有任何问题随时问我。**

