import request from '../utils/request';

export interface LogEntry {
  type: string;
  requestId: string;
  method?: string;
  url?: string;
  statusCode?: number;
  message?: string;
  stack?: string;
  responseTime?: string;
  timestamp: string;
  body?: any;
  ip?: string;
  userAgent?: string;
  level?: string;
}

export interface QueryLogsParams {
  requestId?: string;
  level?: 'error' | 'warn' | 'info' | 'debug';
  type?: 'request' | 'response' | 'error';
  method?: string;
  url?: string;
  statusCode?: number;
  startTime?: string;
  endTime?: string;
  page?: number;
  pageSize?: number;
}

export interface LogsResponse {
  list: LogEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LogDetailResponse {
  requestId: string;
  request?: LogEntry;
  response?: LogEntry;
  error?: LogEntry;
  timeline: LogEntry[];
}

export interface LogStatsResponse {
  total: number;
  errorCount: number;
  requestCount: number;
  responseCount: number;
  errorRate: string;
  statusCodeStats: Record<number, number>;
  topErrorUrls: Array<{ url: string; count: number }>;
}

// 查询日志列表
export const queryLogs = (params: QueryLogsParams) => {
  return request.get<LogsResponse>('/admin/logs', { params });
};

// 获取日志详情
export const getLogDetail = (requestId: string) => {
  return request.get<LogDetailResponse>(`/admin/logs/detail/${requestId}`);
};

// 获取日志统计
export const getLogStats = (startTime?: string, endTime?: string) => {
  return request.get<LogStatsResponse>('/admin/logs/stats', {
    params: { startTime, endTime },
  });
};
