import type { AppConfig } from '@/types/api';

const config: AppConfig = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3018/api/v1',
  appTitle: import.meta.env.VITE_APP_TITLE || 'WeTogether Admin',
  appEnv:
    (import.meta.env.VITE_APP_ENV as
      | 'development'
      | 'staging'
      | 'production') || 'development',
  appPort: Number(import.meta.env.VITE_APP_PORT) || 5173,
  appBaseUrl: import.meta.env.VITE_APP_BASE_URL || '/',
  appLogo: import.meta.env.VITE_APP_LOGO || '/logo.png',
  appFavicon: import.meta.env.VITE_APP_FAVICON || '/favicon.ico',
  uploadMaxSize: Number(import.meta.env.VITE_UPLOAD_MAX_SIZE) || 10485760,
  uploadAllowedTypes: (import.meta.env.VITE_UPLOAD_ALLOWED_TYPES || '').split(
    ',',
  ),
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isStaging: import.meta.env.VITE_APP_ENV === 'staging',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
};

export default config;

export const {
  apiUrl,
  appTitle,
  appEnv,
  appPort,
  appBaseUrl,
  appLogo,
  appFavicon,
  uploadMaxSize,
  uploadAllowedTypes,
  isDevelopment,
  isStaging,
  isProduction,
} = config;

export const getApiUrl = (path: string = ''): string => {
  return `${apiUrl}${path}`;
};

export const getAppTitle = (): string => {
  return appTitle;
};

export const isDev = (): boolean => {
  return isDevelopment;
};

export const isProd = (): boolean => {
  return isProduction;
};

export const isStagingEnv = (): boolean => {
  return isStaging;
};
