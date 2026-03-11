'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ListTodo,
  Clock,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
} from 'lucide-react';

const sidebarItems = [
  { href: '/dashboard', label: '仪表盘', icon: Home },
  { href: '/tasks', label: '任务管理', icon: ListTodo },
  { href: '/pomodoro', label: '番茄钟', icon: Clock },
  { href: '/stats', label: '学习统计', icon: BarChart3 },
  { href: '/community', label: '学习社区', icon: Users },
  { href: '/settings', label: '设置', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-mist min-h-[calc(100vh-4rem)]">
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-coral/10 text-coral'
                  : 'text-stone hover:bg-warm hover:text-charcoal'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-mist">
        <Link
          href="/help"
          className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-stone hover:bg-warm hover:text-charcoal transition-all"
        >
          <HelpCircle className="w-5 h-5 mr-3" />
          帮助中心
        </Link>
      </div>
    </aside>
  );
}