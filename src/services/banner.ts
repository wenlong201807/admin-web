import { http } from '@/utils/request';

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkType: 'none' | 'page' | 'topic' | 'user' | 'post';
  linkValue?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BannerListResponse {
  list: Banner[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateBannerDto {
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkType: 'none' | 'page' | 'topic' | 'user' | 'post';
  linkValue?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateBannerDto {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  linkType?: 'none' | 'page' | 'topic' | 'user' | 'post';
  linkValue?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const getBanners = (page: number = 1, pageSize: number = 20) => {
  return http.get<BannerListResponse>('/admin/banners', { params: { page, pageSize } });
};

export const createBanner = (data: CreateBannerDto) => {
  return http.post<{ message: string; banner: Banner }>('/admin/banners', data);
};

export const updateBanner = (id: number, data: UpdateBannerDto) => {
  return http.put<{ message: string; banner: Banner }>(`/admin/banners/${id}`, data);
};

export const deleteBanner = (id: number) => {
  return http.delete<{ message: string }>(`/admin/banners/${id}`);
};

export const toggleBannerStatus = (id: number) => {
  return http.put<{ message: string; banner: Banner }>(`/admin/banners/${id}/toggle`);
};
