// 基金基本信息类型
export interface FundBasic {
  code: string;
  name: string;
  type: string;
  manager?: string;
  company?: string;
}

// 基金实时估值类型
export interface FundData {
  code: string;
  name: string;
  netValue?: number;
  estimateValue: number;
  estimateChange: number;
  dayChange?: number;
  lastUpdate: string;
  isRising: boolean;
}

// 基金搜索结果类型
export interface FundSearchResult {
  code: string;
  name: string;
  type: string;
}

// 基金历史数据类型
export interface FundHistoryData {
  date: string;
  value: number;
  change: number;
}

// 全局状态类型
export interface FundState {
  funds: FundData[];
  isLoading: boolean;
  lastUpdate: string;
  error: string | null;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface EastmoneyHistoryResponse {
  Data: {
    LSJZList: Array<{
      FSRQ: string;
      DWJZ: string;
      JZZZL: string;
    }>;
  };
}