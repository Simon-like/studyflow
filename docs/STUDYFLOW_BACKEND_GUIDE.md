# StudyFlow 后端应用构建指南

> **版本**: v1.0  
> **技术栈**: Spring Boot 3.2.x + Java 21 + MySQL 8.0 + Redis 7  
> **适用对象**: 后端开发初学者及有一定经验的开发者

---

## 目录

1. [环境准备](#1-环境准备)
2. [项目初始化](#2-项目初始化)
3. [数据库配置](#3-数据库配置)
4. [核心代码开发](#4-核心代码开发)
5. [测试方法](#5-测试方法)
6. [部署流程](#6-部署流程)
7. [常见问题解决](#7-常见问题解决)

---

## 1. 环境准备

### 1.1 JDK 21 安装

#### Windows 安装

1. **下载 JDK 21**
   - 访问 [Oracle JDK 21](https://www.oracle.com/java/technologies/downloads/#java21) 或 [Adoptium](https://adoptium.net/)
   - 下载 Windows x64 MSI Installer

2. **安装步骤**
   ```bash
   # 运行下载的 MSI 安装包
   # 按向导完成安装，建议安装到 C:\Program Files\Java\jdk-21
   ```

3. **配置环境变量**
   ```bash
   # 打开系统属性 -> 高级 -> 环境变量
   
   # 新建 JAVA_HOME 变量
   JAVA_HOME = C:\Program Files\Java\jdk-21
   
   # 编辑 Path 变量，添加
   %JAVA_HOME%\bin
   ```

4. **验证安装**
   ```bash
   java -version
   # 输出: openjdk version "21.0.x" ...
   
   javac -version
   # 输出: javac 21.0.x
   ```

#### macOS 安装

```bash
# 使用 Homebrew 安装
brew install openjdk@21

# 创建符号链接
sudo ln -sfn /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-21.jdk

# 添加到 ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 验证
java -version
```

#### Linux (Ubuntu) 安装

```bash
# 更新包索引
sudo apt update

# 安装 OpenJDK 21
sudo apt install openjdk-21-jdk

# 验证
java -version

# 配置环境变量（可选）
echo 'export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 1.2 MySQL 8.0 安装（Docker 方式）

#### 安装 Docker

**Windows/macOS**: 下载 [Docker Desktop](https://www.docker.com/products/docker-desktop)

**Linux (Ubuntu)**:
```bash
# 安装 Docker
sudo apt update
sudo apt install docker.io docker-compose

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 将当前用户加入 docker 组
sudo usermod -aG docker $USER
# 重新登录生效
```

#### 使用 Docker 运行 MySQL 8.0

```bash
# 创建数据目录
mkdir -p ~/docker/mysql/data
mkdir -p ~/docker/mysql/conf

# 拉取 MySQL 8.0 镜像
docker pull mysql:8.0

# 运行 MySQL 容器
docker run -d \
  --name studyflow-mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root123456 \
  -e MYSQL_DATABASE=studyflow \
  -e MYSQL_USER=studyflow \
  -e MYSQL_PASSWORD=studyflow123 \
  -v ~/docker/mysql/data:/var/lib/mysql \
  --restart unless-stopped \
  mysql:8.0 \
  --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_unicode_ci

# 查看容器状态
docker ps

# 进入 MySQL 容器
docker exec -it studyflow-mysql mysql -uroot -p
# 输入密码: root123456

# 测试连接
mysql -h127.0.0.1 -P3306 -ustudyflow -p
# 输入密码: studyflow123
```

#### 使用 Docker Compose（推荐）

创建 `~/docker/mysql/docker-compose.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: studyflow-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123456
      MYSQL_DATABASE: studyflow
      MYSQL_USER: studyflow
      MYSQL_PASSWORD: studyflow123
    ports:
      - "3306:3306"
    volumes:
      - ./data:/var/lib/mysql
      - ./init:/docker-entrypoint-initdb.d
    command: >
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_unicode_ci
      --default-authentication-plugin=mysql_native_password
    restart: unless-stopped
```

启动：
```bash
cd ~/docker/mysql
docker-compose up -d
```

### 1.3 Redis 7 安装（Docker 方式）

```bash
# 创建 Redis 数据目录
mkdir -p ~/docker/redis/data

# 创建 Redis 配置文件
cat > ~/docker/redis/redis.conf << 'EOF'
bind 0.0.0.0
port 6379
requirepass redis123456
maxmemory 256mb
maxmemory-policy allkeys-lru
appendonly yes
appendfsync everysec
EOF

# 运行 Redis 容器
docker run -d \
  --name studyflow-redis \
  -p 6379:6379 \
  -v ~/docker/redis/data:/data \
  -v ~/docker/redis/redis.conf:/usr/local/etc/redis/redis.conf \
  --restart unless-stopped \
  redis:7-alpine \
  redis-server /usr/local/etc/redis/redis.conf

# 测试连接
docker exec -it studyflow-redis redis-cli -a redis123456 ping
# 输出: PONG
```

#### Docker Compose 配置

创建 `~/docker/redis/docker-compose.yml`:

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    container_name: studyflow-redis
    ports:
      - "6379:6379"
    volumes:
      - ./data:/data
      - ./redis.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf
    restart: unless-stopped
```

### 1.4 IntelliJ IDEA 配置

#### 下载与安装

1. 访问 [JetBrains 官网](https://www.jetbrains.com/idea/download/)
2. 下载 **IntelliJ IDEA Ultimate**（学生可免费申请）或 **Community** 版
3. 按向导完成安装

#### 必要插件安装

打开 IDEA -> File -> Settings -> Plugins，安装以下插件：

| 插件名称 | 用途 |
|---------|------|
| **Lombok** | 简化代码（@Data, @Builder 等） |
| **MyBatisX** | MyBatis 增强支持 |
| **Rainbow Brackets** | 彩虹括号，提高可读性 |
| **.env files support** | 环境变量文件支持 |
| **Docker** | Docker 集成（Ultimate 内置） |
| **Maven Helper** | Maven 依赖分析 |

#### JDK 配置

```
File -> Project Structure -> SDKs -> + -> Add JDK
选择 JDK 21 的安装路径
```

#### Maven 配置

```
File -> Settings -> Build, Execution, Deployment -> Build Tools -> Maven
- Maven home path: 使用捆绑的 Maven 或自定义路径
- User settings file: ~/.m2/settings.xml
- Local repository: ~/.m2/repository
```

#### 代码风格配置

```
File -> Settings -> Editor -> Code Style -> Java
- 设置缩进为 4 个空格
- 设置换行长度为 120
- 导入 Google Java Style 或自定义
```

---

## 2. 项目初始化

### 2.1 在 IDEA 中创建 Maven 多模块项目

#### 步骤 1：创建父项目

1. **File -> New -> Project**
2. 选择 **Maven Archetype**，不选择任何 Archetype
3. 填写项目信息：
   - **Name**: studyflow-backend
   - **Location**: 选择你的工作目录
   - **Language**: Java
   - **JDK**: 21
   - **GroupId**: com.studyflow
   - **ArtifactId**: studyflow-backend
   - **Version**: 1.0.0-SNAPSHOT

4. 点击 **Create**

#### 步骤 2：配置父 POM

删除 `src` 目录（父项目不需要源代码），编辑 `pom.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- 父项目信息 -->
    <groupId>com.studyflow</groupId>
    <artifactId>studyflow-backend</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>
    <name>StudyFlow Backend</name>
    <description>智能学习陪伴应用后端</description>

    <!-- 子模块列表 -->
    <modules>
        <module>studyflow-common</module>
        <module>studyflow-user</module>
        <module>studyflow-task</module>
        <module>studyflow-pomodoro</module>
        <module>studyflow-stats</module>
        <module>studyflow-ai</module>
        <module>studyflow-server</module>
    </modules>

    <!-- 属性配置 -->
    <properties>
        <!-- 基础配置 -->
        <java.version>21</java.version>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        
        <!-- 版本管理 -->
        <spring-boot.version>3.2.5</spring-boot.version>
        <mybatis-plus.version>3.5.5</mybatis-plus.version>
        <mysql-connector.version>8.0.33</mysql-connector.version>
        <redis.version>3.2.5</redis.version>
        <jwt.version>0.12.5</jwt.version>
        <knife4j.version>4.5.0</knife4j.version>
        <flyway.version>10.11.0</flyway.version>
        <lombok.version>1.18.32</lombok.version>
        <hutool.version>5.8.27</hutool.version>
        <mapstruct.version>1.5.5.Final</mapstruct.version>
    </properties>

    <!-- 依赖管理 -->
    <dependencyManagement>
        <dependencies>
            <!-- Spring Boot BOM -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <!-- MyBatis Plus -->
            <dependency>
                <groupId>com.baomidou</groupId>
                <artifactId>mybatis-plus-boot-starter</artifactId>
                <version>${mybatis-plus.version}</version>
            </dependency>

            <!-- MySQL 驱动 -->
            <dependency>
                <groupId>com.mysql</groupId>
                <artifactId>mysql-connector-j</artifactId>
                <version>${mysql-connector.version}</version>
            </dependency>

            <!-- JWT -->
            <dependency>
                <groupId>io.jsonwebtoken</groupId>
                <artifactId>jjwt-api</artifactId>
                <version>${jwt.version}</version>
            </dependency>
            <dependency>
                <groupId>io.jsonwebtoken</groupId>
                <artifactId>jjwt-impl</artifactId>
                <version>${jwt.version}</version>
            </dependency>
            <dependency>
                <groupId>io.jsonwebtoken</groupId>
                <artifactId>jjwt-jackson</artifactId>
                <version>${jwt.version}</version>
            </dependency>

            <!-- Knife4j API 文档 -->
            <dependency>
                <groupId>com.github.xiaoymin</groupId>
                <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
                <version>${knife4j.version}</version>
            </dependency>

            <!-- Flyway 数据库迁移 -->
            <dependency>
                <groupId>org.flywaydb</groupId>
                <artifactId>flyway-core</artifactId>
                <version>${flyway.version}</version>
            </dependency>
            <dependency>
                <groupId>org.flywaydb</groupId>
                <artifactId>flyway-mysql</artifactId>
                <version>${flyway.version}</version>
            </dependency>

            <!-- Hutool 工具包 -->
            <dependency>
                <groupId>cn.hutool</groupId>
                <artifactId>hutool-all</artifactId>
                <version>${hutool.version}</version>
            </dependency>

            <!-- MapStruct 对象映射 -->
            <dependency>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct</artifactId>
                <version>${mapstruct.version}</version>
            </dependency>

            <!-- Lombok -->
            <dependency>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <!-- 构建配置 -->
    <build>
        <pluginManagement>
            <plugins>
                <!-- Spring Boot 插件 -->
                <plugin>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-maven-plugin</artifactId>
                    <version>${spring-boot.version}</version>
                    <configuration>
                        <excludes>
                            <exclude>
                                <groupId>org.projectlombok</groupId>
                                <artifactId>lombok</artifactId>
                            </exclude>
                        </excludes>
                    </configuration>
                </plugin>

                <!-- Maven 编译插件 -->
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <version>3.13.0</version>
                    <configuration>
                        <source>21</source>
                        <target>21</target>
                        <annotationProcessorPaths>
                            <path>
                                <groupId>org.projectlombok</groupId>
                                <artifactId>lombok</artifactId>
                                <version>${lombok.version}</version>
                            </path>
                            <path>
                                <groupId>org.mapstruct</groupId>
                                <artifactId>mapstruct-processor</artifactId>
                                <version>${mapstruct.version}</version>
                            </path>
                        </annotationProcessorPaths>
                    </configuration>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>

    <!-- 仓库配置 -->
    <repositories>
        <repository>
            <id>aliyunmaven</id>
            <name>阿里云公共仓库</name>
            <url>https://maven.aliyun.com/repository/public</url>
        </repository>
        <repository>
            <id>central</id>
            <name>Maven Central</name>
            <url>https://repo.maven.apache.org/maven2</url>
        </repository>
    </repositories>

</project>
```

### 2.2 创建各子模块

#### 步骤 1：创建 studyflow-common 模块

1. **右键父项目 -> New -> Module**
2. 选择 **Maven**，不选择 Archetype
3. 填写信息：
   - **Name**: studyflow-common
   - **ArtifactId**: studyflow-common
4. 点击 **Create**

编辑 `studyflow-common/pom.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.studyflow</groupId>
        <artifactId>studyflow-backend</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>studyflow-common</artifactId>
    <name>StudyFlow Common</name>
    <description>公共模块 - 包含通用工具、常量、异常等</description>

    <dependencies>
        <!-- Spring Boot Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Hutool -->
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
        </dependency>

        <!-- MyBatis Plus -->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
        </dependency>
    </dependencies>

</project>
```

#### 步骤 2：创建 studyflow-user 模块

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.studyflow</groupId>
        <artifactId>studyflow-backend</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>studyflow-user</artifactId>
    <name>StudyFlow User</name>
    <description>用户模块 - 用户管理、认证授权</description>

    <dependencies>
        <!-- 依赖公共模块 -->
        <dependency>
            <groupId>com.studyflow</groupId>
            <artifactId>studyflow-common</artifactId>
            <version>${project.version}</version>
        </dependency>

        <!-- Spring Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- MySQL -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Redis -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
    </dependencies>

</project>
```

#### 步骤 3：创建 studyflow-task 模块

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.studyflow</groupId>
        <artifactId>studyflow-backend</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>studyflow-task</artifactId>
    <name>StudyFlow Task</name>
    <description>任务模块 - 任务管理、待办事项</description>

    <dependencies>
        <!-- 依赖公共模块 -->
        <dependency>
            <groupId>com.studyflow</groupId>
            <artifactId>studyflow-common</artifactId>
            <version>${project.version}</version>
        </dependency>

        <!-- 依赖用户模块 -->
        <dependency>
            <groupId>com.studyflow</groupId>
            <artifactId>studyflow-user</artifactId>
            <version>${project.version}</version>
        </dependency>

        <!-- MySQL -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
    </dependencies>

</project>
```

#### 步骤 4：创建 studyflow-pomodoro 模块

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.studyflow</groupId>
        <artifactId>studyflow-backend</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>studyflow-pomodoro</artifactId>
    <name>StudyFlow Pomodoro</name>
    <description>番茄钟模块 - 专注计时、统计</description>

    <dependencies>
        <dependency>
            <groupId>com.studyflow</groupId>
            <artifactId>studyflow-common</artifactId>
            <version>${project.version}</version>
        </dependency>
        <dependency>
            <groupId>com.studyflow</groupId>
            <artifactId>studyflow-user</artifactId>
            <version>${project.version}</version>
        </dependency>

        <!-- MySQL -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Redis -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
    </dependencies>

</project>
```

#### 步骤 5：创建 studyflow-stats 模块

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.studyflow</groupId>
        <artifactId>studyflow-backend</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>studyflow-stats</artifactId>
    <name>StudyFlow Stats</name>
    <description>统计模块 - 学习数据统计分析</description>

    <dependencies>
        <dependency>
            <groupId>com.studyflow</groupId>
            <artifactId>studyflow-common</artifactId>
            <version>${project.version}</version>
        </dependency>
        <dependency>
            <groupId>com.studyflow</groupId>
            <artifactId>studyflow-user</artifactId>
            <version>${project.version}</version>
        </dependency>
        <dependency>
            <groupId>com.studyflow</groupId>
            <artifactId>studyflow-pomodoro</artifactId>
            <version>${project.version}</version>
        </dependency>

        <!-- MySQL -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
    </dependencies>

</project>
```

#### 步骤 6：创建 studyflow-ai 模块（预留）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.studyflow</groupId>
        <artifactId>studyflow-backend</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>studyflow-ai</artifactId>
    <name>StudyFlow AI</name>
    <description>AI模块 - 智能学习助手（预留）</description>

    <dependencies>
        <dependency>
            <groupId>com.studyflow</groupId>
            <artifactId>studyflow-common</artifactId>
            <version>${project.version}</version>
        </dependency>
    </dependencies>

</project>
```

#### 步骤 7：创建 studyflow-server 启动模块

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.studyflow</groupId>
        <artifactId>studyflow-backend</artifactId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>

    <artifactId>studyflow-server</artifactId>
    <name>StudyFlow Server</name>
    <description>启动模块 - 应用入口</description>
    <packaging>jar</packaging>

    <dependencies>
        <!-- 依赖所有业务模块 -->
        <dependency>
            <groupId>com.studyflow</groupId>
            <artifactId>studyflow-common</artifactId>
            <version>${project.version}</version>
        </dependency>
        <dependency>
            <groupId>com.studyflow</groupId>
            <artifactId>studyflow-user</artifactId>
            <version>${project.version}</version>
        </dependency>
        <dependency>
            <groupId>com.studyflow</groupId>
            <artifactId>studyflow-task</artifactId>
            <version>${project.version}</version>
        </dependency>
        <dependency>
            <groupId>com.studyflow</groupId>
            <artifactId>studyflow-pomodoro</artifactId>
            <version>${project.version}</version>
        </dependency>
        <dependency>
            <groupId>com.studyflow</groupId>
            <artifactId>studyflow-stats</artifactId>
            <version>${project.version}</version>
        </dependency>
        <dependency>
            <groupId>com.studyflow</groupId>
            <artifactId>studyflow-ai</artifactId>
            <version>${project.version}</version>
        </dependency>

        <!-- Knife4j API 文档 -->
        <dependency>
            <groupId>com.github.xiaoymin</groupId>
            <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
        </dependency>

        <!-- Flyway -->
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-mysql</artifactId>
        </dependency>

        <!-- 测试 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <mainClass>com.studyflow.server.StudyFlowApplication</mainClass>
                </configuration>
                <executions>
                    <execution>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

</project>
```

#### 步骤 8：刷新 Maven 项目

在 IDEA 右侧 Maven 面板点击 **Reload All Maven Projects** 按钮，或右键 `pom.xml` -> **Maven** -> **Reload Project**

---

## 3. 数据库配置

### 3.1 创建数据库

```bash
# 连接 MySQL
docker exec -it studyflow-mysql mysql -uroot -p
# 输入密码: root123456

# 创建数据库（如未自动创建）
CREATE DATABASE IF NOT EXISTS studyflow 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

# 查看数据库
SHOW DATABASES;

# 退出
EXIT;
```

### 3.2 配置 Flyway 迁移

在 `studyflow-server/src/main/resources` 下创建目录结构：

```
resources/
├── application.yml          # 主配置文件
├── application-dev.yml      # 开发环境配置
├── application-prod.yml     # 生产环境配置
└── db/
    └── migration/           # Flyway 迁移脚本
        ├── V1__init_schema.sql
        └── V2__init_data.sql
```

#### 主配置文件 application.yml

```yaml
spring:
  profiles:
    active: dev
  
  application:
    name: studyflow-server

---
# Knife4j 配置
springdoc:
  swagger-ui:
    path: /swagger-ui.html
    tags-sorter: alpha
    operations-sorter: alpha
  api-docs:
    path: /v3/api-docs
  group-configs:
    - group: 'default'
      paths-to-match: '/**'
      packages-to-scan: com.studyflow

knife4j:
  enable: true
  setting:
    language: zh_cn
    swagger-model-name: 实体类列表
```

#### 开发环境配置 application-dev.yml

```yaml
server:
  port: 8080
  servlet:
    context-path: /

spring:
  # 数据源配置
  datasource:
    url: jdbc:mysql://localhost:3306/studyflow?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: studyflow
    password: studyflow123
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      minimum-idle: 5
      maximum-pool-size: 20
      idle-timeout: 300000
      max-lifetime: 1200000
      connection-timeout: 20000

  # Redis 配置
  data:
    redis:
      host: localhost
      port: 6379
      password: redis123456
      database: 0
      timeout: 6000ms
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0
          max-wait: -1ms

  # Flyway 配置
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
    validate-on-migrate: true
    out-of-order: false

# MyBatis Plus 配置
mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
  global-config:
    db-config:
      id-type: assign_uuid
      logic-delete-field: deletedAt
      logic-delete-value: 'NOW()'
      logic-not-delete-value: 'NULL'
  mapper-locations: classpath*:/mapper/**/*.xml

# JWT 配置
jwt:
  secret: your-256-bit-secret-key-here-must-be-at-least-32-characters-long
  expiration: 86400000  # 24小时，单位毫秒
  refresh-expiration: 604800000  # 7天

# 日志配置
logging:
  level:
    com.studyflow: DEBUG
    org.springframework.security: DEBUG
```

### 3.3 创建 Flyway 迁移脚本

#### V1__init_schema.sql

```sql
-- =============================================
-- StudyFlow 数据库初始化脚本
-- 版本: V1
-- 描述: 创建核心表结构
-- =============================================

-- 用户表
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(36) PRIMARY KEY COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    `email` VARCHAR(100) UNIQUE COMMENT '邮箱',
    `phone` VARCHAR(20) UNIQUE COMMENT '手机号',
    `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
    `nickname` VARCHAR(50) COMMENT '昵称',
    `avatar_url` VARCHAR(500) COMMENT '头像URL',
    `study_goal` VARCHAR(200) COMMENT '学习目标',
    `focus_duration` INT DEFAULT 1500 COMMENT '专注时长(秒)，默认25分钟',
    `short_break_duration` INT DEFAULT 300 COMMENT '短休息时长(秒)，默认5分钟',
    `long_break_duration` INT DEFAULT 900 COMMENT '长休息时长(秒)，默认15分钟',
    `auto_start_break` TINYINT(1) DEFAULT 0 COMMENT '自动开始休息',
    `auto_start_pomodoro` TINYINT(1) DEFAULT 0 COMMENT '自动开始番茄钟',
    `long_break_interval` INT DEFAULT 4 COMMENT '长休息间隔(个番茄钟)',
    `theme` VARCHAR(20) DEFAULT 'light' COMMENT '主题',
    `notification_enabled` TINYINT(1) DEFAULT 1 COMMENT '通知开关',
    `sound_enabled` TINYINT(1) DEFAULT 1 COMMENT '声音开关',
    `vibration_enabled` TINYINT(1) DEFAULT 1 COMMENT '振动开关',
    `language` VARCHAR(10) DEFAULT 'zh-CN' COMMENT '语言',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间(软删除)',
    INDEX `idx_username` (`username`),
    INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 任务表
CREATE TABLE IF NOT EXISTS `tasks` (
    `id` VARCHAR(36) PRIMARY KEY COMMENT '任务ID',
    `user_id` VARCHAR(36) NOT NULL COMMENT '用户ID',
    `title` VARCHAR(200) NOT NULL COMMENT '任务标题',
    `description` TEXT COMMENT '任务描述',
    `category` VARCHAR(50) COMMENT '分类',
    `priority` ENUM('low', 'medium', 'high') DEFAULT 'medium' COMMENT '优先级',
    `status` ENUM('todo', 'in_progress', 'completed', 'abandoned') DEFAULT 'todo' COMMENT '状态',
    `display_order` INT DEFAULT 0 COMMENT '显示顺序',
    `due_date` DATE COMMENT '截止日期',
    `parent_id` VARCHAR(36) COMMENT '父任务ID',
    `is_today` TINYINT(1) DEFAULT 1 COMMENT '是否今日任务',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `completed_at` DATETIME COMMENT '完成时间',
    `deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间',
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_due_date` (`due_date`),
    INDEX `idx_is_today` (`is_today`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务表';

-- 番茄钟记录表
CREATE TABLE IF NOT EXISTS `pomodoro_records` (
    `id` VARCHAR(36) PRIMARY KEY COMMENT '记录ID',
    `user_id` VARCHAR(36) NOT NULL COMMENT '用户ID',
    `task_id` VARCHAR(36) COMMENT '关联任务ID',
    `start_time` DATETIME NOT NULL COMMENT '开始时间',
    `end_time` DATETIME COMMENT '结束时间',
    `planned_duration` INT NOT NULL COMMENT '计划时长(秒)',
    `actual_duration` INT COMMENT '实际时长(秒)',
    `status` ENUM('running', 'paused', 'completed', 'stopped') DEFAULT 'running' COMMENT '状态',
    `is_locked` TINYINT(1) DEFAULT 0 COMMENT '是否锁机模式',
    `abandon_reason` VARCHAR(500) COMMENT '放弃原因',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_task_id` (`task_id`),
    INDEX `idx_start_time` (`start_time`),
    INDEX `idx_status` (`status`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='番茄钟记录表';

-- 学习统计表（每日汇总）
CREATE TABLE IF NOT EXISTS `daily_stats` (
    `id` VARCHAR(36) PRIMARY KEY COMMENT '统计ID',
    `user_id` VARCHAR(36) NOT NULL COMMENT '用户ID',
    `stat_date` DATE NOT NULL COMMENT '统计日期',
    `total_focus_time` INT DEFAULT 0 COMMENT '总专注时长(秒)',
    `total_break_time` INT DEFAULT 0 COMMENT '总休息时长(秒)',
    `completed_pomodoros` INT DEFAULT 0 COMMENT '完成番茄钟数',
    `completed_tasks` INT DEFAULT 0 COMMENT '完成任务数',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY `uk_user_date` (`user_id`, `stat_date`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_stat_date` (`stat_date`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='每日学习统计表';
```

#### V2__init_data.sql

```sql
-- =============================================
-- StudyFlow 初始数据脚本
-- 版本: V2
-- 描述: 插入测试数据
-- =============================================

-- 插入测试用户（密码: 123456）
-- 密码使用 BCrypt 加密: $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `nickname`, `study_goal`) VALUES
('user-001', 'testuser', 'test@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '测试用户', '每天学习2小时'),
('user-002', 'student1', 'student1@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '学霸小明', '通过英语六级考试');

-- 插入测试任务
INSERT INTO `tasks` (`id`, `user_id`, `title`, `description`, `category`, `priority`, `status`, `due_date`, `is_today`) VALUES
('task-001', 'user-001', '完成数学作业', '第3章练习题1-10', '数学', 'high', 'todo', CURDATE(), 1),
('task-002', 'user-001', '背诵英语单词', '背50个托福单词', '英语', 'medium', 'in_progress', CURDATE(), 1),
('task-003', 'user-001', '阅读技术文章', '阅读Spring Boot官方文档', '技术', 'low', 'completed', CURDATE(), 0),
('task-004', 'user-002', '复习物理公式', '力学部分公式整理', '物理', 'high', 'todo', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1);

-- 插入番茄钟记录
INSERT INTO `pomodoro_records` (`id`, `user_id`, `task_id`, `start_time`, `end_time`, `planned_duration`, `actual_duration`, `status`) VALUES
('pomo-001', 'user-001', 'task-002', DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 95 MINUTE), 1500, 1500, 'completed'),
('pomo-002', 'user-001', 'task-002', DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 35 MINUTE), 1500, 1500, 'completed'),
('pomo-003', 'user-002', 'task-004', DATE_SUB(NOW(), INTERVAL 30 MINUTE), NULL, 1500, NULL, 'running');

-- 插入每日统计
INSERT INTO `daily_stats` (`id`, `user_id`, `stat_date`, `total_focus_time`, `completed_pomodoros`, `completed_tasks`) VALUES
('stats-001', 'user-001', CURDATE(), 3000, 2, 1),
('stats-002', 'user-001', DATE_SUB(CURDATE(), INTERVAL 1 DAY), 4500, 3, 2),
('stats-003', 'user-002', CURDATE(), 0, 0, 0);
```

---

## 4. 核心代码开发

### 4.1 公共模块（studyflow-common）

#### 目录结构

```
studyflow-common/src/main/java/com/studyflow/common/
├── config/
│   └── MyBatisPlusConfig.java
├── constant/
│   └── CommonConstant.java
├── entity/
│   └── BaseEntity.java
├── exception/
│   ├── BusinessException.java
│   └── GlobalExceptionHandler.java
├── result/
│   ├── Result.java
│   └── ResultCode.java
└── util/
    ├── JwtUtil.java
    └── SecurityUtil.java
```

#### BaseEntity.java - 基础实体类

```java
package com.studyflow.common.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 基础实体类
 * 所有实体类都应继承此类
 */
@Data
public abstract class BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键ID，使用UUID
     */
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    /**
     * 删除时间（软删除）
     */
    @TableLogic(value = "null", delval = "now()")
    @JsonIgnore
    private LocalDateTime deletedAt;
}
```

#### Result.java - 统一响应结果

```java
package com.studyflow.common.result;

import lombok.Data;

import java.io.Serializable;

/**
 * 统一响应结果
 * @param <T> 数据类型
 */
@Data
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 状态码
     */
    private Integer code;

    /**
     * 响应消息
     */
    private String message;

    /**
     * 响应数据
     */
    private T data;

    /**
     * 时间戳
     */
    private Long timestamp;

    public Result() {
        this.timestamp = System.currentTimeMillis();
    }

    public Result(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = System.currentTimeMillis();
    }

    /**
     * 成功响应
     */
    public static <T> Result<T> success() {
        return new Result<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMessage(), null);
    }

    public static <T> Result<T> success(T data) {
        return new Result<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMessage(), data);
    }

    public static <T> Result<T> success(String message, T data) {
        return new Result<>(ResultCode.SUCCESS.getCode(), message, data);
    }

    /**
     * 失败响应
     */
    public static <T> Result<T> error() {
        return new Result<>(ResultCode.ERROR.getCode(), ResultCode.ERROR.getMessage(), null);
    }

    public static <T> Result<T> error(String message) {
        return new Result<>(ResultCode.ERROR.getCode(), message, null);
    }

    public static <T> Result<T> error(ResultCode resultCode) {
        return new Result<>(resultCode.getCode(), resultCode.getMessage(), null);
    }

    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, message, null);
    }

    /**
     * 判断是否成功
     */
    public boolean isSuccess() {
        return ResultCode.SUCCESS.getCode().equals(this.code);
    }
}
```

#### ResultCode.java - 响应状态码

```java
package com.studyflow.common.result;

import lombok.Getter;

/**
 * 响应状态码枚举
 */
@Getter
public enum ResultCode {

    // 成功
    SUCCESS(200, "操作成功"),

    // 客户端错误
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未授权，请先登录"),
    FORBIDDEN(403, "拒绝访问"),
    NOT_FOUND(404, "资源不存在"),
    METHOD_NOT_ALLOWED(405, "请求方法不允许"),

    // 业务错误
    ERROR(500, "系统繁忙，请稍后重试"),
    PARAM_ERROR(1001, "参数校验失败"),
    USER_NOT_FOUND(1002, "用户不存在"),
    USERNAME_EXISTS(1003, "用户名已存在"),
    EMAIL_EXISTS(1004, "邮箱已存在"),
    PHONE_EXISTS(1005, "手机号已存在"),
    PASSWORD_ERROR(1006, "密码错误"),
    TOKEN_EXPIRED(1007, "Token已过期"),
    TOKEN_INVALID(1008, "Token无效"),
    TASK_NOT_FOUND(1009, "任务不存在"),
    POMODORO_NOT_FOUND(1010, "番茄钟记录不存在"),

    // 服务器错误
    INTERNAL_ERROR(5000, "服务器内部错误");

    private final Integer code;
    private final String message;

    ResultCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
```

#### BusinessException.java - 业务异常

```java
package com.studyflow.common.exception;

import com.studyflow.common.result.ResultCode;
import lombok.Getter;

/**
 * 业务异常
 */
@Getter
public class BusinessException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final Integer code;

    public BusinessException(String message) {
        super(message);
        this.code = ResultCode.ERROR.getCode();
    }

    public BusinessException(ResultCode resultCode) {
        super(resultCode.getMessage());
        this.code = resultCode.getCode();
    }

    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }
}
```

#### GlobalExceptionHandler.java - 全局异常处理

```java
package com.studyflow.common.exception;

import com.studyflow.common.result.Result;
import com.studyflow.common.result.ResultCode;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

/**
 * 全局异常处理器
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 处理业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e) {
        log.warn("业务异常: {}", e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }

    /**
     * 处理参数校验异常（@Valid）
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        log.warn("参数校验失败: {}", message);
        return Result.error(ResultCode.PARAM_ERROR.getCode(), message);
    }

    /**
     * 处理参数绑定异常
     */
    @ExceptionHandler(BindException.class)
    public Result<Void> handleBindException(BindException e) {
        String message = e.getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        log.warn("参数绑定失败: {}", message);
        return Result.error(ResultCode.PARAM_ERROR.getCode(), message);
    }

    /**
     * 处理约束校验异常（@Validated）
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public Result<Void> handleConstraintViolationException(ConstraintViolationException e) {
        String message = e.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining(", "));
        log.warn("约束校验失败: {}", message);
        return Result.error(ResultCode.PARAM_ERROR.getCode(), message);
    }

    /**
     * 处理其他所有异常
     */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("系统异常: ", e);
        return Result.error(ResultCode.INTERNAL_ERROR);
    }
}
```

#### MyBatisPlusConfig.java - MyBatis Plus 配置

```java
package com.studyflow.common.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

/**
 * MyBatis Plus 配置
 */
@Configuration
public class MyBatisPlusConfig {

    /**
     * 分页插件
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }

    /**
     * 自动填充处理器
     */
    @Bean
    public MetaObjectHandler metaObjectHandler() {
        return new MetaObjectHandler() {
            @Override
            public void insertFill(MetaObject metaObject) {
                this.strictInsertFill(metaObject, "createdAt", LocalDateTime.class, LocalDateTime.now());
                this.strictInsertFill(metaObject, "updatedAt", LocalDateTime.class, LocalDateTime.now());
            }

            @Override
            public void updateFill(MetaObject metaObject) {
                this.strictUpdateFill(metaObject, "updatedAt", LocalDateTime.class, LocalDateTime.now());
            }
        };
    }
}
```

### 4.2 用户模块（studyflow-user）

#### 目录结构

```
studyflow-user/src/main/java/com/studyflow/user/
├── config/
│   └── SecurityConfig.java
├── controller/
│   └── AuthController.java
│   └── UserController.java
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   └── UpdateProfileRequest.java
│   └── response/
│       ├── LoginResponse.java
│       ├── UserProfileResponse.java
│       └── PomodoroSettingsResponse.java
├── entity/
│   └── User.java
├── mapper/
│   └── UserMapper.java
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   └── impl/
│       ├── AuthServiceImpl.java
│       └── UserServiceImpl.java
└── security/
    ├── JwtAuthenticationFilter.java
    ├── JwtTokenProvider.java
    └── UserDetailsServiceImpl.java
```

#### User.java - 用户实体

```java
package com.studyflow.user.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.studyflow.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("users")
public class User extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 用户名
     */
    private String username;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 密码哈希
     */
    private String passwordHash;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 头像URL
     */
    private String avatarUrl;

    /**
     * 学习目标
     */
    private String studyGoal;

    // ========== 番茄钟设置 ==========

    /**
     * 专注时长（秒），默认25分钟
     */
    private Integer focusDuration = 1500;

    /**
     * 短休息时长（秒），默认5分钟
     */
    private Integer shortBreakDuration = 300;

    /**
     * 长休息时长（秒），默认15分钟
     */
    private Integer longBreakDuration = 900;

    /**
     * 自动开始休息
     */
    private Boolean autoStartBreak = false;

    /**
     * 自动开始番茄钟
     */
    private Boolean autoStartPomodoro = false;

    /**
     * 长休息间隔（个番茄钟）
     */
    private Integer longBreakInterval = 4;

    // ========== 应用设置 ==========

    /**
     * 主题
     */
    private String theme = "light";

    /**
     * 通知开关
     */
    private Boolean notificationEnabled = true;

    /**
     * 声音开关
     */
    private Boolean soundEnabled = true;

    /**
     * 振动开关
     */
    private Boolean vibrationEnabled = true;

    /**
     * 语言
     */
    private String language = "zh-CN";
}
```

#### UserMapper.java - 用户 Mapper

```java
package com.studyflow.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.studyflow.user.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * 用户 Mapper
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
     * 检查用户名是否存在
     */
    @Select("SELECT COUNT(*) FROM users WHERE username = #{username} AND deleted_at IS NULL")
    Long countByUsername(String username);

    /**
     * 检查邮箱是否存在
     */
    @Select("SELECT COUNT(*) FROM users WHERE email = #{email} AND deleted_at IS NULL")
    Long countByEmail(String email);
}
```

#### RegisterRequest.java - 注册请求DTO

```java
package com.studyflow.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 用户注册请求
 */
@Data
@Schema(description = "用户注册请求")
public class RegisterRequest {

    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 50, message = "用户名长度必须在3-50个字符之间")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "用户名只能包含字母、数字和下划线")
    @Schema(description = "用户名", example = "testuser")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 20, message = "密码长度必须在6-20个字符之间")
    @Schema(description = "密码", example = "123456")
    private String password;

    @Email(message = "邮箱格式不正确")
    @Schema(description = "邮箱", example = "test@example.com")
    private String email;

    @Schema(description = "昵称", example = "测试用户")
    private String nickname;
}
```

#### LoginRequest.java - 登录请求DTO

```java
package com.studyflow.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 用户登录请求
 */
