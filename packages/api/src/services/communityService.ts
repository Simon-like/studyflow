import { http } from "../client/httpClient";
import { API_ENDPOINTS } from "@studyflow/shared";
import type {
  ApiResponse,
  Post,
  Comment,
  StudyGroup,
  CreatePostRequest,
  CreateCommentRequest,
  CreateGroupRequest,
  LikeResponse,
  PostsParams,
  GroupsParams,
  PostsResponse,
  CommentsResponse,
  GroupsResponse,
} from "@studyflow/shared";

export const communityService = {
  // ========== 帖子 ==========

  createPost: (data: CreatePostRequest) =>
    http.post<ApiResponse<Post>>(API_ENDPOINTS.COMMUNITY.POSTS, data),

  getPosts: (params?: PostsParams) =>
    http.get<ApiResponse<PostsResponse>>(API_ENDPOINTS.COMMUNITY.POSTS, {
      params,
    }),

  getPost: (id: string) =>
    http.get<ApiResponse<Post>>(API_ENDPOINTS.COMMUNITY.POST(id)),

  updatePost: (id: string, data: Partial<CreatePostRequest>) =>
    http.put<ApiResponse<Post>>(API_ENDPOINTS.COMMUNITY.POST(id), data),

  deletePost: (id: string) =>
    http.delete<ApiResponse<void>>(API_ENDPOINTS.COMMUNITY.POST(id)),

  toggleLike: (postId: string) =>
    http.post<ApiResponse<LikeResponse>>(API_ENDPOINTS.COMMUNITY.LIKE(postId)),

  // ========== 评论 ==========

  createComment: (postId: string, data: CreateCommentRequest) =>
    http.post<ApiResponse<Comment>>(
      API_ENDPOINTS.COMMUNITY.COMMENTS(postId),
      data,
    ),

  getComments: (postId: string) =>
    http.get<ApiResponse<CommentsResponse>>(
      API_ENDPOINTS.COMMUNITY.COMMENTS(postId),
    ),

  // ========== 学习小组 ==========

  createGroup: (data: CreateGroupRequest) =>
    http.post<ApiResponse<StudyGroup>>(API_ENDPOINTS.COMMUNITY.GROUPS, data),

  getGroups: (params?: GroupsParams) =>
    http.get<ApiResponse<GroupsResponse>>(API_ENDPOINTS.COMMUNITY.GROUPS, {
      params,
    }),

  joinGroup: (groupId: string) =>
    http.post<ApiResponse<void>>(API_ENDPOINTS.COMMUNITY.JOIN_GROUP(groupId)),

  leaveGroup: (groupId: string) =>
    http.post<ApiResponse<void>>(API_ENDPOINTS.COMMUNITY.LEAVE_GROUP(groupId)),
};
