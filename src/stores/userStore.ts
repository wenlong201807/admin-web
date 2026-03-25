import { makeAutoObservable, runInAction } from 'mobx';
import { getUserList, adjustUserPoints, updateUserStatus, getUserDetail } from '@/services/user';
import { User, PaginationParams } from '@/types/api';

class UserStore {
  userList: User[] = [];
  total: number = 0;
  currentParams: PaginationParams = {
    page: 1,
    pageSize: 20,
  };
  isLoading: boolean = false;
  currentUser: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // 获取用户列表
  async fetchUserList(params?: Partial<PaginationParams>) {
    this.isLoading = true;
    try {
      const mergedParams = { ...this.currentParams, ...params };
      const res = await getUserList(mergedParams);
      runInAction(() => {
        this.userList = res.data.list;
        this.total = res.data.total;
        this.currentParams = mergedParams;
      });
    } catch (error) {
      console.error('Fetch user list error:', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // 调整用户积分
  async adjustPoints(userId: number, amount: number, reason: string) {
    try {
      await adjustUserPoints(userId, { amount, reason });
      // 刷新列表
      await this.fetchUserList();
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // 更新用户状态
  async updateStatus(userId: number, status: number) {
    try {
      await updateUserStatus(userId, { status });
      // 刷新列表
      await this.fetchUserList();
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  // 获取用户详情
  async fetchUserDetail(userId: number) {
    try {
      const res = await getUserDetail(userId);
      runInAction(() => {
        this.currentUser = res.data;
      });
    } catch (error) {
      console.error('Fetch user detail error:', error);
    }
  }

  // 重置状态
  reset() {
    this.userList = [];
    this.total = 0;
    this.currentParams = { page: 1, pageSize: 20 };
    this.currentUser = null;
  }
}

export const userStore = new UserStore();
