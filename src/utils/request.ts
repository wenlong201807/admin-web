import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { message } from 'antd';
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

      // 成功响应 - 返回整个 response.data（包含 BaseResponse 结构）
      if (code === 0 || code === 200) {
        return response.data;
      }

      // 业务错误 - 统一处理
      const errorMessage = msg || '请求失败';
      message.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    },
    async (error: AxiosError<any>) => {
      const { response } = error;

      // 处理不同的HTTP状态码
      if (response) {
        const { status, data } = response;
        let errorMessage = data?.message || error.message || '请求失败';

        switch (status) {
          case 401:
            // Token 过期或未授权
            errorMessage = '登录已过期，请重新登录';
            message.error(errorMessage);
            localStorage.removeItem('token');
            localStorage.removeItem('admin');
            // 延迟跳转，确保提示显示
            setTimeout(() => {
              window.location.href = '/login';
            }, 1000);
            break;

          case 403:
            // 无权限
            errorMessage = data?.message || '无权限访问';
            message.error(errorMessage);
            break;

          case 404:
            // 资源不存在
            errorMessage = data?.message || '请求的资源不存在';
            message.error(errorMessage);
            break;

          case 500:
            // 服务器错误
            errorMessage = data?.message || '服务器错误，请稍后重试';
            message.error(errorMessage);
            break;

          case 502:
          case 503:
          case 504:
            // 网关错误或服务不可用
            errorMessage = '服务暂时不可用，请稍后重试';
            message.error(errorMessage);
            break;

          default:
            // 其他错误
            message.error(errorMessage);
        }

        return Promise.reject(new Error(errorMessage));
      }

      // 网络错误（无响应）
      if (error.code === 'ECONNABORTED') {
        message.error('请求超时，请检查网络连接');
      } else if (error.message === 'Network Error') {
        message.error('网络连接失败，请检查网络');
      } else {
        message.error(error.message || '网络错误');
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

export const request = createAxiosInstance();

// 通用请求方法
export const http = {
  get: <T = any>(url: string, params?: any, config?: AxiosRequestConfig) => {
    return request.get<any, T>(url, { ...config, params });
  },

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return request.post<any, T>(url, data, config);
  },

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return request.put<any, T>(url, data, config);
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return request.delete<any, T>(url, config);
  },
};
