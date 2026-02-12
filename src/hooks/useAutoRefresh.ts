import { useEffect, useRef } from 'react';
import useFundStore from '@/stores/fundStore';

// 自动刷新钩子
export const useAutoRefresh = () => {
  const { autoRefresh, refreshInterval, refreshFunds } = useFundStore();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // 清除之前的定时器
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 如果启用了自动刷新，设置新的定时器
    if (autoRefresh) {
      intervalRef.current = window.setInterval(() => {
        refreshFunds();
      }, refreshInterval);
    }

    // 清理函数
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, refreshFunds]);

  return {
    isAutoRefreshEnabled: autoRefresh,
    currentInterval: refreshInterval,
  };
};