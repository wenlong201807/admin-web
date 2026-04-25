import { http } from '@/utils/request';

export interface LocationStats {
  totalUsers: number;
  activeUsers: number;
  citiesCount: number;
  avgDistance: number;
  todayUpdates: number;
}

export interface UserLocation {
  userId: number;
  username: string;
  avatar: string;
  city: string;
  latitude: number;
  longitude: number;
  updateTime: string;
  distance?: number;
}

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  count: number;
}

export interface LocationStatsParams {
  startDate?: string;
  endDate?: string;
}

export interface LocationUsersParams {
  page: number;
  pageSize: number;
  city?: string;
}

// 获取位置数据统计
export const getLocationStats = (params?: LocationStatsParams) => {
  return http.get<LocationStats>('/admin/locations/stats', { params });
};

// 获取用户位置列表
export const getLocationUsers = (params: LocationUsersParams) => {
  return http.get<{
    list: UserLocation[];
    total: number;
  }>('/admin/locations/users', { params });
};

// 获取热力图数据
export const getLocationHeatmap = (city?: string) => {
  return http.get<{
    points: HeatmapPoint[];
  }>('/admin/locations/heatmap', { params: { city } });
};
