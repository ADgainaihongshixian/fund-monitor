import { ApiResponse, PreciousMetalConfig } from '@/types/index';
import { PreciousMetalData } from '@/types/preciousMetal';
import { PRECIOUS_METALS, SINA_METAL_CODES } from '@/constant/enum';
import { PRECIOUS_METAL_BASE_URL } from '@/constant/api';
import { createApiClient } from '@/utils/apiClient';
import { requestInterceptor } from '@/utils/requestInterceptor';
import { handleApiError } from '@/utils/handleApiError';

const apiClient = createApiClient({ baseURL: PRECIOUS_METAL_BASE_URL, accept: '*/*' });
requestInterceptor(apiClient);

/**
 * 解析新浪 preciousMetal 数据文本，提取 preciousMetal 数据
 * @param responseText 包含 preciousMetal 数据的文本响应
 * @param symbol preciousMetal 符号（例如 'AU'）
 * @param config preciousMetal 配置对象，包含名称等信息
 * @returns 解析后的 preciousMetal 数据对象，包含当前价格、变化、变化百分比等，或null表示解析失败
 */
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

    const currentPrice = parseFloat(parts[0]) || 0; //当前价格
    const prevClosePrice = parseFloat(parts[1]) || 0; //昨收价格
    // @ts-ignore: 保留买一价数据供将来使用
    const bidPrice = parseFloat(parts[2]) || 0; //买一价
    // @ts-ignore: 保留卖一价数据供将来使用
    const askPrice = parseFloat(parts[3]) || 0; //卖一价
    const highPrice = parseFloat(parts[4]) || 0; //最高价
    const lowPrice = parseFloat(parts[5]) || 0; //最低价
    const updateTime = parts[6] || '';//更新时间
    const prevClosePriceAlt = parseFloat(parts[7]) || prevClosePrice; //昨收价格（备用）
    const openPrice = parseFloat(parts[8]) || 0; //开盘价
    const date = parts[12] || ''; //日期
    // @ts-ignore: 保留名称数据供将来使用
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

/**
 * preciousMetal API服务
 * 提供获取 preciousMetal 数据的功能
 */
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