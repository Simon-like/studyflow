import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { communityService } from "../services/communityService";
import type {
  Post,
  CreatePostRequest,
  CreateCommentRequest,
  CreateGroupRequest,
  LikeResponse,
  PostsResponse,
  GroupsResponse,
} from "@studyflow/shared";

// ==================== Query Keys ====================

export const COMMUNITY_KEYS = {
  all: ["community"] as const,
  posts: (page?: number) => [...COMMUNITY_KEYS.all, "posts", page] as const,
  postsInfinite: () => [...COMMUNITY_KEYS.all, "posts", "infinite"] as const,
  postDetail: (id: string) =>
    [...COMMUNITY_KEYS.all, "post", id] as const,
  comments: (postId: string) =>
    [...COMMUNITY_KEYS.all, "comments", postId] as const,
  groups: (page?: number, category?: string) =>
    [...COMMUNITY_KEYS.all, "groups", page, category] as const,
};

// ==================== 帖子 Hooks ====================

export function usePosts(page = 0, size = 20) {
  return useQuery({
    queryKey: COMMUNITY_KEYS.posts(page),
    queryFn: () =>
      communityService.getPosts({ page, size }).then((res) => res.data),
    staleTime: 1000 * 30,
  });
}

export function usePostsInfinite(size = 20) {
  return useInfiniteQuery({
    queryKey: COMMUNITY_KEYS.postsInfinite(),
    queryFn: ({ pageParam = 0 }) =>
      communityService
        .getPosts({ page: pageParam, size })
        .then((res) => res.data),
    getNextPageParam: (lastPage: PostsResponse) => {
      if (lastPage.page >= lastPage.totalPages - 1) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 0,
    staleTime: 1000 * 30,
  });
}

export function usePostDetail(postId: string) {
  return useQuery({
    queryKey: COMMUNITY_KEYS.postDetail(postId),
    queryFn: () =>
      communityService.getPost(postId).then((res) => res.data),
    enabled: !!postId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostRequest) =>
      communityService.createPost(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_KEYS.all });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) =>
      communityService.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_KEYS.all });
    },
  });
}

// ==================== 点赞 Hooks ====================

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) =>
      communityService.toggleLike(postId).then((res) => res.data),
    onSuccess: (data: LikeResponse, postId: string) => {
      queryClient.setQueryData(
        COMMUNITY_KEYS.postDetail(postId),
        (old: Post | undefined) => {
          if (!old) return old;
          return {
            ...old,
            isLiked: data.liked,
            likeCount: data.likeCount,
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: COMMUNITY_KEYS.postsInfinite(),
      });
    },
  });
}

// ==================== 评论 Hooks ====================

export function useComments(postId: string) {
  return useQuery({
    queryKey: COMMUNITY_KEYS.comments(postId),
    queryFn: () =>
      communityService.getComments(postId).then((res) => res.data),
    enabled: !!postId,
  });
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCommentRequest) =>
      communityService
        .createComment(postId, data)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COMMUNITY_KEYS.comments(postId),
      });
      queryClient.invalidateQueries({
        queryKey: COMMUNITY_KEYS.postDetail(postId),
      });
      queryClient.invalidateQueries({
        queryKey: COMMUNITY_KEYS.postsInfinite(),
      });
    },
  });
}

// ==================== 学习小组 Hooks ====================

export function useGroups(page = 0, size = 20, category?: string) {
  return useQuery({
    queryKey: COMMUNITY_KEYS.groups(page, category),
    queryFn: () =>
      communityService
        .getGroups({ page, size, category })
        .then((res) => res.data),
    staleTime: 1000 * 60,
  });
}

export function useJoinGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) =>
      communityService.joinGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...COMMUNITY_KEYS.all, "groups"],
      });
    },
  });
}

export function useLeaveGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) =>
      communityService.leaveGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...COMMUNITY_KEYS.all, "groups"],
      });
    },
  });
}
