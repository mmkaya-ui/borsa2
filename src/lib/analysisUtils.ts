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

    analyzeStock: (data: number[], volume: number): AnalysisResult => {
        const rsi = AnalysisUtils.calculateRSI(data);
        const volatility = AnalysisUtils.calculateVolatility(data);
        const hints: string[] = [];
        let riskScore = 20; // Base risk

        // RSI Analysis
        if (rsi > 75) {
            riskScore += 30;
            hints.push('rsi_high'); // Overbought
        } else if (rsi < 25) {
            riskScore += 20;
            hints.push('rsi_low'); // Oversold
        }

        // Volatility Check (Simplified Z-Score proxy)
        const lastPrice = data[data.length - 1];
        const prevPrice = data[data.length - 2] || lastPrice;
        const percentChange = Math.abs((lastPrice - prevPrice) / prevPrice);

        if (percentChange > 0.02) { // >2% movement in one tick (Sensitive for demo)
            riskScore += 40;
            hints.push('volatility_extreme');
        }

        // Volume Check (Pseudo-logic since we don't have historical volume)
        if (volume > 50000000) { // Large cap / or Unusual volume simulation
            // hints.push('volume_unusual'); 
            // Intentionally skipped to avoid false positives in mock
        }

        // Pump & Dump Pattern (Three consecutive sharp rises)
        if (data.length > 3) {
            const p1 = data[data.length - 1];
            const p2 = data[data.length - 2];
            const p3 = data[data.length - 3];
            if (p1 > p2 * 1.02 && p2 > p3 * 1.02) {
                riskScore += 20;
                hints.push('pump_risk');
            }
        }

        return {
            riskScore: Math.min(riskScore, 100),
            riskLevel: riskScore > 70 ? 'HIGH' : riskScore > 40 ? 'MEDIUM' : 'LOW',
            hints,
            rsi,
            volatility
        };
    }
};
