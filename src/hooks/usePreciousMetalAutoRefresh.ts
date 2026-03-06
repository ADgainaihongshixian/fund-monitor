import { useEffect, useRef } from 'react';
import usePreciousMetalStore from '@/stores/preciousMetalStore';

/**
 * 贵金属自动刷新钩子
 * 用于根据用户设置的刷新间隔自动刷新贵金属数据
 */
export const usePreciousMetalAutoRefresh = () => {
  const { autoRefresh, refreshInterval, refreshMetals } = usePreciousMetalStore();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (autoRefresh) {
      intervalRef.current = window.setInterval(() => {
        refreshMetals();
      }, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, refreshMetals]);

  return {
    isAutoRefreshEnabled: autoRefresh,
    currentInterval: refreshInterval,
  };
};
