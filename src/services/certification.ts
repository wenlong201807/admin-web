import { http } from '@/utils/request';
import {
  PaginationParams,
  PaginationResponse,
  Certification,
  BaseResponse,
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
  return http.get<BaseResponse<PaginationResponse<Certification>>>('/admin/certifications', {
    params,
  });
};

// 审核认证
export const reviewCertification = (id: number, params: ReviewParams) => {
  return http.put<BaseResponse<{ message: string }>>(`/admin/certifications/${id}/review`, params);
};
