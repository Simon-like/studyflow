#!/bin/bash

# ==========================================
# StudyFlow 数据库备份脚本
# ==========================================

set -e

BACKUP_DIR="/backups/studyflow"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# 创建备份目录
mkdir -p $BACKUP_DIR

echo "🔄 开始备份数据库..."

# 备份 PostgreSQL
docker exec studyflow-postgres pg_dump -U studyflow studyflow > $BACKUP_DIR/studyflow_$DATE.sql

# 压缩备份
gzip $BACKUP_DIR/studyflow_$DATE.sql

# 删除旧备份（保留7天）
find $BACKUP_DIR -name "studyflow_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "✅ 备份完成: $BACKUP_DIR/studyflow_$DATE.sql.gz"
