# StudyFlow — AI 数字人模块详细规范

> **版本**：v1.0  
> **更新日期**：2026-05-11  
> **用途**：AI 数字人模块（Companion）的开发蓝图。包含数据库设计、API 定义、业务逻辑、前端交互和 Prompt 工程规范。  
> **状态**：⏳ 待开发（后端 API + 前端真实对接）  
> **当前现状**：Web 和 Mobile 的 companion 页面已有 UI 壳子和 Mock 数据

---

## 1. 模块概述

### 1.1 功能定位

AI 数字人是 StudyFlow 的**核心差异化功能**，为学习者提供：

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 智能对话 | 基于上下文的自然语言交互 | P0 |
| 学习计划生成 | 根据用户目标生成个性化学习计划 | P0 |
| 知识问答 | 回答学习过程中的疑问 | P1 |
| 情感陪伴 | 识别情绪，提供鼓励和建议 | P1 |
| 学习提醒 | 基于数据的智能提醒 | P2 |
| 番茄钟联动 | 根据专注情况给出建议 | P2 |

### 1.2 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                         AI 数字人模块架构                     │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Web + Mobile)                                    │
│  ├── Companion 页面（聊天界面）                              │
│  ├── 学习计划展示页                                          │
│  └── 快捷操作面板（QuickActions）                            │
├─────────────────────────────────────────────────────────────┤
│  Backend (Spring Boot)                                      │
│  ├── AICompanionController  ← REST API 入口                  │
│  ├── ChatService            ← 会话管理 + 消息存储            │
│  ├── AIStudyPlanService     ← 学习计划生成 + 管理            │
│  ├── AIOrchestrator         ← 意图识别 + 提示词组装          │
│  ├── LLMProvider            ← LLM API 调用封装               │
│  └── ContextManager         ← 对话上下文管理                 │
├─────────────────────────────────────────────────────────────┤
│  External Services                                          │
│  ├── LLM API (OpenAI / Claude / 通义千问 / DeepSeek)         │
│  └── Vector DB (预留: Milvus / Pinecone)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 数据库设计

### 2.1 实体关系

```
User (1)
 ├── ChatSession (N)
 │    └── ChatMessage (N)
 ├── AiStudyPlan (N)
 └── KnowledgeDocument (N) [预留]
```

### 2.2 ChatSession —— 对话会话

```java
@Entity
@Table(name = "chat_sessions", indexes = {
    @Index(name = "idx_chat_sessions_user_created", columnList = "user_id, created_at")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "title", length = 100)
    private String title; // AI 自动生成或用户自定义

    @Column(name = "context_summary", columnDefinition = "TEXT")
    private String contextSummary; // 长会话摘要

    @Column(name = "message_count", nullable = false)
    @Builder.Default
    private Integer messageCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "session_type", nullable = false, length = 20)
    @Builder.Default
    private SessionType sessionType = SessionType.GENERAL;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("createdAt ASC")
    @Builder.Default
    private List<ChatMessage> messages = new ArrayList<>();

    public enum SessionType {
        GENERAL,      // 通用对话
        STUDY_PLAN,   // 学习计划
        KNOWLEDGE_QA, // 知识问答
        EMOTIONAL,    // 情感陪伴
        POMODORO      // 番茄钟陪伴
    }

    public void incrementMessageCount() {
        this.messageCount++;
    }
}
```

### 2.3 ChatMessage —— 对话消息

```java
@Entity
@Table(name = "chat_messages", indexes = {
    @Index(name = "idx_chat_messages_session", columnList = "session_id, created_at")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private ChatSession session;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private ChatRole role; // user / assistant / system

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false, length = 20)
    @Builder.Default
    private MessageType messageType = MessageType.TEXT;

    @Column(name = "metadata", columnDefinition = "jsonb")
    private String metadata; // JSON: { tokensUsed, model, durationMs, finishReason }

    @Column(name = "tokens_used")
    private Integer tokensUsed;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum ChatRole {
        USER, ASSISTANT, SYSTEM
    }

    public enum MessageType {
        TEXT, PLAN, REMINDER, ANALYSIS, SUGGESTION
    }
}
```

### 2.4 AiStudyPlan —— AI 生成的学习计划

