
import yahooFinance from 'yahoo-finance2';

export interface StockData {
    symbol: string;
    price: number;
    changePercent: number;
    volume: number;
    avgVolume: number;
    rsi: number;
    riskScore: number;
    riskReasons: string[];
    history: any[]; // Simplified for now
}

export class StockDetective {

    // Default list of risky or popular stocks to monitor if user doesn't provide any
    // Including some from the document
    private watchlist = [
        'DAPGM.IS', 'EUREN.IS', 'IZENR.IS', 'USAK.IS', 'TERA.IS', 'KIMMR.IS',
        'SASA.IS', 'HEKTS.IS', 'THYAO.IS', 'GARAN.IS', 'ODAS.IS', 'CANTE.IS'
    ];

    constructor() { }

    async analyzeStock(symbol: string): Promise<StockData | null> {
        try {
            // Fetch historical data for RSI and Volume avg
            const queryOptions = { period1: '2023-01-01', interval: '1d' as const }; // '1d' needs to be cast to specific type usually, but let's try simple string first or check lib types if it fails
            // Using query directly usually gives strict types. 
            // Let's use historical to get array of candles.

            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 60); // Last 60 days

            const history = await yahooFinance.historical(symbol, {
                period1: startDate.toISOString().split('T')[0],
                interval: '1d',
            }) as unknown as any[];

            if (!history || history.length < 20) {
                return null;
            }

            const quote = await yahooFinance.quote(symbol) as any;

            const closePrices = history.map(h => h.close);
            const volumes = history.map(h => h.volume);

            const currentPrice = quote.regularMarketPrice || closePrices[closePrices.length - 1];
            const currentVolume = quote.regularMarketVolume || volumes[volumes.length - 1];
            const prevClose = quote.regularMarketPreviousClose || closePrices[closePrices.length - 2];
            const changePercent = ((currentPrice - prevClose) / prevClose) * 100;

            const rsi = this.calculateRSI(closePrices);
            const avgVolume = this.calculateAvgVolume(volumes);

            const { score, reasons } = this.calculateRiskScore({
                price: currentPrice,
                volume: currentVolume,
                avgVolume,
                rsi,
                changePercent,
                peRatio: quote.trailingPE
            });

            return {
                symbol,
                price: currentPrice,
                changePercent,
                volume: currentVolume,
                avgVolume,
                rsi,
                riskScore: score,
                riskReasons: reasons,
                history
            };

        } catch (error) {
            console.error(`Error analyzing ${symbol}:`, error);
            return null;
        }
    }

    private calculateRSI(prices: number[], period: number = 14): number {
        if (prices.length < period + 1) return 50;

        let gains = 0;
        let losses = 0;

        for (let i = prices.length - period; i < prices.length; i++) {
            const diff = prices[i] - prices[i - 1];
            if (diff >= 0) gains += diff;
            else losses += Math.abs(diff);
        }

        let avgGain = gains / period;
        let avgLoss = losses / period;

        // Simple RSI smoothing could be added here, but standard avg is okay for estimation
        if (avgLoss === 0) return 100;

        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    }

    private calculateAvgVolume(volumes: number[], period: number = 20): number {
        const slice = volumes.slice(-period);
        const sum = slice.reduce((a, b) => a + b, 0);
        return sum / slice.length;
    }

    private calculateRiskScore(data: {
        price: number;
        volume: number;
        avgVolume: number;
        rsi: number;
        changePercent: number;
        peRatio?: number;
    }): { score: number; reasons: string[] } {
        let score = 0;
        const reasons: string[] = [];

        // 1. Volume Anomaly (Pump Signal)
        const volumeRatio = data.avgVolume > 0 ? data.volume / data.avgVolume : 0;
        if (volumeRatio > 3.0) {
            score += 25;
            reasons.push("ANORMAL HACİM (Olası Operasyon Hazırlığı)");
        } else if (volumeRatio > 2.0) {
            score += 10;
            reasons.push("Yüksek Hacim Artışı");
        }

        // 2. RSI Overbought
        if (data.rsi > 80) {
            score += 20;
            reasons.push("RSI AŞIRI YÜKSEK (Doygunluk)");
        } else if (data.rsi > 70) {
            score += 10;
            reasons.push("RSI Yüksek (70+)");
        }

        // 3. Price Spike (Momentum)
        if (data.changePercent > 9.0) { // Near ceiling
            score += 15;
            reasons.push("TAVAN HAREKETİ (Agresif Yükseliş)");
        }

        // 4. Fundamental/Technical Mismatch (Zombie Companies Rallying)
        // If PE is negative (loss making) or very high, but price is rallying
        if ((!data.peRatio || data.peRatio < 0 || data.peRatio > 50) && data.changePercent > 5) {
            score += 40;
            reasons.push("TEMEL-TEKNİK UYUMSUZLUĞU (Balon Riski)");
        }

        return { score: Math.min(score, 100), reasons };
    }

    async getWatchlistAnalysis() {
        const results = await Promise.all(this.watchlist.map(s => this.analyzeStock(s)));
        return results.filter(r => r !== null) as StockData[];
    }
}
