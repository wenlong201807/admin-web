import { http } from '@/utils/request';

export interface PointsLog {
  id: number;
  userId: number;
  type: string;
  amount: number;
  balance: number;
  description: string;
  relatedId?: number;
  relatedType?: string;
  createdAt: string;
  user?: {
    id: number;
    nickname: string;
    mobile: string;
  };
}

export interface PointsQueryParams {
  page?: number;
  pageSize?: number;
  userId?: number;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export interface PointsStatistics {
  totalPoints: number;
  totalUsers: number;
  todayPoints: number;
  todayUsers: number;
  typeDistribution: {
    type: string;
    count: number;
    totalAmount: number;
  }[];
}

export const pointsApi = {
  // 获取积分记录列表
  getList: (params: PointsQueryParams) => {
    return http.get<{ list: PointsLog[]; total: number }>('/admin/points/logs', params);
  },

  // 获取用户积分记录
  getUserPoints: (userId: number, params?: { page?: number; pageSize?: number }) => {
    return http.get<{ list: PointsLog[]; total: number }>(`/admin/points/user/${userId}`, params);
  },

  // 获取积分统计
  getStatistics: (params?: { startDate?: string; endDate?: string }) => {
    return http.get<PointsStatistics>('/admin/points/statistics', params);
  },

  // 手动调整用户积分
  adjustPoints: (data: { userId: number; amount: number; description: string }) => {
    return http.post('/admin/points/adjust', data);
  },
};
