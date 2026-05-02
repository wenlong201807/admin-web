import { http } from '@/utils/request';
import {
  PaginationResponse,
  NPSFeedback,
  NPSQueryParams,
  NPSDashboard,
  NPSStatistics,
  BaseResponse,
} from '@/types/api';

export interface UpdateNPSStatusParams {
  status?: number;
  priority?: number;
  assignedTo?: number;
  handleResult?: string;
}

export interface FollowUpParams {
  followUpResult: string;
}

export const getFeedbackList = (params: NPSQueryParams) => {
  return http.get<BaseResponse<PaginationResponse<NPSFeedback>>>('/nps/feedback/list', {
    params,
  });
};

export const getFeedbackDetail = (id: number) => {
  return http.get<BaseResponse<NPSFeedback>>(`/nps/feedback/${id}`);
};

export const updateFeedbackStatus = (
  id: number,
  params: UpdateNPSStatusParams,
) => {
  return http.put<BaseResponse<{ message: string }>>(`/nps/feedback/${id}/status`, params);
};

export const followUp = (id: number, params: FollowUpParams) => {
  return http.post<BaseResponse<{ message: string }>>(`/nps/feedback/${id}/follow-up`, params);
};

export const getDashboard = () => {
  return http.get<BaseResponse<NPSDashboard>>('/nps/dashboard');
};

export const getStatistics = (periodType: string = 'day', days: number = 30) => {
  return http.get<BaseResponse<NPSStatistics[]>>('/nps/statistics', {
    params: { periodType, days },
  });
};
