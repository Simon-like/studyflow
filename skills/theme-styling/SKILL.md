# Theme & Styling Development

StudyFlow主题与样式开发指南 - 如何使用设计系统保持双端一致性。

---

## 概述

StudyFlow使用`@studyflow/theme`包统一管理设计令牌，通过平台适配器生成Web(Tailwind)和Mobile(RN StyleSheet)可用的样式系统。

## 设计系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                      设计系统架构                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            @studyflow/theme (Source of Truth)            │   │
│  │                                                         │   │
│  │  tokens.ts                                              │   │
│  │  ├── colors (coral, sage, neutral...)                   │   │
│  │  ├── spacing (4, 8, 12, 16...)                          │   │
│  │  ├── typography (fontSizes, fontWeights...)             │   │
│  │  └── shadows, radii, breakpoints...                     │   │
│  │                                                         │   │
│  │  adapters.ts                                            │   │
│  │  ├── mobileTokens → RN StyleSheet                       │   │
│  │  ├── webTokens → CSS Variables                          │   │
│  │  └── generateTailwindConfig()                           │   │
│  │                                                         │   │
│  └─────────────────────────┬───────────────────────────────┘   │
│                            │                                    │
│           ┌────────────────┼────────────────┐                   │
│           ▼                ▼                ▼                   │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐          │
│  │    Web      │   │   Mobile    │   │   Shared    │          │
│  │  Tailwind   │   │  StyleSheet │   │   Types     │          │
│  │             │   │             │   │             │          │
│  │ text-coral  │   │ colors.coral│   │  ColorToken │          │
│  │ p-4         │   │ spacing.md  │   │  SpacingToken│          │
│  └─────────────┘   └─────────────┘   └─────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 使用方式

### Web端 (Tailwind CSS)

```typescript
// apps/web/tailwind.config.js
import { generateTailwindConfig } from '@studyflow/theme/adapters';

export default generateTailwindConfig({
  // 自定义扩展
  extend: {
    animation: {
      'spin-slow': 'spin 3s linear infinite',
    },
  },
});
```

```tsx
// Web组件中使用
function Button({ variant = 'primary', children }: ButtonProps) {
  const variants = {
    primary: 'bg-coral text-white hover:bg-coral-600',
    secondary: 'bg-sage text-white hover:bg-sage-600',
    outline: 'border-2 border-coral text-coral hover:bg-coral/10',
  };
  
  return (
    <button className={`
      px-4 py-2 
      rounded-lg 
      font-medium 
      transition-colors 
      ${variants[variant]}
    `}>
      {children}
    </button>
  );
}
```

### Mobile端 (React Native)

```typescript
// apps/mobile/src/theme/index.ts
import { mobileTokens } from '@studyflow/theme';

export const colors = mobileTokens.colors;
export const spacing = mobileTokens.spacing;
export const typography = mobileTokens.typography;
export const radii = mobileTokens.radii;

// apps/mobile/src/components/ui/Button.tsx
import { colors, spacing, radii } from '../../theme';

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
  },
  primary: {
    backgroundColor: colors.coral[500],
  },
  secondary: {
    backgroundColor: colors.sage[500],
  },
  text: {
    color: colors.white,
    fontWeight: '600',
  },
});
```

## 颜色系统

### 主色调

| Token | 色值 | 用途 |
|-------|------|------|
| `coral.500` | `#E07A5F` | 主品牌色、CTA按钮 |
| `coral.50` | `#FDF6F1` | 浅色背景、hover状态 |
| `sage.500` | `#81B29A` | 成功状态、次要操作 |
| `neutral.900` | `#3D405B` | 主文字颜色 |
| `neutral.500` | `#8E8E93` | 次要文字 |
| `neutral.200` | `#E5E5E5` | 边框、分割线 |

### 使用示例

```tsx
// Web - Tailwind
<div className="bg-coral-50 border border-coral-200 text-coral-900">
  提示信息
</div>

// Mobile - StyleSheet
<View style={{
  backgroundColor: colors.coral[50],
  borderColor: colors.coral[200],
  borderWidth: 1,
}}>
  <Text style={{ color: colors.coral[900] }}>提示信息</Text>
</View>
```

## 间距系统

| Token | 值 | 用途 |
|-------|-----|------|
| `xs` | 4 | 紧凑间距 |
| `sm` | 8 | 小间距 |
| `md` | 16 | 标准间距 |
| `lg` | 24 | 大间距 |
| `xl` | 32 | 区块间距 |
| `2xl` | 48 | 页面间距 |

### 平台映射

```typescript
// Web: Tailwind类名
<div className="p-4 gap-2 mx-auto max-w-6xl">

// Mobile: StyleSheet
<View style={{
  padding: spacing.md,
  gap: spacing.sm,
  marginHorizontal: 'auto',
  maxWidth: 768,
}}>
```

## 字体系统

### 字体栈

```typescript
// Web (Tailwind)
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}

// Mobile (系统字体)
fontFamily: {
  sans: undefined, // 使用系统默认
  mono: 'Courier',
}
```

