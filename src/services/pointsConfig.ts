import { http } from '@/utils/request';

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
    return http.get<{ list: PointsConfig[] }>('/admin/points-configs');
  },

  getByKey: (key: string) => {
    return http.get<PointsConfig>(`/admin/points-configs/${key}`);
  },

  update: (key: string, data: UpdatePointsConfigDto) => {
    return http.put(`/admin/points-configs/${key}`, data);
  },

  batchUpdate: (data: BatchUpdateDto) => {
    return http.post('/admin/points-configs/batch', data);
  },

  init: () => {
    return http.post('/admin/points-configs/init');
  },
};
