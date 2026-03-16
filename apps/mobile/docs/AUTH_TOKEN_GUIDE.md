# Mobile 双 Token 持久化方案

## 概述

本文档描述了 StudyFlow Mobile 端的双 Token 认证持久化方案，包括：
- Access Token + Refresh Token 双 token 机制
- AsyncStorage 持久化存储
- 自动刷新机制
- Mock 模式支持

## 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                     AuthContext (全局认证状态)                 │
├─────────────────────────────────────────────────────────────┤
│                     useAuthToken Hook                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   登录/登出  │  │  Token刷新   │  │   自动刷新调度       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                   tokenStorage (存储层)                      │
│         AsyncStorage - accessToken / refreshToken           │
├─────────────────────────────────────────────────────────────┤
│                      API 层 (Mock)                           │
│              mockAuthService / authService                   │
└─────────────────────────────────────────────────────────────┘
```

## 核心组件

### 1. TokenStorage (`src/utils/tokenStorage.ts`)

基于 AsyncStorage 的 token 存储工具：

```typescript
// 存储的键名
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'studyflow_access_token',
  REFRESH_TOKEN: 'studyflow_refresh_token',
  TOKEN_EXPIRES_AT: 'studyflow_token_expires_at',
  USER: 'studyflow_user',
};

// 主要方法
- saveTokens(data: TokenData)     // 保存双 token
- getAccessToken()                // 获取 access token
- getRefreshToken()               // 获取 refresh token
- clearTokens()                   // 清除所有 token（登出）
- isTokenExpiringSoon(bufferMin)  // 检查 token 是否即将过期
```

### 2. useAuthToken Hook (`src/hooks/useAuthToken.ts`)

核心认证逻辑 Hook：

```typescript
interface UseAuthTokenReturn {
  isAuthenticated: boolean;        // 是否已认证
  isLoading: boolean;              // 初始化加载状态
  user: User | null;               // 当前用户信息
  
  login(username, password)        // 登录（mock 模式）
  logout()                         // 登出
  refreshAccessToken()             // 手动刷新 access token
  getValidAccessToken()            // 获取有效的 access token（自动刷新）
}
```

**自动刷新机制：**
- 每 55 分钟自动刷新一次 access token
- Token 即将过期（5分钟内）时自动刷新
- 刷新失败自动重试 3 次

### 3. AuthContext (`src/contexts/AuthContext.tsx`)

全局认证状态提供者：

```typescript
// 使用方式
const { 
  isAuthenticated, 
  isLoading, 
  user, 
  login, 
  logout 
} = useAuth();
```

## 使用示例

### 登录流程

```tsx
import { useAuth } from '../contexts/AuthContext';

function LoginScreen() {
  const { login } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login('test@studyflow.com', 'Test1234');
      // 登录成功，AuthContext 自动更新状态
      // Navigation 自动跳转到主界面
    } catch (error) {
      // 处理登录失败
    }
  };
}
```

### 登出流程

```tsx
import { useAuth } from '../contexts/AuthContext';

function ProfileScreen() {
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    // 登出成功，自动清除 token
    // Navigation 自动跳转到登录页
  };
}
```

### 获取当前用户

```tsx
const { user, isAuthenticated } = useAuth();

if (isAuthenticated && user) {
  console.log(user.nickname);  // 用户昵称
  console.log(user.avatar);    // 用户头像
}
```

## Mock 模式

当前系统使用 Mock 模式，登录时：

1. 调用 `api.auth.login()` → 实际调用 `mockAuthService.login()`
2. Mock 服务返回预设的 token 和用户信息
3. `useAuthToken` 保存 token 到 AsyncStorage
4. 更新认证状态，UI 自动切换到主界面

**测试账号：**
- 用户名: `test@studyflow.com`
- 密码: `Test1234`

## Token 数据结构

```typescript
// 存储在 AsyncStorage 中的数据
{
  "studyflow_access_token": "mock-access-token-xxx",
  "studyflow_refresh_token": "mock-refresh-token-xxx",
  "studyflow_token_expires_at": "1234567890000",  // 时间戳
  "studyflow_user": {
    "id": "user-001",
    "username": "test@studyflow.com",
    "nickname": "学习达人",
    "avatar": "",
    // ...
  }
}
```

## 切换到真实后端

当后端就绪后，需要：

1. **更新 API 创建函数** (`packages/api/src/index.ts`):
```typescript
export const api = createApi(false);  // 关闭 mock
```

2. **确保后端支持双 token**：
   - 登录接口返回: `{ accessToken, refreshToken, expiresIn, user }`
   - 刷新接口: `POST /api/v1/auth/refresh` 接收 refreshToken，返回新的双 token

3. **更新 httpClient** 的拦截器（如果需要）

## 安全建议

1. **使用 SecureStore**（生产环境）
   - 对于敏感数据（refreshToken），建议使用 Expo SecureStore 替代 AsyncStorage
   - 需要安装: `expo-secure-store`

2. **HTTPS 通信**
   - 生产环境必须启用 HTTPS
   - 配置证书固定（Certificate Pinning）

3. **Token 过期策略**
   - Access Token: 建议 15-60 分钟
   - Refresh Token: 建议 7-30 天

## 调试

### 查看存储的 token
```javascript
// 在 RN 调试器中运行
import AsyncStorage from '@react-native-async-storage/async-storage';

const keys = await AsyncStorage.getAllKeys();
const items = await AsyncStorage.multiGet(keys);
console.log(items);
```

### 清除所有存储
```javascript
await AsyncStorage.clear();
```

## 文件列表

| 文件 | 描述 |
|------|------|
| `src/utils/tokenStorage.ts` | Token 存储工具 |
| `src/hooks/useAuthToken.ts` | 双 Token 管理 Hook |
| `src/contexts/AuthContext.tsx` | 全局认证上下文 |
| `src/navigation/index.tsx` | 导航集成 |
| `src/screens/Auth/LoginScreen.tsx` | 登录页面 |
| `src/screens/Auth/RegisterScreen.tsx` | 注册页面 |