```java
@Entity
@Table(name = "ai_study_plans", indexes = {
    @Index(name = "idx_ai_plans_user_status", columnList = "user_id, status")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AiStudyPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "chat_session_id")
    private UUID chatSessionId; // 关联生成该计划的会话

    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "target", columnDefinition = "TEXT")
    private String target; // 学习目标描述

    @Column(name = "goals", columnDefinition = "jsonb")
    private String goals; // JSON 数组: [{ title, deadline, completed }]

    @Column(name = "tasks", columnDefinition = "jsonb")
    private String tasks; // JSON 数组: [{ title, subject, estimatedMinutes, dayOfWeek }]

    @Column(name = "daily_schedule", columnDefinition = "jsonb")
    private String dailySchedule; // JSON: { morning: [...], afternoon: [...], evening: [...] }

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private PlanStatus status = PlanStatus.ACTIVE;

    @Column(name = "progress", nullable = false)
    @Builder.Default
    private Integer progress = 0; // 0-100

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum PlanStatus {
        ACTIVE, COMPLETED, ARCHIVED, ABANDONED
    }
}
```

### 2.5 KnowledgeDocument —— 知识库（RAG 预留）

```java
@Entity
@Table(name = "knowledge_documents", indexes = {
    @Index(name = "idx_knowledge_docs_category", columnList = "category")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class KnowledgeDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "vector_id", length = 100)
    private String vectorId; // 向量数据库 ID

    @Column(name = "embedding_status", length = 20)
    @Builder.Default
    private String embeddingStatus = "pending"; // pending / processing / completed / failed

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
```

---

## 3. API 接口定义

### 3.1 会话管理

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/v1/chat/sessions` | 获取用户会话列表 |
| `POST` | `/api/v1/chat/sessions` | 创建新会话 |
| `GET` | `/api/v1/chat/sessions/{sessionId}` | 获取会话详情（含最近消息） |
| `DELETE` | `/api/v1/chat/sessions/{sessionId}` | 删除会话 |
| `PATCH` | `/api/v1/chat/sessions/{sessionId}/title` | 修改会话标题 |

### 3.2 消息对话

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/v1/chat/sessions/{sessionId}/messages` | 分页获取消息历史 |
| `POST` | `/api/v1/chat/sessions/{sessionId}/messages` | 发送消息（非流式） |
| `POST` | `/api/v1/chat/sessions/{sessionId}/messages/stream` | 发送消息（SSE 流式） |

### 3.3 学习计划

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/v1/chat/plans/generate` | 生成学习计划 |
| `GET` | `/api/v1/chat/plans` | 获取用户学习计划列表 |
| `GET` | `/api/v1/chat/plans/{planId}` | 获取计划详情 |
| `PUT` | `/api/v1/chat/plans/{planId}` | 更新计划 |
| `DELETE` | `/api/v1/chat/plans/{planId}` | 删除计划 |
| `POST` | `/api/v1/chat/plans/{planId}/progress` | 更新进度 |

### 3.4 请求/响应 DTO

```java
// ========== 请求 DTO ==========

@Data
@Schema(description = "创建会话请求")
public class CreateSessionRequest {
    @Schema(description = "会话类型", example = "GENERAL")
    private SessionType sessionType = SessionType.GENERAL;
}

@Data
@Schema(description = "发送消息请求")
public class SendMessageRequest {
    @NotBlank(message = "消息内容不能为空")
    @Size(max = 4000, message = "消息长度不能超过4000字符")
    @Schema(description = "消息内容", example = "帮我制定一个考研数学复习计划")
    private String content;
}

@Data
@Schema(description = "生成学习计划请求")
public class GeneratePlanRequest {
    @NotBlank(message = "学习目标不能为空")
    @Schema(description = "学习目标", example = "3个月内考研数学达到120分")
    private String target;

    @Schema(description = "当前水平", example = "基础薄弱，高数只学过一半")
    private String currentLevel;

    @Schema(description = "每日可用时间（分钟）", example = "240")
    private Integer dailyMinutes;

    @Schema(description = "计划周期（天）", example = "90")
    private Integer durationDays;
}

// ========== 响应 DTO ==========

