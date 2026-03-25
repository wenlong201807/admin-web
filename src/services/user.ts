import { http } from '@/utils/request';
import { BaseResponse, PaginationParams, PaginationResponse, User } from '@/types/api';

interface UserListParams extends PaginationParams {
  keyword?: string;
  status?: number;
}

interface AdjustPointsParams {
  amount: number;
  reason: string;
}

interface UpdateStatusParams {
  status: number;
}

// 获取用户列表
export const getUserList = (params: UserListParams) => {
  return http.get<PaginationResponse<User>>('/admin/users', { params });
};

// 获取用户详情
export const getUserDetail = (userId: number) => {
  return http.get<User>(`/admin/users/${userId}`);
};

// 调整用户积分
export const adjustUserPoints = (userId: number, params: AdjustPointsParams) => {
  return http.post(`/admin/users/${userId}/points`, params);
};

// 更新用户状态
export const updateUserStatus = (userId: number, params: UpdateStatusParams) => {
  return http.put(`/admin/users/${userId}/status`, params);
};
