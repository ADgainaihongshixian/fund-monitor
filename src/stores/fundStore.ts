import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import fundApi from '@/services/api';
import { FundData, FundSearchResult } from '@/types';
import { generateCacheKey, fundDataCache } from '@/utils/cache';

// 状态接口
interface FundStore {
  // 状态
  funds: FundData[];
  isLoading: boolean;
  lastUpdate: string;
  error: string | null;
  autoRefresh: boolean;
  refreshInterval: number;

  // 操作
  addFund: (code: string) => Promise<void>;
  removeFund: (code: string) => void;
  refreshFunds: (forceRefresh?: boolean) => Promise<void>;
  searchFunds: (keyword: string) => Promise<FundSearchResult[]>;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  clearError: () => void;
}

// 创建store
export const useFundStore = create<FundStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      funds: [],
      isLoading: false,
      lastUpdate: '',
      error: null,
      autoRefresh: true,
      refreshInterval: 60000, // 默认1分钟

      // 添加基金
      addFund: async (code: string) => {
        const { funds } = get();

        // 检查是否已存在
        if (funds.some(fund => fund.code === code)) {
          set({ error: '该基金已添加' });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          // 获取基金数据
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

      // 删除基金
      removeFund: (code: string) => {
        const { funds } = get();
        set({
          funds: funds.filter(fund => fund.code !== code),
        });
      },

      // 刷新基金数据
      refreshFunds: async (forceRefresh = false) => {
        const { funds } = get();

        if (!funds.length) return;

        set({ isLoading: true, error: null });

        try {
          const codes = funds.map(fund => fund.code);

          // 检查缓存
          const cacheKey = generateCacheKey('funds', codes);
          const cachedData = fundDataCache.get(cacheKey);

          // 使用缓存数据（如果存在且未强制刷新）
          if (cachedData && !forceRefresh) {
            set({
              funds: cachedData,
              lastUpdate: new Date().toLocaleTimeString(),
              isLoading: false,
            });
            return;
          }

          // 获取数据
          const response = await fundApi.getFundData(codes);

          if (response.success) {
            // 更新缓存
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

      // 搜索基金
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

      // 设置自动刷新
      setAutoRefresh: (enabled: boolean) => {
        set({ autoRefresh: enabled });
      },

      // 设置刷新间隔
      setRefreshInterval: (interval: number) => {
        set({ refreshInterval: interval });
      },

      // 清除错误
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'fund-monitor-storage', // 本地存储键名
      partialize: (state) => ({
        funds: state.funds,
        autoRefresh: state.autoRefresh,
        refreshInterval: state.refreshInterval,
      }), // 只持久化这些字段
    }
  )
);

export default useFundStore;