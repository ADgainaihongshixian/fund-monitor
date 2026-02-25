import { useCallback, useEffect } from 'react';
import usePreciousMetalStore from '@/stores/preciousMetalStore';

export const usePreciousMetalData = () => {
  const {
    metals,
    isLoading,
    lastUpdate,
    error,
    refreshMetals,
    clearError,
  } = usePreciousMetalStore();

  useEffect(() => {
    if (metals.length === 0) {
      refreshMetals();
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    await refreshMetals();
  }, [refreshMetals]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    metals,
    isLoading,
    lastUpdate,
    error,
    refreshMetals: handleRefresh,
    clearError: handleClearError,
  };
};
