import { FundData, FundSearchResult } from "@/types/fund";
import { PreciousMetalData } from "@/types/preciousMetal";
import { ExchangeRateData } from "@/types/exchangeRate";

export interface FundStore {
    funds: FundData[];
    isLoading: boolean;
    lastUpdate: string;
    error: string | null;
    autoRefresh: boolean;
    refreshInterval: number;

    // 全量基金数据相关
    allFunds: FundSearchResult[];
    allFundsLoading: boolean;
    allFundsError: string | null;

    addFund: (code: string) => Promise<void>;
    removeFund: (code: string) => void;
    refreshFunds: (forceRefresh?: boolean) => Promise<void>;
    searchFunds: (keyword: string) => Promise<FundSearchResult[]>;
    setAutoRefresh: (enabled: boolean) => void;
    setRefreshInterval: (interval: number) => void;
    clearError: () => void;

    // 新增：预加载全量基金数据
    preloadAllFunds: () => Promise<boolean>;
    // 新增：本地搜索（基于已加载的数据）
    searchFundsFromLocal: (keyword: string) => FundSearchResult[];
    // 新增：清除全量基金缓存
    clearAllFundsCache: () => void;
};


export interface PreciousMetalStore {
    metals: PreciousMetalData[];
    isLoading: boolean;
    lastUpdate: string;
    error: string | null;
    autoRefresh: boolean;
    refreshInterval: number;
    exchangeRate: ExchangeRateData | null;
    exchangeRateError: string | null;

    refreshMetals: () => Promise<void>;
    setAutoRefresh: (enabled: boolean) => void;
    setRefreshInterval: (interval: number) => void;
    clearError: () => void;
};