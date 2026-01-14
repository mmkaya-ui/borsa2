export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    exchange: 'BIST' | 'NASDAQ' | 'CRYPTO';
    currency: 'TRY' | 'USD';
    history: number[]; // Simple sparkline data
    open: number;
    prevClose: number;
    dayHigh: number;
    dayLow: number;
}

// Full lists of real tickers to populate the market scanner
const BIST_STOCKS = [
    { symbol: "THYAO", name: "Türk Hava Yolları", basePrice: 285 },
    { symbol: "GARAN", name: "Garanti BBVA", basePrice: 78 },
    { symbol: "ASELS", name: "Aselsan", basePrice: 52 },
    { symbol: "EREGL", name: "Ereğli Demir Çelik", basePrice: 42 },
    { symbol: "KCHOL", name: "Koç Holding", basePrice: 175 },
    { symbol: "SISE", name: "Şişecam", basePrice: 50 },
    { symbol: "AKBNK", name: "Akbank", basePrice: 45 },
    { symbol: "BIMAS", name: "BİM Mağazalar", basePrice: 380 },
    { symbol: "TUPRS", name: "Tüpraş", basePrice: 170 },
    { symbol: "SASA", name: "SASA Polyester", basePrice: 39 },
    { symbol: "HEKTS", name: "Hektaş", basePrice: 16 },
    { symbol: "PETKM", name: "Petkim", basePrice: 21 },
    { symbol: "TOASO", name: "Tofaş Oto", basePrice: 260 },
    { symbol: "FROTO", name: "Ford Otosan", basePrice: 1050 },
    { symbol: "KONTR", name: "Kontrolmatik", basePrice: 215 },
    { symbol: "EKGYO", name: "Emlak Konut", basePrice: 11 },
    { symbol: "VESTL", name: "Vestel", basePrice: 92 },
    { symbol: "ARCLK", name: "Arçelik", basePrice: 165 },
    { symbol: "TCELL", name: "Turkcell", basePrice: 85 },
    { symbol: "TTKOM", name: "Türk Telekom", basePrice: 48 },
    { symbol: "YKBNK", name: "Yapı Kredi", basePrice: 32 },
    { symbol: "ISCTR", name: "İş Bankası (C)", basePrice: 36 },
    { symbol: "SAHOL", name: "Sabancı Holding", basePrice: 95 },
    { symbol: "ENKAI", name: "Enka İnşaat", basePrice: 46 },
    { symbol: "ALARK", name: "Alarko Holding", basePrice: 130 },
    { symbol: "PGSUS", name: "Pegasus", basePrice: 880 },
    { symbol: "MGROS", name: "Migros", basePrice: 510 },
    { symbol: "ODAS", name: "Odaş Elektrik", basePrice: 10 },
    { symbol: "KOZAL", name: "Koza Altın", basePrice: 23 },
    { symbol: "TAVHL", name: "TAV Havalimanları", basePrice: 180 },
    { symbol: "GUBRF", name: "Gübre Fabrikaları", basePrice: 160 },
    { symbol: "OTKAR", name: "Otokar", basePrice: 540 },
    { symbol: "TTRAK", name: "Türk Traktör", basePrice: 920 },
    { symbol: "DOHOL", name: "Doğan Holding", basePrice: 14 },
    { symbol: "ULKER", name: "Ülker Bisküvi", basePrice: 115 },
    { symbol: "SOKM", name: "Şok Marketler", basePrice: 65 },
    { symbol: "MAVI", name: "Mavi Giyim", basePrice: 140 },
    { symbol: "TKFEN", name: "Tekfen Holding", basePrice: 52 },
    { symbol: "AEFES", name: "Anadolu Efes", basePrice: 155 },
    { symbol: "AGHOL", name: "AG Anadolu Grubu", basePrice: 240 },
    { symbol: "AKSEN", name: "Aksa Enerji", basePrice: 42 },
    { symbol: "ALBRK", name: "Albaraka Türk", basePrice: 5.50 },
    { symbol: "ASUZU", name: "Anadolu Isuzu", basePrice: 210 },
    { symbol: "AYGAZ", name: "Aygaz", basePrice: 160 },
    { symbol: "BAGFS", name: "Bagfaş", basePrice: 28 },
    { symbol: "BERA", name: "Bera Holding", basePrice: 18 },
    { symbol: "BIZIM", name: "Bizim Toptan", basePrice: 42 },
    { symbol: "BIOEN", name: "Biotrend Enerji", basePrice: 22 },
    { symbol: "BRISA", name: "Brisa", basePrice: 110 },
    { symbol: "CANTE", name: "Çan2 Termik", basePrice: 19 },
    { symbol: "CCOLA", name: "Coca-Cola İçecek", basePrice: 620 },
    { symbol: "CEMTS", name: "Çemtaş", basePrice: 14 },
    { symbol: "CIMSA", name: "Çimsa", basePrice: 38 },
    { symbol: "DOAS", name: "Doğuş Otomotiv", basePrice: 290 },
    { symbol: "ECILC", name: "Eczacıbaşı İlaç", basePrice: 58 },
    { symbol: "EGEEN", name: "Ege Endüstri", basePrice: 15500 },
    { symbol: "ENJSA", name: "Enerjisa", basePrice: 62 },
    { symbol: "GLYHO", name: "Global Yatırım", basePrice: 13 },
    { symbol: "ZOREN", name: "Zorlu Enerji", basePrice: 5.80 },
    { symbol: "AKFGY", name: "Akfen GYO", basePrice: 2.30 },
    { symbol: "SKBNK", name: "Şekerbank", basePrice: 4.10 },
    { symbol: "HALKB", name: "Halkbank", basePrice: 16 },
    { symbol: "VAKBN", name: "Vakıfbank", basePrice: 18 },
    { symbol: "TSKB", name: "T.S.K.B.", basePrice: 8.50 },
    { symbol: "ISFIN", name: "İş Finans", basePrice: 15 },
    { symbol: "GSDHO", name: "GSD Holding", basePrice: 4.20 },
    { symbol: "IHLAS", name: "İhlas Holding", basePrice: 1.10 },
    { symbol: "METRO", name: "Metro Holding", basePrice: 2.50 },
    { symbol: "GOZDE", name: "Gözde Girişim", basePrice: 24 },
    { symbol: "VERUS", name: "Verusa Holding", basePrice: 185 },
    { symbol: "KORDS", name: "Kordsa", basePrice: 95 },
    { symbol: "AKSA", name: "Aksa", basePrice: 105 },
    { symbol: "SANKO", name: "Sanko Pazarlama", basePrice: 32 },
    { symbol: "TRGYO", name: "Torunlar GYO", basePrice: 38 },
    { symbol: "ISGYO", name: "İş GYO", basePrice: 18 },
    { symbol: "SNGYO", name: "Sinpaş GYO", basePrice: 4.80 },
    { symbol: "OZKGY", name: "Özak GYO", basePrice: 12 },
    { symbol: "DGNMO", name: "Doğanlar Mobilya", basePrice: 14 },
    { symbol: "KMPUR", name: "Kimteks Poliüretan", basePrice: 65 },
    { symbol: "QUAGR", name: "Qua Granite", basePrice: 4.50 },
    { symbol: "GWIND", name: "Galata Wind", basePrice: 28 },
    { symbol: "EUREN", name: "Europower Enerji", basePrice: 160 },
    { symbol: "ASTOR", name: "Astor Enerji", basePrice: 110 },
    { symbol: "ALFAS", name: "Alfa Solar Enerji", basePrice: 85 },
    { symbol: "SMART", name: "Smart Güneş", basePrice: 60 },
    { symbol: "GESAN", name: "Girişim Elektrik", basePrice: 70 },
    { symbol: "YEOTK", name: "Yeo Teknoloji", basePrice: 180 },
    { symbol: "MIATK", name: "Mia Teknoloji", basePrice: 45 },
    { symbol: "PENTA", name: "Penta Teknoloji", basePrice: 18 },
    { symbol: "LOGO", name: "Logo Yazılım", basePrice: 95 },
    { symbol: "ARDYZ", name: "ARD Bilişim", basePrice: 36 },
    { symbol: "VBTYZ", name: "VBT Yazılım", basePrice: 32 },
    { symbol: "FONET", name: "Fonet Bilgi", basePrice: 15 },
    { symbol: "LINK", name: "Link Bilgisayar", basePrice: 65 },
    { symbol: "KFEIN", name: "Kafein Yazılım", basePrice: 44 },
    { symbol: "ESEN", name: "Esenboğa Elektrik", basePrice: 17 }
];

