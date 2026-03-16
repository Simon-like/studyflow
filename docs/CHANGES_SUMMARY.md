# StudyFlow 修改总结

> **修改日期**: 2026-03-15

## 一、功能修改概览

### 1. 自由模式处理优化 ✅

**问题**: 结束任务后任务状态处理不正确

**解决方案**:
- 点击"结束任务"后，弹出确认对话框
- 确认后清除选中的任务，进入自由模式
- 自由模式下时钟显示"自由任务 / 专注当下 / 自由模式"
- 自由模式下可以随意进行番茄钟而不与任何任务绑定

**涉及文件**:
- `apps/mobile/src/screens/Home/hooks.ts` - `abandonTask` 方法
- `apps/web/src/features/dashboard/index.tsx` - `handleAbandonTask` 方法

### 2. 重置按钮添加确认弹窗 ✅

**问题**: 重置按钮没有确认提示，且不清除任务状态

**解决方案**:
- 点击"重置"时弹出确认对话框
- 如果有选中的任务，提示将清除任务绑定并进入自由模式
- 确认后清除任务选中状态并重置计时器

**涉及文件**:
- `apps/mobile/src/screens/Home/hooks.ts` - `resetTimer` 方法
- `apps/web/src/features/dashboard/index.tsx` - `handleResetTimer` 方法

### 3. 删除预计番茄数字段 ✅

**变更内容**:
- 删除 `Task` 类型的 `estimatedPomodoros` 和 `completedPomodoros` 字段
- 删除创建任务时的预估番茄数设置
- 删除UI中显示番茄进度的相关代码
- 任务卡片只显示分类信息，不再显示番茄进度

**涉及文件**:
- `packages/shared/src/types/index.ts` - Task接口
- `packages/api/src/services/taskService.ts` - CreateTaskRequest接口
- `packages/api/src/mock/data.ts` - Mock任务数据
- `packages/api/src/mock/services.ts` - createTask和stop方法
- `apps/mobile/src/screens/Tasks/index.tsx` - 创建任务表单
- `apps/mobile/src/screens/Home/index.tsx` - 任务详情弹窗
- `apps/web/src/features/dashboard/index.tsx` - 任务详情弹窗

## 二、统计模块重新设计

### 核心统计指标

| 指标 | 说明 | 数据来源 |
|------|------|----------|
| 每日完成番茄数 | 用户每天完成的番茄钟数量 | `pomodoro_daily_stats` 表 |
| 每日专注时长 | 用户每天专注的总分钟数 | `pomodoro_daily_stats` 表 |
| 每日完成任务数 | 用户每天完成的任务数 | `task_daily_stats` 表 |
| 连续学习天数 | 连续有学习记录的天数 | `user_streaks` 表 |
| 学科分布 | 各学科专注时长占比 | 实时计算 |

### 不再统计的指标

- ❌ 每个任务的预计番茄数
- ❌ 每个任务的已完成番茄数
- ❌ 任务的番茄进度百分比

## 三、后端设计文档

**文档位置**: `docs/backend-design-spring.md`

**文档内容**:
1. 技术选型（Spring Boot 3.2 + Java 21 + PostgreSQL）
2. 完整的数据库表结构设计（6张表）
3. JPA实体类定义
4. RESTful API接口设计
5. 核心业务逻辑（番茄钟结算、任务状态切换）
6. 统计模块详细设计（预聚合策略）
7. 安全设计（JWT认证）
8. Docker Compose部署配置
9. 项目目录结构

## 四、文件变更详情

### Mobile端
- `apps/mobile/src/screens/Home/hooks.ts` - 核心逻辑修改
- `apps/mobile/src/screens/Home/index.tsx` - UI和弹窗修改
- `apps/mobile/src/screens/Tasks/index.tsx` - 删除番茄数设置

### Web端
- `apps/web/src/features/dashboard/index.tsx` - 核心逻辑和UI修改

### 共享包
- `packages/shared/src/types/index.ts` - Task类型定义
- `packages/api/src/mock/data.ts` - Mock数据
- `packages/api/src/mock/services.ts` - Mock服务逻辑
- `packages/api/src/services/taskService.ts` - API接口定义

## 五、后续开发建议

### 后端开发顺序
1. **P0 - 基础设施**（1天）
   - 项目搭建
   - 数据库初始化（Flyway迁移脚本）
   - Docker Compose配置

2. **P0 - 认证模块**（2天）
   - JWT Token生成与验证
   - 登录/注册接口
   - Spring Security配置

3. **P0 - 任务模块**（2天）
   - 任务CRUD接口
   - 今日任务查询
   - 任务排序功能

4. **P0 - 番茄钟模块**（2天）
   - 开始/停止番茄钟
   - 结算逻辑
   - 与任务的弱关联