@Data
@Schema(description = "会话 DTO")
public class ChatSessionDto {
    private UUID id;
    private String title;
    private SessionType sessionType;
    private Integer messageCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Data
@Schema(description = "消息 DTO")
public class ChatMessageDto {
    private UUID id;
    private ChatRole role;
    private String content;
    private MessageType messageType;
    private Integer tokensUsed;
    private LocalDateTime createdAt;
}

@Data
@Schema(description = "学习计划 DTO")
public class AiStudyPlanDto {
    private UUID id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String target;
    private List<PlanGoalDto> goals;
    private List<PlanTaskDto> tasks;
    private DailyScheduleDto dailySchedule;
    private PlanStatus status;
    private Integer progress;
    private LocalDateTime createdAt;
}
```

---

## 4. 业务逻辑设计

### 4.1 消息处理流程

```
用户发送消息
    │
    ▼
[1] 获取/创建 ChatSession
    │
    ▼
[2] 保存用户消息到 chat_messages
    │
    ▼
[3] 意图识别（规则匹配 + LLM 轻量分类）
    │
    ├── GENERAL ──→ 通用对话
    ├── STUDY_PLAN ──→ 组装学习计划 Prompt
    ├── KNOWLEDGE_QA ──→ RAG 检索 + 组装 Prompt
    ├── EMOTIONAL ──→ 情感分析 + 组装 Prompt
    └── POMODORO ──→ 查询番茄钟状态 + 组装 Prompt
    │
    ▼
[4] 组装完整 Prompt（系统提示 + 上下文摘要 + 最近消息 + 增强信息）
    │
    ▼
[5] 调用 LLM API（支持流式返回）
    │
    ▼
[6] 保存 AI 回复到 chat_messages
    │
    ▼
[7] 更新会话上下文（Redis）
    │
    ▼
[8] 返回给前端（如果是学习计划，同时保存到 ai_study_plans）
```

### 4.2 意图识别规则（初版）

```java
private static final Map<IntentType, List<String>> KEYWORD_RULES = Map.of(
    IntentType.STUDY_PLAN, List.of("计划", "规划", "安排", "目标", "复习", "备考", "学习路线"),
    IntentType.KNOWLEDGE_QA, List.of("为什么", "是什么", "怎么做", "如何", "解释", "问题", "什么意思"),
    IntentType.POMODORO, List.of("番茄钟", "专注", "计时", "休息", "开始", "暂停"),
    IntentType.EMOTIONAL, List.of("累", "焦虑", "压力", "担心", "鼓励", "烦躁", "难过", "不想学"),
    IntentType.SUGGESTION, List.of("建议", "推荐", "帮我", "需要", "怎样更好"),
    IntentType.GREETING, List.of("你好", "嗨", "在吗", "hello", "hi")
);
```

规则未命中时，使用轻量级 LLM 调用进行意图分类（temperature=0.3，maxTokens=50）。

### 4.3 上下文管理策略

| 策略 | 实现 | 说明 |
|------|------|------|
| 最近消息 | Redis 缓存 | 保留最近 20 条消息 |
| 上下文摘要 | LLM 摘要 | 消息数超过 15 条时触发压缩 |
| 会话元数据 | 数据库 | title, messageCount, contextSummary |
| 缓存过期 | Redis TTL | 2 小时无活跃自动过期 |

### 4.4 学习计划生成 Prompt 模板

```
你是 StudyFlow 智能学习助手，擅长制定科学、可执行的学习计划。

用户学习画像：
- 日均学习时长：{avgDailyStudyTime} 分钟
- 擅长科目：{strongSubjects}
- 薄弱科目：{weakSubjects}
- 历史连续学习天数：{currentStreak} 天

用户目标：{target}
当前水平：{currentLevel}
每日可用时间：{dailyMinutes} 分钟
计划周期：{durationDays} 天

请生成一份详细的学习计划，包含：
1. 计划标题（20字以内）
2. 计划描述（学习计划的整体思路）
3. 阶段目标（至少3个阶段，每个阶段有截止日期和验收标准）
4. 每日任务安排（按周一至周日，包含科目、内容、预计时长）
5. 每日时间表（早/中/晚的建议安排）

请以 JSON 格式输出，不要包含任何 markdown 代码块标记：
{
  "title": "...",
  "description": "...",
  "goals": [...],
  "tasks": [...],
  "dailySchedule": { "morning": [...], "afternoon": [...], "evening": [...] }
}
```

---

## 5. 前端交互设计

### 5.1 Web 端 Companion 页面

```
┌─────────────────────────────────────────┐
│  ←  学习助手              [+] 新会话    │  Header
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐  你好！我是你的学习助手   │  欢迎语（首次）
│  │  AI头像  │  有什么可以帮你的吗？     │
│  └──────────┘                           │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  📋 制定学习计划                 │    │  QuickActions
│  │  ❓ 解答学习问题                 │    │
│  │  📊 分析学习数据                 │    │
│  │  💪 我需要鼓励                   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [用户消息]                              │
│                              [AI回复]   │  消息列表
│  [用户消息]                              │
│                              [AI回复]   │
│                              [typing...]│  TypingIndicator
│                                         │
├─────────────────────────────────────────┤
│  [输入消息...]              [发送]       │  ChatInput
└─────────────────────────────────────────┘
```

### 5.2 前端关键组件

| 组件 | 位置 | 说明 |
|------|------|------|
| `ChatHeader` | `components/ChatHeader.tsx` | 头部，切换会话 |
| `ChatMessages` | `components/ChatMessages.tsx` | 消息列表，支持滚动加载 |
| `MessageBubble` | `components/business/MessageBubble.tsx` | 消息气泡（Web 已存在） |
| `ChatInput` | `components/ChatInput.tsx` | 输入框 + 发送按钮 |
| `TypingIndicator` | `components/TypingIndicator.tsx` | AI 输入中动画 |
| `QuickActions` | `components/QuickActions.tsx` | 快捷操作按钮 |

### 5.3 前端状态管理

```typescript
// stores/chatStore.ts
interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;

