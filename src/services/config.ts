import { http } from '@/utils/request';
import { SystemConfig } from '@/types/api';

interface ConfigListParams {
  group?: string;
}

interface CreateConfigParams {
  configKey: string;
  configValue: string;
  valueType?: string;
  group?: string;
  description?: string;
  isPublic?: boolean;
  isEnabled?: boolean;
}

interface UpdateConfigParams {
  configValue?: string;
  valueType?: string;
  group?: string;
  description?: string;
  isPublic?: boolean;
  isEnabled?: boolean;
}

// 获取配置列表（按分组）
export const getConfigList = (params?: ConfigListParams) => {
  return http.get<{ list: SystemConfig[] }>('/admin/config', { params });
};

// 获取配置分组列表
export const getConfigGroups = () => {
  return http.get<{ groups: string[] }>('/admin/config/groups');
};

// 获取单个配置
export const getConfigByKey = (key: string) => {
  return http.get<SystemConfig>(`/admin/config/${key}`);
};

// 创建配置
export const createConfig = (params: CreateConfigParams) => {
  return http.post<SystemConfig>('/admin/config', params);
};

// 更新配置
export const updateConfig = (key: string, params: UpdateConfigParams) => {
  return http.put<SystemConfig>(`/admin/config/${key}`, params);
};

// 删除配置
export const deleteConfig = (key: string) => {
  return http.delete(`/admin/config/${key}`);
};

// 初始化默认配置
export const initConfig = () => {
  return http.post('/admin/config/init');
};

// 获取系统配置（旧接口，保持兼容）
export const getConfig = () => {
  return http.get<SystemConfig>('/admin/config');
};
