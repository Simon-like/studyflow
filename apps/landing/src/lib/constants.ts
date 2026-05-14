export const PRODUCT_URLS = {
  web: import.meta.env.VITE_WEB_URL || 'https://app.studyflow.app',
  admin: import.meta.env.VITE_ADMIN_URL || 'https://admin.studyflow.app',
  api: import.meta.env.VITE_API_URL || 'https://api.studyflow.app',
  mobile: {
    ios: '#',
    android: '#',
  },
  github: 'https://github.com/SimonHayek/studyflow',
} as const

export const NAV_ITEMS = [
  { label: '首页', href: '/' },
  {
    label: '功能',
    href: '/features',
    children: [
      { label: '番茄钟专注', href: '/features/pomodoro', icon: 'Timer' },
      { label: 'AI 学习助手', href: '/features/companion', icon: 'Bot' },
      { label: '学习社区', href: '/features/community', icon: 'Users' },
    ],
  },
  { label: '展示', href: '/showcase' },
  { label: '关于', href: '/about' },
] as const

export const FEATURES = [
  {
    id: 'pomodoro',
    icon: 'Timer',
    title: '专注计时',
    subtitle: '番茄钟专注系统',
    description: '科学的番茄工作法，搭配锁屏专注模式和多端实时同步，让你远离干扰、沉浸学习。',
    highlights: [
      '多端实时同步（WebSocket）',
      '锁屏专注模式',
      '任务联动 + 统计分析',
      '休息提醒自动切换',
    ],
    route: '/features/pomodoro',
    color: 'coral' as const,
  },
  {
    id: 'companion',
    icon: 'Bot',
    title: 'AI 助手',
    subtitle: 'AI 数字人学习助手',
    description: '不只是聊天，更能理解你的学习数据。Agent 工具调用，主动分析进度、生成个性化学习计划。',
    highlights: [
      '多轮对话 + SSE 流式输出',
      'Agent 工具调用（4 个系统工具）',
      '7 种情感状态数字人',
      '学习计划 AI 生成',
    ],
    route: '/features/companion',
    color: 'sage' as const,
  },
  {
    id: 'community',
    icon: 'Users',
    title: '学习社区',
    subtitle: '学习社区互动',
    description: '学习不孤单。分享学习动态、自动生成打卡帖、点赞评论互动，让学习变成社交。',
    highlights: [
      '自动打卡帖（学习日报）',
      '评论 + 点赞互动',
      '标签筛选动态广场',
      '通知系统（获赞/回信）',
    ],
    route: '/features/community',
    color: 'coral' as const,
  },
] as const

export const TECH_TAGS = [
  'React 19', 'TypeScript', 'Spring Boot 4.0.6', 'PostgreSQL 16',
  'Redis 7', 'WebSocket', 'JWT', 'Monorepo',
  'TanStack Query', 'Zustand', 'Tailwind CSS', 'Framer Motion',
  'React Native', 'Expo', 'RBAC', 'SSE',
] as const

export const ADMIN_FEATURES = [
  { icon: 'BarChart3', title: '数据大盘', desc: '实时统计与趋势分析' },
  { icon: 'Users', title: '用户管理', desc: '用户列表与状态管控' },
  { icon: 'Shield', title: '内容审核', desc: '帖子评论与敏感词' },
  { icon: 'BookOpen', title: '学习数据', desc: '番茄钟与任务统计' },
  { icon: 'Bot', title: 'AI 管理', desc: 'Prompt 与模型配置' },
  { icon: 'Lock', title: '权限管理', desc: 'RBAC 角色与菜单' },
] as const
