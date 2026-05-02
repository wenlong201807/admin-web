import { http } from '@/utils/request';
import { cryptoUtil } from '@/utils/crypto';
import { BaseResponse } from '@/types/api';

interface LoginParams {
  username: string;
  password: string;
  emailCode: string;
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
  return http.get<BaseResponse<PublicKeyResponse>>('/admin/auth/public-key');
};

// 发送管理员邮箱验证码（发送到配置的管理员邮箱）
export const sendAdminEmailCode = () => {
  return http.post<BaseResponse<{ message: string }>>('/admin/auth/email/send-admin-code');
};

// 管理员登录
export const login = async (params: LoginParams) => {
  // 1. 获取公钥
  const keyRes = await getPublicKey();
  const publicKey = keyRes.data.publicKey;

  // 2. 设置公钥并加密密码
  cryptoUtil.setPublicKey(publicKey);
  const encryptedPassword = cryptoUtil.encryptText(params.password);

  // 3. 发送登录请求（包含邮箱验证码）
  return http.post<BaseResponse<LoginResponse>>('/admin/auth/login', {
    account: params.username,
    password: encryptedPassword,
    emailCode: params.emailCode,
    loginType: 'username',
  });
};

// 管理员登出
export const logout = () => {
  return http.post<BaseResponse<{ message: string }>>('/admin/auth/logout');
};

// 刷新 Token
export const refreshToken = (token: string) => {
  return http.post<BaseResponse<{ token: string; refreshToken?: string }>>('/admin/auth/refresh', {
    refreshToken: token,
  });
};
