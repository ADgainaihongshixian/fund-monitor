import { ApiResponse } from '@/types';
import { EXCHANGE_RATE_BASE_URL } from '@/constant/api';
import { createApiClient } from '@/utils/apiClient';
import { requestInterceptor } from '@/utils/requestInterceptor';

const apiClient = createApiClient({ baseURL: EXCHANGE_RATE_BASE_URL, accept: '*/*' });
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