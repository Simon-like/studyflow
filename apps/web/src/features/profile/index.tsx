import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useUser } from '@/hooks';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileStats } from './components/ProfileStats';
import { Achievements } from './components/Achievements';
import { useDeleteAccount } from './hooks';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { displayName, avatarUrl, studyGoal, tags, stats, rawStats, isLoading } = useUser();
  const deleteAccount = useDeleteAccount();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEditPress = () => {
    navigate('/profile/edit');
  };

  if (isLoading) {
    return (
      <div className="p-10 max-w-6xl mx-auto">
        <div className="animate-pulse mb-8">
          <div className="h-40 bg-mist/30 rounded-3xl" />
        </div>
        <div className="animate-pulse mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-mist/30 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-mist/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <ProfileHeader
        displayName={displayName}
        avatarUrl={avatarUrl}
        studyGoal={studyGoal}
        tags={tags}
        onEditPress={handleEditPress}
      />
      <ProfileStats stats={stats} />
      <Achievements userStats={rawStats} />

      {/* 危险区域 */}
      <div className="mt-8 border border-red-100 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-stone/60 uppercase tracking-wider mb-4">
          危险区域
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-charcoal">注销账号</p>
            <p className="text-xs text-stone/60 mt-0.5">
              永久删除账号及所有数据，此操作不可撤销
            </p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            注销账号
          </button>
        </div>
      </div>

      {/* 注销确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-charcoal text-center mb-2">确认注销账号？</h2>
            <p className="text-sm text-stone text-center mb-6 leading-relaxed">
              账号内所有数据（任务、番茄记录、统计数据）将被<span className="font-semibold text-red-500">永久删除</span>，且无法恢复。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-mist text-sm font-medium text-charcoal hover:bg-warm transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  deleteAccount.mutate();
                }}
                disabled={deleteAccount.isPending}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleteAccount.isPending ? '注销中...' : '确认注销'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
