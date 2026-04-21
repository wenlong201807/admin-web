import { http } from '@/utils/request';

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
    return http.get<{ list: CertificationType[] }>('/admin/certification-types');
  },

  getById: (id: number) => {
    return http.get<CertificationType>(`/admin/certification-types/${id}`);
  },

  create: (data: CreateCertificationTypeDto) => {
    return http.post<CertificationType>('/admin/certification-types', data);
  },

  update: (id: number, data: UpdateCertificationTypeDto) => {
    return http.put(`/admin/certification-types/${id}`, data);
  },

  delete: (id: number) => {
    return http.delete(`/admin/certification-types/${id}`);
  },

  init: () => {
    return http.post('/admin/certification-types/init');
  }
};
