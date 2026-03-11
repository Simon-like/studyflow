/**
 * Community 页面
 * 学习社区
 */

import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { PostCard } from '../../components/business/PostCard';
import { CommunityHeader, GroupFilter, GroupBanner } from './components';
import { useCommunityScreen } from './hooks';
import { GROUPS } from './constants';
import { spacing } from '../../theme';

export default function CommunityScreen() {
  const {
    posts,
    activeGroup,
    setActiveGroup,
    toggleLike,
    handleCreatePost,
    handleJoinGroup,
  } = useCommunityScreen();
  
  return (
    <ScreenContainer scrollable={false} padding={false}>
      {/* 头部 */}
      <CommunityHeader onCreatePost={handleCreatePost} />
      
      {/* 小组筛选 */}
      <GroupFilter
        groups={GROUPS}
        activeGroup={activeGroup}
        onSelectGroup={setActiveGroup}
      />
      
      {/* 推荐小组 */}
      <GroupBanner onJoin={handleJoinGroup} />
      
      {/* 帖子列表 */}
      <ScrollView
        style={styles.posts}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.postsContent}
      >
        {posts.map(post => (
          <PostCard
            key={post.id}
            {...post}
            onLike={() => toggleLike(post.id)}
          />
        ))}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </ScreenContainer>
  );
}

import { View } from 'react-native';

const styles = StyleSheet.create({
  posts: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  postsContent: {
    paddingTop: spacing.xs,
  },
});
