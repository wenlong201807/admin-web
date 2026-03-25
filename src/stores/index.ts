import { authStore } from './authStore';
import { userStore } from './userStore';
import { configStore } from './configStore';
import { statisticsStore } from './statisticsStore';

// 直接导出各个 store
export { authStore };
export { userStore };
export { configStore };
export { statisticsStore };

export const rootStore = {
  auth: authStore,
  user: userStore,
  config: configStore,
  statistics: statisticsStore,
};

export type RootStore = typeof rootStore;
