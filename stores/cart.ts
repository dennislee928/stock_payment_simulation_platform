import { defineStore } from "pinia";

// 購物車項目接口
interface CartItem {
  symbol: string; // 股票代碼
  name: string; // 股票名稱
  price: number; // 股票價格
  quantity: number; // 購買數量
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
    loading: false,
  }),

  getters: {
    totalAmount: (state) => {
      return state.items.reduce((total: number, item: CartItem) => {
        return total + item.price * item.quantity;
      }, 0);
    },

    itemCount: (state) => {
      return state.items.length;
    },

    totalQuantity: (state) => {
      return state.items.reduce((total: number, item: CartItem) => {
        return total + item.quantity;
      }, 0);
    },

    formattedTotal: (state) => {
      return state.items
        .reduce((total: number, item: CartItem) => {
          return total + item.price * item.quantity;
        }, 0)
        .toLocaleString("zh-TW", {
          style: "currency",
          currency: "TWD",
        });
    },
  },

  actions: {
    addItem(item: Omit<CartItem, "quantity">, quantity: number = 1) {
      const existingItemIndex = this.items.findIndex(
        (i: CartItem) => i.symbol === item.symbol
      );

      if (existingItemIndex !== -1) {
        this.items[existingItemIndex].quantity += quantity;
      } else {
        this.items.push({
          ...item,
          quantity,
        });
      }

      this.saveToStorage();
    },

    removeItem(symbol: string) {
      this.items = this.items.filter(
        (item: CartItem) => item.symbol !== symbol
      );

      this.saveToStorage();
    },

    updateQuantity(symbol: string, quantity: number) {
      const item = this.items.find((item: CartItem) => item.symbol === symbol);
      if (item) {
        item.quantity = quantity;

        if (quantity <= 0) {
          this.removeItem(symbol);
        } else {
          this.saveToStorage();
        }
      }
    },

    clearCart() {
      this.items = [];

      this.saveToStorage();
    },

    saveToStorage() {
      if (process.client) {
        localStorage.setItem("cart", JSON.stringify(this.items));
      }
    },

    loadFromStorage() {
      if (process.client) {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          this.items = JSON.parse(savedCart);
        }
      }
    },

    async submitOrder(userData: any) {
      this.loading = true;

      try {
        const orderData = {
          items: this.items,
          totalAmount: this.totalAmount,
          ...userData,
        };

        const response = await fetch("/api/order/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (result.success) {
          this.clearCart();
        }

        return result;
      } catch (error) {
        console.error("提交訂單時發生錯誤:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
