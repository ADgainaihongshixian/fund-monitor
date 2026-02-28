import { PreciousMetalData, ApiResponse, PRECIOUS_METALS, PreciousMetalConfig } from '@/types';
import { SINA_METAL_CODES } from '@/constant/enum';
import { PRECIOUS_METAL_BASE_URL } from '@/constant/api';
import { createApiClient } from '@/utils/apiClient';
import { requestInterceptor } from '@/utils/requestInterceptor';

const apiClient = createApiClient({ baseURL: PRECIOUS_METAL_BASE_URL, accept: '*/*' });
requestInterceptor(apiClient);

const handleApiError = (error: any): string => {
  if (error.response) {
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
    return '网络连接失败，请检查网络设置';
  } else if (error.code === 'ECONNABORTED') {
    return '请求超时，请稍后重试';
  } else if (error.code === 'ENOTFOUND') {
    return '无法连接到服务器，请检查网络连接';
  } else {
    return error.message || '请求失败，请稍后重试';
  }
};

const parseSinaMetalData = (responseText: string, symbol: string, config: PreciousMetalConfig): PreciousMetalData | null => {
  try {
    const sinaCode = SINA_METAL_CODES[symbol];
    if (!sinaCode) return null;

    const pattern = new RegExp(`var hq_str_${sinaCode}="([^"]*)"`);
    const match = responseText.match(pattern);

    if (!match || !match[1]) {
      console.warn(`${symbol} 数据格式不匹配`);
      return null;
    }

    const dataStr = match[1];
    const parts = dataStr.split(',');

    if (parts.length < 9) {
      console.warn(`${symbol} 数据字段不完整:`, dataStr);
      return null;
    }

    const currentPrice = parseFloat(parts[0]) || 0;//当前价格
    const prevClosePrice = parseFloat(parts[1]) || 0;//昨收价格
    const bidPrice = parseFloat(parts[2]) || 0;//买一价
    const askPrice = parseFloat(parts[3]) || 0;//卖一价
    const highPrice = parseFloat(parts[4]) || 0;//最高价
    const lowPrice = parseFloat(parts[5]) || 0;//最低价
    const updateTime = parts[6] || '';//更新时间
    const prevClosePriceAlt = parseFloat(parts[7]) || prevClosePrice;//昨收价格（备用）
    const openPrice = parseFloat(parts[8]) || 0;//开盘价
    const date = parts[12] || ''; //日期
    const name = parts[13] || config.name; //名称

    if (!currentPrice) return null;

    const finalPrevClose = prevClosePriceAlt > 0 ? prevClosePriceAlt : prevClosePrice;
    const change = currentPrice - finalPrevClose;
    const changePercent = finalPrevClose > 0 ? (change / finalPrevClose) * 100 : 0;
    const isRising = change >= 0;

    return {
      symbol: config.symbol,
      name: config.name,
      nameEn: config.nameEn,
      currentPrice,
      openPrice: openPrice || currentPrice,
      highPrice: highPrice || currentPrice,
      lowPrice: lowPrice || currentPrice,
      prevClosePrice: finalPrevClose || currentPrice,
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      lastUpdate: date && updateTime ? `${date} ${updateTime}` : new Date().toLocaleString(),
      isRising,
      currency: 'USD',
    };
  } catch (error) {
    console.error(`解析 ${symbol} 数据失败:`, error);
    return null;
  }
};

const preciousMetalApi = {
  getPreciousMetalsData: async (symbols: string[] = ['XAU', 'XAG', 'XPT', 'XPD']): Promise<ApiResponse<PreciousMetalData[]>> => {
    try {
      if (!symbols.length) {
        return {
          success: true,
          data: [],
          message: '无贵金属代码',
        };
      }

      const validSymbols = symbols.filter(s => SINA_METAL_CODES[s]);
      if (!validSymbols.length) {
        return {
          success: false,
          data: [],
          message: '不支持的贵金属代码',
        };
      }

      const sinaCodes = validSymbols.map(s => SINA_METAL_CODES[s]).join(',');
      const response = await apiClient.get<string>(`/list=${sinaCodes}`, {
        responseType: 'text',
      });

      const results: PreciousMetalData[] = [];

      for (const symbol of validSymbols) {
        const config = PRECIOUS_METALS.find(m => m.symbol === symbol);
        if (!config) continue;

        const metalData = parseSinaMetalData(response as unknown as string, symbol, config);
        if (metalData) {
          results.push(metalData);
        }
      }

      if (!results.length) {
        return {
          success: false,
          data: [],
          message: '获取贵金属数据失败：未获取到有效数据',
        };
      }

      return {
        success: true,
        data: results,
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
};

export default preciousMetalApi;