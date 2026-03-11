/**
 * Community 页面自定义 Hooks
 */

import { useState, useCallback } from 'react';
import { Post } from './types';
import { INITIAL_POSTS } from './constants';

export function useCommunityScreen() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeGroup, setActiveGroup] = useState('全部');
  
  const toggleLike = useCallback((postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  }, []);
  
  const handleCreatePost = useCallback(() => {
    console.log('Create new post');
  }, []);
  
  const handleJoinGroup = useCallback(() => {
    console.log('Join group');
  }, []);
  
  const filteredPosts = activeGroup === '全部'
    ? posts
    : posts.filter(post => post.group.includes(activeGroup));
  
  return {
    posts: filteredPosts,
    activeGroup,
    setActiveGroup,
    toggleLike,
    handleCreatePost,
    handleJoinGroup,
  };
}
