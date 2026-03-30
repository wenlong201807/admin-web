import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { message } from 'antd';
import { BaseResponse } from '@/types/api';
import config from './config';

// 创建 Axios 实例
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: config.apiUrl,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 添加 Token
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const { code, message: msg } = response.data;

      // 成功响应
      if (code === 0) {
        return response.data;
      }

      // 业务错误
      message.error(msg || '请求失败');
      return Promise.reject(new Error(msg || '请求失败'));
    },
    async (error: AxiosError) => {
      const { response } = error;

      // Token 过期
      if (response?.status === 401) {
        message.error('登录已过期，请重新登录');
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // 其他错误
      const errorMsg = error.message || '网络错误';
      // const errorMsg = response?.data?.message || error.message || '网络错误';
      message.error(errorMsg);
      return Promise.reject(error);
    },
  );

  return instance;
};

export const request = createAxiosInstance();

// 通用请求方法
export const http = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return request.get<any, BaseResponse<T>>(url, config);
  },

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return request.post<any, BaseResponse<T>>(url, data, config);
  },

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return request.put<any, BaseResponse<T>>(url, data, config);
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return request.delete<any, BaseResponse<T>>(url, config);
  },
};
