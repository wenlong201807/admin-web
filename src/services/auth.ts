import { http } from '@/utils/request';
import { cryptoUtil } from '@/utils/crypto';

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

interface PublicKeyResponse {
  publicKey: string;
}

// 获取 RSA 公钥
export const getPublicKey = () => {
  return http.get<PublicKeyResponse>('/admin/auth/public-key');
};

// 管理员登录
export const login = async (params: LoginParams) => {
  // 1. 获取公钥
  const { publicKey } = await getPublicKey();

  // 2. 设置公钥并加密密码
  cryptoUtil.setPublicKey(publicKey);
  const encryptedPassword = cryptoUtil.encryptText(params.password);

  // 3. 发送登录请求
  return http.post<LoginResponse>('/admin/auth/login', {
    account: params.username,
    password: encryptedPassword,
    loginType: 'username',
  });
};

// 管理员登出
export const logout = () => {
  return http.post('/admin/auth/logout');
};

// 刷新 Token
export const refreshToken = (token: string) => {
  return http.post<{ token: string; refreshToken?: string }>('/admin/auth/refresh', {
    refreshToken: token,
  });
};