@Data
@Schema(description = "用户登录请求")
public class LoginRequest {

    @NotBlank(message = "用户名不能为空")
    @Schema(description = "用户名", example = "testuser")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Schema(description = "密码", example = "123456")
    private String password;
}
```

#### LoginResponse.java - 登录响应DTO

```java
package com.studyflow.user.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

/**
 * 登录响应
 */
@Data
@Builder
@Schema(description = "登录响应")
public class LoginResponse {

    @Schema(description = "访问令牌")
    private String accessToken;

    @Schema(description = "刷新令牌")
    private String refreshToken;

    @Schema(description = "令牌类型")
    private String tokenType;

    @Schema(description = "过期时间（秒）")
    private Long expiresIn;

    @Schema(description = "用户信息")
    private UserInfo user;

    @Data
    @Builder
    @Schema(description = "用户信息")
    public static class UserInfo {
        @Schema(description = "用户ID")
        private String id;

        @Schema(description = "用户名")
        private String username;

        @Schema(description = "昵称")
        private String nickname;

        @Schema(description = "头像URL")
        private String avatarUrl;
    }
}
```

#### JwtTokenProvider.java - JWT 令牌提供者

```java
package com.studyflow.user.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JWT 令牌提供者
 */
@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    /**
     * 获取签名密钥
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 从令牌中提取用户名
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * 从令牌中提取过期时间
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * 提取指定声明
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * 提取所有声明
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * 检查令牌是否过期
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * 生成访问令牌
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails, jwtExpiration);
    }

    /**
     * 生成刷新令牌
     */
    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails, refreshExpiration);
    }

    /**
     * 生成令牌
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails, Long expiration) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    /**
     * 验证令牌是否有效
     */
    public Boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * 验证令牌是否有效（仅检查格式和过期）
     */
    public Boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("JWT令牌已过期");
        } catch (UnsupportedJwtException e) {
            log.warn("不支持的JWT令牌");
        } catch (MalformedJwtException e) {
            log.warn("JWT令牌格式错误");
        } catch (SignatureException e) {
            log.warn("JWT签名验证失败");
        } catch (IllegalArgumentException e) {
            log.warn("JWT令牌为空或非法");
        }
        return false;
    }
}
```

#### JwtAuthenticationFilter.java - JWT 认证过滤器

```java
package com.studyflow.user.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT 认证过滤器
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 获取 JWT 令牌
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 检查 Authorization 头
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 提取令牌
        jwt = authHeader.substring(7);

        try {
            // 从令牌中提取用户名
            username = jwtTokenProvider.extractUsername(jwt);

            // 检查用户是否已认证
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // 加载用户详情
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                // 验证令牌
                if (jwtTokenProvider.isTokenValid(jwt, userDetails)) {
                    // 创建认证令牌
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // 设置安全上下文
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            log.error("JWT认证失败: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
```

#### UserDetailsServiceImpl.java - 用户详情服务

```java
package com.studyflow.user.security;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.studyflow.user.entity.User;
import com.studyflow.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * 用户详情服务实现
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 查询用户
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUsername, username)
                        .isNull(User::getDeletedAt)
        );

        if (user == null) {
            throw new UsernameNotFoundException("用户不存在: " + username);
        }

        // 返回 Spring Security 的 UserDetails
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}
```

#### SecurityConfig.java - 安全配置

```java
package com.studyflow.user.config;

