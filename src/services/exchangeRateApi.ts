import { ApiResponse } from '@/types';
import { EXCHANGE_RATE_BASE_URL } from '@/constant/api';
import { createApiClient } from '@/utils/apiClient';
import { requestInterceptor } from '@/utils/requestInterceptor';
import { handleApiError } from '@/utils/handleApiError';

const apiClient = createApiClient({ baseURL: EXCHANGE_RATE_BASE_URL, accept: '*/*' });
requestInterceptor(apiClient);

export interface ExchangeRateData {
  rate: number;
  lastUpdate: string;
}

const parseExchangeRateData = (responseText: string): ExchangeRateData | null => {
  try {
    const pattern = /var hq_str_USDCNY="([^"]*)"/;
    const match = responseText.match(pattern);

    if (!match || !match[1]) {
      console.warn('汇率数据格式不匹配');
      return null;
    }

    const dataStr = match[1];
    const parts = dataStr.split(',');

    const rate = parseFloat(parts[1]) || parseFloat(parts[2]);
    const updateTime = parts[0] || '';
    const date = parts[parts.length - 1] || '';

    if (!rate) {
      console.warn('汇率数据无效');
      return null;
    }

    return {
      rate,
      lastUpdate: date && updateTime ? `${date} ${updateTime}` : new Date().toLocaleString(),
    };
  } catch (error) {
    console.error('解析汇率数据失败:', error);
    return null;
  }
};

const exchangeRateApi = {
  getUSDCNYRate: async (): Promise<ApiResponse<ExchangeRateData>> => {
    try {
      const response = await apiClient.get('/list=USDCNY', {
        responseType: 'text',
      });

      const rateData = parseExchangeRateData(response as unknown as string);

      if (!rateData) {
        return {
          success: false,
          data: { rate: 0, lastUpdate: '' },
          message: '获取汇率数据失败：数据格式错误',
        };
      }

      return {
        success: true,
        data: rateData,
        message: '获取汇率数据成功',
      };
    } catch (error) {
      return {
        success: false,
        data: { rate: 0, lastUpdate: '' },
        message: handleApiError(error),
      };
    }
  },
};

export default exchangeRateApi;