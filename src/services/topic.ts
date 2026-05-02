import { http } from '@/utils/request';
import { BaseResponse } from '@/types/api';

export interface Topic {
  id: number;
  name: string;
  description?: string;
  coverImage: string;
  postCount: number;
  followCount: number;
  viewCount: number;
  hotScore: number;
  isHot: boolean;
  status: number;
  sortOrder: number;
  seoKeywords?: string;
  creatorId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TopicListResponse {
  list: Topic[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TopicStatistics {
  totalTopics: number;
  activeTopics: number;
  hotTopics: number;
  totalPosts: number;
  totalFollows: number;
  topTopics: Topic[];
}

export interface CreateTopicDto {
  name: string;
  description?: string;
  coverImage: string;
  status?: number;
  isHot?: boolean;
  sortOrder?: number;
  seoKeywords?: string;
}

export interface UpdateTopicDto {
  name?: string;
  description?: string;
  coverImage?: string;
  status?: number;
  isHot?: boolean;
  sortOrder?: number;
  seoKeywords?: string;
}

export interface TopicListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: number;
  isHot?: boolean;
  sortBy?: 'hotScore' | 'createdAt' | 'followCount' | 'postCount' | 'sortOrder';
  sortOrder?: 'ASC' | 'DESC';
}

export interface BatchOperationDto {
  ids: number[];
  action: 'enable' | 'disable' | 'setHot' | 'unsetHot';
}

// 获取话题列表
export const getTopics = (params: TopicListParams) => {
  return http.get<BaseResponse<TopicListResponse>>('/admin/topics', { params });
};

// 获取话题详情
export const getTopicById = (id: number) => {
  return http.get<BaseResponse<Topic>>(`/admin/topics/${id}`);
};

// 创建话题
export const createTopic = (data: CreateTopicDto) => {
  return http.post<BaseResponse<Topic>>('/admin/topics', data);
};

// 更新话题
export const updateTopic = (id: number, data: UpdateTopicDto) => {
  return http.put<BaseResponse<Topic>>(`/admin/topics/${id}`, data);
};

// 删除话题
export const deleteTopic = (id: number) => {
  return http.delete<BaseResponse<{ success: boolean; message: string }>>(`/admin/topics/${id}`);
};

// 批量操作
export const batchOperation = (data: BatchOperationDto) => {
  return http.post<BaseResponse<{ success: boolean; message: string }>>('/admin/topics/batch', data);
};

// 获取话题统计
export const getTopicStatistics = () => {
  return http.get<BaseResponse<TopicStatistics>>('/admin/topics/statistics');
};
