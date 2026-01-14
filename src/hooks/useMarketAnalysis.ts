import { useMemo, useState } from 'react';
import { useMarketStore } from "@/store/marketStore";
import { AnalysisUtils } from "@/lib/analysisUtils";
import { Stock } from "@/lib/api";

type SortKey = 'symbol' | 'price' | 'riskScore' | 'trend';
export type SortDirection = 'asc' | 'desc';

interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}

export const useMarketAnalysis = () => {
    const { stocks } = useMarketStore();
    const [selectedExchange, setSelectedExchange] = useState<string>('ALL');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'riskScore', direction: 'desc' });

    // 1. Data Processing (Running AI Models) - Only runs when stocks update or exchange changes
    const analyzedMarket = useMemo(() => {
        if (stocks.length === 0) return [];

        let filtered = stocks;
        if (selectedExchange !== 'ALL') {
            filtered = stocks.filter(s => s.exchange === selectedExchange);
        }

        return filtered.map(stock => {
            const analysis = AnalysisUtils.analyzeStock(stock.history, stock.volume);
            const { trend, confidence } = AnalysisUtils.calculateTrend(stock.history, stock.symbol);
            return {
                ...stock,
                analysis,
                trend: trend as 'Bullish' | 'Bearish', // Strong typing
                confidence
            };
        });
    }, [stocks, selectedExchange]);

    // 2. Sorting Logic - Runs when Sort Config changes (very fast)
    const sortedMarket = useMemo(() => {
        // Create a shallow copy to avoid mutating the original array during sort
        const data = [...analyzedMarket];

        return data.sort((a, b) => {
            let valA: string | number = '';
            let valB: string | number = '';

            switch (sortConfig.key) {
                case 'symbol':
                    valA = a.symbol;
                    valB = b.symbol;
                    break;
                case 'price':
                    valA = a.price;
                    valB = b.price;
                    break;
                case 'riskScore':
                    valA = a.analysis.riskScore;
                    valB = b.analysis.riskScore;
                    break;
                case 'trend':
                    // Weighted Score: Direction (Bullish=1, Bearish=0) * 1000 + Confidence
                    // This groups Bullish items first, then sorts by confidence
                    valA = (a.trend === 'Bullish' ? 1 : 0) * 1000 + a.confidence;
                    valB = (b.trend === 'Bullish' ? 1 : 0) * 1000 + b.confidence;
                    break;
            }

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [analyzedMarket, sortConfig]);

    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key: key as SortKey,
            direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    return {
        sortedMarket,
        analyzedCount: analyzedMarket.length,
        selectedExchange,
        setSelectedExchange,
        sortConfig,
        handleSort
    };
};
