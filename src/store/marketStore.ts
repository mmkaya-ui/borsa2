import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Stock, MarketAPI } from '@/lib/api';

export interface Holding {
    symbol: string;
    quantity: number;
    buyPrice: number;
}

interface MarketState {
    stocks: Stock[];
    holdings: Holding[];
    isLoading: boolean;
    error: string | null;
    fetchStocks: () => Promise<void>;
    startLiveUpdates: () => () => void;
    addHolding: (symbol: string, quantity: number, price: number) => void;
    removeHolding: (symbol: string) => void;
    resetPortfolio: () => void;
}

export const useMarketStore = create<MarketState>()(
    persist(
        (set, get) => ({
            stocks: [],
            holdings: [], // Initial Default (Empty)
            isLoading: false,
            error: null,

            fetchStocks: async () => {
                set({ isLoading: true, error: null });
                try {
                    const stocks = await MarketAPI.getMarketOverview();
                    set({ stocks, isLoading: false });
                } catch (error) {
                    set({ error: 'Failed to fetch market data', isLoading: false });
                }
            },

            startLiveUpdates: () => {
                // Ensure we don't have multiple subscriptions running if logic were different,
                // but here we rely on the caller to handle the unsubscribe.
                // Optimization: We could check if we already have data to avoid initial flash.
                return MarketAPI.subscribeToTicker((updatedStocks) => {
                    // Optimization: Check for equality before setting to avoid store notification?
                    // But deep equality on 300 items is heavy.
                    // We rely on StockCard memoization for the UI layer.
                    set({ stocks: updatedStocks });
                });
            },

            addHolding: (symbol, quantity, buyPrice) => {
                set((state) => ({
                    holdings: [...state.holdings, { symbol, quantity, buyPrice }]
                }));
            },

            removeHolding: (symbol) => {
                set((state) => ({
                    holdings: state.holdings.filter(h => h.symbol !== symbol)
                }));
            },

            resetPortfolio: () => {
                set({ holdings: [] });
            }
        }),
        {
            name: 'borsa-storage-v1',
            partialize: (state) => ({ holdings: state.holdings }), // Only persist holdings
        }
    )
);
