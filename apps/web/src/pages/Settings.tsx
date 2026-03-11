import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, Moon, Shield, User } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-charcoal mb-6">设置</h1>

      <div className="space-y-6">
        {/* 账户设置 */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-coral/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-coral" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal">账户信息</h2>
              <p className="text-sm text-stone">管理您的个人账户信息</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-mist/20">
              <span className="text-stone">用户名</span>
              <span className="text-charcoal font-medium">{user?.username || '未设置'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-mist/20">
              <span className="text-stone">昵称</span>
              <span className="text-charcoal font-medium">{user?.nickname || '未设置'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-stone">邮箱</span>
              <span className="text-charcoal font-medium">{user?.email || '未设置'}</span>
            </div>
          </div>
        </Card>

        {/* 通知设置 */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-sage/20 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-sage" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal">通知设置</h2>
              <p className="text-sm text-stone">管理您的通知偏好</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-stone">启用通知</span>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors ${
                notifications ? 'bg-coral' : 'bg-mist'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </Card>

        {/* 外观设置 */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-warm rounded-lg flex items-center justify-center">
              <Moon className="w-5 h-5 text-charcoal" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal">外观</h2>
              <p className="text-sm text-stone">自定义您的界面外观</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-stone">深色模式</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors ${
                darkMode ? 'bg-coral' : 'bg-mist'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </Card>

        {/* 隐私与安全 */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-coral/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-coral" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-charcoal">隐私与安全</h2>
              <p className="text-sm text-stone">管理您的隐私设置</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            修改密码
          </Button>
        </Card>
      </div>
    </div>
  );
}
