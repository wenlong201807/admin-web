import { http } from '@/utils/request';
import { BaseResponse } from '@/types/api';

export interface PointsConfig {
  id: number;
  key: string;
  value: number;
  description: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePointsConfigDto {
  value?: number;
  description?: string;
  isEnabled?: boolean;
}

export interface BatchUpdateDto {
  configs: { key: string; value: number; description?: string }[];
}

export const pointsConfigApi = {
  getList: () => {
    return http.get<BaseResponse<{ list: PointsConfig[] }>>('/admin/points-configs');
  },

  getByKey: (key: string) => {
    return http.get<BaseResponse<PointsConfig>>(`/admin/points-configs/${key}`);
  },

  update: (key: string, data: UpdatePointsConfigDto) => {
    return http.put<BaseResponse<{ message: string }>>(`/admin/points-configs/${key}`, data);
  },

  batchUpdate: (data: BatchUpdateDto) => {
    return http.post<BaseResponse<{ message: string }>>('/admin/points-configs/batch', data);
  },

  init: () => {
    return http.post<BaseResponse<{ message: string }>>('/admin/points-configs/init');
  },
};
