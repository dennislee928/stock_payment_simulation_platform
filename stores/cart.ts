import { defineStore } from "pinia";

interface StockItem {
  symbol: string;
  name: string;
  price: number;
  quantity: number;
  industry?: string;
  totalAmount?: number;
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as StockItem[],
  }),

  getters: {
    totalItems: (state) => state.items.length,

    totalAmount: (state) => {
      return state.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    },

    formattedTotal: (state) => {
      const total = state.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
      return new Intl.NumberFormat("zh-TW", {
        style: "currency",
        currency: "TWD",
        minimumFractionDigits: 0,
      }).format(total);
    },
  },

  actions: {
    addItem(item: StockItem) {
      const existingItem = this.items.find((i) => i.symbol === item.symbol);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        this.items.push(item);
      }
    },

    removeItem(symbol: string) {
      const index = this.items.findIndex((item) => item.symbol === symbol);
      if (index > -1) {
        this.items.splice(index, 1);
      }
    },

    updateQuantity(symbol: string, quantity: number) {
      const item = this.items.find((i) => i.symbol === symbol);
      if (item) {
        item.quantity = quantity;
      }
    },

    clearCart() {
      this.items = [];
    },
  },
});
