export interface AddFundProps {
    isOpen: boolean;
    onClose: () => void;
    onAddFund: (code: string) => Promise<void>;
    searchFunds: (keyword: string) => Promise<FundSearchResult[]>;
};

export interface ChartProps {
    fundCode: string;
    fundName: string;
};

// 基金实时估值类型
export type FundData = {
    code: string;
    name: string;
    netValue?: number;
    estimateValue: number;
    estimateChange: number;
    dayChange?: number;
    lastUpdate: string;
    isRising: boolean;
};

export interface FundCardProps {
    fund: FundData;
    onRemove: (code: string) => void;
    onClick?: (fund: FundData) => void;
};

export interface FundListProps {
    funds: FundData[];
    onRemoveFund: (code: string) => void;
    onFundClick?: (fund: FundData) => void;
};


// 基金搜索结果类型
export type FundSearchResult = {
    code: string;
    name: string;
    type: string;
};


export interface SearchFundProps {
    onSearch: (keyword: string) => Promise<FundSearchResult[]>;
    onSelect: (fund: FundSearchResult) => void;
    isLoading?: boolean;
};