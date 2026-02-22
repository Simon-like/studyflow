# 移动端导航架构决策记录

**日期**: 2026-02-22  
**作者**: Kimi Code  
**状态**: 已实施  
**相关**: apps/mobile

---

## 背景

StudyFlow 移动端应用需要实现复杂的导航结构，包括：
- 认证流程（登录、注册）
- 主应用流程（多个功能模块）
- 全局页面（设置、任务详情等）

---

## 决策

### 采用 Root/Main 工程范式

```
RootNavigator
├── Auth Stack (未认证状态)
│   ├── Login
│   └── Register
│
└── Main Stack (已认证状态)
    ├── Bottom Tabs
    │   ├── Home
    │   ├── Tasks
    │   ├── Stats
    │   ├── Companion
    │   ├── Community
    │   └── Profile
    │
    └── 全局页面（Modal/覆盖层）
        ├── Settings
        ├── TaskDetail
        └── PomodoroTimer
```

### 技术选型

| 技术 | 版本 | 用途 |
|------|------|------|
| @react-navigation/native | v7.x | 导航核心 |
| @react-navigation/native-stack | v7.x | 原生栈导航 |
| @react-navigation/bottom-tabs | v7.x | 底部 Tab 导航 |

### 状态管理

- 使用 **Zustand** 替代 Redux
- 原因：
  1. 学习成本低，适合新人
  2. 体积小，适合移动端
  3. TypeScript 支持好
  4. 支持持久化中间件

---

## 实现细节

### 文件结构

```
src/
├── navigation/
│   ├── RootNavigator.tsx      # 根导航，处理认证状态切换
│   ├── AuthNavigator.tsx      # 认证流程导航
│   ├── MainNavigator.tsx      # 主应用底部 Tab 导航
│   └── index.ts               # 导航导出
│
├── stores/
│   └── authStore.ts           # 鉴权状态管理
│
├── types/
│   └── navigation.ts          # 导航类型定义
│
└── screens/
    ├── auth/                  # 认证页面
    └── main/                  # 主应用页面
```

### 关键代码模式

**1. 条件渲染导航栈**

```tsx
<Stack.Navigator>
  {isAuthenticated ? (
    // Main Stack
    <>
      <Stack.Screen name="Main" component={MainNavigator} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </>
  ) : (
    // Auth Stack
    <Stack.Screen name="Auth" component={AuthNavigator} />
  )}
</Stack.Navigator>
```

**2. 类型安全的导航**

```ts
// 类型定义
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Settings: undefined;
  TaskDetail: { taskId: string };
};

// 全局声明
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
```

**3. 持久化认证状态**

```ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({ ... }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

---

## 优点

1. **清晰的职责分离**
   - Root 层只负责认证状态判断
   - Auth 和 Main 各自管理内部导航

2. **类型安全**
   - 完整的 TypeScript 类型定义
   - 编译时检查导航参数

3. **易于维护**
   - 模块化的导航配置
   - 新增页面只需修改对应 Navigator

4. **用户体验**
   - 认证状态变化时平滑切换
   - 支持返回手势（iOS）

---

## 后续优化建议

1. **深度链接 (Deep Linking)**
   - 配置 scheme 处理外部跳转
   - 支持从通知进入特定页面

2. **导航状态持久化**
   - 记录用户离开时的页面位置
   - 重启应用后恢复导航栈

3. **分析埋点**
   - 监听导航事件
   - 记录页面访问统计

---

## 参考

- [React Navigation 官方文档](https://reactnavigation.org/)
- [Zustand 文档](https://docs.pmnd.rs/zustand)
