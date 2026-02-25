import { useEffect, useRef } from 'react';
import usePreciousMetalStore from '@/stores/preciousMetalStore';

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
