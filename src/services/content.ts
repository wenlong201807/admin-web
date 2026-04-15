import { http } from '@/utils/request';
import { PaginationParams, PaginationResponse, Post } from '@/types/api';

interface PostListParams extends PaginationParams {
  status?: number;
  keyword?: string;
}

interface DeletePostParams {
  reason?: string;
  deductPoints?: number;
}

// 获取内容列表
export const getPostList = (params: PostListParams) => {
  return http.get<PaginationResponse<Post>>('/api/v1/admin/posts', { params });
};

// 删除内容
export const deletePost = (id: number, params?: DeletePostParams) => {
  return http.delete(`/api/v1/admin/posts/${id}`, { data: params });
};
