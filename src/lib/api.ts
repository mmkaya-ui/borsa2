export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    exchange: 'BIST' | 'NASDAQ' | 'CRYPTO'; // Added exchange
    currency: 'TRY' | 'USD'; // Added currency
    history: number[]; // Simple sparkline data
}

const MOCK_STOCKS: Stock[] = [
    // BIST (Istanbul Stock Exchange)
    { symbol: "THYAO", name: "Türk Hava Yolları", basePrice: 280, exchange: 'BIST' } as any,
    { symbol: "GARAN", name: "Garanti BBVA", basePrice: 65, exchange: 'BIST' } as any,
    { symbol: "ASELS", name: "Aselsan", basePrice: 45, exchange: 'BIST' } as any,
    { symbol: "EREGL", name: "Ereğli Demir Çelik", basePrice: 42, exchange: 'BIST' } as any,
    { symbol: "KCHOL", name: "Koç Holding", basePrice: 140, exchange: 'BIST' } as any,
    { symbol: "SISE", name: "Şişecam", basePrice: 48, exchange: 'BIST' } as any,
    { symbol: "AKBNK", name: "Akbank", basePrice: 38, exchange: 'BIST' } as any,
    { symbol: "BIMAS", name: "BİM Mağazalar", basePrice: 350, exchange: 'BIST' } as any,
    { symbol: "TUPRS", name: "Tüpraş", basePrice: 160, exchange: 'BIST' } as any,
    { symbol: "SASA", name: "SASA Polyester", basePrice: 38, exchange: 'BIST' } as any,
    { symbol: "HEKTS", name: "Hektaş", basePrice: 22, exchange: 'BIST' } as any,
    { symbol: "PETKM", name: "Petkim", basePrice: 20, exchange: 'BIST' } as any,
    { symbol: "TOASO", name: "Tofaş Oto", basePrice: 240, exchange: 'BIST' } as any,
    { symbol: "FROTO", name: "Ford Otosan", basePrice: 890, exchange: 'BIST' } as any,
    { symbol: "KONTR", name: "Kontrolmatik", basePrice: 210, exchange: 'BIST' } as any,

    // NASDAQ / NYSE (US Tech & Blue Chips)
    { symbol: "AAPL", name: "Apple Inc.", basePrice: 175, exchange: 'NASDAQ' } as any,
    { symbol: "GOOGL", name: "Alphabet Inc.", basePrice: 140, exchange: 'NASDAQ' } as any,
    { symbol: "MSFT", name: "Microsoft Corp.", basePrice: 380, exchange: 'NASDAQ' } as any,
    { symbol: "AMZN", name: "Amazon.com", basePrice: 155, exchange: 'NASDAQ' } as any,
    { symbol: "TSLA", name: "Tesla, Inc.", basePrice: 220, exchange: 'NASDAQ' } as any,
    { symbol: "NVDA", name: "NVIDIA Corp.", basePrice: 600, exchange: 'NASDAQ' } as any,
    { symbol: "META", name: "Meta Platforms", basePrice: 390, exchange: 'NASDAQ' } as any,
    { symbol: "NFLX", name: "Netflix", basePrice: 480, exchange: 'NASDAQ' } as any,
    { symbol: "AMD", name: "AMD", basePrice: 160, exchange: 'NASDAQ' } as any,
    { symbol: "INTC", name: "Intel Corp.", basePrice: 45, exchange: 'NASDAQ' } as any,

    // CRYPTO
    { symbol: "BTC-USD", name: "Bitcoin", basePrice: 52000, exchange: 'CRYPTO' } as any,
    { symbol: "ETH-USD", name: "Ethereum", basePrice: 2800, exchange: 'CRYPTO' } as any,
    { symbol: "SOL-USD", name: "Solana", basePrice: 110, exchange: 'CRYPTO' } as any,
    { symbol: "XRP-USD", name: "Ripple", basePrice: 0.55, exchange: 'CRYPTO' } as any,
    { symbol: "AVAX-USD", name: "Avalanche", basePrice: 36, exchange: 'CRYPTO' } as any,
    { symbol: "DOGE-USD", name: "Dogecoin", basePrice: 0.08, exchange: 'CRYPTO' } as any,
    { symbol: "BNB-USD", name: "Binance Coin", basePrice: 350, exchange: 'CRYPTO' } as any,
    { symbol: "ADA-USD", name: "Cardano", basePrice: 0.50, exchange: 'CRYPTO' } as any,
    { symbol: "DOT-USD", name: "Polkadot", basePrice: 7.20, exchange: 'CRYPTO' } as any,
    { symbol: "MATIC-USD", name: "Polygon", basePrice: 0.85, exchange: 'CRYPTO' } as any,
    { symbol: "LINK-USD", name: "Chainlink", basePrice: 18, exchange: 'CRYPTO' } as any,

    // BIST Extension
    { symbol: "EKGYO", name: "Emlak Konut", basePrice: 10, exchange: 'BIST' } as any,
    { symbol: "VESTL", name: "Vestel", basePrice: 85, exchange: 'BIST' } as any,
    { symbol: "ARCLK", name: "Arçelik", basePrice: 160, exchange: 'BIST' } as any,
    { symbol: "TCELL", name: "Turkcell", basePrice: 70, exchange: 'BIST' } as any,
    { symbol: "TTKOM", name: "Türk Telekom", basePrice: 40, exchange: 'BIST' } as any,
    { symbol: "YKBNK", name: "Yapı Kredi", basePrice: 28, exchange: 'BIST' } as any,
    { symbol: "ISCTR", name: "İş Bankası (C)", basePrice: 32, exchange: 'BIST' } as any,
    { symbol: "SAHOL", name: "Sabancı Holding", basePrice: 90, exchange: 'BIST' } as any,
    { symbol: "ENKAI", name: "Enka İnşaat", basePrice: 45, exchange: 'BIST' } as any,
    { symbol: "ALARK", name: "Alarko Holding", basePrice: 120, exchange: 'BIST' } as any,
    { symbol: "PGSUS", name: "Pegasus", basePrice: 850, exchange: 'BIST' } as any,
    { symbol: "MGROS", name: "Migros", basePrice: 480, exchange: 'BIST' } as any,
    { symbol: "ODAS", name: "Odaş Elektrik", basePrice: 11, exchange: 'BIST' } as any,
    { symbol: "KOZAL", name: "Koza Altın", basePrice: 24, exchange: 'BIST' } as any,

    // NASDAQ Extension
    { symbol: "CRM", name: "Salesforce", basePrice: 280, exchange: 'NASDAQ' } as any,
    { symbol: "ADBE", name: "Adobe", basePrice: 550, exchange: 'NASDAQ' } as any,
    { symbol: "ORCL", name: "Oracle", basePrice: 115, exchange: 'NASDAQ' } as any,
    { symbol: "CSCO", name: "Cisco", basePrice: 48, exchange: 'NASDAQ' } as any,
    { symbol: "QCOM", name: "Qualcomm", basePrice: 155, exchange: 'NASDAQ' } as any,
];

