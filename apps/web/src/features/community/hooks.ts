import { useState, useCallback } from 'react';
import type { Post, StudyGroup } from '@/types';
import type { CommunityTab } from './types';
import { INITIAL_POSTS, GROUPS } from './constants';

export function useCommunity() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeTab, setActiveTab] = useState<CommunityTab>('feed');
  const groups = GROUPS;

  const toggleLike = useCallback((id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  }, []);

  const joinGroup = useCallback((id: string) => {
    // TODO: Implement join group
    console.log('Join group:', id);
  }, []);

  return {
    posts,
    groups,
    activeTab,
    setActiveTab,
    toggleLike,
    joinGroup,
  };
}
