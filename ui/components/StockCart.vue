<template>
  <div class="stock-cart">
    <a-card class="mb-6" :bordered="false">
      <template #title>
        <div class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
            />
          </svg>
          股票購物車
        </div>
      </template>

      <div v-if="!cartItems.length" class="text-center py-8 text-gray-500">
        購物車目前是空的，請搜尋並添加股票
      </div>

      <template v-else>
        <a-list
          class="mb-4"
          size="small"
          :data-source="cartItems"
          :loading="loading"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta
                :title="`${item.symbol} - ${item.name}`"
                :description="`數量: ${item.quantity}股`"
              >
                <template #avatar>
                  <div class="stock-icon">{{ item.symbol.charAt(0) }}</div>
                </template>
              </a-list-item-meta>
              <div class="flex flex-col items-end">
                <div class="font-semibold">
                  {{ formatCurrency(item.price * item.quantity) }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ formatCurrency(item.price) }}/股
                </div>
                <a-button
                  type="text"
                  danger
                  size="small"
                  class="mt-1"
                  @click="removeFromCart(item.symbol)"
                >
                  移除
                </a-button>
              </div>
            </a-list-item>
          </template>
        </a-list>

        <div
          class="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
        >
          <div class="text-lg font-medium">總計</div>
          <div class="text-xl font-bold">{{ formatCurrency(totalAmount) }}</div>
        </div>

        <div class="mt-4">
          <a-button
            type="primary"
            block
            size="large"
            :disabled="!cartItems.length"
            @click="checkout"
          >
            前往結帳
          </a-button>
        </div>
      </template>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCart } from "~/composables/useCart";
import { useFormat } from "~/composables/useFormat";
import { useRouter } from "vue-router";

const { cartItems, loading, removeFromCart, totalAmount } = useCart();
const { formatCurrency } = useFormat();
const router = useRouter();

function checkout() {
  // 導航到結帳頁面
  router.push("/checkout");
}
</script>

<style scoped>
.stock-cart {
  max-width: 400px;
  margin: 0 auto;
}

.stock-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: #1890ff;
  color: white;
  border-radius: 50%;
  font-weight: bold;
}
</style>