import com.studyflow.user.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security 配置
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    /**
     * 密码编码器
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 认证管理器
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * 认证提供者
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * CORS 配置
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));  // 生产环境应限制具体域名
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * 安全过滤器链
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 禁用 CSRF（使用 JWT 不需要）
                .csrf(AbstractHttpConfigurer::disable)
                // 配置 CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 配置授权
                .authorizeHttpRequests(auth -> auth
                        // 公开接口
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/doc.html", "/webjars/**").permitAll()
                        // 其他接口需要认证
                        .anyRequest().authenticated()
                )
                // 无状态会话（不使用 Session）
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // 配置认证提供者
                .authenticationProvider(authenticationProvider())
                // 添加 JWT 过滤器
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

#### AuthService.java - 认证服务接口

```java
package com.studyflow.user.service;

import com.studyflow.user.dto.request.LoginRequest;
import com.studyflow.user.dto.request.RegisterRequest;
import com.studyflow.user.dto.response.LoginResponse;

/**
 * 认证服务接口
 */
public interface AuthService {

    /**
     * 用户注册
     */
    void register(RegisterRequest request);

    /**
     * 用户登录
     */
    LoginResponse login(LoginRequest request);

    /**
     * 刷新令牌
     */
    LoginResponse refreshToken(String refreshToken);

