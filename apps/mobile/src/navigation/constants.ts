/**
 * 导航常量
 */

import { IconName } from '../components/ui/Icon';

export type TabKey = 'home' | 'tasks' | 'companion' | 'community' | 'profile';

export interface TabConfig {
  key: TabKey;
  label: string;
  icon: IconName;
}

export const TABS: TabConfig[] = [
  { key: 'home', label: '首页', icon: 'home' },
  { key: 'tasks', label: '任务', icon: 'tasks' },
  { key: 'companion', label: '学伴', icon: 'chat' },
  { key: 'community', label: '社区', icon: 'users' },
  { key: 'profile', label: '我的', icon: 'user' },
];