  // Actions
  loadSessions: () => Promise<void>;
  createSession: (type: SessionType) => Promise<string>;
  switchSession: (sessionId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  sendMessageStream: (content: string) => Promise<void>; // SSE
}
```

---

## 6. LLM 接入方案

### 6.1 多厂商抽象

```java
public interface LLMProvider {
    // 流式生成（SSE）
    Flux<String> generateStream(String prompt, ConversationContext context);

    // 非流式生成
    LLMResponse generate(String prompt, ConversationContext context);

    // 快速生成（用于分类、摘要等内部任务）
    String quickGenerate(String prompt);
}
```

### 6.2 推荐接入顺序（MVP）

1. **首选**：国内免费/低成本 API
   - 通义千问（阿里云，有免费额度）
   - DeepSeek（价格低，API 兼容 OpenAI）
   - 文心一言（百度）

2. **备选**：OpenAI / Claude（需代理和海外支付）

3. **降级**：固定回复规则（当前 Mock 实现）

### 6.3 配置示例

```yaml
# application.yml
ai:
  llm:
    provider: deepseek  # openai / deepseek / qwen
    api-key: ${LLM_API_KEY}
    base-url: https://api.deepseek.com
    model: deepseek-chat
    temperature: 0.7
    max-tokens: 2048
    timeout: 30000
```

---

## 7. 开发检查清单

### 7.1 后端开发

- [ ] ChatSession / ChatMessage / AiStudyPlan Entity 创建
- [ ] Repository 接口（分页查询、按会话查消息）
- [ ] ChatService（会话 CRUD、消息发送）
- [ ] LLMProvider 接口 + DeepSeek/OpenAI 实现
- [ ] AIOrchestrator（意图识别、Prompt 组装）
- [ ] ContextManager（Redis 缓存上下文）
- [ ] AICompanionController（REST API + SSE 流式）
- [ ] 学习计划生成服务（Prompt 模板、JSON 解析）
- [ ] Swagger 注解补全

### 7.2 前端开发

- [ ] packages/shared 补充 Chat 相关类型
- [ ] packages/api 创建 chatService（含 SSE 支持）
- [ ] Web companion 页面接入真实 API
- [ ] Mobile companion 页面接入真实 API
- [ ] 流式消息展示（SSE 接收 + 打字机效果）
- [ ] 学习计划展示组件
- [ ] 快捷操作功能实现

---

## 8. 变更日志

| 日期 | 版本 | 变更内容 | 变更者 |
|------|------|----------|--------|
| 2026-05-11 | v1.0 | 初始创建，整合论文第 4.4 章设计和当前 UI 现状 | Kimi Code CLI |

---

**最后更新**：2026-05-11  
**版本**：v1.0
