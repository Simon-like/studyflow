import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  usePosts,
  useGroups,
  useToggleLike,
  useJoinGroup,
  useLeaveGroup,
} from "@studyflow/api";
import type { CommunityTab } from "./types";

export function useCommunity() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CommunityTab>("feed");

  // Posts
  const {
    data: postsData,
    isLoading: postsLoading,
  } = usePosts(0, 20);

  // Groups
  const {
    data: groupsData,
    isLoading: groupsLoading,
  } = useGroups(0, 20);

  // Mutations
  const toggleLikeMutation = useToggleLike();
  const joinGroupMutation = useJoinGroup();
  const leaveGroupMutation = useLeaveGroup();

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key as CommunityTab);
  }, []);

  const toggleLike = useCallback(
    (id: string) => {
      toggleLikeMutation.mutate(id);
    },
    [toggleLikeMutation],
  );

  const joinGroup = useCallback(
    (id: string) => {
      joinGroupMutation.mutate(id);
    },
    [joinGroupMutation],
  );

  const leaveGroup = useCallback(
    (id: string) => {
      leaveGroupMutation.mutate(id);
    },
    [leaveGroupMutation],
  );

  const goToPost = useCallback(
    (id: string) => {
      navigate(`/community/post/${id}`);
    },
    [navigate],
  );

  return {
    posts: postsData?.list ?? [],
    groups: groupsData?.list ?? [],
    activeTab,
    setActiveTab: handleTabChange,
    toggleLike,
    joinGroup,
    leaveGroup,
    goToPost,
    postsLoading,
    groupsLoading,
  };
}
