# StudyFlow 阿里云部署指南

## 📋 部署架构

```
┌─────────────────────────────────────────────────────────────┐
│                         阿里云 ECS                           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │   Nginx     │───▶│  Web (React)│    │  Server (NestJS)│  │
│  │  (80/443)   │    │   (容器)     │◀───│    (容器)        │  │
│  └─────────────┘    └─────────────┘    └─────────────────┘  │
│                                               │              │
│  ┌─────────────┐    ┌─────────────┐          │              │
│  │ PostgreSQL  │◀───│   Redis     │◀─────────┘              │
│  │   (容器)     │    │   (容器)     │                         │
│  └─────────────┘    └─────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 第一步：购买阿里云服务器

### 1.1 选购建议

| 配置项 | 推荐配置 | 说明 |
|--------|----------|------|
| **实例规格** | 2核4G 或更高 | 学习应用，初期 2核4G 够用 |
| **操作系统** | Alibaba Cloud Linux 3 / Ubuntu 22.04 | 推荐 Alibaba Cloud Linux |
| **带宽** | 3-5Mbps | 按固定带宽计费 |
| **存储** | 40GB ESSD 云盘 | 系统盘 |
| **数据盘** | 100GB（可选） | 存放数据库备份 |
| **地域** | 选择离你最近的 | 降低延迟 |

### 1.2 安全组配置

在阿里云控制台配置安全组规则：

| 端口 | 用途 | 授权对象 |
|------|------|----------|
| 22 | SSH 远程连接 | 你的 IP |
| 80 | HTTP | 0.0.0.0/0 |
| 443 | HTTPS | 0.0.0.0/0 |

> ⚠️ **注意**: 不要开放 3001、5432、6379 端口，这些只通过内网访问

---

## 第二步：服务器初始化

### 2.1 连接服务器

```bash
# 使用 SSH 连接（将 xxx.xxx.xxx.xxx 替换为你的服务器 IP）
ssh root@xxx.xxx.xxx.xxx
```

### 2.2 系统更新

```bash
# Alibaba Cloud Linux / CentOS
yum update -y

# Ubuntu
apt update && apt upgrade -y
```

### 2.3 安装 Docker

```bash
# 安装 Docker（Alibaba Cloud Linux / CentOS）
yum install -y docker

# 启动 Docker
systemctl start docker
systemctl enable docker

# 验证安装
docker --version
```

### 2.4 安装 Docker Compose

```bash
# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 添加执行权限
sudo chmod +x /usr/local/bin/docker-compose

# 创建软链接
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# 验证安装
docker-compose --version
```

### 2.5 安装 Git

```bash
# Alibaba Cloud Linux / CentOS
yum install -y git

# Ubuntu
apt install -y git
```

---

## 第三步：配置域名和 HTTPS（可选但推荐）

### 3.1 购买域名

在阿里云购买域名并完成实名认证。

### 3.2 解析域名

在阿里云 DNS 控制台添加解析记录：

| 记录类型 | 主机记录 | 解析值 |
|----------|----------|--------|
| A | @ | 你的服务器 IP |
| A | www | 你的服务器 IP |

### 3.3 安装 Certbot（Let's Encrypt）

```bash
# 安装 Certbot
yum install -y epel-release
yum install -y certbot

# 申请证书（将 your-domain.com 替换为你的域名）
certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# 证书将保存在：
# /etc/letsencrypt/live/your-domain.com/fullchain.pem
# /etc/letsencrypt/live/your-domain.com/privkey.pem
```

---

## 第四步：部署应用

### 4.1 克隆代码

```bash
# 进入 /opt 目录
cd /opt

# 克隆代码（替换为你的仓库地址）
git clone https://github.com/your-username/studyflow.git

# 进入项目目录
cd studyflow
```

### 4.2 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置
nano .env
```

`.env` 文件内容示例：

```bash
# 数据库配置
DB_USER=studyflow
DB_PASSWORD=Your_Strong_Password_123
DB_NAME=studyflow

# Redis 配置
REDIS_PASSWORD=Your_Redis_Password_456

# JWT 配置（至少32位随机字符串）
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-to-32-chars
JWT_ACCESS_EXPIRATION=2h
JWT_REFRESH_EXPIRATION=7d

# CORS 配置（你的域名）
CORS_ORIGIN=https://your-domain.com
```

