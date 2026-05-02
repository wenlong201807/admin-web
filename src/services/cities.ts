import { http } from '@/utils/request';
import { PaginationResponse, BaseResponse } from '@/types/api';

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
  return http.get<BaseResponse<PaginationResponse<City>>>('/admin/cities', { params });
};

// 添加新城市
export const createCity = (data: CreateCityDto) => {
  return http.post<BaseResponse<City>>('/admin/cities', data);
};

// 更新城市信息
export const updateCity = (id: number, data: UpdateCityDto) => {
  return http.put<BaseResponse<City>>(`/admin/cities/${id}`, data);
};

// 删除城市
export const deleteCity = (id: number) => {
  return http.delete<BaseResponse<{ message: string }>>(`/admin/cities/${id}`);
};

// 获取城市统计
export const getCityStats = () => {
  return http.get<BaseResponse<CityStats>>('/admin/cities/stats');
};
