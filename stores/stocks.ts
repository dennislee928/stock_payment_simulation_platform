import { defineStore } from "pinia";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change?: number;
  changePercent?: number;
  industry?: string;
  date?: string;
  volume?: number;
}

export const useStocksStore = defineStore("stocks", {
  state: () => ({
    searchResults: [] as StockData[],
    recentStocks: [] as StockData[],
    favorites: [] as string[],
    stockCache: {} as Record<string, StockData>,
  }),

  getters: {
    getStockBySymbol: (state) => (symbol: string) => {
      return state.stockCache[symbol];
    },

    favoriteStocks: (state) => {
      return state.favorites
        .map((symbol) => state.stockCache[symbol])
        .filter(Boolean);
    },
  },

  actions: {
    setSearchResults(results: StockData[]) {
      this.searchResults = results;
    },

    addToRecent(stock: StockData) {
      // 避免重複
      const existingIndex = this.recentStocks.findIndex(
        (item) => item.symbol === stock.symbol
      );
      if (existingIndex !== -1) {
        this.recentStocks.splice(existingIndex, 1);
      }

      // 添加到最前面
      this.recentStocks.unshift(stock);

      // 限制最多保存 5 筆
      if (this.recentStocks.length > 5) {
        this.recentStocks.pop();
      }

      // 同時更新快取
      this.stockCache[stock.symbol] = stock;
    },

    toggleFavorite(symbol: string) {
      const index = this.favorites.indexOf(symbol);
      if (index !== -1) {
        this.favorites.splice(index, 1);
      } else {
        this.favorites.push(symbol);
      }
    },

    cacheStock(stock: StockData) {
      this.stockCache[stock.symbol] = stock;
    },
  },
});
