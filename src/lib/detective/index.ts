import yahooFinance from 'yahoo-finance2';
import { unstable_cache } from 'next/cache';

export interface StockData {
    symbol: string;
    price: number;
    changePercent: number;
    volume: number;
    avgVolume: number;
    rsi: number;
    volatility: number; // New field
    riskScore: number;
    riskReasons: string[];
    history: any[];
}

// Partial interface for Yahoo Finance Quote result
interface YahooQuote {
    regularMarketPrice?: number;
    regularMarketVolume?: number;
    regularMarketPreviousClose?: number;
    trailingPE?: number;
    symbol: string;
}

export class StockDetective {

    private watchlist = [
        'DAPGM.IS', 'EUREN.IS', 'IZENR.IS', 'USAK.IS', 'TERA.IS', 'KIMMR.IS',
        'SASA.IS', 'HEKTS.IS', 'THYAO.IS', 'GARAN.IS', 'ODAS.IS', 'CANTE.IS'
    ];

    constructor() { }

    // cache the analysis for 5 minutes (300 seconds)
    // This drastically reduces API calls and improves page load speed
    getWatchlistAnalysis = unstable_cache(
        async () => {
            const results = await Promise.all(this.watchlist.map(s => this.analyzeStock(s)));
            return results.filter(r => r !== null) as StockData[];
        },
        ['detective-watchlist-analysis'],
        { revalidate: 300, tags: ['detective'] }
    );

    async analyzeStock(symbol: string): Promise<StockData | null> {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 60); // Last 60 days

            // Helper for safe fetching
            const safeHistory = async () => {
                try {
                    return await yahooFinance.historical(symbol, {
                        period1: startDate.toISOString().split('T')[0],
                        interval: '1d',
                    });
                } catch (e) {
                    return null;
                }
            };

            const safeQuote = async () => {
                try {
                    return await yahooFinance.quote(symbol);
                } catch (e) {
                    return null;
                }
            };

            // Parallel fetch
            const [historyData, quoteResult] = await Promise.all([
                safeHistory(),
                safeQuote()
            ]);

            const history = historyData as unknown as any[];

            if (!history || !Array.isArray(history) || history.length < 20) {
                return null;
            }

            const quote = quoteResult as unknown as YahooQuote;
            if (!quote) return null;

            const closePrices = history.map(h => h.close);
            const volumes = history.map(h => h.volume);

            const currentPrice = quote.regularMarketPrice || closePrices[closePrices.length - 1];
            const currentVolume = quote.regularMarketVolume || volumes[volumes.length - 1];
            const prevClose = quote.regularMarketPreviousClose || closePrices[closePrices.length - 2];
            const changePercent = prevClose ? ((currentPrice - prevClose) / prevClose) * 100 : 0;

            const rsi = this.calculateRSI(closePrices);
            const avgVolume = this.calculateAvgVolume(volumes);
            const volatility = this.calculateVolatility(closePrices);
            const sma50 = this.calculateSMA(closePrices, 50);
            const sma200 = this.calculateSMA(closePrices, 200);
            const bollinger = this.calculateBollingerBands(closePrices, 20);

            const { score, reasons } = this.calculateRiskScore({
                price: currentPrice,
                volume: currentVolume,
                avgVolume,
                rsi,
                changePercent,
                volatility,
                peRatio: quote.trailingPE,
                sma50,
                sma200,
                bollingerUpper: bollinger.upper,
                bollingerLower: bollinger.lower
            });