    /**
     * 用户登出
     */
    void logout(String token);
}
```

#### AuthServiceImpl.java - 认证服务实现

```java
package com.studyflow.user.service.impl;

import com.studyflow.common.exception.BusinessException;
import com.studyflow.common.result.ResultCode;
import com.studyflow.user.dto.request.LoginRequest;
import com.studyflow.user.dto.request.RegisterRequest;
import com.studyflow.user.dto.response.LoginResponse;
import com.studyflow.user.entity.User;
import com.studyflow.user.mapper.UserMapper;
import com.studyflow.user.security.JwtTokenProvider;
import com.studyflow.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

/**
 * 认证服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final StringRedisTemplate redisTemplate;

    private static final String TOKEN_BLACKLIST_PREFIX = "token:blacklist:";

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        // 检查用户名是否已存在
        if (userMapper.countByUsername(request.getUsername()) > 0) {
            throw new BusinessException(ResultCode.USERNAME_EXISTS);
        }

        // 检查邮箱是否已存在
        if (request.getEmail() != null && userMapper.countByEmail(request.getEmail()) > 0) {
            throw new BusinessException(ResultCode.EMAIL_EXISTS);
        }

        // 创建用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setNickname(request.getNickname() != null ? request.getNickname() : request.getUsername());

        // 保存用户
        userMapper.insert(user);
        log.info("用户注册成功: {}", request.getUsername());
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // 认证用户
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // 获取用户详情
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // 生成令牌
        String accessToken = jwtTokenProvider.generateToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        // 查询用户信息
        User user = userMapper.selectByUsername(request.getUsername());

        log.info("用户登录成功: {}", request.getUsername());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400L)  // 24小时
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .nickname(user.getNickname())
                        .avatarUrl(user.getAvatarUrl())
                        .build())
                .build();
    }

    @Override
    public LoginResponse refreshToken(String refreshToken) {
        // 验证刷新令牌
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BusinessException(ResultCode.TOKEN_INVALID);
        }

        // 提取用户名
        String username = jwtTokenProvider.extractUsername(refreshToken);

        // 查询用户
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            throw new BusinessException(ResultCode.USER_NOT_FOUND);
        }

        // 生成新令牌
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPasswordHash())
                .roles("USER")
                .build();

        String newAccessToken = jwtTokenProvider.generateToken(userDetails);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(86400L)
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .nickname(user.getNickname())
                        .avatarUrl(user.getAvatarUrl())
                        .build())
                .build();
    }

    @Override
    public void logout(String token) {
        // 将令牌加入黑名单
        String key = TOKEN_BLACKLIST_PREFIX + token;
        redisTemplate.opsForValue().set(key, "1", 1, TimeUnit.DAYS);
        log.info("用户登出成功");
    }
}
```

#### AuthController.java - 认证控制器

```java
package com.studyflow.user.controller;

import com.studyflow.common.result.Result;
import com.studyflow.user.dto.request.LoginRequest;
import com.studyflow.user.dto.request.RegisterRequest;
import com.studyflow.user.dto.response.LoginResponse;
import com.studyflow.user.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "认证管理", description = "用户注册、登录、登出等接口")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "用户注册")
    public Result<Void> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return Result.success("注册成功");
    }

    @PostMapping("/login")
    @Operation(summary = "用户登录")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return Result.success(authService.login(request));
    }

    @PostMapping("/refresh")
    @Operation(summary = "刷新令牌")
    public Result<LoginResponse> refresh(@RequestHeader("X-Refresh-Token") String refreshToken) {
        return Result.success(authService.refreshToken(refreshToken));
    }

    @PostMapping("/logout")
    @Operation(summary = "用户登出")
    public Result<Void> logout(HttpServletRequest request) {
        String token = extractToken(request);
        authService.logout(token);
        return Result.success("登出成功");
    }

    /**
     * 从请求中提取令牌
     */
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