### 字体大小

| Token | Web | Mobile | 用途 |
|-------|-----|--------|------|
| `xs` | `text-xs` | `12` | 标签、辅助文字 |
| `sm` | `text-sm` | `14` | 次要内容 |
| `base` | `text-base` | `16` | 正文 |
| `lg` | `text-lg` | `18` | 小标题 |
| `xl` | `text-xl` | `20` | 标题 |
| `2xl` | `text-2xl` | `24` | 大标题 |

### 字体粗细

```tsx
// Web
<p className="font-normal">常规</p>
<p className="font-medium">中等</p>
<p className="font-semibold">半粗</p>
<p className="font-bold">粗体</p>

// Mobile
<Text style={{ fontWeight: '400' }}>常规</Text>
<Text style={{ fontWeight: '500' }}>中等</Text>
<Text style={{ fontWeight: '600' }}>半粗</Text>
<Text style={{ fontWeight: '700' }}>粗体</Text>
```

## 圆角系统

| Token | 值 | 用途 |
|-------|-----|------|
| `none` | 0 | 无圆角 |
| `sm` | 4 | 小标签 |
| `md` | 8 | 按钮、输入框 |
| `lg` | 12 | 卡片 |
| `xl` | 16 | 大卡片 |
| `full` | 9999 | 圆形、胶囊 |

## 阴影系统

### Web

```tsx
// Tailwind阴影
<div className="shadow-sm">   // 小阴影</div>
<div className="shadow">      // 标准阴影</div>
<div className="shadow-md">   // 中等阴影</div>
<div className="shadow-lg">   // 大阴影</div>
<div className="shadow-xl">   // 特大阴影</div>
```

### Mobile

```tsx
// iOS阴影
<View style={{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3, // Android
}} />
```

## 组件样式规范

### Button 规范

```typescript
// packages/shared/src/types/components.ts
export interface ButtonVariant {
  bg: string;
  bgHover: string;
  text: string;
  border?: string;
}

// Web实现
const buttonVariants: Record<string, string> = {
  primary: 'bg-coral-500 text-white hover:bg-coral-600',
  secondary: 'bg-sage-500 text-white hover:bg-sage-600',
  outline: 'border-2 border-coral-500 text-coral-500 hover:bg-coral-50',
  ghost: 'text-neutral-700 hover:bg-neutral-100',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

// Mobile实现
const buttonStyles = StyleSheet.create({
  base: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.coral[500],
  },
  // ...
});
```

### Card 规范

```tsx
// Web
<div className="bg-white rounded-xl shadow-md p-6">
  <h3 className="text-lg font-semibold text-neutral-900">标题</h3>
  <p className="text-neutral-600 mt-2">内容</p>
</div>

// Mobile
<View style={{
  backgroundColor: colors.white,
  borderRadius: radii.lg,
  padding: spacing.lg,
  ...shadows.md,
}}>
  <Text style={{ fontSize: 18, fontWeight: '600', color: colors.neutral[900] }}>
    标题
  </Text>
  <Text style={{ color: colors.neutral[600], marginTop: spacing.sm }}>
    内容
  </Text>
</View>
```

## 响应式设计 (Web)

```tsx
// Tailwind响应式前缀
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 移动端1列，平板2列，桌面3列 */}
</div>

// 隐藏/显示
<div className="hidden md:block">
  {/* 仅平板及以上显示 */}
</div>

// 字体大小响应式
<h1 className="text-xl md:text-2xl lg:text-3xl">
  响应式标题
</h1>
```

## 深色模式支持

```typescript
// tailwind.config.ts 配置
darkMode: 'class',

// 使用
<div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
  支持深色模式
</div>

// 切换
function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);
  
  return <button onClick={() => setIsDark(!isDark)}>切换主题</button>;
}
```

## 最佳实践

1. **始终使用设计令牌**
   ```css
   /* ❌ 错误 */
   color: #E07A5F;
   padding: 15px;
   
   /* ✅ 正确 */
   color: theme('colors.coral.500');
   padding: theme('spacing.md');
   ```

2. **提取可复用样式**
   ```typescript
   // 创建样式变体
   export const cardStyles = {
     base: 'bg-white rounded-xl',
     elevated: 'bg-white rounded-xl shadow-md',
     flat: 'bg-neutral-50 rounded-xl border border-neutral-200',
   };
   ```

3. **保持平台一致性**
   - Web和Mobile使用相同的颜色值
   - 间距系统保持一致
   - 组件圆角一致

4. **避免魔法数字**
   ```typescript
   // ❌ 错误
   <View style={{ marginTop: 17 }} />
   
   // ✅ 正确
   <View style={{ marginTop: spacing.md }} />
   ```

## 相关链接

- [@studyflow/theme](../../packages/theme/)
- [Tailwind CSS](https://tailwindcss.com)
- [React Native StyleSheet](https://reactnative.dev/docs/stylesheet)