function generateRandomStockData(base: Stock | any): Stock {
    const basePrice = base.basePrice || 100;
    // Fix: Variation should be proportional to price
    // Inject artificial volatility for specific "Risky" demo stocks
    const isVolatile = ['DOGE-USD', 'SASA', 'XRP-USD'].includes(base.symbol);
    const volatilityFactor = isVolatile ? 0.15 : 0.05; // 15% for risky, 5% for normal

    const percentVariation = (Math.random() - 0.5) * volatilityFactor;
    const variation = basePrice * percentVariation;

    const price = Math.max(0.01, basePrice + variation);
    const change = variation; // This was missing correct calc before
    const changePercent = percentVariation * 100;

    // Generate 20 point history with proportional random walk
    const history = [price];
    for (let i = 1; i < 20; i++) {
        const prev = history[i - 1];
        // Volatile stocks move more aggressively
        const move = prev * (Math.random() - 0.5) * (isVolatile ? 0.08 : 0.02);
        history.push(Math.max(0.01, prev + move));
    }

    return {
        symbol: base.symbol,
        name: base.name,
        price: parseFloat(price.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000),
        exchange: base.exchange as 'BIST' | 'NASDAQ' | 'CRYPTO',
        currency: base.exchange === 'BIST' ? 'TRY' : 'USD', // Helper
        history
    };
}

export const MarketAPI = {
    getMarketOverview: async (): Promise<Stock[]> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_STOCKS.map(generateRandomStockData);
    },

    // Simulate live updates
    subscribeToTicker: (callback: (data: Stock[]) => void) => {
        const interval = setInterval(() => {
            const updates = MOCK_STOCKS.map(generateRandomStockData);
            callback(updates);
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    },

    getHistory: async (symbol: string, range: string): Promise<number[]> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Fix: Use index access or check for existence
        const stock = MOCK_STOCKS.find(s => s.symbol === symbol);
        const basePrice = stock ? (stock as any).basePrice : 100;

        // Ensure consistency with "Scanner" by applying same volatility rules
        const isVolatile = ['DOGE-USD', 'SASA', 'XRP-USD'].includes(symbol);

        let points = 20;
        let volatility = isVolatile ? 0.15 : 0.02; // Default 2%, but 15% for risky assets matching scanner

        // Scale volatility based on range, but keep relative riskiness
        const volMultiplier = isVolatile ? 4 : 1; // Risky assets are 4x more volatile

        switch (range) {
            case '5M': points = 10; volatility = 0.005 * volMultiplier; break;
            case '1H': points = 24; volatility = 0.01 * volMultiplier; break;
            case '1D': points = 48; volatility = 0.02 * volMultiplier; break;
            case '1W': points = 7; volatility = 0.05 * volMultiplier; break;
            case '1M': points = 30; volatility = 0.08 * volMultiplier; break;
            case '1Y': points = 52; volatility = 0.20 * volMultiplier; break;
            case '5Y': points = 60; volatility = 0.40 * volMultiplier; break;
            default: points = 20; volatility = 0.05 * volMultiplier;
        }

        const history: number[] = [];
        let currentPrice = basePrice;

        for (let i = 0; i < points; i++) {
            // Random walk
            const change = currentPrice * (Math.random() - 0.5) * volatility;
            currentPrice += change;
            history.push(currentPrice);
        }

        return history;
    },

    searchStocks: async (query: string): Promise<any[]> => {
        await new Promise(resolve => setTimeout(resolve, 200));
        const lowerQuery = query.toLowerCase();

        if (!query) {
            // Return a mix of stocks (e.g., BIST, NASDAQ, CRYPTO) as default
            const indices = [0, 1, 2, 15, 16, 17, 25, 26, 27]; // Balanced selection
            return indices.map(i => MOCK_STOCKS[i]).filter(Boolean).map(generateRandomStockData);
        }

        return MOCK_STOCKS.filter(s =>
            s.symbol.toLowerCase().includes(lowerQuery) ||
            s.name.toLowerCase().includes(lowerQuery)
        ).map(generateRandomStockData);
    }
};
