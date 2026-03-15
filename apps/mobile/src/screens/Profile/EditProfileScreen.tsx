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
} from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { useProfileData, useUpdateProfile, useUploadAvatar } from './hooks';
import { colors, spacing, radius, fontSize, fontWeight, shadows } from '../../theme';
import type { UpdateProfileRequest } from '@studyflow/shared';
import { PRESET_USER_TAGS, MAX_USER_TAGS } from '@studyflow/shared';

interface EditProfileScreenProps {
  onBack: () => void;
}

export function EditProfileScreen({ onBack }: EditProfileScreenProps) {
  const { profile, displayName, avatarUrl } = useProfileData();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    nickname: '',
    studyGoal: '',
    email: '',
    phone: '',
    tags: [],
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 初始化表单数据
  useEffect(() => {
    if (profile) {
      setFormData({
        nickname: profile.nickname || '',
        studyGoal: profile.studyGoal || '',
        email: profile.email || '',
        phone: profile.phone || '',
        tags: profile.tags?.map(t => t.id) || [],
      });
      setSelectedTags(profile.tags?.map(t => t.id) || []);
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

  const handleAvatarPress = () => {
    // 在React Native中使用ImagePicker
    Alert.alert('更换头像', '选择图片来源', [
      { text: '拍照', onPress: () => console.log('Camera') },
      { text: '从相册选择', onPress: () => console.log('Gallery') },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const handleSubmit = async () => {
    await updateProfile.mutateAsync({ ...formData, tags: selectedTags });
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

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>邮箱</Text>
            <TextInput
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder="example@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>手机号</Text>
            <TextInput
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              placeholder="138xxxxxxxxx"
              keyboardType="phone-pad"
              style={styles.input}
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Tags */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              个人标签 (最多{MAX_USER_TAGS}个)
            </Text>
            <View style={styles.tagsContainer}>
              {PRESET_USER_TAGS.map((tag) => (
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
});
