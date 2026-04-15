import { http } from '@/utils/request';

export interface FileRecord {
  id: number;
  fileName: string;
  filePath: string;
  url: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  status: number;
  uploadUserId: number;
  uploadNickname: string;
  type?: string;
  createdAt: string;
}

export interface FileListParams {
  page?: number;
  pageSize?: number;
  status?: number;
  keyword?: string;
  startDate?: string;
  endDate?: string;
}

export interface FileListResponse {
  list: FileRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export const getFileList = (params: FileListParams) => {
  return http.get<FileListResponse>('/api/v1/admin/file/list', { params });
};

export const blockFile = (id: number, reason?: string) => {
  return http.post(`/api/v1/admin/file/${id}/block`, { reason });
};

export const unblockFile = (id: number) => {
  return http.post(`/api/v1/admin/file/${id}/unblock`);
};

export const batchBlockFile = (ids: number[], reason?: string) => {
  return http.post('/api/v1/admin/file/batch-block', { ids, reason });
};
