import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Timer, 
  CheckSquare, 
  BarChart3, 
  Users, 
  Cat,
  Settings,
  UserCircle,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@studyflow/features-auth';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: '仪表盘' },
  { path: '/pomodoro', icon: Timer, label: '番茄钟' },
  { path: '/tasks', icon: CheckSquare, label: '任务' },
  { path: '/stats', icon: BarChart3, label: '统计' },
  { path: '/friends', icon: Users, label: '好友' },
  { path: '/companion', icon: Cat, label: '同伴' },
];

const bottomItems = [
  { path: '/profile', icon: UserCircle, label: '个人中心' },
  { path: '/settings', icon: Settings, label: '设置' },
];

export function Sidebar() {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  return (
    <aside className="w-64 bg-white border-r border-mist flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-mist">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-coral rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="font-display text-xl font-bold text-charcoal">StudyFlow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-coral/10 text-coral font-medium'
                  : 'text-stone hover:bg-warm hover:text-charcoal'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-mist space-y-1">
        {bottomItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-coral/10 text-coral font-medium'
                  : 'text-stone hover:bg-warm hover:text-charcoal'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  );
}