由于篇幅限制，任务模块和番茄钟模块的代码将在文档后续部分继续展示。以下是模块核心要点：


### 4.3 任务模块（studyflow-task）

#### Task.java - 任务实体

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
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("tasks")
public class Task extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 任务标题
     */
    private String title;

    /**
     * 任务描述
     */
    private String description;

    /**
     * 分类
     */
    private String category;

    /**
     * 优先级: low, medium, high
     */
    private String priority = "medium";

    /**
     * 状态: todo, in_progress, completed, abandoned
     */
    private String status = "todo";

    /**
     * 显示顺序
     */
    private Integer displayOrder = 0;

    /**
     * 截止日期
     */
    private LocalDate dueDate;

    /**
     * 父任务ID
     */
    private String parentId;

    /**
     * 是否今日任务
     */
    private Boolean isToday = true;

    /**
     * 完成时间
     */
    private LocalDateTime completedAt;
}
```

#### TaskMapper.java - 任务 Mapper

```java
package com.studyflow.task.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.studyflow.task.entity.Task;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.time.LocalDate;
import java.util.List;

/**
 * 任务 Mapper
 */
@Mapper
public interface TaskMapper extends BaseMapper<Task> {

    /**
     * 获取今日任务列表
     */
    @Select("SELECT * FROM tasks WHERE user_id = #{userId} AND is_today = 1 AND deleted_at IS NULL ORDER BY display_order")
    List<Task> selectTodayTasks(@Param("userId") String userId);

