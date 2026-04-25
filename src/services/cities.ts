import { http } from '@/utils/request';
import { PaginationResponse } from '@/types/api';

export interface City {
  id: number;
  name: string;
  province: string;
  latitude: number;
  longitude: number;
  userCount?: number;
  isHot?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CityStats {
  totalCities: number;
  hotCities: number;
  totalUsers: number;
  topCities: Array<{
    city: string;
    userCount: number;
  }>;
}

export interface CreateCityDto {
  name: string;
  province: string;
  latitude: number;
  longitude: number;
  isHot?: boolean;
}

export interface UpdateCityDto {
  name?: string;
  province?: string;
  latitude?: number;
  longitude?: number;
  isHot?: boolean;
}

export interface CityListParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

// 获取城市列表
export const getCityList = (params: CityListParams) => {
  return http.get<PaginationResponse<City>>('/admin/cities', { params });
};

// 添加新城市
export const createCity = (data: CreateCityDto) => {
  return http.post<City>('/admin/cities', data);
};

// 更新城市信息
export const updateCity = (id: number, data: UpdateCityDto) => {
  return http.put<City>(`/admin/cities/${id}`, data);
};

// 删除城市
export const deleteCity = (id: number) => {
  return http.delete(`/admin/cities/${id}`);
};

// 获取城市统计
export const getCityStats = () => {
  return http.get<CityStats>('/admin/cities/stats');
};
