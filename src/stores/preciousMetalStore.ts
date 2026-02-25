import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import preciousMetalApi from '@/services/preciousMetalApi';
import { PreciousMetalData } from '@/types';

interface PreciousMetalStore {
  metals: PreciousMetalData[];
  isLoading: boolean;
  lastUpdate: string;
  error: string | null;
  autoRefresh: boolean;
  refreshInterval: number;

  refreshMetals: () => Promise<void>;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  clearError: () => void;
}

export const usePreciousMetalStore = create<PreciousMetalStore>()(
  persist(
    (set) => ({
      metals: [],
      isLoading: false,
      lastUpdate: '',
      error: null,
      autoRefresh: true,
      refreshInterval: 60000,

      refreshMetals: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await preciousMetalApi.getPreciousMetalsData();

          if (response.success) {
            set({
              metals: response.data,
              lastUpdate: new Date().toLocaleTimeString(),
              isLoading: false,
            });
          } else {
            set({ error: response.message, isLoading: false });
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
        set({ error: null });
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
