<template>
  <div class="stock-search">
    <a-card :bordered="false" class="mb-6">
      <template #title>
        <div class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
          股票搜尋
        </div>
      </template>
      <div class="mb-4">
        <a-input-search
          v-model:value="keyword"
          placeholder="請輸入股票代碼或公司名稱"
          enter-button="搜尋"
          size="large"
          @search="handleSearch"
          :loading="loading"
        />
      </div>

      <div v-if="error" class="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
        {{ error }}
      </div>

      <div v-if="searchResults.length > 0">
        <a-table
          :dataSource="searchResults"
          :columns="columns"
          :pagination="false"
          :loading="loading"
          rowKey="symbol"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'price'">
              <template v-if="record.price">
                {{ record.price.toFixed(2) }}
                <span
                  :class="{
                    'text-red-500': record.change < 0,
                    'text-green-500': record.change > 0,
                  }"
                  v-if="record.change"
                >
                  ({{ record.change > 0 ? "+" : ""
                  }}{{ record.change.toFixed(2) }})
                </span>
              </template>
              <template v-else>--</template>
            </template>
            <template v-if="column.key === 'action'">
              <a-button
                type="primary"
                size="small"
                @click="addToCart(record.symbol)"
              >
                加入購物車
              </a-button>
            </template>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStocks } from "~/composables/useStocks";
import { useCart } from "~/composables/useCart";

const keyword = ref("");
const { searchStock, loading, error } = useStocks();
const { addToCart } = useCart();
const searchResults = ref<any[]>([]);

const columns = [
  {
    title: "代碼",
    dataIndex: "symbol",
    key: "symbol",
    width: "15%",
  },
  {
    title: "公司名稱",
    dataIndex: "name",
    key: "name",
    width: "40%",
  },
  {
    title: "產業類別",
    dataIndex: "industry",
    key: "industry",
    width: "20%",
  },
  {
    title: "股價",
    key: "price",
    align: "right",
    width: "15%",
  },
  {
    title: "操作",
    key: "action",
    align: "center",
    width: "10%",
  },
];

async function handleSearch() {
  if (keyword.value.length < 2) {
    return;
  }

  const results = await searchStock(keyword.value);
  if (results && results.length > 0) {
    searchResults.value = results;
  } else {
    searchResults.value = [];
  }
}
</script>

<style scoped>
.stock-search {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
