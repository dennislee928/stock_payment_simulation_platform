<script setup lang="ts">
import { ref, onMounted } from "vue";

const orderStatus = ref<"success" | "pending" | "failure" | null>(null);
const orderDetails = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    // 從 URL 參數取得訂單 ID
    const route = useRoute();
    const orderId = route.query.orderId as string;

    if (!orderId) {
      throw new Error("沒有找到訂單 ID");
    }

    // 從後端 API 獲取訂單狀態
    const { data, error: fetchError } = await useFetch(`/api/order/${orderId}`);

    if (fetchError.value) {
      throw new Error("無法獲取訂單資訊");
    }

    if (!data.value) {
      throw new Error("未收到訂單資訊");
    }

    orderDetails.value = data.value;
    orderStatus.value = data.value.status;
  } catch (err) {
    console.error("獲取訂單資訊時發生錯誤:", err);
    error.value =
      typeof err === "string"
        ? err
        : err instanceof Error
        ? err.message
        : "載入時發生未知錯誤";
    orderStatus.value = "failure";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div v-if="loading" class="text-center py-12">
      <div
        class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"
      ></div>
      <p class="text-lg">正在載入訂單資訊...</p>
    </div>

    <div
      v-else-if="error"
      class="bg-red-50 text-red-700 p-8 rounded-lg shadow-md text-center my-12"
    >
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
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h1 class="text-2xl font-bold mb-2">載入失敗</h1>
      <p>{{ error }}</p>
      <NuxtLink
        to="/"
        class="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        返回首頁
      </NuxtLink>
    </div>

    <div v-else>
      <!-- 付款成功 -->
      <div
        v-if="orderStatus === 'success'"
        class="bg-green-50 p-8 rounded-lg shadow-md my-12"
      >
        <div class="text-center mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 mx-auto mb-4 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h1 class="text-3xl font-bold mb-2 text-green-700">交易成功</h1>
          <p class="text-green-600">您的股票購買訂單已完成付款</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow mb-6">
          <h2 class="text-xl font-semibold mb-4">訂單詳情</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-gray-500 text-sm">訂單編號</p>
              <p class="font-medium">{{ orderDetails?.orderId || "-" }}</p>
            </div>
            <div>
              <p class="text-gray-500 text-sm">付款時間</p>
              <p class="font-medium">{{ orderDetails?.paymentTime || "-" }}</p>
            </div>
            <div>
              <p class="text-gray-500 text-sm">付款方式</p>
              <p class="font-medium">
                {{ orderDetails?.paymentMethod || "-" }}
              </p>
            </div>
            <div>
              <p class="text-gray-500 text-sm">付款金額</p>
              <p class="font-medium">{{ orderDetails?.totalAmount || "-" }}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-center space-x-4">
          <NuxtLink
            to="/account/orders"
            class="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
          >
            查看我的訂單
          </NuxtLink>
          <NuxtLink
            to="/"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            繼續購買
          </NuxtLink>
        </div>
      </div>

      <!-- 付款等待中 -->
      <div
        v-else-if="orderStatus === 'pending'"
        class="bg-yellow-50 p-8 rounded-lg shadow-md my-12"
      >
        <div class="text-center mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 mx-auto mb-4 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 class="text-3xl font-bold mb-2 text-yellow-700">交易處理中</h1>
          <p class="text-yellow-600">您的訂單已建立，正在等待付款確認</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow mb-6">
          <h2 class="text-xl font-semibold mb-4">付款資訊</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-gray-500 text-sm">訂單編號</p>
              <p class="font-medium">{{ orderDetails?.orderId || "-" }}</p>
            </div>
            <div>
              <p class="text-gray-500 text-sm">付款期限</p>
              <p class="font-medium">{{ orderDetails?.expireDate || "-" }}</p>
            </div>
            <div>
              <p class="text-gray-500 text-sm">付款方式</p>
              <p class="font-medium">
                {{ orderDetails?.paymentMethod || "-" }}
              </p>
            </div>
            <div>
              <p class="text-gray-500 text-sm">付款金額</p>
              <p class="font-medium">{{ orderDetails?.totalAmount || "-" }}</p>
            </div>
          </div>

          <div
            v-if="orderDetails?.paymentInfo"
            class="mt-6 p-4 bg-yellow-50 rounded-lg"
          >
            <h3 class="font-semibold mb-2">
              {{
                orderDetails.paymentMethod === "ATM"
                  ? "ATM 轉帳資訊"
                  : "超商繳費資訊"
              }}
            </h3>
            <p
              v-for="(value, key) in orderDetails.paymentInfo"
              :key="key"
              class="mb-1"
            >
              <span class="text-gray-500">{{ key }}:</span>
              <span class="font-medium">{{ value }}</span>
            </p>
          </div>
        </div>

        <div class="flex justify-center">
          <NuxtLink
            to="/"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回首頁
          </NuxtLink>
        </div>
      </div>

      <!-- 付款失敗 -->
      <div v-else class="bg-red-50 p-8 rounded-lg shadow-md my-12">
        <div class="text-center mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 mx-auto mb-4 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <h1 class="text-3xl font-bold mb-2 text-red-700">交易失敗</h1>
          <p class="text-red-600">很抱歉，您的交易未能完成</p>
        </div>

        <div class="bg-white p-6 rounded-lg shadow mb-6">
          <h2 class="text-xl font-semibold mb-4">錯誤詳情</h2>
          <p class="text-gray-700">
            {{
              orderDetails?.errorMessage || "發生未知錯誤，請稍後再試或聯繫客服"
            }}
          </p>
        </div>

        <div class="flex justify-center space-x-4">
          <NuxtLink
            to="/cart"
            class="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
          >
            返回購物車
          </NuxtLink>
          <NuxtLink
            to="/"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回首頁
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
