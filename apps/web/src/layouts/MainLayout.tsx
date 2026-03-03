import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  CheckSquare, 
  BarChart3, 
  MessageCircle, 
  Users, 
  User, 
  Settings,
  BookOpen
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const navigation = [
  { name: '仪表盘', path: '/dashboard', icon: Home },
  { name: '任务管理', path: '/tasks', icon: CheckSquare },
  { name: '数据分析', path: '/stats', icon: BarChart3 },
  { name: '学伴对话', path: '/companion', icon: MessageCircle },
  { name: '学习社区', path: '/community', icon: Users },
];

function Sidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-mist/30 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 gradient-coral rounded-xl flex items-center justify-center shadow-lg">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <span className="font-display text-xl font-bold text-charcoal">StudyFlow</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-mist/20">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              isActive ? 'bg-coral/10 text-coral' : 'hover:bg-warm'
            }`
          }
        >
          <div className="w-10 h-10 gradient-coral rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">
              {user?.nickname?.[0] || user?.username?.[0] || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-charcoal font-medium text-sm truncate">
              {user?.nickname || user?.username || '用户'}
            </p>
            <p className="text-stone text-xs truncate">
              {user?.studyGoal || '学习中'}
            </p>
          </div>
        </NavLink>
        
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 mt-2 rounded-xl transition-all duration-200 text-stone ${
              isActive ? 'text-coral bg-coral/10' : 'hover:bg-warm hover:text-charcoal'
            }`
          }
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">设置</span>
        </NavLink>
      </div>
    </aside>
  );
}

export function MainLayout() {
  return (
    <div className="min-h-screen bg-cream flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