    /**
     * 获取用户的所有任务
     */
    @Select("SELECT * FROM tasks WHERE user_id = #{userId} AND deleted_at IS NULL ORDER BY created_at DESC")
    List<Task> selectByUserId(@Param("userId") String userId);

    /**
     * 切换任务完成状态
     */
    @Update("UPDATE tasks SET status = #{status}, completed_at = #{completedAt}, updated_at = NOW() WHERE id = #{taskId}")
    int updateTaskStatus(@Param("taskId") String taskId, @Param("status") String status, @Param("completedAt") java.time.LocalDateTime completedAt);

    /**
     * 统计用户今日完成任务数
     */
    @Select("SELECT COUNT(*) FROM tasks WHERE user_id = #{userId} AND status = 'completed' AND DATE(completed_at) = #{date}")
    Long countCompletedToday(@Param("userId") String userId, @Param("date") LocalDate date);
}
```

#### TaskService.java - 任务服务接口

```java
package com.studyflow.task.service;

import com.studyflow.task.dto.request.CreateTaskRequest;
import com.studyflow.task.dto.request.UpdateTaskRequest;
import com.studyflow.task.dto.response.TaskResponse;

import java.util.List;

/**
 * 任务服务接口
 */
public interface TaskService {

    /**
     * 获取任务列表
     */
    List<TaskResponse> getTaskList(String userId);

    /**
     * 获取今日任务
     */
    List<TaskResponse> getTodayTasks(String userId);

    /**
     * 创建任务
     */
    TaskResponse createTask(String userId, CreateTaskRequest request);

    /**
     * 更新任务
     */
    TaskResponse updateTask(String userId, String taskId, UpdateTaskRequest request);

    /**
     * 删除任务
     */
    void deleteTask(String userId, String taskId);

    /**
     * 切换任务状态
     */
    TaskResponse toggleTaskStatus(String userId, String taskId);
}
```

#### TaskServiceImpl.java - 任务服务实现

```java
package com.studyflow.task.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.studyflow.common.exception.BusinessException;
import com.studyflow.common.result.ResultCode;
import com.studyflow.task.dto.request.CreateTaskRequest;
import com.studyflow.task.dto.request.UpdateTaskRequest;
import com.studyflow.task.dto.response.TaskResponse;
import com.studyflow.task.entity.Task;
import com.studyflow.task.mapper.TaskMapper;
import com.studyflow.task.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 任务服务实现
 */
@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskMapper taskMapper;

    @Override
    public List<TaskResponse> getTaskList(String userId) {
        List<Task> tasks = taskMapper.selectByUserId(userId);
        return tasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getTodayTasks(String userId) {
        List<Task> tasks = taskMapper.selectTodayTasks(userId);
        return tasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskResponse createTask(String userId, CreateTaskRequest request) {
        Task task = new Task();
        task.setUserId(userId);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCategory(request.getCategory());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setIsToday(request.getIsToday() != null ? request.getIsToday() : true);

        taskMapper.insert(task);
        return convertToResponse(task);
    }

    @Override
    @Transactional
    public TaskResponse updateTask(String userId, String taskId, UpdateTaskRequest request) {
        Task task = getTaskByIdAndUserId(taskId, userId);

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getCategory() != null) {
            task.setCategory(request.getCategory());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        if (request.getIsToday() != null) {
            task.setIsToday(request.getIsToday());
        }

        taskMapper.updateById(task);
        return convertToResponse(task);
    }

    @Override
    @Transactional
    public void deleteTask(String userId, String taskId) {
        Task task = getTaskByIdAndUserId(taskId, userId);
        taskMapper.deleteById(task.getId());
    }

    @Override
    @Transactional
    public TaskResponse toggleTaskStatus(String userId, String taskId) {
        Task task = getTaskByIdAndUserId(taskId, userId);

        if ("completed".equals(task.getStatus())) {
            // 取消完成
            task.setStatus("todo");
            task.setCompletedAt(null);
        } else {
            // 标记完成
            task.setStatus("completed");
            task.setCompletedAt(LocalDateTime.now());
        }

        taskMapper.updateById(task);
        return convertToResponse(task);
    }

    /**
     * 根据ID和用户ID获取任务
     */
    private Task getTaskByIdAndUserId(String taskId, String userId) {
        Task task = taskMapper.selectOne(
                new LambdaQueryWrapper<Task>()
                        .eq(Task::getId, taskId)
                        .eq(Task::getUserId, userId)
                        .isNull(Task::getDeletedAt)
        );

        if (task == null) {
            throw new BusinessException(ResultCode.TASK_NOT_FOUND);
        }

        return task;
    }

    /**
     * 转换为响应对象
     */
    private TaskResponse convertToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        BeanUtils.copyProperties(task, response);
        return response;
    }
}
```

#### TaskController.java - 任务控制器

```java
package com.studyflow.task.controller;

import com.studyflow.common.result.Result;
import com.studyflow.task.dto.request.CreateTaskRequest;
import com.studyflow.task.dto.request.UpdateTaskRequest;
import com.studyflow.task.dto.response.TaskResponse;
import com.studyflow.task.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 任务控制器
 */
