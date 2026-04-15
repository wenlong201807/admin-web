import { http } from '@/utils/request';
import { PaginationParams, PaginationResponse, Report } from '@/types/api';

interface ReportListParams extends PaginationParams {
  status?: number;
}

interface HandleReportParams {
  action: string;
  deductPoints?: number;
}

// 获取举报列表
export const getReportList = (params: ReportListParams) => {
  return http.get<PaginationResponse<Report>>('/api/v1/admin/reports', { params });
};

// 处理举报
export const handleReport = (id: number, params: HandleReportParams) => {
  return http.put(`/api/v1/admin/reports/${id}/handle`, params);
};
