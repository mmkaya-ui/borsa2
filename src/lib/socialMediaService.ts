export interface SocialSignal {
    source: 'TWITTER' | 'REDDIT' | 'NEWS';
    sentimentScore: number; // -1.0 to 1.0
    volume: number;
    summary: string;
    trendingTopics: string[];
}

export const SocialMediaService = {
    // Reference implementation: Generates mock signals based on market movement
    // In a real scenario, this would call Twitter/Reddit/Finnhub APIs
    getSocialSignals: async (symbol: string, priceChange: number): Promise<SocialSignal[]> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const signals: SocialSignal[] = [];

        // 1. Simulate Twitter Sentiment (Reacting to price)
        let twitterScore = 0;
        let twitterSummary = "";

        if (priceChange < -2) {
            twitterScore = -0.8;
            twitterSummary = "🔥 Panic selling trending. Users mentioning 'crash' and 'stop loss'.";
        } else if (priceChange > 2) {
            twitterScore = 0.9;
            twitterSummary = "🚀 'Moon' and 'ATH' trending. High retail euphoria.";
        } else {
            twitterScore = 0.1;
            twitterSummary = "Mixed sentiment. Discussions on resistance levels.";
        }

        signals.push({
            source: 'TWITTER',
            sentimentScore: twitterScore,
            volume: Math.floor(Math.random() * 5000) + 1000,
            summary: twitterSummary,
            trendingTopics: priceChange < 0 ? ['#crash', '#bearmarket'] : ['#bullrun', '#mooning']
        });

        // 2. Simulate Reddit (WallStreetBets style)
        // Usually inverse or high risk
        const redditScore = priceChange < -1 ? 0.4 : 0.6; // WSB often buys the dip
        signals.push({
            source: 'REDDIT',
            sentimentScore: redditScore,
            volume: Math.floor(Math.random() * 2000),
            summary: priceChange < -1 ? "WSB discussing 'Diamond Hands' and 'Buy the Dip'." : "Meme stock hype continues.",
            trendingTopics: ['r/wallstreetbets', 'HODL']
        });

        return signals;
    }
};
