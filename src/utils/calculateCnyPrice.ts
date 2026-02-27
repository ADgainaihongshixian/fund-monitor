import { TROY_OUNCE_TO_GRAM } from '@/constant/enum';

export const calculateCnyPrice = (usdPrice: number, exchangeRate: number): number => {
    const cnyPerOunce = usdPrice * exchangeRate;
    const cnyPerGram = cnyPerOunce / TROY_OUNCE_TO_GRAM;
    return parseFloat(cnyPerGram.toFixed(2));
};