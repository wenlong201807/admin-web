import { http } from '@/utils/request';

export interface NearbyStats {
  totalViews: number;
  uniqueUsers: number;
  avgViewsPerUser: number;
  todayViews: number;
  viewTrend: Array<{
    date: string;
    views: number;
    users: number;
  }>;
}

export interface PopularArea {
  city: string;
  district?: string;
  latitude: number;
  longitude: number;
  userCount: number;
  viewCount: number;
}

export interface UserActivity {
  userId: number;
  username: string;
  avatar: string;
  city: string;
  viewCount: number;
  helloCount: number;
  lastActiveTime: string;
}

export interface NearbyStatsParams {
  startDate?: string;
  endDate?: string;
}

// 获取访问统计
export const getNearbyStats = (params?: NearbyStatsParams) => {
  return http.get<NearbyStats>('/admin/nearby/stats', { params });
};

// 获取热门区域分析
export const getPopularAreas = (limit: number = 10) => {
  return http.get<{
    list: PopularArea[];
  }>('/admin/nearby/popular-areas', { params: { limit } });
};

// 获取用户活跃度排行
export const getUserActivity = (params: { limit?: number; days?: number }) => {
  return http.get<{
    list: UserActivity[];
  }>('/admin/nearby/user-activity', { params });
};
