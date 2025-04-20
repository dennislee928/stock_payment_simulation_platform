<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";

// 設定需要驗證
definePageMeta({
  middleware: "auth",
});

const { isAuthenticated, login } = useAuth();
const orders = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// 模擬登入（實際應用程式應有完整登入流程）
async function mockLogin() {
  await login("demo@example.com", "password");
}

// 獲取訂單資料
async function fetchOrders() {
  loading.value = true;
  error.value = null;

  try {
    // 從後端 API 獲取訂單列表
    const { data, error: fetchError } = await useFetch("/api/orders");

    if (fetchError.value) {
      throw new Error("無法獲取訂單資料");
    }

    orders.value = data.value || [];
  } catch (err) {
    console.error("獲取訂單時發生錯誤:", err);
    error.value =
      typeof err === "string"
        ? err
        : err instanceof Error
        ? err.message
        : "載入時發生未知錯誤";
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  // 如果未登入，先模擬登入
  if (!isAuthenticated.value) {
    await mockLogin();
  }

  // 獲取訂單資料
  await fetchOrders();
});

// 訂單狀態中文化
function formatStatus(status: string) {
  switch (status) {
    case "success":
      return "交易成功";
    case "pending":
      return "處理中";
    case "failure":
      return "交易失敗";
    default:
      return "未知狀態";
  }
}

// 格式化日期
function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4">
    <h1 class="text-3xl font-bold my-8 text-center">訂單管理</h1>

    <div v-if="loading" class="text-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"
      ></div>
      <p>正在載入訂單資料...</p>
    </div>

    <div
      v-else-if="error"
      class="bg-red-50 text-red-700 p-6 rounded-lg text-center"
    >
      <p class="font-bold">載入失敗</p>
      <p>{{ error }}</p>
      <button
        @click="fetchOrders"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        重試
      </button>
    </div>

    <!-- 無訂單時顯示 -->
    <div
      v-else-if="orders.length === 0"
      class="bg-white rounded-lg shadow-md p-8 text-center"
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p class="text-lg mb-2">目前沒有訂單記錄</p>
        <p>完成交易後，訂單會顯示在這裡</p>
      </div>
      <NuxtLink
        to="/"
        class="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        開始購買
      </NuxtLink>
    </div>

    <!-- 訂單列表 -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-3 px-4 text-left">訂單編號</th>
            <th class="py-3 px-4 text-left">建立時間</th>
            <th class="py-3 px-4 text-left">付款方式</th>
            <th class="py-3 px-4 text-right">金額</th>
            <th class="py-3 px-4 text-center">狀態</th>
            <th class="py-3 px-4 text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orders"
            :key="order.orderId"
            class="border-t border-gray-200"
          >
            <td class="py-3 px-4">{{ order.orderId }}</td>
            <td class="py-3 px-4">{{ formatDate(order.createdAt) }}</td>
            <td class="py-3 px-4">
              <span v-if="order.paymentMethod === 'credit_card'">信用卡</span>
              <span v-else-if="order.paymentMethod === 'atm'">ATM 轉帳</span>
              <span v-else-if="order.paymentMethod === 'cvs'">超商代碼</span>
              <span v-else>{{ order.paymentMethod }}</span>
            </td>
            <td class="py-3 px-4 text-right font-medium">
              {{ order.totalAmount }}
            </td>
            <td class="py-3 px-4 text-center">
              <span
                class="inline-block px-3 py-1 rounded-full text-sm"
                :class="{
                  'bg-green-100 text-green-800': order.status === 'success',
                  'bg-yellow-100 text-yellow-800': order.status === 'pending',
                  'bg-red-100 text-red-800': order.status === 'failure',
                }"
              >
                {{ formatStatus(order.status) }}
              </span>
            </td>
            <td class="py-3 px-4 text-center">
              <NuxtLink
                :to="`/result?orderId=${order.orderId}`"
                class="text-blue-600 hover:text-blue-800 underline"
              >
                查看詳情
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
