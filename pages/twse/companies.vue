<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">上市公司資料</h1>

    <div v-if="loading" class="flex justify-center items-center py-10">
      <div
        class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"
      ></div>
      <span class="ml-3">資料載入中...</span>
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
    >
      <p>{{ error }}</p>
      <button
        @click="fetchCompanies"
        class="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        重新嘗試
      </button>
    </div>

    <div
      v-else-if="companies.length === 0"
      class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6"
    >
      <p>沒有找到任何上市公司資料</p>
    </div>

    <div v-else>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜尋公司代碼或名稱..."
        class="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-2 px-4 border-b text-left">公司代碼</th>
              <th class="py-2 px-4 border-b text-left">公司名稱</th>
              <th class="py-2 px-4 border-b text-left">產業類別</th>
              <th class="py-2 px-4 border-b text-left">董事長</th>
              <th class="py-2 px-4 border-b text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="company in filteredCompanies"
              :key="company.Code"
              class="hover:bg-gray-50"
            >
              <td class="py-2 px-4 border-b">{{ company.Code }}</td>
              <td class="py-2 px-4 border-b">{{ company.Name }}</td>
              <td class="py-2 px-4 border-b">
                {{ company.Industry || "未分類" }}
              </td>
              <td class="py-2 px-4 border-b">
                {{ company.Chairman || "無資料" }}
              </td>
              <td class="py-2 px-4 border-b">
                <button
                  @click="goToStock(company.Code)"
                  class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  查看詳情
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const companies = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref("");

// 過濾公司列表
const filteredCompanies = computed(() => {
  if (!searchQuery.value) return companies.value;

  const query = searchQuery.value.toLowerCase();
  return companies.value.filter(
    (company) =>
      company.Code.toLowerCase().includes(query) ||
      company.Name.toLowerCase().includes(query)
  );
});

// 獲取公司數據
async function fetchCompanies() {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch("/api/twse/companies");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API 回應錯誤 (${response.status}): ${errorText || response.statusText}`
      );
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      companies.value = data;
    } else {
      console.error("API回應格式不正確:", data);
      throw new Error("收到的資料格式不正確");
    }
  } catch (err) {
    console.error("獲取上市公司資料錯誤:", err);
    error.value = `無法取得上市公司資料: ${err.message}`;
  } finally {
    loading.value = false;
  }
}

// 導航到股票詳情頁
function goToStock(code) {
  navigateTo(`/stocks/${code}`);
}

// 頁面載入時獲取數據
onMounted(() => {
  fetchCompanies();
});
</script>
