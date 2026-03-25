import { makeAutoObservable, runInAction } from 'mobx';
import { login, logout, refreshToken } from '@/services/auth';
import { AdminUser } from '@/types/api';

class AuthStore {
  token: string = '';
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
    const adminStr = localStorage.getItem('admin');
    console.log('adminStr:', adminStr);
    if (token && adminStr) {
      try {
        const admin = JSON.parse(adminStr);
        runInAction(() => {
          this.token = token;
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
        this.admin = res.data.admin;
        this.isAuthenticated = true;
        localStorage.setItem('token', res.data.token);
        // debugger;
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
        this.admin = null;
        this.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
      });
    }
  }

  // 刷新 Token
  async refreshAccessToken() {
    try {
      const res = await refreshToken();
      runInAction(() => {
        this.token = res.data.token;
        localStorage.setItem('token', res.data.token);
      });
    } catch (error) {
      await this.logout();
    }
  }
}

export const authStore = new AuthStore();