5. **P1 - 统计模块**（2天）
   - 预聚合表设计
   - 每日统计更新逻辑
   - 连续天数计算

6. **P2 - 优化**（2天）
   - API文档完善
   - 单元测试
   - 性能优化

## 六、数据库迁移说明

从旧版本迁移到新版本需要执行以下SQL：

```sql
-- 删除Task表的番茄数字段
ALTER TABLE tasks DROP COLUMN IF EXISTS estimated_pomodoros;
ALTER TABLE tasks DROP COLUMN IF EXISTS completed_pomodoros;

-- 创建预聚合统计表
-- （详见 docs/backend-design-spring.md 第3.2节）
```

---

## 七、番茄钟功能改进（2026-03-15 追加）

### 1. 完成按钮置灰逻辑 ✅

**问题**: 任务未开启时（暂停时算开启了某项任务），完成按钮不应该可用

**解决方案**:
- 添加 `isTaskBound` 属性到 `PomodoroTimerProps` 和 `TimerControlsProps`
- 当未绑定任务且计时器处于 idle 状态时，完成按钮置灰（opacity: 0.4）
- 暂停状态（paused）下，即使自由模式，完成按钮也可用

**涉及文件**:
- `apps/mobile/src/components/business/PomodoroTimer/types.ts` - 添加 isTaskBound 属性
- `apps/mobile/src/components/business/PomodoroTimer/index.tsx` - 传递 isTaskBound
- `apps/mobile/src/components/business/PomodoroTimer/components/TimerControls.tsx` - 置灰逻辑
- `apps/web/src/components/business/PomodoroTimer/types.ts` - 添加 isTaskBound 属性
- `apps/web/src/components/business/PomodoroTimer/index.tsx` - 传递 isTaskBound
- `apps/web/src/components/business/PomodoroTimer/components/TimerControls.tsx` - 置灰逻辑
- `apps/mobile/src/screens/Home/index.tsx` - 传递 isTaskBound={!!selectedTask}
- `apps/web/src/features/dashboard/index.tsx` - 传递 isTaskBound={isTaskBound}

### 2. 完成任务确认弹窗 ✅

**问题**: 点击完成按钮时，应该给出 dialog 提示，确定结束该任务

**解决方案**:
- 点击完成按钮时显示确认弹窗
- 任务模式：提示"确定要提前结束并完成任务「xxx」吗？"
- 自由模式：提示"确定要完成当前番茄钟吗？完成后将计入统计。"

**涉及文件**:
- `apps/mobile/src/screens/Home/hooks.ts` - `completeTask` 方法添加确认弹窗
- `apps/web/src/features/dashboard/index.tsx` - `handleCompleteTask` 方法添加确认弹窗

### 3. 结束任务改为放弃任务 ✅

**问题**: "结束任务"语义不够准确，应该改为"放弃任务"

**解决方案**:
- 按钮文字从"结束任务"改为"放弃任务"
- 确认弹窗标题从"结束任务"改为"放弃任务"
- 提示文本更新为"放弃后计时将不会计入统计"

**涉及文件**:
- `apps/mobile/src/components/business/PomodoroTimer/components/TimerControls.tsx` - 按钮文字
- `apps/web/src/components/business/PomodoroTimer/components/TimerControls.tsx` - 按钮文字
- `apps/mobile/src/screens/Home/hooks.ts` - `abandonTask` 方法弹窗文本
- `apps/web/src/features/dashboard/index.tsx` - `handleAbandonTask` 方法弹窗文本

### 4. 自由模式下完成按钮逻辑 ✅

**问题**: 自由模式下，完成按钮应该也能起作用，完成后的番茄钟需要计入统计

**解决方案**:
- 自由模式下，点击完成按钮可以记录已专注的时间
- 创建番茄钟记录并标记为已完成（completed）
- 放弃任务则不计入统计（相当于重置）

**涉及文件**:
- `apps/mobile/src/screens/Home/hooks.ts` - `completeTask` 方法添加自由模式处理
- `apps/web/src/features/dashboard/index.tsx` - `handleCompleteTask` 方法添加自由模式处理

### 5. 任务卡标题描述最多三行 ✅

**问题**: 任务卡的标题描述应该最多显示三行，超过需要省略

**解决方案**:
- Mobile 端：将 `numberOfLines={1}` 改为 `numberOfLines={3}`
- Web 端：将 `truncate` 改为 `line-clamp-3`（Tailwind CSS）

**涉及文件**:
- `apps/mobile/src/screens/Home/components/SortableTaskList.tsx` - TaskItem 组件
- `apps/web/src/features/dashboard/components/SortableTaskList.tsx` - TaskItemContent 组件

---

*此文档描述了从旧版本升级到新版本的所有变更*
