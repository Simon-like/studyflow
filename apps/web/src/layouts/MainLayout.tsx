import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/hooks';
import { useTabTransition } from '@/hooks/useTabTransition';
import { TabTransitionWrapper } from '@/components/PageRefresh';
import { Avatar } from '@/components/ui';
import {
  Home,
  MessageCircle,
  CheckSquare,
  Users,
  User,
  BarChart2,
  Settings,
  Bell,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: '首页', icon: Home },
  { to: '/companion', label: '学伴对话', icon: MessageCircle },
  { to: '/tasks', label: '任务管理', icon: CheckSquare },
  { to: '/community', label: '社区', icon: Users },
  { to: '/profile', label: '个人中心', icon: User },
  { to: '/stats', label: '学习统计', icon: BarChart2 },
  { to: '/settings', label: '设置', icon: Settings },
];

export function MainLayout() {
  const { displayName, avatarUrl, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab 切换动画管理
  const {
    getTabLoadingState,
    startTabTransition,
    endTabTransition
  } = useTabTransition(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  // 处理导航点击
  const handleNavClick = (to: string) => {
    if (to !== location.pathname) {
      startTabTransition(to);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-mist/20 flex flex-col sticky top-0 h-screen z-10">
        {/* Logo */}
        <div className="p-6 border-b border-mist/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-coral rounded-xl flex items-center justify-center shadow-soft">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold text-charcoal">StudyFlow</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => handleNavClick(item.to)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-coral/10 text-coral'
                      : 'text-stone hover:bg-warm hover:text-charcoal'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-mist/20 space-y-1.5">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone hover:bg-warm transition-all">
            <Bell className="w-5 h-5" />
            通知中心
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-warm transition-all"
          >
            <Avatar
              name={displayName}
              src={avatarUrl}
              size="sm"
              color="bg-coral"
            />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-charcoal truncate">{displayName}</p>
              <p className="text-xs text-stone">退出登录</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto min-h-screen relative">
        <TabTransitionWrapper
          tabKey={location.pathname}
          isLoading={getTabLoadingState(location.pathname).isLoading}
          onTransitionEnd={endTabTransition}
        >
          <Outlet />
        </TabTransitionWrapper>
      </main>
    </div>
  );
}
