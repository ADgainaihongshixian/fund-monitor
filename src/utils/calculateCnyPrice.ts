import { TROY_OUNCE_TO_GRAM } from '@/constant/enum';

/**
 * 计算CNY价格
 * @param usdPrice 美元价格
 * @param exchangeRate 汇率
 * @returns CNY价格
 */
export const calculateCnyPrice = (usdPrice: number, exchangeRate: number): number => {
    const cnyPerOunce = usdPrice * exchangeRate;
    const cnyPerGram = cnyPerOunce / TROY_OUNCE_TO_GRAM;
    return parseFloat(cnyPerGram.toFixed(2));
};