@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
@Tag(name = "任务管理", description = "任务的增删改查接口")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "获取任务列表")
    public Result<List<TaskResponse>> getTaskList(Authentication authentication) {
        String userId = getUserId(authentication);
        return Result.success(taskService.getTaskList(userId));
    }

    @GetMapping("/today")
    @Operation(summary = "获取今日任务")
    public Result<List<TaskResponse>> getTodayTasks(Authentication authentication) {
        String userId = getUserId(authentication);
        return Result.success(taskService.getTodayTasks(userId));
    }

    @PostMapping
    @Operation(summary = "创建任务")
    public Result<TaskResponse> createTask(
            Authentication authentication,
            @Valid @RequestBody CreateTaskRequest request) {
        String userId = getUserId(authentication);
        return Result.success(taskService.createTask(userId, request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新任务")
    public Result<TaskResponse> updateTask(
            Authentication authentication,
            @PathVariable("id") String taskId,
            @Valid @RequestBody UpdateTaskRequest request) {
        String userId = getUserId(authentication);
        return Result.success(taskService.updateTask(userId, taskId, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除任务")
    public Result<Void> deleteTask(
            Authentication authentication,
            @PathVariable("id") String taskId) {
        String userId = getUserId(authentication);
        taskService.deleteTask(userId, taskId);
        return Result.success("删除成功");
    }

    @PatchMapping("/{id}/toggle")
    @Operation(summary = "切换任务状态")
    public Result<TaskResponse> toggleTaskStatus(
            Authentication authentication,
            @PathVariable("id") String taskId) {
        String userId = getUserId(authentication);
        return Result.success(taskService.toggleTaskStatus(userId, taskId));
    }

    /**
     * 从认证信息中获取用户ID
     * 注意：实际项目中应从JWT令牌中解析用户ID
     */
    private String getUserId(Authentication authentication) {
        // 简化处理，实际应从JWT中获取
        return authentication.getName().equals("testuser") ? "user-001" : "user-002";
    }
}
```

### 4.4 番茄钟模块（studyflow-pomodoro）

#### PomodoroRecord.java - 番茄钟记录实体

```java
package com.studyflow.pomodoro.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.studyflow.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 番茄钟记录实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("pomodoro_records")
public class PomodoroRecord extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    private String userId;

    /**
     * 关联任务ID
     */
    private String taskId;

    /**
     * 开始时间
     */
    private LocalDateTime startTime;

    /**
     * 结束时间
     */
    private LocalDateTime endTime;

    /**
     * 计划时长（秒）
     */
    private Integer plannedDuration;

    /**
     * 实际时长（秒）
     */
    private Integer actualDuration;

    /**
     * 状态: running, paused, completed, stopped
     */
    private String status = "running";

    /**
     * 是否锁机模式
     */
    private Boolean isLocked = false;

    /**
     * 放弃原因
     */
    private String abandonReason;
}
```

#### PomodoroService.java - 番茄钟服务接口

```java
package com.studyflow.pomodoro.service;

import com.studyflow.pomodoro.dto.request.StartPomodoroRequest;
import com.studyflow.pomodoro.dto.request.StopPomodoroRequest;
import com.studyflow.pomodoro.dto.response.PomodoroRecordResponse;
import com.studyflow.pomodoro.dto.response.PomodoroStatsResponse;

/**
 * 番茄钟服务接口
 */
public interface PomodoroService {

    /**
     * 开始番茄钟
     */
    PomodoroRecordResponse startPomodoro(String userId, StartPomodoroRequest request);

    /**
     * 停止番茄钟
     */
    PomodoroRecordResponse stopPomodoro(String userId, String recordId, StopPomodoroRequest request);

    /**
     * 获取今日统计
     */
    PomodoroStatsResponse getTodayStats(String userId);

    /**
     * 获取周统计
     */
    PomodoroStatsResponse getWeeklyStats(String userId);
}
```

#### PomodoroServiceImpl.java - 番茄钟服务实现

```java
package com.studyflow.pomodoro.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.studyflow.common.exception.BusinessException;
import com.studyflow.common.result.ResultCode;
import com.studyflow.pomodoro.dto.request.StartPomodoroRequest;
import com.studyflow.pomodoro.dto.request.StopPomodoroRequest;
import com.studyflow.pomodoro.dto.response.PomodoroRecordResponse;
import com.studyflow.pomodoro.dto.response.PomodoroStatsResponse;
import com.studyflow.pomodoro.entity.PomodoroRecord;
import com.studyflow.pomodoro.mapper.PomodoroRecordMapper;
import com.studyflow.pomodoro.service.PomodoroService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * 番茄钟服务实现
 */
@Service
@RequiredArgsConstructor
public class PomodoroServiceImpl implements PomodoroService {

    private final PomodoroRecordMapper pomodoroRecordMapper;

    @Override
    @Transactional
    public PomodoroRecordResponse startPomodoro(String userId, StartPomodoroRequest request) {
        // 检查是否有正在进行的番茄钟
        PomodoroRecord runningRecord = pomodoroRecordMapper.selectOne(
                new LambdaQueryWrapper<PomodoroRecord>()
                        .eq(PomodoroRecord::getUserId, userId)
                        .eq(PomodoroRecord::getStatus, "running")
        );

        if (runningRecord != null) {
            throw new BusinessException(ResultCode.ERROR.getCode(), "已有正在进行的番茄钟");
        }

        // 创建新的番茄钟记录
        PomodoroRecord record = new PomodoroRecord();
        record.setUserId(userId);
        record.setTaskId(request.getTaskId());
        record.setStartTime(LocalDateTime.now());
        record.setPlannedDuration(request.getPlannedDuration() != null ? 
                request.getPlannedDuration() : 1500);  // 默认25分钟
        record.setIsLocked(request.getIsLocked() != null ? request.getIsLocked() : false);

        pomodoroRecordMapper.insert(record);
        return convertToResponse(record);
    }

    @Override
    @Transactional
    public PomodoroRecordResponse stopPomodoro(String userId, String recordId, StopPomodoroRequest request) {
        PomodoroRecord record = pomodoroRecordMapper.selectOne(
                new LambdaQueryWrapper<PomodoroRecord>()
                        .eq(PomodoroRecord::getId, recordId)
                        .eq(PomodoroRecord::getUserId, userId)
        );

        if (record == null) {
            throw new BusinessException(ResultCode.POMODORO_NOT_FOUND);
        }

        if (!"running".equals(record.getStatus())) {
            throw new BusinessException(ResultCode.ERROR.getCode(), "番茄钟不在运行中");
        }

        // 更新记录
        record.setEndTime(LocalDateTime.now());
        record.setStatus(request.getStatus());  // completed 或 stopped
        record.setAbandonReason(request.getAbandonReason());

        // 计算实际时长
        long actualSeconds = ChronoUnit.SECONDS.between(record.getStartTime(), record.getEndTime());
        record.setActualDuration((int) actualSeconds);

        pomodoroRecordMapper.updateById(record);
        return convertToResponse(record);
    }

    @Override
    public PomodoroStatsResponse getTodayStats(String userId) {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        List<PomodoroRecord> records = pomodoroRecordMapper.selectByUserIdAndDateRange(userId, startOfDay, endOfDay);

        return calculateStats(records);
    }

    @Override
    public PomodoroStatsResponse getWeeklyStats(String userId) {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfWeek = today.minusDays(6).atStartOfDay();  // 最近7天
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        List<PomodoroRecord> records = pomodoroRecordMapper.selectByUserIdAndDateRange(userId, startOfWeek, endOfDay);

        return calculateStats(records);
    }

    /**
     * 计算统计数据
     */
    private PomodoroStatsResponse calculateStats(List<PomodoroRecord> records) {
        int totalFocusTime = 0;
        int completedPomodoros = 0;

        for (PomodoroRecord record : records) {
            if ("completed".equals(record.getStatus()) && record.getActualDuration() != null) {
                totalFocusTime += record.getActualDuration();
                completedPomodoros++;
            }
        }

        return PomodoroStatsResponse.builder()
                .totalFocusTime(totalFocusTime)
                .completedPomodoros(completedPomodoros)
                .totalRecords(records.size())
                .build();
    }

    /**
     * 转换为响应对象
     */
    private PomodoroRecordResponse convertToResponse(PomodoroRecord record) {
        PomodoroRecordResponse response = new PomodoroRecordResponse();
        BeanUtils.copyProperties(record, response);
        return response;
    }
}
```

### 4.5 启动模块（studyflow-server）

#### StudyFlowApplication.java - 应用入口

```java
package com.studyflow.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * StudyFlow 应用入口
 */
@SpringBootApplication
@ComponentScan(basePackages = {
        "com.studyflow.common",
        "com.studyflow.user",
        "com.studyflow.task",
        "com.studyflow.pomodoro",
        "com.studyflow.stats",
        "com.studyflow.ai",
        "com.studyflow.server"
})
public class StudyFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudyFlowApplication.class, args);
    }
}
```

#### application-prod.yml - 生产环境配置

```yaml
server:
  port: 8080
  servlet:
    context-path: /

spring:
  # 数据源配置
  datasource:
    url: jdbc:mysql://${MYSQL_HOST:localhost}:${MYSQL_PORT:3306}/${MYSQL_DATABASE:studyflow}?useUnicode=true&characterEncoding=utf-8&useSSL=true&serverTimezone=Asia/Shanghai
    username: ${MYSQL_USERNAME:studyflow}
    password: ${MYSQL_PASSWORD:studyflow123}
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      minimum-idle: 10
      maximum-pool-size: 50
      idle-timeout: 600000
      max-lifetime: 1800000
      connection-timeout: 30000

  # Redis 配置
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
      database: 0
      timeout: 6000ms
      lettuce:
        pool:
          max-active: 20
          max-idle: 20
          min-idle: 5
          max-wait: -1ms

  # Flyway 配置
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
    validate-on-migrate: true

# MyBatis Plus 配置
mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.nologging.NoLoggingImpl
  global-config:
    db-config:
      id-type: assign_uuid
      logic-delete-field: deletedAt
      logic-delete-value: 'NOW()'
      logic-not-delete-value: 'NULL'

# JWT 配置
jwt:
  secret: ${JWT_SECRET:your-production-secret-key-must-be-32-chars-long}
  expiration: 86400000
  refresh-expiration: 604800000

# 日志配置
logging:
  level:
    root: WARN
    com.studyflow: INFO
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
```

---

## 5. 测试方法

### 5.1 单元测试

#### UserServiceTest.java - 用户服务测试

```java
package com.studyflow.user.service;

import com.studyflow.user.dto.request.RegisterRequest;
import com.studyflow.user.entity.User;
import com.studyflow.user.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class UserServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserMapper userMapper;

    @Test
    void testRegister() {
        // 准备测试数据
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser_new");
        request.setPassword("123456");
        request.setEmail("test_new@example.com");
        request.setNickname("测试用户");

        // 执行注册
        authService.register(request);

        // 验证结果
        User user = userMapper.selectByUsername("testuser_new");
        assertNotNull(user);
        assertEquals("testuser_new", user.getUsername());
        assertEquals("测试用户", user.getNickname());
    }
}
```

### 5.2 接口测试（Knife4j）

启动应用后，访问以下地址查看 API 文档：

```
http://localhost:8080/doc.html
```

#### 使用 Knife4j 进行接口测试

1. **打开文档页面**
   - 浏览器访问 `http://localhost:8080/doc.html`

2. **查看接口列表**
   - 左侧导航栏显示所有接口
   - 点击接口查看详情

3. **测试接口**
   - 点击"调试"按钮
   - 填写请求参数
   - 点击"发送"按钮
   - 查看响应结果

4. **设置全局 Token**
   - 点击右上角"Authorize"
   - 输入 `Bearer your-jwt-token`
   - 后续请求会自动携带 Token

### 5.3 使用 Postman 测试

#### 导入 OpenAPI 文档

1. 访问 `http://localhost:8080/v3/api-docs`
2. 复制 JSON 内容
3. 打开 Postman
4. File -> Import -> Raw text -> 粘贴 JSON

#### 常用测试用例

**1. 用户注册**
```http
POST http://localhost:8080/api/v1/auth/register
Content-Type: application/json

{
    "username": "newuser",
    "password": "123456",
    "email": "newuser@example.com",
    "nickname": "新用户"
}
```

