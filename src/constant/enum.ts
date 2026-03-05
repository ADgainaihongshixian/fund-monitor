import { PreciousMetalConfig } from "@/types/index";

export const GOLD_COLOR = '#FFD700';

export const TIME_INTERVAL_MAP = [30, 60, 120, 300];

export const TROY_OUNCE_TO_GRAM = 31.1035;

export const SINA_METAL_CODES: Record<string, string> = {
    XAU: 'hf_XAU',
    XAG: 'hf_XAG',
    XPT: 'hf_XPT',
    XPD: 'hf_XPD',
};

// 基金历史数据缓存过期时间（毫秒）
export const FUND_HISTORY_CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5分钟

export const PRECIOUS_METALS: PreciousMetalConfig[] = [
    { symbol: 'XAU', name: '伦敦金', nameEn: 'Gold', apiCode: 'XAU' },
    { symbol: 'XAG', name: '伦敦银', nameEn: 'Silver', apiCode: 'XAG' },
    { symbol: 'XPT', name: '铂金期货', nameEn: 'Platinum', apiCode: 'XPT' },
    { symbol: 'XPD', name: '钯金期货', nameEn: 'Palladium', apiCode: 'XPD' },
];

export const FUND_LIST_CACHE_KEY = 'fund_list_cache';

export const FUND_LIST_CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24小时

export const STORAGE_KEY = 'price-notification-target';
export const NOTIFICATION_SENT_KEY = 'price-notification-sent';

