/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE_API: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';
  readonly VITE_APP_PORT: string;
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_APP_LOGO: string;
  readonly VITE_APP_FAVICON: string;
  readonly VITE_UPLOAD_MAX_SIZE: string;
  readonly VITE_UPLOAD_ALLOWED_TYPES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
