export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    exchange: 'BIST' | 'NASDAQ' | 'CRYPTO'; // Added exchange
    history: number[]; // Simple sparkline data
}

const MOCK_STOCKS = [
    // BIST (Turkish Stocks)
    { symbol: "THYAO", name: "Türk Hava Yolları", basePrice: 280, exchange: 'BIST' },
    { symbol: "GARAN", name: "Garanti BBVA", basePrice: 65, exchange: 'BIST' },
    { symbol: "ASELS", name: "Aselsan", basePrice: 45, exchange: 'BIST' },
    { symbol: "EREGL", name: "Ereğli Demir Çelik", basePrice: 42, exchange: 'BIST' },
    { symbol: "KCHOL", name: "Koç Holding", basePrice: 140, exchange: 'BIST' },
    // NASDAQ
    { symbol: "AAPL", name: "Apple Inc.", basePrice: 150, exchange: 'NASDAQ' },
    { symbol: "GOOGL", name: "Alphabet Inc.", basePrice: 2800, exchange: 'NASDAQ' },
    { symbol: "AMZN", name: "Amazon.com Inc.", basePrice: 3400, exchange: 'NASDAQ' },
    { symbol: "MSFT", name: "Microsoft Corp.", basePrice: 300, exchange: 'NASDAQ' },
    { symbol: "TSLA", name: "Tesla, Inc.", basePrice: 700, exchange: 'NASDAQ' },
    // CRYPTO
    { symbol: "BTC-USD", name: "Bitcoin USD", basePrice: 45000, exchange: 'CRYPTO' },
    { symbol: "ETH-USD", name: "Ethereum USD", basePrice: 3000, exchange: 'CRYPTO' },
];

function generateRandomStockData(base: { symbol: string; name: string; basePrice: number; exchange: string }): Stock {
    const variation = (Math.random() - 0.5) * 5; // +/- 2.5% or dollars
    const price = base.basePrice + variation;
    const change = variation;
    const changePercent = (change / base.basePrice) * 100;

    // Generate 20 point history
    const history = Array.from({ length: 20 }, () => base.basePrice + (Math.random() - 0.5) * 10);

    return {
        symbol: base.symbol,
        name: base.name,
        price: parseFloat(price.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000),
        exchange: base.exchange as 'BIST' | 'NASDAQ' | 'CRYPTO',
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

        const basePrice = MOCK_STOCKS.find(s => s.symbol === symbol)?.basePrice || 100;
        let points = 20;
        let volatility = 0.02; // 2%

        switch (range) {
            case '5M': points = 10; volatility = 0.005; break;
            case '1H': points = 24; volatility = 0.01; break;
            case '1D': points = 48; volatility = 0.02; break; // Every 30 mins
            case '1W': points = 7; volatility = 0.05; break;
            case '1M': points = 30; volatility = 0.08; break;
            case '1Y': points = 52; volatility = 0.20; break; // Weekly
            case '5Y': points = 60; volatility = 0.40; break;
            default: points = 20; volatility = 0.05;
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
    }
};
