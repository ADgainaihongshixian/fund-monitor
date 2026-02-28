export type PreciousMetalData = {
    symbol: string;
    name: string;
    nameEn: string;
    currentPrice: number;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    prevClosePrice: number;
    change: number;
    changePercent: number;
    lastUpdate: string;
    isRising: boolean;
    currency: 'USD' | 'CNY';
}

export interface PreciousMetalCardProps {
    metal: PreciousMetalData;
};

export interface PreciousMetalListProps {
    metals: PreciousMetalData[];
};