import { ref, computed } from "vue";
import { useStocksStore } from "~/stores/stocks";

export function useStocks() {
  const config = useRuntimeConfig();
  const twseBase = config.public.twseApiBase;
  const loading = ref(false);
  const error = ref<string | null>(null);
  const stocksStore = useStocksStore();

  // 搜尋股票
  async function searchStock(keyword: string) {
    if (!keyword || keyword.length < 2) return;

    loading.value = true;
    error.value = null;

    try {
      // 取得上市公司基本資料
      const { data: companies } = await useFetch<any[]>(
        `${twseBase}/opendata/t187ap03_L`
      );

      if (!companies.value || !Array.isArray(companies.value)) {
        throw new Error("無法取得公司資料");
      }

      // 根據關鍵字過濾公司
      const results = companies.value
        .filter((company) => {
          const companyName = company.Name || "";
          const companyCode = company.Code || "";

          return companyName.includes(keyword) || companyCode.includes(keyword);
        })
        .map((company) => ({
          symbol: company.Code,
          name: company.Name,
          industry: company.Industry,
          price: 0, // 先設為 0，之後會更新
        }));

      if (results.length > 0) {
        // 更新結果到存儲
        stocksStore.setSearchResults(results);

        // 對前 5 個結果獲取價格
        await Promise.all(
          results.slice(0, 5).map(async (stock) => {
            await getStockPrice(stock.symbol);
          })
        );
      }

      return results;
    } catch (err) {
      console.error("搜尋股票時發生錯誤:", err);
      error.value = "搜尋股票時發生錯誤，請稍後再試";
      return [];
    } finally {
      loading.value = false;
    }
  }

  // 取得股票價格
  async function getStockPrice(symbol: string) {
    try {
      // 從後端 API 取得股票最新價格 (使用 server route)
      const { data } = await useFetch(`/api/stocks/${symbol}`);

      if (data.value && data.value.price) {
        // 更新快取
        stocksStore.cacheStock({
          ...stocksStore.getStockBySymbol(symbol),
          symbol,
          price: data.value.price,
          change: data.value.change,
          changePercent: data.value.changePercent,
          date: data.value.date,
        });
      }

      return data.value;
    } catch (err) {
      console.error(`取得股票 ${symbol} 價格時發生錯誤:`, err);
      throw new Error(`無法取得股票 ${symbol} 的價格資訊`);
    }
  }

  return {
    loading,
    error,
    searchStock,
    getStockPrice,
    recentStocks: computed(() => stocksStore.recentStocks),
    favoriteStocks: computed(() => stocksStore.favoriteStocks),
    toggleFavorite: stocksStore.toggleFavorite,
  };
}
