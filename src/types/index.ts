// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
};

export interface EastmoneyHistoryResponse {
  Data: {
    LSJZList: Array<{
      FSRQ: string;
      DWJZ: string;
      JZZZL: string;
    }>;
  };
};

export interface PreciousMetalConfig {
  symbol: string;
  name: string;
  nameEn: string;
  apiCode: string;
};