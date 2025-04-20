<template>
  <div class="checkout-form">
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
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clip-rule="evenodd"
            />
          </svg>
          填寫訂單資料
        </div>
      </template>

      <a-form
        :model="formState"
        :rules="rules"
        layout="vertical"
        @finish="onFinish"
        ref="formRef"
      >
        <a-steps class="mb-8" :current="current" size="small">
          <a-step title="選擇股票" />
          <a-step title="填寫資料" />
          <a-step title="完成付款" />
        </a-steps>

        <a-form-item label="姓名" name="name">
          <a-input
            v-model:value="formState.name"
            placeholder="請輸入您的姓名"
          />
        </a-form-item>

        <a-form-item label="電子郵件" name="email">
          <a-input
            v-model:value="formState.email"
            placeholder="請輸入您的電子郵件"
          />
        </a-form-item>

        <a-form-item label="手機號碼" name="phone">
          <a-input
            v-model:value="formState.phone"
            placeholder="請輸入您的手機號碼"
          />
        </a-form-item>

        <a-form-item label="付款方式" name="paymentMethod">
          <a-radio-group v-model:value="formState.paymentMethod">
            <a-radio value="credit_card">信用卡付款</a-radio>
            <a-radio value="atm">ATM轉帳</a-radio>
            <a-radio value="cvs">超商代碼</a-radio>
            <a-radio value="webatm">網路銀行</a-radio>
          </a-radio-group>
        </a-form-item>

        <h3 class="font-medium text-lg mb-3">訂單摘要</h3>
        <a-table
          :dataSource="cartItems"
          :columns="columns"
          :pagination="false"
          size="small"
          class="mb-4"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'amount'">
              {{ formatCurrency(record.price * record.quantity) }}
            </template>
          </template>
        </a-table>

        <div
          class="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-6"
        >
          <div class="text-lg font-medium">總計</div>
          <div class="text-xl font-bold">{{ formatCurrency(totalAmount) }}</div>
        </div>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            block
            size="large"
            :loading="submitting"
          >
            確認送出
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useCart } from "~/composables/useCart";
import { useFormat } from "~/composables/useFormat";

const { cartItems, totalAmount } = useCart();
const { formatCurrency } = useFormat();
const formRef = ref();
const submitting = ref(false);
const current = ref(1); // 當前步驟

// 定義表單資料
const formState = reactive({
  name: "",
  email: "",
  phone: "",
  paymentMethod: "credit_card",
});

// 定義表單驗證規則
const rules = {
  name: [{ required: true, message: "請輸入您的姓名", trigger: "blur" }],
  email: [
    { required: true, message: "請輸入您的電子郵件", trigger: "blur" },
    { type: "email", message: "請輸入有效的電子郵件格式", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "請輸入您的手機號碼", trigger: "blur" },
    {
      pattern: /^09\d{8}$/,
      message: "請輸入有效的手機號碼格式",
      trigger: "blur",
    },
  ],
  paymentMethod: [
    { required: true, message: "請選擇付款方式", trigger: "change" },
  ],
};

// 定義表格欄位
const columns = [
  {
    title: "代碼",
    dataIndex: "symbol",
    key: "symbol",
    width: "15%",
  },
  {
    title: "名稱",
    dataIndex: "name",
    key: "name",
    width: "40%",
  },
  {
    title: "單價",
    dataIndex: "price",
    key: "price",
    width: "15%",
    align: "right",
  },
  {
    title: "數量",
    dataIndex: "quantity",
    key: "quantity",
    width: "15%",
    align: "center",
  },
  {
    title: "小計",
    key: "amount",
    width: "15%",
    align: "right",
  },
];

// 表單提交
async function onFinish(values: any) {
  submitting.value = true;

  try {
    // 這裡可以調用API進行訂單提交
    console.log("提交訂單:", {
      ...values,
      items: cartItems.value,
      totalAmount: totalAmount.value,
    });

    // 模擬API呼叫
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 假設處理成功，導向到結果頁面
    // 實際專案中應根據API回應決定後續處理
    navigateTo("/result?success=true");
  } catch (error) {
    console.error("訂單提交失敗:", error);
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.checkout-form {
  max-width: 800px;
  margin: 0 auto;
}
</style>
