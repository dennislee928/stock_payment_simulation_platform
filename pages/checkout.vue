<script setup lang="ts">
import { ref } from "vue";
import { useCart } from "~/composables/useCart";

const { items, totalAmount, formattedTotal, prepareOrderData } = useCart();
const loading = ref(false);
const error = ref<string | null>(null);

// 表單資料
const formData = ref({
  name: "",
  email: "",
  phone: "",
  paymentMethod: "credit_card", // 預設信用卡
});

// 提交訂單到後端
async function submitOrder() {
  if (!formData.value.name || !formData.value.email || !formData.value.phone) {
    error.value = "請填寫完整的聯絡資訊";
    return;
  }

  if (items.value.length === 0) {
    error.value = "購物車是空的，請先選擇股票";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // 準備訂單資料
    const orderData = {
      ...prepareOrderData(),
      contact: {
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone,
      },
      paymentMethod: formData.value.paymentMethod,
    };

    // 提交訂單到後端 API
    const { data, error: submitError } = await useFetch("/api/order/submit", {
      method: "POST",
      body: orderData,
    });

    if (submitError.value) {
      throw new Error(submitError.value.message || "提交訂單時發生錯誤");
    }

    if (!data.value) {
      throw new Error("未收到後端回應");
    }

    // 如果成功，取得 ECPay 的重定向 URL 並導向
    if (data.value.redirectUrl) {
      window.location.href = data.value.redirectUrl;
    } else {
      throw new Error("未收到付款重定向連結");
    }
  } catch (err) {
    console.error("結帳時發生錯誤:", err);
    error.value =
      typeof err === "string"
        ? err
        : err instanceof Error
        ? err.message
        : "結帳時發生未知錯誤";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold my-8 text-center">結帳</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 結帳表單 -->
      <div class="md:col-span-2">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-6">聯絡資訊</h2>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">姓名</label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入姓名"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2">電子郵件</label>
            <input
              v-model="formData.email"
              type="email"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入電子郵件"
            />
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 mb-2">手機</label>
            <input
              v-model="formData.phone"
              type="tel"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請輸入手機號碼"
            />
          </div>

          <h2 class="text-xl font-semibold mb-4">付款方式</h2>

          <div class="flex flex-col space-y-3 mb-6">
            <label class="flex items-center space-x-3">
              <input
                type="radio"
                v-model="formData.paymentMethod"
                value="credit_card"
                class="h-5 w-5 text-blue-600"
              />
              <span>信用卡付款（模擬）</span>
            </label>

            <label class="flex items-center space-x-3">
              <input
                type="radio"
                v-model="formData.paymentMethod"
                value="atm"
                class="h-5 w-5 text-blue-600"
              />
              <span>ATM 轉帳（模擬）</span>
            </label>

            <label class="flex items-center space-x-3">
              <input
                type="radio"
                v-model="formData.paymentMethod"
                value="cvs"
                class="h-5 w-5 text-blue-600"
              />
              <span>超商代碼付款（模擬）</span>
            </label>
          </div>

          <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>

          <button
            @click="submitOrder"
            :disabled="loading"
            class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            <span v-if="loading">處理中...</span>
            <span v-else>確認結帳</span>
          </button>
        </div>
      </div>

      <!-- 訂單摘要 -->
      <div class="md:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">訂單摘要</h2>

          <div class="divide-y">
            <div
              v-for="item in items"
              :key="item.symbol"
              class="py-3 flex justify-between"
            >
              <div>
                <div class="font-medium">{{ item.name }}</div>
                <div class="text-sm text-gray-500">
                  {{ item.symbol }} x {{ item.quantity }}
                </div>
              </div>
              <div class="font-medium">
                {{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t">
            <div class="flex justify-between items-center font-bold">
              <span>總計</span>
              <span>{{ formattedTotal }}</span>
            </div>
          </div>

          <div class="mt-6 text-sm text-gray-500">
            <p>* 此為模擬結帳系統，不會實際扣款</p>
            <p>* 使用 ECPay 測試環境</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