const NASDAQ_STOCKS = [
    { symbol: "AAPL", name: "Apple Inc.", basePrice: 175 },
    { symbol: "GOOGL", name: "Alphabet Inc.", basePrice: 140 },
    { symbol: "MSFT", name: "Microsoft Corp.", basePrice: 410 },
    { symbol: "AMZN", name: "Amazon.com", basePrice: 175 },
    { symbol: "TSLA", name: "Tesla, Inc.", basePrice: 190 },
    { symbol: "NVDA", name: "NVIDIA Corp.", basePrice: 720 },
    { symbol: "META", name: "Meta Platforms", basePrice: 470 },
    { symbol: "NFLX", name: "Netflix", basePrice: 580 },
    { symbol: "AMD", name: "AMD", basePrice: 175 },
    { symbol: "INTC", name: "Intel Corp.", basePrice: 43 },
    { symbol: "CRM", name: "Salesforce", basePrice: 290 },
    { symbol: "ADBE", name: "Adobe", basePrice: 580 },
    { symbol: "ORCL", name: "Oracle", basePrice: 112 },
    { symbol: "CSCO", name: "Cisco", basePrice: 49 },
    { symbol: "QCOM", name: "Qualcomm", basePrice: 150 },
    { symbol: "JPM", name: "JPMorgan Chase", basePrice: 180 },
    { symbol: "V", name: "Visa Inc.", basePrice: 280 },
    { symbol: "JNJ", name: "Johnson & Johnson", basePrice: 160 },
    { symbol: "WMT", name: "Walmart", basePrice: 170 },
    { symbol: "PG", name: "Procter & Gamble", basePrice: 160 },
    { symbol: "UNH", name: "UnitedHealth", basePrice: 510 },
    { symbol: "MA", name: "Mastercard", basePrice: 460 },
    { symbol: "HD", name: "Home Depot", basePrice: 360 },
    { symbol: "CVX", name: "Chevron", basePrice: 155 },
    { symbol: "MRK", name: "Merck & Co.", basePrice: 125 },
    { symbol: "ABBV", name: "AbbVie", basePrice: 175 },
    { symbol: "KO", name: "Coca-Cola Co.", basePrice: 60 },
    { symbol: "PEP", name: "PepsiCo", basePrice: 168 },
    { symbol: "BAC", name: "Bank of America", basePrice: 34 },
    { symbol: "COST", name: "Costco", basePrice: 740 },
    { symbol: "MCD", name: "McDonald's", basePrice: 290 },
    { symbol: "ACN", name: "Accenture", basePrice: 360 },
    { symbol: "ABT", name: "Abbott Labs", basePrice: 115 },
    { symbol: "LIN", name: "Linde", basePrice: 430 },
    { symbol: "NKE", name: "Nike", basePrice: 105 },
    { symbol: "DIS", name: "Walt Disney", basePrice: 110 },
    { symbol: "CMCSA", name: "Comcast", basePrice: 42 },
    { symbol: "VZ", name: "Verizon", basePrice: 40 },
    { symbol: "T", name: "AT&T", basePrice: 17 },
    { symbol: "PFE", name: "Pfizer", basePrice: 27 },
    { symbol: "XOM", name: "Exxon Mobil", basePrice: 102 },
    { symbol: "LLY", name: "Eli Lilly", basePrice: 750 },
    { symbol: "AVGO", name: "Broadcom", basePrice: 1250 },
    { symbol: "TMUS", name: "T-Mobile US", basePrice: 165 },
    { symbol: "CSX", name: "CSX Corp", basePrice: 38 },
    { symbol: "HON", name: "Honeywell", basePrice: 200 },
    { symbol: "UNP", name: "Union Pacific", basePrice: 245 },
    { symbol: "LOW", name: "Lowe's", basePrice: 230 },
    { symbol: "SBUX", name: "Starbucks", basePrice: 95 },
    { symbol: "IBM", name: "IBM", basePrice: 185 },
    { symbol: "GS", name: "Goldman Sachs", basePrice: 385 },
    { symbol: "MS", name: "Morgan Stanley", basePrice: 85 },
    { symbol: "CAT", name: "Caterpillar", basePrice: 320 },
    { symbol: "DE", name: "Deere & Co", basePrice: 390 },
    { symbol: "GE", name: "General Electric", basePrice: 145 },
    { symbol: "MMM", name: "3M", basePrice: 92 },
    { symbol: "BA", name: "Boeing", basePrice: 205 },
    { symbol: "LMT", name: "Lockheed Martin", basePrice: 430 },
    { symbol: "RTX", name: "RTX Corp", basePrice: 90 },
    { symbol: "UPS", name: "UPS", basePrice: 150 },
    { symbol: "F", name: "Ford Motor", basePrice: 12 },
    { symbol: "GM", name: "General Motors", basePrice: 38 },
    { symbol: "HMC", name: "Honda Motor", basePrice: 35 },
    { symbol: "TM", name: "Toyota Motor", basePrice: 220 },
    { symbol: "SONY", name: "Sony", basePrice: 95 },
    { symbol: "SHOP", name: "Shopify", basePrice: 80 },
    { symbol: "SQ", name: "Block (Square)", basePrice: 70 },
    { symbol: "PYPL", name: "PayPal", basePrice: 60 },
    { symbol: "UBER", name: "Uber", basePrice: 75 },
    { symbol: "ABNB", name: "Airbnb", basePrice: 150 },
    { symbol: "BKNG", name: "Booking.com", basePrice: 3500 },
    { symbol: "MELI", name: "MercadoLibre", basePrice: 1750 },
    { symbol: "PANW", name: "Palo Alto", basePrice: 370 },
    { symbol: "SNOW", name: "Snowflake", basePrice: 230 },
    { symbol: "PLTR", name: "Palantir", basePrice: 24 },
    { symbol: "COIN", name: "Coinbase", basePrice: 160 },
    { symbol: "MSTR", name: "MicroStrategy", basePrice: 700 },
    { symbol: "MAR", name: "Marriott", basePrice: 240 },
    { symbol: "PLD", name: "Prologis", basePrice: 130 },
    { symbol: "AMT", name: "American Tower", basePrice: 195 },
    { symbol: "BLK", name: "BlackRock", basePrice: 800 },
    { symbol: "C", name: "Citigroup", basePrice: 55 },
    { symbol: "WFC", name: "Wells Fargo", basePrice: 50 },
    { symbol: "AXP", name: "American Express", basePrice: 210 },
    { symbol: "SPGI", name: "S&P Global", basePrice: 420 },
    { symbol: "MDLZ", name: "Mondelez", basePrice: 75 },
    { symbol: "MO", name: "Altria", basePrice: 40 },
    { symbol: "PM", name: "Philip Morris", basePrice: 90 },
    { symbol: "CL", name: "Colgate-Palmolive", basePrice: 85 },
    { symbol: "EL", name: "Estee Lauder", basePrice: 140 },
    { symbol: "NOC", name: "Northrop Grumman", basePrice: 460 },
    { symbol: "GD", name: "General Dynamics", basePrice: 270 }
];

