<script setup lang="ts">
import { ref, watch } from "vue";
import { useStocks } from "~/composables/useStocks";
import { useCart } from "~/composables/useCart";

const keyword = ref("");
const searchTimeout = ref<NodeJS.Timeout | null>(null);
const { loading, error, searchStock, recentStocks } = useStocks();
const { addToCart } = useCart();

const searchResults = ref<any[]>([]);

// 當關鍵字變化時，進行搜索（延遲 500ms，避免太頻繁請求）
watch(keyword, (newValue) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  if (newValue.length >= 2) {
    searchTimeout.value = setTimeout(async () => {
      const results = await searchStock(newValue);
      if (results) {
        searchResults.value = results;
      }
    }, 500);
  } else {
    searchResults.value = [];
  }
});

// 添加股票到購物車
function handleAddToCart(symbol: string) {
  try {
    addToCart(symbol, 1);
    // 可以加入成功提示
  } catch (err) {
    console.error("添加到購物車失敗:", err);
    // 可以加入錯誤提示
  }
}
</script>

<template>
  <div>
    <div class="max-w-4xl mx-auto mb-10">
      <div class="text-center my-8">
        <h1 class="text-3xl font-bold mb-2">台股模擬購買平台</h1>
        <p class="text-gray-600">
          搜尋股票代碼或名稱，將其加入購物車進行模擬交易
        </p>
      </div>

      <!-- 搜尋框 -->
      <div class="mb-8">
        <div class="flex shadow-md rounded-lg overflow-hidden">
          <input
            v-model="keyword"
            type="text"
            placeholder="輸入股票代碼或名稱..."
            class="flex-grow p-4 outline-none text-lg"
          />
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 transition"
            :disabled="loading"
          >
            <span v-if="loading">搜尋中...</span>
            <span v-else>搜尋</span>
          </button>
        </div>
        <p v-if="error" class="mt-2 text-red-500">{{ error }}</p>
      </div>

      <!-- 搜尋結果 -->
      <div v-if="searchResults.length > 0" class="mb-10">
        <h2 class="text-xl font-semibold mb-4">搜尋結果</h2>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="py-3 px-4 text-left">代碼</th>
                <th class="py-3 px-4 text-left">名稱</th>
                <th class="py-3 px-4 text-left">產業</th>
                <th class="py-3 px-4 text-right">價格</th>
                <th class="py-3 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="stock in searchResults"
                :key="stock.symbol"
                class="border-t border-gray-200"
              >
                <td class="py-3 px-4">{{ stock.symbol }}</td>
                <td class="py-3 px-4">{{ stock.name }}</td>
                <td class="py-3 px-4">{{ stock.industry || "暫無資料" }}</td>
                <td class="py-3 px-4 text-right">
                  <template v-if="stock.price">
                    {{ stock.price.toFixed(2) }}
                    <span
                      :class="{
                        'text-red-500': stock.change < 0,
                        'text-green-500': stock.change > 0,
                      }"
                      v-if="stock.change"
                    >
                      ({{ stock.change > 0 ? "+" : ""
                      }}{{ stock.change.toFixed(2) }})
                    </span>
                  </template>
                  <template v-else> -- </template>
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    @click="handleAddToCart(stock.symbol)"
                    class="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded transition"
                  >
                    加入購物車
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 最近查看的股票 -->
      <div v-if="recentStocks.length > 0" class="mb-10">
        <h2 class="text-xl font-semibold mb-4">最近查看</h2>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="py-3 px-4 text-left">代碼</th>
                <th class="py-3 px-4 text-left">名稱</th>
                <th class="py-3 px-4 text-right">價格</th>
                <th class="py-3 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="stock in recentStocks"
                :key="stock.symbol"
                class="border-t border-gray-200"
              >
                <td class="py-3 px-4">{{ stock.symbol }}</td>
                <td class="py-3 px-4">{{ stock.name }}</td>
                <td class="py-3 px-4 text-right">
                  <template v-if="stock.price">
                    {{ stock.price.toFixed(2) }}
                  </template>
                  <template v-else> -- </template>
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    @click="handleAddToCart(stock.symbol)"
                    class="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded transition"
                  >
                    加入購物車
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
