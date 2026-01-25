import { Stock } from './api';

export interface VigilReport {
    score: number;
    decision: 'BUY' | 'SELL' | 'NEUTRAL';
    messages: string[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
    socialSentiment?: {
        score: number;
        summary: string;
    };
}

// Mock Social Signal for synchronous logic (async fetching would require refactor of hook)
// In a real app, this analysis should be async or data passed in.
import { SocialMediaService } from './socialMediaService';

export const VigilUtils = {
    analyzeGlobalMarkets: (stocks: Stock[]): VigilReport => {
        let score = 0;
        const messages: string[] = [];
        let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME' = 'MEDIUM';

        // Helper to find stock
        const getStock = (symbol: string) => stocks.find(s => s.symbol === symbol);

        const tur = getStock('TUR');
        const spy = getStock('SPY');
        const uup = getStock('UUP'); // Dollar Index Proxy
        const vix = getStock('VIX'); // VIX usually generic or specific symbol
        const nvda = getStock('NVDA');

        // 1. TUR (Turkey ETF) Analysis
        if (tur) {
            if (tur.changePercent < -1.5) {
                score -= 2;
                messages.push(`⚠️ TEHLİKE: Türkiye ETF'si ($TUR) %${tur.changePercent.toFixed(2)} düştü. Açılışta satış baskısı olabilir.`);
            } else if (tur.changePercent > 1.5) {
                score += 2;
                messages.push(`🚀 FIRSAT: Türkiye ETF'si ($TUR) %${tur.changePercent.toFixed(2)} yükseldi. Pozitif açılış bekleniyor.`);
            } else {
                messages.push(`ℹ️ $TUR nötr seyrediyor (%${tur.changePercent.toFixed(2)}).`);
            }
        }

        // 2. VIX (Volatility/Fear) Analysis
        // Note: VIX might need special handling if it's not in the standard stock list or if value is index points
        // Assuming we treat it as a stock with price = index value
        if (vix) {
            if (vix.price > 20) {
                score -= 1;
                riskLevel = 'HIGH';
                messages.push(`😨 KORKU: VIX Endeksi ${vix.price.toFixed(1)} seviyesinde! Global risk yüksek, defansif ol.`);
            }
        }

        // 3. Dollar Index (UUP) Analysis
        if (uup) {
            // UUP rising means Dollar getting stronger -> Bad for Emerging Markets
            if (uup.changePercent > 0.5) {
                score -= 1;
                messages.push(`💵 Dolar Güçleniyor ($UUP %${uup.changePercent.toFixed(2)}). Yabancı çıkışı riski.`);
            } else if (uup.changePercent < -0.3) {
                score += 1;
                messages.push(`📉 Dolar Gevşiyor ($UUP %${uup.changePercent.toFixed(2)}). Gelişmekte olan piyasalar için olumlu.`);
            }
        }

        // 4. NVDA (Risk Appetite) Analysis
        if (nvda) {
            if (nvda.changePercent > 1) {
                score += 0.5;
                messages.push(`🤖 Risk iştahı yüksek (NVDA +%${nvda.changePercent.toFixed(2)}).`);
            } else if (nvda.changePercent < -2) {
                score -= 0.5;
                messages.push(`⚠️ Teknoloji satış yiyor (NVDA %${nvda.changePercent.toFixed(2)}).`);
            }
        }
    }

        // 5. Social Media Sentiment Injection (Mock/Reference)
        // Since this function is sync, we calculate based on existing market data state
        // In V2 this will come from the async service
        
        let socialScore = 0;
    let socialSummary = "";

    // Simple logic for now: If heavily bearish market, assume Social is Panic
    if(tur && tur.changePercent < -2) {
        socialScore = -0.5;
socialSummary = "Social Media: Panic selling trending (#crash)";
messages.push(`🗣️ Sosyal Medya: "Satış" konuşuluyor. Panik havası hakim.`);
        } else if (tur && tur.changePercent > 1.5) {
    socialScore = 0.5;
    socialSummary = "Social Media: Euphoria (#bullrun)";
    messages.push(`🗣️ Sosyal Medya: "Ralli" beklentisi yüksek.`);
}

score += socialScore;

// Final Decision
let decision: 'BUY' | 'SELL' | 'NEUTRAL' = 'NEUTRAL';
if (score >= 2) decision = 'BUY';
else if (score <= -2) decision = 'SELL';

if (score <= -3) riskLevel = 'EXTREME';
if (score >= 2 && riskLevel !== 'HIGH') riskLevel = 'LOW';

return {
    score,
    decision,
    messages,
    riskLevel,
    socialSentiment: {
        score: socialScore,
        summary: socialSummary
    }
};
    }
};
