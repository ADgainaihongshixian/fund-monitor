import { useCallback, useEffect } from 'react';
import useFundStore from '@/stores/fundStore';

// 基金数据钩子
export const useFundData = () => {
  const {
    funds,
    isLoading,
    lastUpdate,
    error,
    addFund,
    removeFund,
    refreshFunds,
    searchFunds,
    clearError,
  } = useFundStore();

  // 初始加载时刷新数据
  useEffect(() => {
    funds.length && refreshFunds();
  }, []);

  // 手动刷新
  const handleRefresh = useCallback(async () => {
    await refreshFunds(true);
  }, [refreshFunds]);

  // 添加基金
  const handleAddFund = useCallback(async (code: string) => {
    await addFund(code);
  }, [addFund]);

  // 删除基金
  const handleRemoveFund = useCallback((code: string) => {
    removeFund(code);
  }, [removeFund]);

  // 搜索基金
  const handleSearchFunds = useCallback(async (keyword: string) => {
    return await searchFunds(keyword);
  }, [searchFunds]);

  // 清除错误
  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    funds,
    isLoading,
    lastUpdate,
    error,
    refreshFunds: handleRefresh,
    addFund: handleAddFund,
    removeFund: handleRemoveFund,
    searchFunds: handleSearchFunds,
    clearError: handleClearError,
  };
};