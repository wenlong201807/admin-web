import { makeAutoObservable, runInAction } from 'mobx';
import { getStatistics } from '@/services/statistics';
import { StatisticsData } from '@/types/api';

class StatisticsStore {
  statistics: StatisticsData | null = null;
  isLoading: boolean = false;
  dateRange: [string, string] = ['', ''];

  constructor() {
    makeAutoObservable(this);
  }

  // 获取统计数据
  async fetchStatistics(startDate: string, endDate: string) {
    this.isLoading = true;
    try {
      console.log(99, startDate, endDate);
      // debugger;
      const res = await getStatistics({ startDate, endDate });
      // debugger;
      console.log(77, res);
      // runInAction(() => {
      //   this.statistics = res.data;
      //   if (startDate && endDate) {
      //     this.dateRange = [startDate, endDate];
      //   }
      // });
    } catch (error) {
      console.error('Fetch statistics error:', error);
    } finally {
      console.log(88);
      // runInAction(() => {
      //   this.isLoading = false;
      // });
    }
  }

  // 计算属性：总用户数
  get totalUsers() {
    return this.statistics?.user.total || 0;
  }

  // 计算属性：今日新增用户
  get newUsersToday() {
    return this.statistics?.user.newToday || 0;
  }

  // 计算属性：今日活跃用户
  get activeUsersToday() {
    return this.statistics?.user.activeToday || 0;
  }

  // 计算属性：总帖子数
  get totalPosts() {
    return this.statistics?.content.posts || 0;
  }

  // 计算属性：总评论数
  get totalComments() {
    return this.statistics?.content.comments || 0;
  }

  // 计算属性：积分发放总额
  get totalPointsIssued() {
    return this.statistics?.points.totalIssued || 0;
  }

  // 计算属性：积分消费总额
  get totalPointsConsumed() {
    return this.statistics?.points.totalConsumed || 0;
  }
}

export const statisticsStore = new StatisticsStore();
