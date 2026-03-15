import { useState, useEffect, useRef } from 'react';
import { X, Camera, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import type { UpdateProfileRequest } from '@studyflow/shared';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: {
    nickname?: string;
    username?: string;
    avatar?: string;
    studyGoal?: string;
    email?: string;
    phone?: string;
  } | null;
  onSubmit: (data: UpdateProfileRequest) => Promise<void>;
  onAvatarChange: (file: File) => Promise<void>;
  isSubmitting?: boolean;
}

export function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSubmit,
  onAvatarChange,
  isSubmitting = false,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    nickname: '',
    studyGoal: '',
    email: '',
    phone: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 初始化表单数据
  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        nickname: profile.nickname || '',
        studyGoal: profile.studyGoal || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
      setAvatarPreview(profile.avatar || '');
    }
  }, [profile, isOpen]);

  const handleInputChange = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 预览
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // 上传
    await onAvatarChange(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-mist/20">
          <h2 className="text-xl font-semibold text-charcoal">编辑资料</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-mist/30 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-stone" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar
                name={formData.nickname || profile?.username || 'U'}
                src={avatarPreview}
                size="xl"
                color="bg-coral"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-coral text-white rounded-full flex items-center justify-center shadow-medium hover:bg-coral/90 transition-colors disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Nickname */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-charcoal">
              昵称
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => handleInputChange('nickname', e.target.value)}
                placeholder="请输入昵称"
                maxLength={50}
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-3 bg-warm rounded-xl border-0 text-charcoal placeholder:text-stone/50 focus:ring-2 focus:ring-coral/30 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-stone/60 text-right">
              {(formData.nickname?.length || 0)}/50
            </p>
          </div>

          {/* Study Goal */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-charcoal">
              学习目标
            </label>
            <textarea
              value={formData.studyGoal}
              onChange={(e) => handleInputChange('studyGoal', e.target.value)}
              placeholder="例如：考研上岸、通过雅思..."
              rows={3}
              maxLength={200}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-warm rounded-xl border-0 text-charcoal placeholder:text-stone/50 focus:ring-2 focus:ring-coral/30 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-stone/60 text-right">
              {(formData.studyGoal?.length || 0)}/200
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-charcoal">
              邮箱
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="example@email.com"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-warm rounded-xl border-0 text-charcoal placeholder:text-stone/50 focus:ring-2 focus:ring-coral/30 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-charcoal">
              手机号
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="138xxxxxxxxx"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-warm rounded-xl border-0 text-charcoal placeholder:text-stone/50 focus:ring-2 focus:ring-coral/30 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
