<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useStocks } from "~/composables/useStocks";
import { useCart } from "~/composables/useCart";
import { useFormat } from "~/composables/useFormat";

// 取得路由參數
const route = useRoute();
const symbol = route.params.symbol as string;

const { getStockPrice, loading, error } = useStocks();
const { addToCart } = useCart();
const { formatCurrency, formatPercent, formatStockChange } = useFormat();

const stock = ref<any>(null);
const quantity = ref(1);
const showAddedMessage = ref(false);

// 取得股票詳細資訊
async function fetchStockDetail() {
  try {
    const data = await getStockPrice(symbol);
    if (data) {
      stock.value = data;
    }
  } catch (err) {
    console.error(`獲取股票 ${symbol} 詳細資訊失敗:`, err);
  }
}

// 添加到購物車
function handleAddToCart() {
  try {
    if (quantity.value <= 0) {
      return;
    }

    addToCart(symbol, quantity.value);

    // 顯示添加成功訊息
    showAddedMessage.value = true;
    setTimeout(() => {
      showAddedMessage.value = false;
    }, 3000);
  } catch (err) {
    console.error("添加到購物車失敗:", err);
  }
}

// 增加數量
function increaseQuantity() {
  quantity.value++;
}

// 減少數量
function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--;
  }
}

// 頁面加載時獲取股票資訊
onMounted(() => {
  fetchStockDetail();
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <div v-if="loading && !stock" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>

    <div v-else-if="error" class="bg-red-50 text-red-700 p-6 rounded-lg">
      <p class="font-bold">載入失敗</p>
      <p>{{ error }}</p>
      <button
        @click="fetchStockDetail"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        重試
      </button>
    </div>

    <template v-else-if="stock">
      <div class="mb-6">
        <NuxtLink
          to="/"
          class="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          返回搜尋
        </NuxtLink>
      </div>

      <!-- 股票基本信息 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div
          class="flex flex-col md:flex-row md:justify-between md:items-center mb-6"
        >
          <div>
            <h1 class="text-2xl font-bold">
              {{ stock.symbol }} - {{ stock.name }}
            </h1>
            <p class="text-gray-500 mt-1">{{ stock.industry || "一般" }}</p>
          </div>
          <div class="flex flex-col items-end mt-4 md:mt-0">
            <div class="text-3xl font-bold">
              {{ formatCurrency(stock.price) }}
            </div>
            <div
              :class="{
                'text-red-600': stock.change < 0,
                'text-green-600': stock.change > 0,
                'text-gray-500': stock.change === 0,
              }"
              class="text-lg font-semibold"
            >
              {{ formatStockChange(stock.change) }} ({{
                formatPercent(stock.changePercent)
              }})
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="border rounded-lg p-3 text-center">
            <div class="text-sm text-gray-500 mb-1">成交量</div>
            <div class="font-bold">
              {{ stock.volume?.toLocaleString() || "-" }}
            </div>
          </div>
          <div class="border rounded-lg p-3 text-center">
            <div class="text-sm text-gray-500 mb-1">日期</div>
            <div class="font-bold">{{ stock.date || "-" }}</div>
          </div>
          <div class="border rounded-lg p-3 text-center">
            <div class="text-sm text-gray-500 mb-1">52週最高</div>
            <div class="font-bold">{{ formatCurrency(stock.price * 1.2) }}</div>
          </div>
          <div class="border rounded-lg p-3 text-center">
            <div class="text-sm text-gray-500 mb-1">52週最低</div>
            <div class="font-bold">{{ formatCurrency(stock.price * 0.8) }}</div>
          </div>
        </div>
      </div>

      <!-- 購買表單 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">模擬購買</h2>

        <div class="flex items-center mb-6">
          <div class="mr-8">
            <div class="text-sm text-gray-500 mb-1">單價</div>
            <div class="font-bold text-lg">
              {{ formatCurrency(stock.price) }}
            </div>
          </div>

          <div>
            <div class="text-sm text-gray-500 mb-1">數量</div>
            <div class="flex items-center">
              <button
                @click="decreaseQuantity"
                class="border border-gray-300 rounded-l px-3 py-1 text-lg"
              >
                -
              </button>
              <input
                v-model="quantity"
                type="number"
                class="border-t border-b border-gray-300 w-16 text-center py-1"
                min="1"
              />
              <button
                @click="increaseQuantity"
                class="border border-gray-300 rounded-r px-3 py-1 text-lg"
              >
                +
              </button>
            </div>
          </div>

          <div class="ml-auto">
            <div class="text-sm text-gray-500 mb-1">小計</div>
            <div class="font-bold text-lg">
              {{ formatCurrency(stock.price * quantity) }}
            </div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row justify-between gap-4">
          <button
            @click="handleAddToCart"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
          >
            加入購物車
          </button>

          <NuxtLink
            to="/cart"
            class="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg text-center transition"
          >
            前往購物車
          </NuxtLink>
        </div>

        <!-- 成功訊息 -->
        <div
          v-show="showAddedMessage"
          class="mt-4 p-3 bg-green-50 text-green-700 rounded-lg"
        >
          已成功加入購物車！
        </div>
      </div>

      <!-- 股票相關資訊 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">公司資訊</h2>

        <div class="space-y-3">
          <div class="border-b pb-3">
            <div class="text-sm text-gray-500 mb-1">營收</div>
            <div class="font-medium">依季公告</div>
          </div>

          <div class="border-b pb-3">
            <div class="text-sm text-gray-500 mb-1">每股盈餘</div>
            <div class="font-medium">依季公告</div>
          </div>

          <div class="border-b pb-3">
            <div class="text-sm text-gray-500 mb-1">配息資訊</div>
            <div class="font-medium">依年公告</div>
          </div>
        </div>

        <div class="mt-4 text-sm text-gray-500">
          <p>* 此頁面僅作為模擬交易用途，無法確保資料即時性</p>
          <p>* 投資股票有賺有賠，請詳閱公開說明書</p>
        </div>
      </div>
    </template>

    <div v-else class="bg-white rounded-lg shadow-md p-8 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 mx-auto mb-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h2 class="text-xl font-semibold mb-2">找不到股票資訊</h2>
      <p class="text-gray-500 mb-4">無法找到代號為 {{ symbol }} 的股票資訊</p>
      <NuxtLink
        to="/"
        class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        返回搜尋
      </NuxtLink>
    </div>
  </div>
</template>
