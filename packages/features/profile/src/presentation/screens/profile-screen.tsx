import { useState } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  ChevronRight, 
  LogOut,
  Target,
  Clock,
  TrendingUp
} from 'lucide-react';
import type { User as UserType } from '@studyflow/features-auth';

interface ProfileScreenProps {
  user: UserType;
  onNavigateToSettings?: () => void;
  onNavigateToStats?: () => void;
  onLogout?: () => void;
}

export function ProfileScreen({ 
  user, 
  onNavigateToSettings,
  onNavigateToStats,
  onLogout 
}: ProfileScreenProps) {
  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <div className="bg-gradient-to-br from-coral/20 to-sage/20 rounded-3xl p-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 gradient-coral rounded-3xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-4xl">
              {user.nickname?.[0] || user.email[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-charcoal">
              {user.nickname || user.email.split('@')[0]}
            </h1>
            <p className="text-stone">{user.email}</p>
            <div className="flex gap-2 mt-3">
              <span className="badge-coral">{user.studyGoal || '学习中'}</span>
              <span className="badge-sage">坚持23天</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-charcoal">128</p>
            <p className="text-stone text-sm">番茄总数</p>
          </div>
          <div className="text-center border-x border-charcoal/10">
            <p className="font-display text-2xl font-bold text-charcoal">52h</p>
            <p className="text-stone text-sm">专注时长</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-charcoal">89%</p>
            <p className="text-stone text-sm">完成率</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-3">
        <MenuItem 
          icon={User} 
          label="个人资料" 
          description="修改昵称、头像等信息"
          onClick={() => {}}
        />
        <MenuItem 
          icon={Settings} 
          label="应用设置" 
          description="番茄钟参数、通知提醒"
          onClick={onNavigateToSettings}
        />
        <MenuItem 
          icon={Bell} 
          label="消息通知" 
          description="每日提醒、成就通知"
          onClick={() => {}}
        />
        <MenuItem 
          icon={TrendingUp} 
          label="数据统计" 
          description="查看详细学习报告"
          onClick={onNavigateToStats}
        />
        <MenuItem 
          icon={Shield} 
          label="隐私安全" 
          description="修改密码、数据备份"
          onClick={() => {}}
        />
      </div>

      {/* Logout Button */}
      <button 
        onClick={onLogout}
        className="w-full bg-white text-red-500 font-medium py-4 rounded-2xl shadow-sm 
                   hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        退出登录
      </button>
    </div>
  );
}

function MenuItem({ 
  icon: Icon, 
  label, 
  description,
  onClick 
}: { 
  icon: React.ElementType; 
  label: string; 
  description?: string;
  onClick?: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 
                 hover:shadow-md transition-all group"
    >
      <div className="w-12 h-12 bg-coral/10 rounded-xl flex items-center justify-center 
                      group-hover:bg-coral/20 transition-colors">
        <Icon className="w-5 h-5 text-coral" />
      </div>
      <div className="flex-1 text-left">
        <p className="font-medium text-charcoal">{label}</p>
        {description && <p className="text-xs text-stone">{description}</p>}
      </div>
      <ChevronRight className="w-5 h-5 text-mist" />
    </button>
  );
}