> ⚠️ **重要**: 请使用强密码替换示例中的密码！

### 4.3 执行部署

```bash
# 添加执行权限
chmod +x scripts/deploy.sh

# 执行部署
./scripts/deploy.sh
```

部署脚本会自动：
1. 拉取最新代码
2. 构建 Docker 镜像
3. 启动所有服务
4. 执行数据库迁移
5. 清理旧镜像

### 4.4 验证部署

```bash
# 查看运行状态
docker-compose -f docker-compose.prod.yml ps

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 只查看后端日志
docker-compose -f docker-compose.prod.yml logs -f server
```

---

## 第五步：配置 HTTPS（使用域名时）

### 5.1 修改 Nginx 配置

编辑 `apps/web/nginx.conf`：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # HTTP 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_prefer_server_ciphers on;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /api {
        proxy_pass http://server:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /socket.io {
        proxy_pass http://server:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5.2 挂载证书并重新部署

修改 `docker-compose.prod.yml` 中的 web 服务：

```yaml
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    container_name: studyflow-web
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro  # 挂载 SSL 证书
    depends_on:
      - server
```

重新部署：

```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 第六步：设置自动备份

### 6.1 创建备份目录

```bash
mkdir -p /backups/studyflow
```

### 6.2 添加定时任务

```bash
# 编辑定时任务
crontab -e

# 添加以下内容（每天凌晨 3 点备份）
0 3 * * * /opt/studyflow/scripts/backup.sh >> /var/log/studyflow-backup.log 2>&1

# 自动续期 SSL 证书（每周一凌晨 2 点）
0 2 * * 1 /usr/bin/certbot renew --quiet
```

---

## 第七步：配置 CI/CD（可选）

### 7.1 GitHub Actions 工作流

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/studyflow
            git pull origin main
            ./scripts/deploy.sh
```

### 7.2 配置 GitHub Secrets

在 GitHub 仓库设置中添加：
- `SERVER_HOST`: 你的服务器 IP
- `SERVER_USER`: root（或你的用户名）
- `SSH_PRIVATE_KEY`: SSH 私钥

---

## 🔧 常用运维命令

```bash
# 查看服务状态
docker-compose -f docker-compose.prod.yml ps

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 重启服务
docker-compose -f docker-compose.prod.yml restart

# 停止服务
docker-compose -f docker-compose.prod.yml down

# 进入容器
docker exec -it studyflow-server sh

# 数据库备份
docker exec studyflow-postgres pg_dump -U studyflow studyflow > backup.sql

# 数据库恢复
docker exec -i studyflow-postgres psql -U studyflow studyflow < backup.sql

# 查看资源占用
docker stats

# 清理未使用的镜像
docker image prune -f
```

---

## ⚠️ 安全建议

1. **修改默认密码**: 所有默认密码必须在生产环境修改
2. **禁用 root 登录**: 创建普通用户并使用密钥登录
3. **配置防火墙**: 只开放必要的端口
4. **定期更新**: 及时更新系统和 Docker 镜像
5. **启用日志**: 配置日志收集和监控

---

## 🆘 故障排查

### 服务无法启动

```bash
# 查看详细日志
docker-compose -f docker-compose.prod.yml logs server

# 检查端口占用
netstat -tlnp | grep 3001
```

### 数据库连接失败

```bash
# 检查数据库是否运行
docker-compose -f docker-compose.prod.yml ps postgres

# 测试数据库连接
docker exec -it studyflow-postgres psql -U studyflow -d studyflow -c "\dt"
```

### 前端无法访问 API

```bash
# 检查后端是否正常运行
docker-compose -f docker-compose.prod.yml ps server

# 测试 API
curl http://localhost:3001/api/health
```

---

## 📞 需要帮助？

遇到问题请检查：
1. 安全组规则是否正确配置
2. `.env` 文件是否正确配置
3. Docker 和 Docker Compose 版本是否兼容
4. 服务器内存是否充足（建议至少 2GB）
