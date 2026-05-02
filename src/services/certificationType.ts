import { http } from '@/utils/request';
import { BaseResponse } from '@/types/api';

export interface CertificationType {
  id: number;
  code: string;
  name: string;
  icon: string;
  description: string;
  requiredFields: string[];
  isEnabled: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCertificationTypeDto {
  code: string;
  name: string;
  icon?: string;
  description?: string;
  requiredFields?: string[];
  sortOrder?: number;
}

export interface UpdateCertificationTypeDto {
  name?: string;
  icon?: string;
  description?: string;
  requiredFields?: string[];
  isEnabled?: boolean;
  sortOrder?: number;
}

export const certificationTypeApi = {
  getList: () => {
    return http.get<BaseResponse<{ list: CertificationType[] }>>('/admin/certification-types');
  },

  getById: (id: number) => {
    return http.get<BaseResponse<CertificationType>>(`/admin/certification-types/${id}`);
  },

  create: (data: CreateCertificationTypeDto) => {
    return http.post<BaseResponse<CertificationType>>('/admin/certification-types', data);
  },

  update: (id: number, data: UpdateCertificationTypeDto) => {
    return http.put<BaseResponse<{ message: string }>>(`/admin/certification-types/${id}`, data);
  },

  delete: (id: number) => {
    return http.delete<BaseResponse<{ message: string }>>(`/admin/certification-types/${id}`);
  },

  init: () => {
    return http.post<BaseResponse<{ message: string }>>('/admin/certification-types/init');
  }
};
