import { http } from '@/utils/request';
import {
  PaginationResponse,
  NPSFeedback,
  NPSQueryParams,
  NPSDashboard,
  NPSStatistics,
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
  return http.get<PaginationResponse<NPSFeedback>>('/nps/feedback/list', {
    params,
  });
};

export const getFeedbackDetail = (id: number) => {
  return http.get<NPSFeedback>(`/nps/feedback/${id}`);
};

export const updateFeedbackStatus = (
  id: number,
  params: UpdateNPSStatusParams,
) => {
  return http.put(`/nps/feedback/${id}/status`, params);
};

export const followUp = (id: number, params: FollowUpParams) => {
  return http.post(`/nps/feedback/${id}/follow-up`, params);
};

export const getDashboard = () => {
  return http.get<NPSDashboard>('/nps/dashboard');
};

export const getStatistics = (periodType: string = 'day', days: number = 30) => {
  return http.get<NPSStatistics[]>('/nps/statistics', {
    params: { periodType, days },
  });
};
