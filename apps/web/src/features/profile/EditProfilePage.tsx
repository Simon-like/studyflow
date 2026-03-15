import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, User, Tag, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useDialog } from '@/providers/DialogProvider';
import { useUser } from '@/hooks';
import { useUpdateProfile, useUploadAvatar } from './hooks';
import type { UpdateProfileRequest } from '@studyflow/shared';
import { PRESET_USER_TAGS, MAX_USER_TAGS } from '@studyflow/shared';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const dialog = useDialog();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 获取原始数据
  const { displayName, avatarUrl, user: profile, isLoading: isDataLoading } = useUser();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  // 表单状态
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    nickname: '',
    studyGoal: '',
    email: '',
    phone: '',
    tags: [],
  });
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // 初始化表单数据
  useEffect(() => {
    if (profile) {
      const initialData = {
        nickname: profile.nickname || '',
        studyGoal: profile.studyGoal || '',
        email: profile.email || '',
        phone: profile.phone || '',
        tags: profile.tags?.map((t) => t.id) || [],
      };
      setFormData(initialData);
      setSelectedTags(initialData.tags);
      setAvatarPreview(profile.avatar || avatarUrl || '');
    }
  }, [profile, avatarUrl]);

  // 检测表单是否被修改
  useEffect(() => {
    if (!profile) return;

    const initialData = {
      nickname: profile.nickname || '',
      studyGoal: profile.studyGoal || '',
      email: profile.email || '',
      phone: profile.phone || '',
      tags: profile.tags?.map((t) => t.id) || [],
    };

    const hasChanges =
      formData.nickname !== initialData.nickname ||
      formData.studyGoal !== initialData.studyGoal ||
      formData.email !== initialData.email ||
      formData.phone !== initialData.phone ||
      JSON.stringify(selectedTags.sort()) !== JSON.stringify(initialData.tags.sort());

    setIsDirty(hasChanges);
  }, [formData, selectedTags, profile]);

  const handleInputChange = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : prev.length < MAX_USER_TAGS
          ? [...prev, tagId]
          : prev;
      return newTags;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 预览
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // 上传
    await uploadAvatar.mutateAsync(file);
  };

  const handleSave = async () => {
    await updateProfile.mutateAsync({ ...formData, tags: selectedTags });
    
    // 显示保存成功提示
    dialog.confirm({
      variant: 'success',
      title: '保存成功',
      message: '您的个人资料已更新',
      confirmText: '确定',
      cancelText: '',
      onConfirm: () => {
        navigate('/profile');
      },
    });
  };

  const handleBack = useCallback(() => {
    if (isDirty) {
      dialog.confirm({
        variant: 'warning',
        title: '未保存的更改',
        message: '您有未保存的更改，确定要离开吗？',
        confirmText: '离开',
        cancelText: '继续编辑',
        onConfirm: () => {
          navigate('/profile');
        },
      });
    } else {
      navigate('/profile');
    }
  }, [isDirty, navigate, dialog]);

  const isSubmitting = updateProfile.isPending || uploadAvatar.isPending;

  if (isDataLoading) {
    return (
      <div className="p-10 max-w-3xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-mist/30 rounded-xl w-32" />
          <div className="h-96 bg-mist/30 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-3xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-mist/30 rounded-xl transition-colors"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-6 h-6 text-charcoal" />
        </button>
        <h1 className="font-display text-2xl font-bold text-charcoal">编辑资料</h1>
      </div>

      {/* Form Card */}
      <Card padding="lg" className="space-y-8">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar
              name={formData.nickname || profile?.username || 'U'}
              src={avatarPreview}
              size="2xl"
              color="bg-coral"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="absolute -bottom-1 -right-1 w-10 h-10 bg-coral text-white rounded-full flex items-center justify-center shadow-medium hover:bg-coral/90 transition-colors disabled:opacity-50"
            >
              <Camera className="w-5 h-5" />
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
          <p className="text-sm text-stone">点击更换头像</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Nickname */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-charcoal">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-stone" />
                昵称
              </span>
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              placeholder="请输入昵称"
              maxLength={50}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-warm rounded-xl border-0 text-charcoal placeholder:text-stone/50 focus:ring-2 focus:ring-coral/30 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-stone/60 text-right">
              {(formData.nickname?.length || 0)}/50
            </p>
          </div>

          {/* Study Goal */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-charcoal">学习目标</label>
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

          {/* Email & Phone - Two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-charcoal">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-stone" />
                  邮箱
                </span>
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
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-stone" />
                  手机号
                </span>
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
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-charcoal">
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-stone" />
                个人标签
                <span className="text-xs text-stone/60 font-normal">(最多选择{MAX_USER_TAGS}个)</span>
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_USER_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  disabled={
                    isSubmitting ||
                    (!selectedTags.includes(tag.id) && selectedTags.length >= MAX_USER_TAGS)
                  }
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag.id)
                      ? 'bg-coral text-white'
                      : selectedTags.length >= MAX_USER_TAGS
                        ? 'bg-mist/30 text-stone/40 cursor-not-allowed'
                        : 'bg-warm text-stone hover:bg-coral/10 hover:text-coral'
                  }`}
                  title={tag.description}
                >
                  {tag.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-stone/60">
              已选择 {selectedTags.length}/{MAX_USER_TAGS} 个标签
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-mist/20" />

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={handleSave}
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? '保存中...' : '保存'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
