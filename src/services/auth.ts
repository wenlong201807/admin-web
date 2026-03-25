import { http } from '@/utils/request';
// import { BaseResponse } from '@/types/api';

interface LoginParams {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  admin: {
    id: number;
    username: string;
    role: string;
  };
}

// 管理员登录
export const login = (params: LoginParams) => {
  return http.post<LoginResponse>('/admin/auth/login', params);
};

// 管理员登出
export const logout = () => {
  return http.post('/admin/auth/logout');
};

// 刷新 Token
export const refreshToken = () => {
  return http.post<{ token: string }>('/admin/auth/refresh');
};
