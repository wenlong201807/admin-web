import { makeAutoObservable, runInAction } from 'mobx';
import { getConfig, updateConfig } from '@/services/config';
import { SystemConfig } from '@/types/api';

class ConfigStore {
  config: SystemConfig = {} as SystemConfig;
  isLoading: boolean = false;
  isSaving: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // 获取系统配置
  async fetchConfig() {
    this.isLoading = true;
    try {
      const res = await getConfig();
      runInAction(() => {
        this.config = res.data;
      });
    } catch (error) {
      console.error('Fetch config error:', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // 更新系统配置
  async updateConfig(newConfig: Partial<SystemConfig>) {
    this.isSaving = true;
    try {
      await updateConfig(newConfig);
      runInAction(() => {
        this.config = { ...this.config, ...newConfig };
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    } finally {
      runInAction(() => {
        this.isSaving = false;
      });
    }
  }

  // 获取单个配置项
  getConfigValue(key: keyof SystemConfig): number {
    return this.config[key] || 0;
  }
}

export const configStore = new ConfigStore();
