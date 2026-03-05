import { ApiResponse, EastmoneyHistoryResponse } from '@/types';
import { FundData, FundSearchResult } from '@/types/fund';
import { FUND_BASE_URL, FUND_BASE_SEARCH_URL, FUND_BASE_HISTORY_URL } from '@/constant/api';
import { FUND_HISTORY_CACHE_EXPIRY_TIME, FUND_LIST_CACHE_KEY, FUND_LIST_CACHE_EXPIRY_TIME } from '@/constant/enum';
import { createApiClient } from '@/utils/apiClient';
import { requestInterceptor } from '@/utils/requestInterceptor';
import { handleApiError } from '@/utils/handleApiError';

interface FundListCache {
  data: FundSearchResult[];
  timestamp: number;
}

const getFundListCache = (): FundListCache | null => {
  try {
    const cached = localStorage.getItem(FUND_LIST_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.data) && typeof parsed.timestamp === 'number') {
        return parsed;
      }
    }
  } catch (e) {
    // 缓存数据损坏，清除缓存
    localStorage.removeItem(FUND_LIST_CACHE_KEY);
  }
  return null;
};

const setFundListCache = (data: FundSearchResult[]): void => {
  try {
    const cache: FundListCache = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(FUND_LIST_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    // localStorage 写入失败（可能已满），清除旧缓存后重试
    try {
      localStorage.removeItem(FUND_LIST_CACHE_KEY);
      const cache: FundListCache = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(FUND_LIST_CACHE_KEY, JSON.stringify(cache));
    } catch (e2) {
      // 仍然失败，忽略
    }
  }
};

const isCacheValid = (cache: FundListCache | null): boolean => {
  if (!cache || !cache.data || cache.data.length === 0) {
    return false;
  }
  return (Date.now() - cache.timestamp) < FUND_LIST_CACHE_EXPIRY_TIME;
};

// 历史数据缓存
const historyDataCache: {
  [key: string]: {
    data: { date: string; value: number; change: number }[];
    timestamp: number;
  };
} = {};

// 解析JSONP响应
const parseJSONP = (response: any): any => {
  // 参数检查
  if (!response || typeof response !== 'string') {
    throw new Error('Invalid response: expected string');
  }

  // 尝试匹配JSONP格式
  const match = response.match(/jsonpgz\((.*)\)/);
  if (match?.[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      throw new Error('Invalid JSON in response');
    }
  }
  throw new Error('Invalid JSONP response format');
};

// 创建多个axios实例，分别用于不同的API服务
const apiClient = createApiClient({ baseURL: FUND_BASE_URL, contentType: 'text/plain', accept: '*/*' });
const searchApiClient = createApiClient({ baseURL: FUND_BASE_SEARCH_URL, contentType: 'application/json' });
const historyApiClient = createApiClient({ baseURL: FUND_BASE_HISTORY_URL, contentType: 'application/json' });

// 请求拦截器
requestInterceptor(apiClient);
requestInterceptor(searchApiClient);
requestInterceptor(historyApiClient);

// API服务
const fundApi = {
  // 获取基金实时估值数据
  getFundData: async (codes: string[]): Promise<ApiResponse<FundData[]>> => {
    try {
      if (!codes.length) {
        return {
          success: true,
          data: [],
          message: '无基金代码',
        };
      }

      // 并行请求多个基金数据
      const fundPromises = codes.map(async (code) => {
        try {
          const url = `/js/${code}.js`;
          const response = await apiClient.get(url, { responseType: 'text' as const });

          if (!response || typeof response !== 'string') {
            throw new Error(`Empty or invalid response: data=${response}`);
          }

          // 尝试解析JSONP响应
          try {
            const fundData = parseJSONP(response);

            // 构建基金数据对象
            const netValue = parseFloat(fundData.dwjz) || 0;
            const estimateValue = parseFloat(fundData.gsz) || 0;
            const estimateChange = parseFloat(fundData.gszzl) || 0;
            const isRising = estimateChange >= 0;

            const result: FundData = {
              code: fundData.fundcode,
              name: fundData.name,
              netValue,
              estimateValue,
              estimateChange: parseFloat(estimateChange.toFixed(2)),
              dayChange: parseFloat(estimateChange.toFixed(2)),
              lastUpdate: fundData.gztime,
              isRising,
            };
            return result;
          } catch (jsonpError: any) {
            // 尝试解析JSON响应，检查是否是错误信息
            try {
              const errorData = JSON.parse(response);
              throw new Error(`API error: ${errorData.ErrMsg || 'Unknown error'}`);
            } catch {
              // 如果不是JSON响应，重新抛出JSONP错误
              throw jsonpError;
            }
          }
        } catch (error: any) {
          return null;
        }
      });

      // 等待所有请求完成
      const results = await Promise.all(fundPromises);

      // 过滤掉失败的请求
      const fundDataList = results.filter((fund): fund is FundData => fund !== null) as FundData[];

      if (fundDataList.length === 0) {
        return {
          success: false,
          data: [],
          message: '获取基金数据失败',
        };
      }

      return {
        success: true,
        data: fundDataList,
        message: '获取数据成功',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: handleApiError(error),
      };
    }
  },

  // 获取全量基金列表（带缓存）
  getAllFunds: async (): Promise<ApiResponse<FundSearchResult[]>> => {
    try {
      // 检查缓存
      const cache = getFundListCache();
      if (isCacheValid(cache)) {
        return {
          success: true,
          data: cache!.data,
          message: '获取基金列表成功（从缓存）',
        };
      }

      // 从API获取数据
      const url = '/js/fundcode_search.js';
      const now = Date.now();
      const response = await searchApiClient.get(url, {
        responseType: 'text',
        params: { _: now }
      });

      const responseData = response as unknown as string;
      const allFunds: FundSearchResult[] = [];

      // 提取JavaScript代码中的基金数据数组
      // 响应格式: var r = [["000001","HXCZHH","华夏成长混合","混合型-灵活","HUAXIACHENGZHANGHUNHE"],...]
      const fundDataMatch = responseData.match(/var r = \[(\[.*?\])\];/s);
      if (fundDataMatch) {
        try {
          // 解析提取的数组字符串
          const fundDataArray = JSON.parse(`[${fundDataMatch[1]}]`);

          // 遍历基金数据数组
          fundDataArray.forEach((fundItem: any[]) => {
            if (fundItem.length >= 4) {
              allFunds.push({
                code: fundItem[0],
                name: fundItem[2],
                type: fundItem[3],
              });
            }
          });

          // 保存到缓存
          setFundListCache(allFunds);

          return {
            success: true,
            data: allFunds,
            message: '获取基金列表成功',
          };
        } catch (parseError) {
          return {
            success: false,
            data: [],
            message: '解析基金数据失败',
          };
        }
      }

      return {
        success: false,
        data: [],
        message: '获取基金列表失败：数据格式错误',
      };
    } catch (error) {
      // 如果有旧缓存，降级使用
      const cache = getFundListCache();
      if (cache && cache.data.length > 0) {
        return {
          success: true,
          data: cache.data,
          message: '获取基金列表成功（使用旧缓存）',
        };
      }

      return {
        success: false,
        data: [],
        message: handleApiError(error),
      };
    }
  },

  // 本地搜索基金（基于缓存数据）
  searchFundsLocal: (keyword: string, allFunds: FundSearchResult[]): FundSearchResult[] => {
    if (!keyword || !keyword.trim()) {
      return [];
    }

    const keywordLower = keyword.trim().toLowerCase();
    return allFunds.filter(
      fund => fund.code.toLowerCase().includes(keywordLower) ||
        fund.name.toLowerCase().includes(keywordLower)
    );
  },

  // 搜索基金（保留原有接口兼容性）
  searchFund: async (keyword: string): Promise<ApiResponse<FundSearchResult[]>> => {
    try {
      if (!keyword || keyword.trim() === '') {
        return {
          success: true,
          data: [],
          message: '搜索关键词为空',
        };
      }

      // 获取全量数据（会使用缓存）
      const allFundsResponse = await fundApi.getAllFunds();

      if (!allFundsResponse.success || !allFundsResponse.data.length) {
        return {
          success: false,
          data: [],
          message: allFundsResponse.message || '获取基金数据失败',
        };
      }

      // 本地筛选
      const filteredResults = fundApi.searchFundsLocal(keyword, allFundsResponse.data);

      return {
        success: true,
        data: filteredResults,
        message: '搜索成功',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: handleApiError(error),
      };
    }
  },

  // 清除基金列表缓存
  clearFundListCache: (): void => {
    localStorage.removeItem(FUND_LIST_CACHE_KEY);
  },

  // 获取基金历史数据
  // 用于展示基金净值走势图，返回按日期排序的历史净值数据
  getFundHistory: async (code: string, days: number = 30): Promise<ApiResponse<any[]>> => {
    try {
      if (!code || code.trim() === '') {
        return {
          success: false,
          data: [],
          message: '基金代码为空',
        };
      }

      // 生成缓存键
      const cacheKey = `${code.trim()}_${days}`;

      // 检查缓存是否有效
      const now = Date.now();
      if (historyDataCache[cacheKey] && now - historyDataCache[cacheKey].timestamp < FUND_HISTORY_CACHE_EXPIRY_TIME) {
        return {
          success: true,
          data: historyDataCache[cacheKey].data,
          message: '获取历史数据成功（从缓存）',
        };
      }

      // 构建东方财富网历史净值API请求URL
      const url = `/f10/lsjz`;
      const response = await historyApiClient.get<EastmoneyHistoryResponse>(url, {
        params: {
          fundCode: code.trim(),
          pageIndex: 1,
          pageSize: days,
          startDate: '',
          endDate: '',
          _: now,
        }
      });

      const historyData: { date: string; value: number; change: number }[] = [];

      if (response) {
        // 由于拦截器返回 response.data，response 已经是响应体
        const typedResponse = response as { Data?: { LSJZList?: any[] } };
        // 只处理LSJZList格式的响应
        if (typedResponse?.Data?.LSJZList && Array.isArray(typedResponse?.Data?.LSJZList)) {
          // 解析LSJZList数组
          typedResponse?.Data?.LSJZList.forEach((item: any) => {
            if (item.FSRQ && item.DWJZ) {
              historyData.push({
                date: item.FSRQ,
                value: parseFloat(item.DWJZ) || 0,
                change: parseFloat(item.JZZZL) || 0,
              });
            }
          });
        } else {
          // 响应格式不符合预期
          return {
            success: false,
            data: [],
            message: '获取历史数据失败：响应格式不符合预期',
          };
        }

        // 检查是否解析到数据
        if (!historyData.length) {
          return {
            success: false,
            data: [],
            message: '获取历史数据失败：未解析到历史数据',
          };
        }

        // 按日期排序（从旧到新）
        historyData.sort((a: any, b: any) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        // 更新缓存
        historyDataCache[cacheKey] = {
          data: historyData,
          timestamp: now,
        };

      } else {
        return {
          success: false,
          data: [],
          message: '获取历史数据失败：API返回空响应',
        };
      }

      return {
        success: true,
        data: historyData,
        message: '获取历史数据成功',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: handleApiError(error),
      };
    }
  },
};

export default fundApi;