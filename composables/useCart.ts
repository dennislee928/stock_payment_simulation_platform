import { computed } from "vue";
import { useCartStore } from "~/stores/cart";
import { useStocksStore } from "~/stores/stocks";

export function useCart() {
  const cartStore = useCartStore();
  const stocksStore = useStocksStore();

  // 添加股票到購物車
  function addToCart(symbol: string, quantity: number = 1) {
    const stock = stocksStore.getStockBySymbol(symbol);

    if (!stock) {
      throw new Error(`找不到股票 ${symbol} 的資料`);
    }

    cartStore.addItem({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      quantity,
      industry: stock.industry,
    });
  }

  // 從購物車移除股票
  function removeFromCart(symbol: string) {
    cartStore.removeItem(symbol);
  }

  // 更新數量
  function updateQuantity(symbol: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(symbol);
      return;
    }

    cartStore.updateQuantity(symbol, quantity);
  }

  // 清空購物車
  function clearCart() {
    cartStore.clearCart();
  }

  // 計算總金額（用於結帳）
  function calcTotal() {
    return cartStore.totalAmount;
  }

  // 建立訂單資料（給結帳時使用）
  function prepareOrderData() {
    return {
      items: cartStore.items.map((item) => ({
        symbol: item.symbol,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        totalAmount: item.price * item.quantity,
      })),
      totalAmount: cartStore.totalAmount,
      orderDate: new Date().toISOString(),
    };
  }

  return {
    items: computed(() => cartStore.items),
    totalItems: computed(() => cartStore.totalItems),
    totalAmount: computed(() => cartStore.totalAmount),
    formattedTotal: computed(() => cartStore.formattedTotal),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calcTotal,
    prepareOrderData,
  };
}
