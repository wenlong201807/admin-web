import { makeAutoObservable, runInAction } from 'mobx';
import { pointsConfigApi, PointsConfig } from '@/services/pointsConfig';

class ConfigStore {
  config: Record<string, number> = {};
  configList: PointsConfig[] = [];
  isLoading: boolean = false;
  isSaving: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchConfig() {
    this.isLoading = true;
    try {
      const res = await pointsConfigApi.getList();
      runInAction(() => {
        this.configList = res.data.list;
        const configObj: Record<string, number> = {};
        res.data.list.forEach((item) => {
          configObj[item.key] = item.value;
        });
        this.config = configObj;
      });
    } catch (error) {
      console.error('Fetch config error:', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async updateConfig(key: string, value: number, description?: string) {
    this.isSaving = true;
    try {
      await pointsConfigApi.update(key, { value, description });
      runInAction(() => {
        const index = this.configList.findIndex((item) => item.key === key);
        if (index !== -1) {
          this.configList[index].value = value;
          if (description) {
            this.configList[index].description = description;
          }
          this.config[key] = value;
        }
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

  async batchUpdate(configs: { key: string; value: number; description?: string }[]) {
    this.isSaving = true;
    try {
      await pointsConfigApi.batchUpdate({ configs });
      await this.fetchConfig();
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    } finally {
      runInAction(() => {
        this.isSaving = false;
      });
    }
  }

  getConfigValue(key: string): number {
    return this.config[key] || 0;
  }
}

export const configStore = new ConfigStore();
