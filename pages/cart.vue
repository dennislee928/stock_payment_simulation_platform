<script setup lang="ts">
import { useCart } from "~/composables/useCart";

const { items, formattedTotal, removeFromCart, updateQuantity } = useCart();

// 更新股票數量
function handleUpdateQuantity(symbol: string, newQuantity: number) {
  updateQuantity(symbol, Math.max(1, newQuantity));
}

// 移除股票
function handleRemoveStock(symbol: string) {
  removeFromCart(symbol);
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold my-8 text-center">購物車</h1>

    <div
      v-if="items.length === 0"
      class="text-center py-16 bg-white rounded-lg shadow-md"
    >
      <div class="text-gray-500 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <p class="text-lg">購物車是空的</p>
      </div>
      <NuxtLink
        to="/"
        class="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        去尋找股票
      </NuxtLink>
    </div>

    <template v-else>
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <table class="w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-3 px-4 text-left">代碼</th>
              <th class="py-3 px-4 text-left">名稱</th>
              <th class="py-3 px-4 text-right">價格</th>
              <th class="py-3 px-4 text-center">數量</th>
              <th class="py-3 px-4 text-right">小計</th>
              <th class="py-3 px-4 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in items"
              :key="item.symbol"
              class="border-t border-gray-200"
            >
              <td class="py-4 px-4">{{ item.symbol }}</td>
              <td class="py-4 px-4">{{ item.name }}</td>
              <td class="py-4 px-4 text-right">{{ item.price.toFixed(2) }}</td>
              <td class="py-4 px-4">
                <div class="flex items-center justify-center">
                  <button
                    @click="
                      handleUpdateQuantity(item.symbol, item.quantity - 1)
                    "
                    class="p-1 border rounded"
                  >
                    -
                  </button>
                  <span class="mx-2 w-8 text-center">{{ item.quantity }}</span>
                  <button
                    @click="
                      handleUpdateQuantity(item.symbol, item.quantity + 1)
                    "
                    class="p-1 border rounded"
                  >
                    +
                  </button>
                </div>
              </td>
              <td class="py-4 px-4 text-right font-medium">
                {{ (item.price * item.quantity).toFixed(2) }}
              </td>
              <td class="py-4 px-4 text-center">
                <button
                  @click="handleRemoveStock(item.symbol)"
                  class="text-red-500 hover:text-red-700"
                  title="移除"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50">
            <tr>
              <td colspan="4" class="py-4 px-4 text-right font-bold">總計：</td>
              <td class="py-4 px-4 text-right font-bold">
                {{ formattedTotal }}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="flex justify-between items-center">
        <NuxtLink
          to="/"
          class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          繼續購物
        </NuxtLink>
        <NuxtLink
          to="/checkout"
          class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          前往結帳
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
