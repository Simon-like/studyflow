/**
 * 编辑资料页面
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useProfileData, useUpdateProfile, useUploadAvatar } from './hooks';
import { colors, spacing, radius, fontSize, fontWeight } from '../../theme';
import type { UpdateProfileRequest, UserTag } from '@studyflow/shared';
import { PRESET_USER_TAGS, MAX_USER_TAGS } from '@studyflow/shared';

interface EditProfileScreenProps {
  onBack: () => void;
}

export function EditProfileScreen({ onBack }: EditProfileScreenProps) {
  const { profile, displayName, avatarUrl } = useProfileData();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    nickname: profile?.nickname || '',
    studyGoal: profile?.studyGoal || '',
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<{ id: string; name: string; type: 'custom' }[]>([]);
  const [showCustomTagModal, setShowCustomTagModal] = useState(false);
  const [customTagName, setCustomTagName] = useState('');

  // 初始化表单数据
  useEffect(() => {
    if (profile) {
      setFormData({
        nickname: profile.nickname || '',
        studyGoal: profile.studyGoal || '',
      });
      const validTags = (profile.tags || []).filter(t => t?.id && t?.name);
      setSelectedTags(validTags.map(t => t.id));
      // 从已保存的标签中还原出不在预设列表里的自定义标签
      const presetIds = new Set(PRESET_USER_TAGS.map(t => t.id));
      const savedCustom = validTags
        .filter(t => !presetIds.has(t.id))
        .map(t => ({ id: t.id, name: t.name, type: 'custom' as const }));
      setCustomTags(savedCustom);
    }
  }, [profile]);

  const handleInputChange = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      }
      if (prev.length >= MAX_USER_TAGS) {
        Alert.alert('提示', `最多只能选择${MAX_USER_TAGS}个标签`);
        return prev;
      }
      return [...prev, tagId];
    });
  };

  const handleAddCustomTag = () => {
    if (!customTagName.trim()) return;

    if (selectedTags.length >= MAX_USER_TAGS) {
      Alert.alert('提示', `最多只能添加${MAX_USER_TAGS}个标签，请先删除一些标签再添加。`);
      return;
    }

    const customTagId = `custom_${Date.now()}`;
    setCustomTags(prev => [...prev, { id: customTagId, name: customTagName.trim(), type: 'custom' }]);
    setSelectedTags(prev => [...prev, customTagId]);
    setCustomTagName('');
    setShowCustomTagModal(false);
  };

  const pickImage = async (useCamera: boolean) => {
    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('提示', useCamera ? '需要相机权限才能拍照' : '需要相册权限才能选择图片');
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    const uri = asset.uri;
    const name = uri.split('/').pop() || 'avatar.jpg';
    const type = asset.mimeType || 'image/jpeg';

    try {
      await uploadAvatar.mutateAsync({ uri, name, type });
    } catch {
      Alert.alert('提示', '头像上传失败，请稍后重试');
    }
  };

  const handleAvatarPress = () => {
    Alert.alert('更换头像', '选择图片来源', [
      { text: '拍照', onPress: () => pickImage(true) },
      { text: '从相册选择', onPress: () => pickImage(false) },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const handleSubmit = async () => {
    // 将选中的标签ID转换为UserTag数组
    const allTags = [...PRESET_USER_TAGS, ...customTags];
    const selectedUserTags: UserTag[] = selectedTags
      .map(tagId => allTags.find(t => t.id === tagId))
      .filter((t): t is UserTag => t !== undefined);

    await updateProfile.mutateAsync({ ...formData, tags: selectedUserTags });
    onBack();
  };

  const isSubmitting = updateProfile.isPending || uploadAvatar.isPending;

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="chevron-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>编辑资料</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleAvatarPress} style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{displayName[0]?.toUpperCase() || 'U'}</Text>
              )}
            </View>
            <View style={styles.cameraButton}>
              <Icon name="camera" size={16} color={colors.surface} />
            </View>
          </TouchableOpacity>
          <Text style={styles.changeAvatarText}>点击更换头像</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Nickname */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>昵称</Text>
            <TextInput
              value={formData.nickname}
              onChangeText={(text) => handleInputChange('nickname', text)}
              placeholder="请输入昵称"
              maxLength={50}
              style={styles.input}
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.charCount}>
              {(formData.nickname?.length || 0)}/50
            </Text>
          </View>

          {/* Study Goal */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>学习目标</Text>
            <TextInput
              value={formData.studyGoal}
              onChangeText={(text) => handleInputChange('studyGoal', text)}
              placeholder="例如：考研上岸、通过雅思..."
              maxLength={200}
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textArea]}
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.charCount}>
              {(formData.studyGoal?.length || 0)}/200
            </Text>
          </View>

          {/* PIN - 只读 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>用户PIN</Text>
            <TextInput
              value={profile?.pin || ''}
              editable={false}
              style={[styles.input, styles.readOnlyInput]}
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.helperText}>PIN是您的唯一标识，不可更改</Text>
          </View>

          {/* Phone - 只读 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>手机号</Text>
            <TextInput
              value={profile?.phone || ''}
              editable={false}
              style={[styles.input, styles.readOnlyInput]}
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.helperText}>手机号不可修改</Text>
          </View>

          {/* Tags */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              个人标签 (最多{MAX_USER_TAGS}个)
            </Text>
            <View style={styles.tagsContainer}>
              {[...PRESET_USER_TAGS, ...customTags].map((tag) => (
                <TouchableOpacity
                  key={tag.id}
                  onPress={() => handleTagToggle(tag.id)}
                  disabled={isSubmitting || (!selectedTags.includes(tag.id) && selectedTags.length >= MAX_USER_TAGS)}
                  style={[
                    styles.tagButton,
                    selectedTags.includes(tag.id) && styles.tagButtonActive,
                    !selectedTags.includes(tag.id) && selectedTags.length >= MAX_USER_TAGS && styles.tagButtonDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.tagButtonText,
                      selectedTags.includes(tag.id) && styles.tagButtonTextActive,
                      !selectedTags.includes(tag.id) && selectedTags.length >= MAX_USER_TAGS && styles.tagButtonTextDisabled,
                    ]}
                  >
                    {tag.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => setShowCustomTagModal(true)}
                disabled={isSubmitting || selectedTags.length >= MAX_USER_TAGS}
                style={[
                  styles.tagButton,
                  selectedTags.length >= MAX_USER_TAGS && styles.tagButtonDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.tagButtonText,
                    selectedTags.length >= MAX_USER_TAGS && styles.tagButtonTextDisabled,
                  ]}
                >
                  ＋ 自定义
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.tagCount}>
              已选择 {selectedTags.length}/{MAX_USER_TAGS} 个标签
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.footer}>
          <Button
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={styles.submitButton}
          >
            {isSubmitting ? '保存中...' : '保存'}
          </Button>
        </View>
      </ScrollView>

      {/* Custom Tag Modal */}
      <Modal
        visible={showCustomTagModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowCustomTagModal(false);
          setCustomTagName('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加自定义标签</Text>
            <View style={styles.modalInputContainer}>
              <TextInput
                value={customTagName}
                onChangeText={setCustomTagName}
                placeholder="请输入标签名称"
                maxLength={20}
                style={styles.modalInput}
                placeholderTextColor={colors.textMuted}
                autoFocus
              />
              <Text style={styles.modalCharCount}>
                {(customTagName?.length || 0)}/20
              </Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setShowCustomTagModal(false);
                  setCustomTagName('');
                }}
                style={[styles.modalButton, styles.modalButtonCancel]}
              >
                <Text style={styles.modalButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddCustomTag}
                disabled={!customTagName.trim()}
                style={[styles.modalButton, styles.modalButtonConfirm, !customTagName.trim() && styles.modalButtonDisabled]}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextConfirm]}>添加</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  placeholder: {
    width: 44,
  },
  container: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarText: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  changeAvatarText: {
    marginTop: spacing.md,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  form: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'right',
  },
  footer: {
    padding: spacing.lg,
    marginTop: spacing.xl,
  },
  submitButton: {
    width: '100%',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tagButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagButtonDisabled: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    opacity: 0.5,
  },
  tagButtonText: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  tagButtonTextActive: {
    color: colors.surface,
    fontWeight: fontWeight.medium,
  },
  tagButtonTextDisabled: {
    color: colors.textMuted,
  },
  tagCount: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  modalInputContainer: {
    marginBottom: spacing.lg,
  },
  modalInput: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  modalCharCount: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'right',
  },
  helperText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  readOnlyInput: {
    backgroundColor: colors.background,
    color: colors.text,
    borderColor: colors.border,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.background,
  },
  modalButtonConfirm: {
    backgroundColor: colors.primary,
  },
  modalButtonDisabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.5,
  },
  modalButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  modalButtonTextConfirm: {
    color: colors.surface,
  },
});
