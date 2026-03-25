import { http } from '@/utils/request';
import { BaseResponse, StatisticsData } from '@/types/api';

interface StatisticsParams {
  startDate: string;
  endDate: string;
}

// 获取统计数据
export const getStatistics = (params: StatisticsParams) => {
  return http.get<StatisticsData>('/admin/statistics', { params });
};
