import { defineStore } from "pinia";

interface User {
  id: string;
  name: string;
  email: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    user: null as User | null,
    token: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn && !!state.token,
    username: (state) => state.user?.name || "訪客",
  },

  actions: {
    login(user: User, token: string) {
      this.isLoggedIn = true;
      this.user = user;
      this.token = token;

      // 模擬將令牌保存在 localStorage
      if (process.client) {
        localStorage.setItem("auth_token", token);
      }
    },

    logout() {
      this.isLoggedIn = false;
      this.user = null;
      this.token = null;

      // 移除儲存的令牌
      if (process.client) {
        localStorage.removeItem("auth_token");
      }
    },

    // 檢查本地存儲中是否有token（用於持久登入狀態）
    checkAuth() {
      if (process.client) {
        const token = localStorage.getItem("auth_token");
        if (token) {
          // 在實際應用中，這裡會發送請求到服務器驗證令牌
          // 這裡僅為模擬
          this.isLoggedIn = true;
          this.token = token;
          this.user = {
            id: "1",
            name: "模擬用戶",
            email: "user@example.com",
          };
        }
      }
    },
  },
});
