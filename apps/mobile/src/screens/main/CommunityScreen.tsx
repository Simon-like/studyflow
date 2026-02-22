/**
 * 学习社区页面
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Post {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  timestamp: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    user: { name: '小明' },
    content: '今天完成了 5 个番茄钟，感觉效率很高！坚持就是胜利 💪',
    likes: 24,
    comments: 5,
    timestamp: '2小时前',
  },
  {
    id: '2',
    user: { name: '小红' },
    content: '分享一下我的学习方法：番茄工作法 + 费曼技巧，效果超棒！',
    likes: 56,
    comments: 12,
    timestamp: '4小时前',
  },
  {
    id: '3',
    user: { name: '学习达人' },
    content: '连续打卡第 30 天！感谢 StudyFlow 帮我养成好习惯 🎉',
    likes: 108,
    comments: 23,
    timestamp: '昨天',
  },
];

export const CommunityScreen: React.FC = () => {
  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      {/* 用户信息 */}
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={20} color="#FF6B6B" />
        </View>
        <View style={styles.userMeta}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* 内容 */}
      <Text style={styles.postContent}>{item.content}</Text>

      {/* 操作按钮 */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="heart-outline" size={20} color="#666" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="chatbubble-outline" size={20} color="#666" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="share-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.title}>学习社区</Text>
        <TouchableOpacity style={styles.postButton}>
          <Ionicons name="create-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      {/* 社区标签 */}
      <View style={styles.tagsContainer}>
        <TouchableOpacity style={[styles.tag, styles.tagActive]}>
          <Text style={styles.tagTextActive}>推荐</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tag}>
          <Text style={styles.tagText}>热门</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tag}>
          <Text style={styles.tagText}>关注</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tag}>
          <Text style={styles.tagText}>学习打卡</Text>
        </TouchableOpacity>
      </View>

      {/* 动态列表 */}
      <FlatList
        data={mockPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  postButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
  },
  tagActive: {
    backgroundColor: '#FF6B6B',
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
  tagTextActive: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMeta: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  postContent: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
});
