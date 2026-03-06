import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import fundApi from '@/services/fundApi';
import { FundSearchResult } from '@/types/fund';
import { FundStore } from "@/types/store";
import { generateCacheKey, fundDataCache } from '@/utils/cache';

/**
 * 基金状态管理
 * 管理用户添加的基金列表、基金数据加载状态、刷新配置等
 */
export const useFundStore = create<FundStore>()(
  persist(
    (set, get) => ({
      funds: [],
      isLoading: false,
      lastUpdate: '',
      error: null,
      autoRefresh: true,
      refreshInterval: 60000,

      allFunds: [],
      allFundsLoading: false,
      allFundsError: null,

      addFund: async (code: string) => {
        const { funds } = get();

        if (funds.some(fund => fund.code === code)) {
          set({ error: '该基金已添加' });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await fundApi.getFundData([code]);

          if (response.success && response.data.length > 0) {
            const newFund = response.data[0];
            set({
              funds: [...funds, newFund],
              lastUpdate: new Date().toLocaleTimeString(),
              isLoading: false,
            });
          } else {
            set({ error: '获取基金数据失败', isLoading: false });
          }
        } catch (error) {
          set({ error: '添加基金失败', isLoading: false });
        }
      },

      removeFund: (code: string) => {
        const { funds } = get();
        set({
          funds: funds.filter(fund => fund.code !== code),
        });
      },

      refreshFunds: async (forceRefresh = false) => {
        const { funds } = get();

        if (!funds.length) return;

        set({ isLoading: true, error: null });

        try {
          const codes = funds.map(fund => fund.code);
          const cacheKey = generateCacheKey('funds', codes);
          const cachedData = fundDataCache.get(cacheKey);

          if (cachedData && !forceRefresh) {
            set({
              funds: cachedData,
              lastUpdate: new Date().toLocaleTimeString(),
              isLoading: false,
            });
            return;
          }

          const response = await fundApi.getFundData(codes);

          if (response.success) {
            fundDataCache.set(cacheKey, response.data);

            set({
              funds: response.data,
              lastUpdate: new Date().toLocaleTimeString(),
              isLoading: false,
            });
          } else {
            set({ error: '刷新数据失败', isLoading: false });
          }
        } catch (error) {
          set({ error: '网络错误', isLoading: false });
        }
      },

      // 预加载全量基金数据
      preloadAllFunds: async (): Promise<boolean> => {
        const { allFunds } = get();

        // 如果已有数据，不重复加载
        if (allFunds.length > 0) {
          return true;
        }

        set({ allFundsLoading: true, allFundsError: null });

        try {
          const response = await fundApi.getAllFunds();

          if (response.success && response.data.length > 0) {
            set({
              allFunds: response.data,
              allFundsLoading: false,
            });
            return true;
          } else {
            set({
              allFundsLoading: false,
              allFundsError: response.message || '获取基金列表失败',
            });
            return false;
          }
        } catch (error) {
          set({
            allFundsLoading: false,
            allFundsError: '网络错误，请稍后重试',
          });
          return false;
        }
      },

      // 基于本地数据的搜索
      searchFundsFromLocal: (keyword: string): FundSearchResult[] => {
        const { allFunds } = get();
        if (!keyword.trim() || allFunds.length === 0) {
          return [];
        }
        return fundApi.searchFundsLocal(keyword, allFunds);
      },

      // 清除全量基金缓存
      clearAllFundsCache: () => {
        fundApi.clearFundListCache();
        set({ allFunds: [] });
      },

      // 搜索基金（兼容原有接口）
      searchFunds: async (keyword: string) => {
        if (!keyword.trim()) {
          return [];
        }

        try {
          const response = await fundApi.searchFund(keyword);
          return response.success ? response.data : [];
        } catch (error) {
          set({ error: '搜索失败' });
          return [];
        }
      },

      setAutoRefresh: (enabled: boolean) => {
        set({ autoRefresh: enabled });
      },

      setRefreshInterval: (interval: number) => {
        set({ refreshInterval: interval });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'fund-monitor-storage',
      partialize: (state) => ({
        funds: state.funds,
        autoRefresh: state.autoRefresh,
        refreshInterval: state.refreshInterval,
      }),
    }
  )
);

export default useFundStore;