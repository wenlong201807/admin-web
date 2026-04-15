import { http } from '@/utils/request';
// import { BaseResponse } from '@/types/api';

interface LoginParams {
  username: string;
  password: string;
  loginType?: 'username' | 'mobile_sms';
}

interface LoginResponse {
  token: string;
  refreshToken?: string;
  admin: {
    id: number;
    username: string;
    role: string;
  };
}

// 管理员登录
export const login = (params: LoginParams) => {
  return http.post<LoginResponse>('/api/v1/admin/auth/login', {
    account: params.username,
    password: params.password,
    loginType: 'username',
  });
};

// 管理员登出
export const logout = () => {
  return http.post('/api/v1/admin/auth/logout');
};

// 刷新 Token
export const refreshToken = (token: string) => {
  return http.post<{ token: string; refreshToken?: string }>('/api/v1/admin/auth/refresh', {
    refreshToken: token,
  });
};
