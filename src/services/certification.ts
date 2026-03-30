import { http } from '@/utils/request';
import {
  PaginationParams,
  PaginationResponse,
  Certification,
} from '@/types/api';

interface CertificationListParams extends PaginationParams {
  status?: number;
}

interface ReviewParams {
  status: number;
  rejectReason?: string;
}

// 获取认证审核列表
export const getCertificationList = (params: CertificationListParams) => {
  return http.get<PaginationResponse<Certification>>('/admin/certifications', {
    params,
  });
};

// 审核认证
export const reviewCertification = (id: number, params: ReviewParams) => {
  return http.put(`/admin/certifications/${id}/review`, params);
};
