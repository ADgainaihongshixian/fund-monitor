import axios from 'axios';
import { FundData, FundSearchResult, ApiResponse, EastmoneyHistoryResponse } from '@/types';

// API基础URL - 使用Vite代理
const BASE_URL = '/api/fundgz';

// 基金搜索API基础URL - 使用Vite代理
const SEARCH_BASE_URL = '/api/eastmoney';

// 基金历史数据API基础URL - 使用Vite代理
const HISTORY_BASE_URL = '/api/fund';

// 历史数据缓存
const historyDataCache: {
  [key: string]: {
    data: { date: string; value: number; change: number }[];
    timestamp: number;
  };
} = {};

// 缓存过期时间（毫秒）
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5分钟

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
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'text/plain',
    'Accept': '*/*',
  },
});

// 创建搜索API实例
const searchApiClient = axios.create({
  baseURL: SEARCH_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 创建历史数据API实例
const historyApiClient = axios.create({
  baseURL: HISTORY_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 错误处理函数
const handleApiError = (error: any): string => {
  if (error.response) {
    // 服务器返回错误状态码
    switch (error.response.status) {
      case 400:
        return '请求参数错误';
      case 401:
        return '未授权访问';
      case 403:
        return '访问被拒绝';
      case 404:
        return '请求的资源不存在';
      case 500:
        return '服务器内部错误';
      case 502:
        return '网关错误';
      case 503:
        return '服务暂时不可用';
      case 504:
        return '请求超时';
      default:
        return `服务器返回错误 (${error.response.status})`;
    }
  } else if (error.request) {
    // 请求已发送但没有收到响应
    return '网络连接失败，请检查网络设置';
  } else if (error.code === 'ECONNABORTED') {
    // 请求超时
    return '请求超时，请稍后重试';
  } else if (error.code === 'ENOTFOUND') {
    // 域名解析失败
    return '无法连接到服务器，请检查网络连接';
  } else {
    // 其他错误
    return error.message || '请求失败，请稍后重试';
  }
};

// 通用请求拦截器
const setupInterceptors = (client: any) => {
  client.interceptors.request.use(
    (config: any) => {
      // 可以在这里添加认证信息等
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response: any) => {
      return response.data;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
};

// 设置拦截器
setupInterceptors(apiClient);
setupInterceptors(searchApiClient);
setupInterceptors(historyApiClient);

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
          // 构建天天基金网API请求URL
          const url = `/js/${code}.js`;

          // 发送请求
          const response = await apiClient.get(url, { responseType: 'text' as const });

          // 检查响应数据
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

  // 搜索基金
  searchFund: async (keyword: string): Promise<ApiResponse<FundSearchResult[]>> => {
    try {
      if (!keyword || keyword.trim() === '') {
        return {
          success: true,
          data: [],
          message: '搜索关键词为空',
        };
      }

      // 使用天天基金网的基金代码搜索API获取真实数据
      // 这个API返回所有基金的代码和名称列表
      const url = '/js/fundcode_search.js';

      // 发送请求
      const response = await searchApiClient.get(url, { responseType: 'text' });

      // 解析响应数据
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
              const code = fundItem[0];
              const name = fundItem[2];
              const type = fundItem[3];

              // 构建基金搜索结果对象
              const fundSearchResult: FundSearchResult = {
                code,
                name,
                type,
              };

              allFunds.push(fundSearchResult);
            }
          });
        } catch (parseError) {
        }
      }

      // 过滤基金列表，只返回包含关键词的结果
      const filteredResults = allFunds.filter(
        fund => fund.code.includes(keyword.trim()) || fund.name.includes(keyword.trim())
      );

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
      if (historyDataCache[cacheKey] && now - historyDataCache[cacheKey].timestamp < CACHE_EXPIRY_TIME) {
        return {
          success: true,
          data: historyDataCache[cacheKey].data,
          message: '获取历史数据成功（从缓存）',
        };
      }

      // 构建东方财富网历史净值API请求URL
      const url = `/f10/lsjz`;

      // 发送请求
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

      // 解析响应数据
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