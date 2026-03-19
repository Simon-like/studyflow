import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Tag, Phone, Plus, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useDialog } from '@/providers/DialogProvider';
import { Portal } from '@/components/Portal';
import { useUser } from '@/hooks';
import { useUpdateProfile, useUploadAvatar } from './hooks';
import type { UpdateProfileRequest, UserTag } from '@studyflow/shared';
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
    nickname: profile?.nickname || '',
    studyGoal: profile?.studyGoal || '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  // selectedTagIds: 当前已选中的标签 ID 集合
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  // customTags: 用户在此次编辑中新增的自定义标签（不污染 PRESET_USER_TAGS）
  const [customTags, setCustomTags] = useState<{ id: string; name: string; type: 'custom' }[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [showCustomTagDialog, setShowCustomTagDialog] = useState(false);
  const [customTagName, setCustomTagName] = useState('');

  // 初始化表单数据
  useEffect(() => {
    if (profile) {
      setFormData({
        nickname: profile.nickname || '',
        studyGoal: profile.studyGoal || '',
      });
      const validTags = (profile.tags || []).filter((t) => t?.id && t?.name);
      const savedIds = validTags.map((t) => t.id);
      setSelectedTagIds(savedIds);
      // 从已保存的标签中还原出不在预设列表里的自定义标签
      const presetIds = new Set<string>(PRESET_USER_TAGS.map((t) => t.id));
      const savedCustom = validTags
        .filter((t) => !presetIds.has(t.id))
        .map((t) => ({ id: t.id, name: t.name, type: 'custom' as const }));
      setCustomTags(savedCustom);
      setAvatarPreview(profile.avatar || avatarUrl || '');
    }
  }, [profile, avatarUrl]);

  // 检测表单是否被修改
  useEffect(() => {
    if (!profile) return;
    const initialIds = (profile.tags || []).filter((t) => t?.id && t?.name).map((t) => t.id).sort().join(',');
    const currentIds = [...selectedTagIds].sort().join(',');
    const hasChanges =
      formData.nickname !== (profile.nickname || '') ||
      formData.studyGoal !== (profile.studyGoal || '') ||
      currentIds !== initialIds;
    setIsDirty(hasChanges);
  }, [formData, selectedTagIds, profile]);

  const handleInputChange = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : prev.length < MAX_USER_TAGS
          ? [...prev, tagId]
          : prev,
    );
  };

  const handleAddCustomTag = () => {
    if (!customTagName.trim()) return;

    if (selectedTagIds.length >= MAX_USER_TAGS) {
      dialog.confirm({
        variant: 'warning',
        title: '标签数量限制',
        message: `最多只能添加${MAX_USER_TAGS}个标签，请先删除一些标签再添加。`,
        confirmText: '确定',
        cancelText: '',
      });
      return;
    }

    const customTagId = `custom_${Date.now()}`;
    setCustomTags((prev) => [...prev, { id: customTagId, name: customTagName.trim(), type: 'custom' }]);
    setSelectedTagIds((prev) => [...prev, customTagId]);
    setCustomTagName('');
    setShowCustomTagDialog(false);
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

  // 根据选中的 ID 生成完整的 UserTag 数组
  const selectedTags: UserTag[] = useMemo(() => {
    const allTags = [...PRESET_USER_TAGS, ...customTags];
    return selectedTagIds
      .map((id) => allTags.find((t) => t.id === id))
      .filter((t): t is UserTag => t !== undefined);
  }, [selectedTagIds, customTags]);

  const handleSave = async () => {
    try {
      // 发送完整的标签对象数组
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
    } catch {
      // onError in useUpdateProfile already shows toast with backend message
    }
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
        {/* Avatar - 点击头像直接上传 */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="relative focus:outline-none focus:ring-4 focus:ring-coral/30 rounded-full transition-all"
            >
              <Avatar
                name={formData.nickname || profile?.username || 'U'}
                src={avatarPreview}
                size="2xl"
                color="bg-coral"
                className="group-hover:opacity-80 transition-opacity"
              />
              {/* 悬停时的遮罩提示 */}
              <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-white text-xs font-medium">更换</span>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
          </div>
          <p className="text-sm text-stone">点击头像更换</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-8">
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

          {/* Phone - Read Only */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-charcoal">
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-stone" />
                手机号
              </span>
            </label>
            <input
              type="tel"
              value={profile?.phone || ''}
              disabled
              className="w-full px-4 py-3 bg-mist/30 rounded-xl border-0 text-stone cursor-not-allowed"
            />
            <p className="text-xs text-stone/60">手机号不可修改</p>
          </div>

          {/* Study Goal */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-charcoal">
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-stone" />
                学习目标（可选）
              </span>
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
              {[...PRESET_USER_TAGS, ...customTags].map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  disabled={
                    isSubmitting ||
                    (!selectedTagIds.includes(tag.id) && selectedTagIds.length >= MAX_USER_TAGS)
                  }
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedTagIds.includes(tag.id)
                      ? 'bg-coral text-white'
                      : selectedTagIds.length >= MAX_USER_TAGS
                        ? 'bg-mist/30 text-stone/40 cursor-not-allowed'
                        : 'bg-warm text-stone hover:bg-coral/10 hover:text-coral'
                  }`}
                  title={tag.name}
                >
                  {tag.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowCustomTagDialog(true)}
                disabled={isSubmitting || selectedTagIds.length >= MAX_USER_TAGS}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                  selectedTagIds.length >= MAX_USER_TAGS
                    ? 'bg-mist/30 text-stone/40 cursor-not-allowed'
                    : 'bg-warm text-stone hover:bg-coral/10 hover:text-coral'
                }`}
                title="添加自定义标签"
              >
                <Plus className="w-3 h-3" />
                自定义
              </button>
            </div>
            <p className="text-xs text-stone/60">
              已选择 {selectedTagIds.length}/{MAX_USER_TAGS} 个标签
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

      {/* Custom Tag Dialog */}
      {showCustomTagDialog && (
        <Portal>
          <div 
            className="fixed inset-0 z-50"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {/* 遮罩层 */}
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => {
                setShowCustomTagDialog(false);
                setCustomTagName('');
              }}
            />
            {/* 弹窗内容 - 居中 */}
            <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
              <div 
                className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-charcoal mb-4">添加自定义标签</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={customTagName}
                      onChange={(e) => setCustomTagName(e.target.value)}
                      placeholder="请输入标签名称"
                      maxLength={20}
                      className="w-full px-4 py-3 bg-warm rounded-xl border-0 text-charcoal placeholder:text-stone/50 focus:ring-2 focus:ring-coral/30"
                      autoFocus
                    />
                    <p className="text-xs text-stone/60 text-right">
                      {(customTagName?.length || 0)}/20
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center mt-6">
                    <button
                      onClick={() => {
                        setShowCustomTagDialog(false);
                        setCustomTagName('');
                      }}
                      className="px-5 py-2.5 text-sm font-medium text-stone bg-warm hover:bg-warm/80 rounded-xl transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleAddCustomTag}
                      disabled={!customTagName.trim()}
                      className="px-5 py-2.5 text-sm font-medium text-white bg-coral hover:bg-coral/90 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      添加
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