const CRYPTO_STOCKS = [
    { symbol: "BTC-USD", name: "Bitcoin", basePrice: 52000 },
    { symbol: "ETH-USD", name: "Ethereum", basePrice: 2900 },
    { symbol: "USDT-USD", name: "Tether", basePrice: 1.00 },
    { symbol: "BNB-USD", name: "Binance Coin", basePrice: 380 },
    { symbol: "SOL-USD", name: "Solana", basePrice: 115 },
    { symbol: "XRP-USD", name: "Ripple", basePrice: 0.58 },
    { symbol: "USDC-USD", name: "USDC", basePrice: 1.00 },
    { symbol: "ADA-USD", name: "Cardano", basePrice: 0.62 },
    { symbol: "AVAX-USD", name: "Avalanche", basePrice: 38 },
    { symbol: "DOGE-USD", name: "Dogecoin", basePrice: 0.088 },
    { symbol: "TRX-USD", name: "TRON", basePrice: 0.13 },
    { symbol: "LINK-USD", name: "Chainlink", basePrice: 20 },
    { symbol: "DOT-USD", name: "Polkadot", basePrice: 8.20 },
    { symbol: "MATIC-USD", name: "Polygon", basePrice: 0.98 },
    { symbol: "TON-USD", name: "Toncoin", basePrice: 2.10 },
    { symbol: "SHIB-USD", name: "Shiba Inu", basePrice: 0.0000095 },
    { symbol: "LTC-USD", name: "Litecoin", basePrice: 72 },
    { symbol: "BCH-USD", name: "Bitcoin Cash", basePrice: 270 },
    { symbol: "UNI-USD", name: "Uniswap", basePrice: 7.50 },
    { symbol: "ICP-USD", name: "Internet Computer", basePrice: 13.50 },
    { symbol: "LEO-USD", name: "LEO Token", basePrice: 4.10 },
    { symbol: "DAI-USD", name: "Dai", basePrice: 1.00 },
    { symbol: "ETC-USD", name: "Ethereum Classic", basePrice: 26 },
    { symbol: "XMR-USD", name: "Monero", basePrice: 130 },
    { symbol: "XLM-USD", name: "Stellar", basePrice: 0.12 },
    { symbol: "OKB-USD", name: "OKB", basePrice: 50 },
    { symbol: "STX-USD", name: "Stacks", basePrice: 2.60 },
    { symbol: "ATOM-USD", name: "Cosmos", basePrice: 10.50 },
    { symbol: "FIL-USD", name: "Filecoin", basePrice: 7.80 },
    { symbol: "IMX-USD", name: "Immutable", basePrice: 3.20 },
    { symbol: "HBAR-USD", name: "Hedera", basePrice: 0.11 },
    { symbol: "KAS-USD", name: "Kaspa", basePrice: 0.17 },
    { symbol: "NEAR-USD", name: "NEAR Protocol", basePrice: 3.90 },
    { symbol: "VET-USD", name: "VeChain", basePrice: 0.045 },
    { symbol: "LDO-USD", name: "Lido DAO", basePrice: 3.10 },
    { symbol: "INJ-USD", name: "Injective", basePrice: 35 },
    { symbol: "APT-USD", name: "Aptos", basePrice: 9.50 },
    { symbol: "OP-USD", name: "Optimism", basePrice: 3.80 },
    { symbol: "GRT-USD", name: "The Graph", basePrice: 0.28 },
    { symbol: "RNDR-USD", name: "Render", basePrice: 7.50 },
    { symbol: "AAVE-USD", name: "Aave", basePrice: 95 },
    { symbol: "AR-USD", name: "Arweave", basePrice: 14 },
    { symbol: "ALGO-USD", name: "Algorand", basePrice: 0.19 },
    { symbol: "FTM-USD", name: "Fantom", basePrice: 0.42 },
    { symbol: "QNT-USD", name: "Quant", basePrice: 115 },
    { symbol: "FLOW-USD", name: "Flow", basePrice: 1.10 },
    { symbol: "SNX-USD", name: "Synthetix", basePrice: 3.80 },
    { symbol: "SAND-USD", name: "The Sandbox", basePrice: 0.52 },
    { symbol: "MANA-USD", name: "Decentraland", basePrice: 0.48 },
    { symbol: "THETA-USD", name: "Theta Network", basePrice: 1.20 },
    { symbol: "EGLD-USD", name: "MultiversX", basePrice: 58 },
    { symbol: "AXS-USD", name: "Axie Infinity", basePrice: 7.80 },
    { symbol: "XTZ-USD", name: "Tezos", basePrice: 1.10 },
    { symbol: "MINA-USD", name: "Mina", basePrice: 1.30 },
    { symbol: "APE-USD", name: "ApeCoin", basePrice: 1.80 },
    { symbol: "EOS-USD", name: "EOS", basePrice: 0.75 },
    { symbol: "CHZ-USD", name: "Chiliz", basePrice: 0.10 },
    { symbol: "ILV-USD", name: "Illuvium", basePrice: 95 },
    { symbol: "GALA-USD", name: "Gala", basePrice: 0.035 },
    { symbol: "KAVA-USD", name: "Kava", basePrice: 0.85 },
    { symbol: "CFX-USD", name: "Conflux", basePrice: 0.22 },
    { symbol: "RUNE-USD", name: "THORChain", basePrice: 5.50 },
    { symbol: "CRV-USD", name: "Curve DAO", basePrice: 0.65 },
    { symbol: "DYDX-USD", name: "dYdX", basePrice: 3.20 },
    { symbol: "AGIX-USD", name: "SingularityNET", basePrice: 0.70 },
    { symbol: "FXS-USD", name: "Frax Share", basePrice: 8.50 },
    { symbol: "MKR-USD", name: "Maker", basePrice: 2100 },
    { symbol: "LUNC-USD", name: "Terra Classic", basePrice: 0.00012 },
    { symbol: "ZEC-USD", name: "Zcash", basePrice: 28 },
    { symbol: "IOTA-USD", name: "IOTA", basePrice: 0.25 },
    { symbol: "DASH-USD", name: "Dash", basePrice: 30 },
    { symbol: "NEO-USD", name: "NEO", basePrice: 14 },
    { symbol: "COMP-USD", name: "Compound", basePrice: 65 },
    { symbol: "BAT-USD", name: "Basic Attention Token", basePrice: 0.28 },
    { symbol: "ENJ-USD", name: "Enjin Coin", basePrice: 0.35 },
    { symbol: "ZIL-USD", name: "Zilliqa", basePrice: 0.025 },
    { symbol: "SUSHI-USD", name: "SushiSwap", basePrice: 1.20 },
    { symbol: "YFI-USD", name: "Yearn.finance", basePrice: 7500 },
    { symbol: "1INCH-USD", name: "1inch", basePrice: 0.45 },
    { symbol: "OCEAN-USD", name: "Ocean Protocol", basePrice: 0.75 },
    { symbol: "FET-USD", name: "Fetch.ai", basePrice: 1.10 },
    { symbol: "RPL-USD", name: "Rocket Pool", basePrice: 32 },
    { symbol: "ANKR-USD", name: "Ankr", basePrice: 0.035 },
    { symbol: "GLM-USD", name: "Golem", basePrice: 0.40 },
    { symbol: "LPT-USD", name: "Livepeer", basePrice: 18 },
    { symbol: "AUDIO-USD", name: "Audius", basePrice: 0.22 },
    { symbol: "RAY-USD", name: "Raydium", basePrice: 1.20 },
    { symbol: "SRM-USD", name: "Serum", basePrice: 0.05 }
];

