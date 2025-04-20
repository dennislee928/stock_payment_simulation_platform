import { defineNuxtPlugin } from "nuxt/app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();

  // 檢查是否在客戶端環境
  if (process.client) {
    // 頁面加載時檢查本地存儲的認證資訊
    authStore.checkAuth();
  }
});
