import { http } from '@/utils/request';
import { PaginationParams, PaginationResponse, User, BaseResponse } from '@/types/api';

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
  return http.get<BaseResponse<PaginationResponse<User>>>('/admin/users', { params });
};

// 获取用户详情
export const getUserDetail = (userId: number) => {
  return http.get<BaseResponse<User>>(`/admin/users/${userId}`);
};

// 调整用户积分
export const adjustUserPoints = (
  userId: number,
  params: AdjustPointsParams,
) => {
  return http.post<BaseResponse<{ message: string }>>(`/admin/users/${userId}/points`, params);
};

// 更新用户状态
export const updateUserStatus = (
  userId: number,
  params: UpdateStatusParams,
) => {
  return http.put<BaseResponse<{ message: string }>>(`/admin/users/${userId}/status`, params);
};
