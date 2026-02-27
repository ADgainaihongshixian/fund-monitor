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
    exchangeRate,
    exchangeRateError,
  } = usePreciousMetalStore();

  useEffect(() => {
    !metals.length && refreshMetals();
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
    exchangeRate,
    exchangeRateError,
  };
};
