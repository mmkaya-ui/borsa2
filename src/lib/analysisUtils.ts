export interface AnalysisResult {
    riskScore: number; // 0-100
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    hints: string[];
    rsi: number;
    volatility: number;
}

export const AnalysisUtils = {
    calculateRSI: (data: number[], period: number = 14): number => {
        if (data.length < period + 1) return 50;

        let gains = 0;
        let losses = 0;

        for (let i = 1; i <= period; i++) {
            const diff = data[data.length - i] - data[data.length - i - 1];
            if (diff >= 0) gains += diff;
            else losses -= diff;
        }

        if (losses === 0) return 100;

        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    },

    calculateVolatility: (data: number[]): number => {
        if (data.length < 2) return 0;
        const n = data.length;
        const mean = data.reduce((a, b) => a + b, 0) / n;
        const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
        return Math.sqrt(variance);
    },


    calculateSMA: (data: number[], period: number): number | null => {
        if (data.length < period) return null;
        const slice = data.slice(-period);
        return slice.reduce((a, b) => a + b, 0) / period;
    },

    calculateBollingerBands: (data: number[], period: number = 20) => {
        if (data.length < period) return null;
        const sma = AnalysisUtils.calculateSMA(data, period);
        if (sma === null) return null;

        const slice = data.slice(-period);
        const variance = slice.reduce((a, b) => a + Math.pow(b - sma, 2), 0) / period;
        const stdDev = Math.sqrt(variance);

        return { upper: sma + (2 * stdDev), lower: sma - (2 * stdDev) };
    },

    analyzeStock: (data: number[], volume: number): AnalysisResult => {
        const rsi = AnalysisUtils.calculateRSI(data);
        const volatility = AnalysisUtils.calculateVolatility(data);
        const hints: string[] = [];
        let riskScore = 20; // Base risk

        // RSI Analysis
        if (rsi > 85) {
            riskScore += 30;
            hints.push('rsi_high'); // Critical
        } else if (rsi > 70) {
            riskScore += 15;
            hints.push('rsi_high');
        } else if (rsi < 25) {
            hints.push('rsi_low');
        }

        // Volatility Check
        let maxMove = 0;
        let totalMove = 0;
        for (let i = 1; i < data.length; i++) {
            const move = Math.abs((data[i] - data[i - 1]) / data[i - 1]);
            totalMove += move;
            if (move > maxMove) maxMove = move;
        }
        const avgMove = totalMove / (data.length - 1 || 1);

        if (avgMove > 0.03 || maxMove > 0.07) { // 7% single day move is huge
            riskScore += 30;
            hints.push('volatility_extreme');
        }

        // Bollinger Bands
        const bb = AnalysisUtils.calculateBollingerBands(data, 20);
        const lastPrice = data[data.length - 1];
        if (bb && lastPrice > bb.upper * 1.01) {
            riskScore += 25;
            hints.push('pump_risk'); // Bollinger Breakout
        }

        // Pump Pattern
        if (data.length > 5) {
            const p1 = data[data.length - 1];
            const p5 = data[data.length - 5];
            if (p1 > p5 * 1.20) { // 20% gain in 5 candles (e.g. 5 days)
                riskScore += 25;
                hints.push('pump_risk');
            }
        }

        // Volume logic acts as multiplier if we had volume history

        return {
            riskScore: Math.min(riskScore, 100),
            riskLevel: riskScore > 75 ? 'HIGH' : riskScore > 40 ? 'MEDIUM' : 'LOW',
            hints: Array.from(new Set(hints)), // Dedup
            rsi,
            volatility
        };
    },
    // ... rest of file (hashString, calculateTrend) ...
    hashString: (str: string): number => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    },

    calculateTrend: (history: number[], symbol?: string): { trend: 'Bullish' | 'Bearish', confidence: number } => {
        if (history.length < 2) return { trend: 'Bullish', confidence: 0 };
        const trend = history[history.length - 1] > history[0] ? 'Bullish' : 'Bearish';

        // SMA Trend Confirmation
        const sma50 = AnalysisUtils.calculateSMA(history, 50);
        const lastPrice = history[history.length - 1];

        let confidenceOffset = 0;
        if (sma50) {
            // Trend is stronger if price is above SMA50
            if (trend === 'Bullish' && lastPrice > sma50) confidenceOffset = 10;
            if (trend === 'Bearish' && lastPrice < sma50) confidenceOffset = 10;
        }

        let seed = 0;
        if (symbol) {
            seed = AnalysisUtils.hashString(symbol);
        } else {
            seed = Math.floor(history[history.length - 1] * 100);
        }

        const baseConfidence = (seed % 20) + 70; // 70-90% range
        const confidence = Math.min(baseConfidence + confidenceOffset, 99);

        return { trend, confidence };
    }
};

