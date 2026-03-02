import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import preciousMetalApi from '@/services/preciousMetalApi';
import exchangeRateApi from '@/services/exchangeRateApi';
import { PreciousMetalStore } from '@/types/store';
import { delayFn } from '@/utils/delayFn';

export const usePreciousMetalStore = create<PreciousMetalStore>()(
  persist(
    (set) => ({
      metals: [],
      isLoading: false,
      lastUpdate: '',
      error: null,
      autoRefresh: true,
      refreshInterval: 60000,
      exchangeRate: null,
      exchangeRateError: null,

      refreshMetals: async () => {
        set({ isLoading: true, error: null, exchangeRateError: null });

        try {
          const metalsResponse = await preciousMetalApi.getPreciousMetalsData();
          // 在生产环境中，添加200ms延迟，避免对新浪财经API的并发请求，导致被反爬虫限制
          await delayFn(200);
          const rateResponse = await exchangeRateApi.getUSDCNYRate();

          const exchangeRateError = rateResponse.success ? null : rateResponse.message;

          if (metalsResponse.success) {
            set({
              metals: metalsResponse.data,
              lastUpdate: new Date().toLocaleString('en-CA', { hour12: false }).replace(',', ''),
              isLoading: false,
              exchangeRate: rateResponse.success ? rateResponse.data : null,
              exchangeRateError,
            });
          } else {
            set({
              error: metalsResponse.message,
              isLoading: false,
              exchangeRate: rateResponse.success ? rateResponse.data : null,
              exchangeRateError,
            });
          }
        } catch (error) {
          set({ error: '获取贵金属数据失败', isLoading: false });
        }
      },

      setAutoRefresh: (enabled: boolean) => {
        set({ autoRefresh: enabled });
      },

      setRefreshInterval: (interval: number) => {
        set({ refreshInterval: interval });
      },

      clearError: () => {
        set({ error: null, exchangeRateError: null });
      },
    }),
    {
      name: 'precious-metal-storage',
      partialize: (state) => ({
        autoRefresh: state.autoRefresh,
        refreshInterval: state.refreshInterval,
      }),
    }
  )
);

export default usePreciousMetalStore;