            return {
                symbol,
                price: currentPrice,
                changePercent,
                volume: currentVolume,
                avgVolume,
                rsi,
                volatility,
                riskScore: score,
                riskReasons: reasons,
                history: history.slice(-5) // Return only last 5 for brevity/preview if needed
            };

        } catch (error) {
            console.error(`Error analyzing ${symbol}:`, error);
            return null;
        }
    }

    private calculateRSI(prices: number[], period: number = 14): number {
        if (prices.length < period + 1) return 50;

        let gains = 0, losses = 0;

        for (let i = prices.length - period; i < prices.length; i++) {
            const diff = prices[i] - prices[i - 1];
            if (diff >= 0) gains += diff;
            else losses += Math.abs(diff);
        }

        if (losses === 0) return 100;

        const rs = (gains / period) / (losses / period);
        return 100 - (100 / (1 + rs));
    }

    private calculateAvgVolume(volumes: number[], period: number = 20): number {
        const slice = volumes.slice(-period);
        return slice.reduce((a, b) => a + b, 0) / slice.length;
    }

    private calculateVolatility(prices: number[], period: number = 20): number {
        if (prices.length < 2) return 0;
        const returns = [];
        for (let i = 1; i < prices.length; i++) {
            returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
        }
        const slice = returns.slice(-period);
        const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
        const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / slice.length;
        return Math.sqrt(variance) * 100;
    }

    private calculateSMA(prices: number[], period: number): number | null {
        if (prices.length < period) return null;
        const slice = prices.slice(-period);
        return slice.reduce((a, b) => a + b, 0) / period;
    }

    private calculateBollingerBands(prices: number[], period: number = 20): { upper: number, lower: number, middle: number } {
        if (prices.length < period) return { upper: 0, lower: 0, middle: 0 };
        const sma = this.calculateSMA(prices, period) || 0;
        const slice = prices.slice(-period);
        const variance = slice.reduce((a, b) => a + Math.pow(b - sma, 2), 0) / period;
        const stdDev = Math.sqrt(variance);
        return { middle: sma, upper: sma + (2 * stdDev), lower: sma - (2 * stdDev) };
    }

    private calculateRiskScore(data: {
        price: number;
        volume: number;
        avgVolume: number;
        rsi: number;
        changePercent: number;
        volatility: number;
        peRatio?: number;
        sma50?: number | null;
        sma200?: number | null;
        bollingerUpper: number;
        bollingerLower: number;
    }): { score: number; reasons: string[] } {
        let score = 0;
        const reasons: string[] = [];

        // 1. Volume Anomaly
        const volumeRatio = data.avgVolume > 0 ? data.volume / data.avgVolume : 0;
        if (volumeRatio > 3.0) {
            score += 25;
            reasons.push("ANORMAL HACİM (Ortalamanın 3 katı)");
        } else if (volumeRatio > 2.0) {
            score += 10;
            reasons.push("Yüksek Hacim Artışı");
        }

        // 2. RSI Extremes
        if (data.rsi > 85) {
            score += 25;
            reasons.push("RSI KRİTİK (>85 Aşırı Alım)");
        } else if (data.rsi > 75) {
            score += 15;
            reasons.push("RSI Yüksek");
        } else if (data.rsi < 20) {
            reasons.push("RSI Dip (Aşırı Satım Potansiyeli)"); // Positive signal usually, but worth noting
        }

        // 3. Volatility Spike
        if (data.volatility > 5) {
            score += 15;
            reasons.push("YÜKSEK VOLATİLİTE (Sert Fiyat Hareketleri)");
        }

        // 4. Bollinger Band Breakout
        if (data.bollingerUpper > 0 && data.price > data.bollingerUpper * 1.02) {
            score += 20;
            reasons.push("BOLLINGER PATLAMASI (Üst Bandın Üzerinde)");
        }

        // 5. Trend Deviation (Pump in Downtrend)
        if (data.sma200 && data.price < data.sma200 && data.changePercent > 5) {
            score += 15;
            reasons.push("DÜŞÜŞ TRENDİNDE TEPKİ (Ölü Kedi Sıçraması Riski)");
        }

        // 6. Fundamental Mismatch (Zombie Company)
        if ((!data.peRatio || data.peRatio < 0 || data.peRatio > 50) && data.changePercent > 5) {
            score += 30;
            reasons.push("TEMEL UYUMSUZLUK (Zarar Eden Şirkette Ralli)");
        }

        return { score: Math.min(score, 100), reasons };
    }
}
