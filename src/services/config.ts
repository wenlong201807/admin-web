import { http } from '@/utils/request';
import { BaseResponse, SystemConfig } from '@/types/api';

// 获取系统配置
export const getConfig = () => {
  return http.get<SystemConfig>('/admin/config');
};

// 更新系统配置
export const updateConfig = (params: Partial<SystemConfig>) => {
  return http.put('/admin/config', params);
};
