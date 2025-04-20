<template>
  <div class="result-page">
    <a-card :bordered="false" class="mb-6">
      <template v-if="isSuccess">
        <a-result
          status="success"
          title="交易成功！"
          sub-title="您的股票模擬交易已順利完成"
        >
          <template #extra>
            <div class="mb-6">
              <div class="p-4 bg-gray-50 rounded-lg mb-4 text-center">
                <p class="text-sm text-gray-500 mb-1">訂單編號</p>
                <p class="font-bold text-lg">{{ orderId }}</p>
              </div>

              <div class="p-4 bg-gray-50 rounded-lg text-center">
                <p class="text-sm text-gray-500 mb-1">交易時間</p>
                <p class="font-bold text-lg">{{ formatDate(new Date()) }}</p>
              </div>
            </div>

            <div class="flex gap-2 justify-center">
              <a-button type="primary" @click="navigateToHome">
                返回首頁
              </a-button>
              <a-button @click="viewOrderDetails"> 查看訂單詳情 </a-button>
            </div>
          </template>
        </a-result>
      </template>

      <template v-else>
        <a-result
          status="error"
          title="交易失敗"
          sub-title="您的股票模擬交易未能完成，請重試"
        >
          <template #extra>
            <div class="mb-6">
              <div v-if="errorMessage" class="p-4 bg-red-50 rounded-lg mb-4">
                <p class="text-red-600">{{ errorMessage }}</p>
              </div>
            </div>

            <div class="flex gap-2 justify-center">
              <a-button type="primary" @click="retryPayment">
                重新付款
              </a-button>
              <a-button @click="navigateToHome"> 返回首頁 </a-button>
            </div>
          </template>
        </a-result>
      </template>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFormat } from "~/composables/useFormat";

const route = useRoute();
const router = useRouter();
const { formatDate } = useFormat();

// 從URL參數中獲取成功/失敗狀態
const isSuccess = ref(route.query.success === "true");
const orderId = ref(
  route.query.orderId || `SMT${Date.now().toString().substring(6)}`
);
const errorMessage = ref(
  route.query.errorMessage || "交易過程中發生錯誤，請稍後再試"
);

function navigateToHome() {
  router.push("/");
}

function viewOrderDetails() {
  // 可以導航到訂單詳情頁面
  router.push(`/order/${orderId.value}`);
}

function retryPayment() {
  // 返回結帳頁面
  router.push("/checkout");
}

// 頁面載入時的動作
onMounted(() => {
  // 可以在這裡執行頁面載入時的動作，如獲取訂單詳情
  console.log("結果頁面已載入，訂單ID:", orderId.value);
});
</script>

<style scoped>
.result-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>
