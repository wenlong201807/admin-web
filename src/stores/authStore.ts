import { makeAutoObservable, runInAction } from 'mobx';
import { login, logout, refreshToken } from '@/services/auth';
import { AdminUser } from '@/types/api';

class AuthStore {
  token: string = '';
  refreshToken: string = '';
  admin: AdminUser | null = null;
  isAuthenticated: boolean = false;
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.initFromStorage();
  }

  // 从本地存储初始化
  initFromStorage() {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const adminStr = localStorage.getItem('admin');

    if (token && adminStr) {
      try {
        const admin = JSON.parse(adminStr);
        runInAction(() => {
          this.token = token;
          this.refreshToken = refreshToken || '';
          this.admin = admin;
          this.isAuthenticated = true;
        });
      } catch (error) {
        console.error('Failed to parse admin data:', error);
      }
    }
  }

  // 登录
  async login(username: string, password: string) {
    this.isLoading = true;
    try {
      const res = await login({ username, password });
      runInAction(() => {
        this.token = res.data.token;
        this.refreshToken = res.data.refreshToken || res.data.token;
        this.admin = res.data.admin;
        this.isAuthenticated = true;
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken || res.data.token);
        localStorage.setItem('admin', JSON.stringify(res.data.admin));
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // 登出
  async logout() {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      runInAction(() => {
        this.token = '';
        this.refreshToken = '';
        this.admin = null;
        this.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('admin');
      });
    }
  }

  // 刷新 Token
  async refreshAccessToken() {
    try {
      const res = await refreshToken(this.refreshToken);
      runInAction(() => {
        this.token = res.data.token;
        if (res.data.refreshToken) {
          this.refreshToken = res.data.refreshToken;
          localStorage.setItem('refreshToken', res.data.refreshToken);
        }
        localStorage.setItem('token', res.data.token);
      });
    } catch (error) {
      await this.logout();
    }
  }
}

export const authStore = new AuthStore();