const MOCK_STOCKS: Stock[] = [
    ...BIST_STOCKS.map(s => populateStock(s, 'BIST')),
    ...NASDAQ_STOCKS.map(s => populateStock(s, 'NASDAQ')),
    ...CRYPTO_STOCKS.map(s => populateStock(s, 'CRYPTO'))
];

function populateStock(base: { symbol: string; name: string; basePrice: number }, exchange: 'BIST' | 'NASDAQ' | 'CRYPTO'): Stock {
    // We already have the base data, so we just pass it to the generator
    // but the generator logic needs to be slightly adapted or we assume the generator
    // handles the random walk from basePrice.
    return generateRandomStockData({
        ...base,
        exchange,
        currency: exchange === 'BIST' ? 'TRY' : 'USD'
    } as any);
}

function generateRandomStockData(base: Stock | any): Stock {
    const basePrice = base.basePrice || 100;
    // Inject artificial volatility for specific "Risky" demo stocks
    const isVolatile = ['DOGE-USD', 'SHIB-USD', 'SASA', 'XRP-USD', 'TSLA', 'NVDA', 'GME'].includes(base.symbol) || base.name.includes("High Volatility");
    const volatilityFactor = isVolatile ? 0.15 : 0.05; // 15% for risky, 5% for normal

    const percentVariation = (Math.random() - 0.5) * volatilityFactor;
    const variation = basePrice * percentVariation;

    const price = Math.max(0.000001, basePrice + variation); // Safety for very low priced cryptos
    const change = variation;
    const changePercent = percentVariation * 100;

    // Derived OHLC Data
    const prevClose = basePrice;
    const gap = basePrice * (Math.random() - 0.5) * 0.01; // +/- 0.5% gap
    const open = basePrice + gap;

    // Simulate High/Low
    const maxVal = Math.max(price, open, prevClose);
    const minVal = Math.min(price, open, prevClose);
    const dayHigh = maxVal * (1 + Math.random() * 0.02);
    const dayLow = minVal * (1 - Math.random() * 0.02);

    // Generate 20 point history with proportional random walk
    const history = [price];
    for (let i = 1; i < 20; i++) {
        const prev = history[i - 1];
        // Volatile stocks move more aggressively
        const move = prev * (Math.random() - 0.5) * (isVolatile ? 0.08 : 0.02);
        history.push(Math.max(0.000001, prev + move));
    }

    return {
        symbol: base.symbol,
        name: base.name,
        price: parseFloat(price.toFixed(decimalPlaces(basePrice))),
        change: parseFloat(change.toFixed(decimalPlaces(basePrice))),
        changePercent: parseFloat(changePercent.toFixed(2)),
        // Generate high volume for "Most Traded" simulation
        volume: Math.floor(Math.random() * 9000000) + 1000000,
        exchange: base.exchange as 'BIST' | 'NASDAQ' | 'CRYPTO',
        currency: base.exchange === 'BIST' ? 'TRY' : 'USD', // Helper
        history,
        open: parseFloat(open.toFixed(decimalPlaces(basePrice))),
        prevClose: parseFloat(prevClose.toFixed(decimalPlaces(basePrice))),
        dayHigh: parseFloat(dayHigh.toFixed(decimalPlaces(basePrice))),
        dayLow: parseFloat(dayLow.toFixed(decimalPlaces(basePrice)))
    };
}

function decimalPlaces(price: number): number {
    if (price < 0.01) return 6;
    if (price < 1) return 4;
    return 2;
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
        const basePrice = stock ? (stock as any).prevClose : 100; // Use prevClose as base

        // Ensure consistency with "Scanner" by applying same volatility rules
        const isVolatile = ['DOGE-USD', 'SASA', 'XRP-USD', 'TSLA'].includes(symbol) || (stock?.name.includes("High Volatility"));

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
            // Just take first 10 from each exchange for default view
            const sample = [
                ...MOCK_STOCKS.filter(s => s.exchange === 'BIST').slice(0, 5),
                ...MOCK_STOCKS.filter(s => s.exchange === 'NASDAQ').slice(0, 5),
                ...MOCK_STOCKS.filter(s => s.exchange === 'CRYPTO').slice(0, 5)
            ];
            return sample.map(generateRandomStockData);
        }

        return MOCK_STOCKS.filter(s =>
            s.symbol.toLowerCase().includes(lowerQuery) ||
            s.name.toLowerCase().includes(lowerQuery)
        ).map(generateRandomStockData);
    }
};
