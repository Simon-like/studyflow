/**
 * Home 页面类型定义
 */

export interface Task {
  id: number;
  title: string;
  sub: string;
  done: boolean;
  active: boolean;
}

export interface Stat {
  label: string;
  value: string;
}

export interface User {
  name: string;
  avatar: string;
}
