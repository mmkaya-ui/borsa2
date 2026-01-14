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
                return MarketAPI.subscribeToTicker((updatedStocks) => {
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
