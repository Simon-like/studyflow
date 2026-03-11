import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const COLORS = {
  coral: '#E8A87C',
  coralLight: '#F5C9A8',
  sage: '#9DB5A0',
  sageDark: '#7A9A7E',
  cream: '#FDF8F3',
  warm: '#FAF5F0',
  charcoal: '#3D3D3D',
  stone: '#8A8A8A',
  mist: '#C9C5C1',
  white: '#FFFFFF',
};

interface Post {
  id: string;
  author: string;
  avatar: string;
  avatarColor: string;
  time: string;
  group: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  liked: boolean;
}

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    author: 'Lucy学习日记',
    avatar: 'L',
    avatarColor: COLORS.sage,
    time: '2小时前',
    group: '考研小组',
    content: '今天完成了8个番茄钟，终于把线代复习完了！StudyFlow真的很有帮助 🎉',
    tags: ['打卡成功', '考研'],
    likes: 128,
    comments: 24,
    liked: false,
  },
  {
    id: '2',
    author: 'Mark的编程之路',
    avatar: 'M',
    avatarColor: '#81C784',
    time: '5小时前',
    group: '编程小组',
    content: '连续30天打卡达成！感谢小知每天的陪伴，从拖延症到每天学习4小时，进步真的很明显 💪',
    tags: ['30天成就', '编程'],
    likes: 256,
    comments: 42,
    liked: true,
  },
  {
    id: '3',
    author: '小陈的考研路',
    avatar: 'C',
    avatarColor: COLORS.coral,
    time: '8小时前',
    group: '考研小组',
    content: '分享一个技巧：番茄钟 + 思维导图学习高数，效果超好！每个番茄结束整理一张图，知识点更清晰了。',
    tags: ['学习方法', '高数'],
    likes: 89,
    comments: 15,
    liked: false,
  },
];

export function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeGroup, setActiveGroup] = useState('全部');

  const GROUPS = ['全部', '考研', '编程', '英语', '运动'];

  const toggleLike = (id: string) => {
    setPosts((p) => p.map((post) =>
      post.id === id
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>学习社区</Text>
        <TouchableOpacity style={styles.postBtn} activeOpacity={0.8}>
          <Text style={styles.postBtnText}>+ 发布</Text>
        </TouchableOpacity>
      </View>

      {/* Group Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.groups}
        contentContainerStyle={styles.groupsContent}
      >
        {GROUPS.map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.groupChip, activeGroup === g && styles.groupChipActive]}
            onPress={() => setActiveGroup(g)}
            activeOpacity={0.7}
          >
            <Text style={[styles.groupChipText, activeGroup === g && styles.groupChipTextActive]}>
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Study Group Banner */}
      <View style={styles.groupBanner}>
        <View style={styles.groupBannerIcon}>
          <Text style={styles.groupBannerEmoji}>🎯</Text>
        </View>
        <View style={styles.groupBannerInfo}>
          <Text style={styles.groupBannerName}>考研冲刺营</Text>
          <Text style={styles.groupBannerSub}>328人正在学习 · 今日目标6h</Text>
        </View>
        <TouchableOpacity style={styles.joinBtn} activeOpacity={0.8}>
          <Text style={styles.joinBtnText}>加入</Text>
        </TouchableOpacity>
      </View>

      {/* Posts */}
      <ScrollView style={styles.posts} showsVerticalScrollIndicator={false}>
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {/* Author */}
            <View style={styles.postAuthor}>
              <View style={[styles.postAvatar, { backgroundColor: post.avatarColor }]}>
                <Text style={styles.postAvatarText}>{post.avatar}</Text>
              </View>
              <View style={styles.postAuthorInfo}>
                <Text style={styles.postAuthorName}>{post.author}</Text>
                <Text style={styles.postMeta}>{post.time} · {post.group}</Text>
              </View>
            </View>

            {/* Content */}
            <Text style={styles.postContent}>{post.content}</Text>

            {/* Tags */}
            <View style={styles.postTags}>
              {post.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.postActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => toggleLike(post.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.actionIcon, post.liked && styles.actionIconLiked]}>
                  {post.liked ? '❤️' : '🤍'}
                </Text>
                <Text style={[styles.actionCount, post.liked && styles.actionCountLiked]}>
                  {post.likes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionCount}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <Text style={styles.actionIcon}>↗️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.charcoal,
  },
  postBtn: {
    backgroundColor: COLORS.coral,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  postBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  groups: {
    maxHeight: 44,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  groupsContent: {
    gap: 8,
    paddingVertical: 4,
  },
  groupChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.mist,
  },
  groupChipActive: {
    backgroundColor: COLORS.coral,
    borderColor: COLORS.coral,
  },
  groupChipText: {
    fontSize: 13,
    color: COLORS.stone,
    fontWeight: '500',
  },
  groupChipTextActive: {
    color: COLORS.white,
  },
  groupBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: `${COLORS.coral}12`,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  groupBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupBannerEmoji: {
    fontSize: 22,
  },
  groupBannerInfo: {
    flex: 1,
  },
  groupBannerName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.charcoal,
  },
  groupBannerSub: {
    fontSize: 12,
    color: COLORS.stone,
    marginTop: 2,
  },
  joinBtn: {
    backgroundColor: COLORS.coral,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
  },
  joinBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  posts: {
    flex: 1,
    paddingHorizontal: 16,
  },
  postCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postAvatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  postAuthorInfo: {
    flex: 1,
  },
  postAuthorName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.charcoal,
  },
  postMeta: {
    fontSize: 11,
    color: COLORS.stone,
    marginTop: 1,
  },
  postContent: {
    fontSize: 14,
    color: COLORS.charcoal,
    lineHeight: 20,
    marginBottom: 12,
  },
  postTags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: `${COLORS.coral}18`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 11,
    color: COLORS.coral,
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: `${COLORS.mist}30`,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: {
    fontSize: 16,
  },
  actionIconLiked: {},
  actionCount: {
    fontSize: 13,
    color: COLORS.stone,
  },
  actionCountLiked: {
    color: COLORS.coral,
  },
});