**2. 用户登录**
```http
POST http://localhost:8080/api/v1/auth/login
Content-Type: application/json

{
    "username": "testuser",
    "password": "123456"
}
```

**3. 获取任务列表**
```http
GET http://localhost:8080/api/v1/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 6. 部署流程

### 6.1 打包

```bash
# 进入项目根目录
cd studyflow-backend

# 清理并打包
mvn clean package -DskipTests

# 查看生成的 JAR 文件
ls -la studyflow-server/target/*.jar
```

### 6.2 Docker 部署

#### 创建 Dockerfile

在 `studyflow-server` 模块下创建 `Dockerfile`:

```dockerfile
# 使用 OpenJDK 21 基础镜像
FROM eclipse-temurin:21-jre-alpine

# 设置工作目录
WORKDIR /app

# 复制 JAR 文件
COPY target/studyflow-server-1.0.0-SNAPSHOT.jar app.jar

# 暴露端口
EXPOSE 8080

# 设置 JVM 参数
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC"

# 启动应用
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

#### 创建 docker-compose.yml

在项目根目录创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # MySQL 数据库
  mysql:
    image: mysql:8.0
    container_name: studyflow-mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:root123456}
      MYSQL_DATABASE: studyflow
      MYSQL_USER: ${MYSQL_USERNAME:studyflow}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:studyflow123}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    command: >
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_unicode_ci
      --default-authentication-plugin=mysql_native_password
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis 缓存
  redis:
    image: redis:7-alpine
    container_name: studyflow-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
      - ./redis.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # StudyFlow 后端服务
  app:
    build:
      context: ./studyflow-server
      dockerfile: Dockerfile
    container_name: studyflow-app
    environment:
      SPRING_PROFILES_ACTIVE: prod
      MYSQL_HOST: mysql
      MYSQL_PORT: 3306
      MYSQL_DATABASE: studyflow
      MYSQL_USERNAME: ${MYSQL_USERNAME:studyflow}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:studyflow123}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD:}
      JWT_SECRET: ${JWT_SECRET:your-production-secret-key-must-be-32-chars-long}
    ports:
      - "8080:8080"
    depends_on:
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

volumes:
  mysql_data:
  redis_data:
```

#### 部署步骤

```bash
# 1. 构建项目
mvn clean package -DskipTests

# 2. 启动所有服务
docker-compose up -d

# 3. 查看日志
docker-compose logs -f app

# 4. 查看服务状态
docker-compose ps

# 5. 停止服务
docker-compose down

# 6. 停止并删除数据卷
docker-compose down -v
```

### 6.3 生产环境配置

#### 环境变量配置

创建 `.env` 文件：

```bash
# 数据库配置
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_USERNAME=studyflow
MYSQL_PASSWORD=your_secure_password

# Redis 配置
REDIS_PASSWORD=your_redis_password

# JWT 配置
JWT_SECRET=your-256-bit-secret-key-here-must-be-at-least-32-characters-long
```

#### Nginx 反向代理配置

```nginx
server {
    listen 80;
    server_name api.studyflow.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.studyflow.com;

    # SSL 证书配置
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # 反向代理到后端服务
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 7. 常见问题解决

### 7.1 数据库连接问题

**问题**: `Communications link failure`

**解决方案**:
```bash
# 1. 检查 MySQL 容器是否运行
docker ps | grep mysql

# 2. 检查端口是否被占用
netstat -tlnp | grep 3306

# 3. 检查连接配置
# 确保 application.yml 中的 host、port、username、password 正确

# 4. 重启 MySQL 容器
docker restart studyflow-mysql
```

### 7.2 JWT 密钥问题

**问题**: `JWT signature does not match`

**解决方案**:
```bash
# 1. 生成安全的 JWT 密钥
openssl rand -base64 32

# 2. 更新 application.yml 中的 jwt.secret
# 密钥必须是 Base64 编码的 256 位密钥
```

### 7.3 Maven 依赖问题

**问题**: `Could not find artifact`

**解决方案**:
```bash
# 1. 清理本地仓库
cd ~/.m2/repository/com/studyflow
rm -rf *

# 2. 重新编译
cd studyflow-backend
mvn clean install -DskipTests

# 3. 刷新 IDEA 的 Maven 项目
# 右键 pom.xml -> Maven -> Reload Project
```

### 7.4 端口冲突问题

**问题**: `Port 8080 was already in use`

**解决方案**:
```bash
# 1. 查找占用端口的进程
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8080
kill -9 <PID>

# 2. 或修改 application.yml 中的端口
server:
  port: 8081
```

### 7.5 Flyway 迁移失败

**问题**: `FlywayException: Validate failed`

**解决方案**:
```bash
# 1. 进入 MySQL 容器
docker exec -it studyflow-mysql mysql -uroot -p

# 2. 删除 Flyway 历史记录表
USE studyflow;
DROP TABLE IF EXISTS flyway_schema_history;

# 3. 重新启动应用
```

### 7.6 Redis 连接问题

**问题**: `Connection refused: connect`

**解决方案**:
```bash
# 1. 检查 Redis 容器状态
docker ps | grep redis

# 2. 检查 Redis 密码配置
# 确保 application.yml 中的密码与 redis.conf 一致

# 3. 测试 Redis 连接
docker exec -it studyflow-redis redis-cli -a redis123456 ping
```

### 7.7 IDEA 编译问题

**问题**: `java: 程序包不存在`

**解决方案**:
```
1. File -> Invalidate Caches / Restart
2. 选择 Invalidate and Restart
3. 等待 IDEA 重启
4. 右键 pom.xml -> Maven -> Reload Project
```

### 7.8 Lombok 注解不生效

**解决方案**:
```
1. 确保 IDEA 已安装 Lombok 插件
   File -> Settings -> Plugins -> 搜索 Lombok -> 安装

2. 启用注解处理器
   File -> Settings -> Build -> Annotation Processors
   勾选 "Enable annotation processing"

3. 重新编译项目
   Build -> Rebuild Project
```

---

## 附录

### A. 完整项目结构

```
studyflow-backend/
├── pom.xml                                    # 父POM
├── docker-compose.yml                         # Docker Compose 配置
├── .env                                       # 环境变量
├── README.md                                  # 项目说明
├── studyflow-common/                          # 公共模块
│   ├── pom.xml
│   └── src/main/java/com/studyflow/common/
│       ├── config/
│       ├── constant/
│       ├── entity/
│       ├── exception/
│       ├── result/
│       └── util/
├── studyflow-user/                            # 用户模块
│   ├── pom.xml
│   └── src/main/java/com/studyflow/user/
│       ├── config/
│       ├── controller/
│       ├── dto/
│       ├── entity/
│       ├── mapper/
│       ├── security/
│       └── service/
├── studyflow-task/                            # 任务模块
│   ├── pom.xml
│   └── src/main/java/com/studyflow/task/
│       ├── controller/
│       ├── dto/
│       ├── entity/
│       ├── mapper/
│       └── service/
├── studyflow-pomodoro/                        # 番茄钟模块
│   ├── pom.xml
│   └── src/main/java/com/studyflow/pomodoro/
│       ├── controller/
│       ├── dto/
│       ├── entity/
│       ├── mapper/
│       └── service/
├── studyflow-stats/                           # 统计模块
│   └── pom.xml
├── studyflow-ai/                              # AI模块（预留）
│   └── pom.xml
└── studyflow-server/                          # 启动模块
    ├── pom.xml
    ├── Dockerfile
    └── src/
        ├── main/
        │   ├── java/com/studyflow/server/
        │   │   └── StudyFlowApplication.java
        │   └── resources/
        │       ├── application.yml
        │       ├── application-dev.yml
        │       ├── application-prod.yml
        │       └── db/migration/
        │           ├── V1__init_schema.sql
        │           └── V2__init_data.sql
        └── test/
```

### B. 常用命令速查

```bash
# Maven 命令
mvn clean                    # 清理
mvn compile                  # 编译
mvn test                     # 运行测试
mvn package                  # 打包
mvn install                  # 安装到本地仓库
mvn spring-boot:run          # 运行 Spring Boot 应用

# Docker 命令
docker ps                    # 查看运行中的容器
docker ps -a                 # 查看所有容器
docker logs <container>      # 查看容器日志
docker exec -it <container> bash  # 进入容器
docker-compose up -d         # 后台启动所有服务
docker-compose down          # 停止所有服务
docker-compose logs -f       # 实时查看日志

# MySQL 命令
docker exec -it studyflow-mysql mysql -uroot -p
SHOW DATABASES;
USE studyflow;
SHOW TABLES;
DESC users;
SELECT * FROM users;

# Redis 命令
docker exec -it studyflow-redis redis-cli -a redis123456
KEYS *
GET key
DEL key
```

### C. 参考资源

- [Spring Boot 官方文档](https://spring.io/projects/spring-boot)
- [MyBatis-Plus 官方文档](https://baomidou.com/)
- [Spring Security 官方文档](https://spring.io/projects/spring-security)
- [Knife4j 官方文档](https://doc.xiaominfo.com/)
- [JWT 官方文档](https://jwt.io/)

---

**文档版本**: v1.0  
**最后更新**: 2024年  
**作者**: StudyFlow 开发团队

