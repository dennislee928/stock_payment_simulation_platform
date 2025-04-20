import { computed } from "vue";
import { useAuthStore } from "~/stores/auth";

export function useAuth() {
  const authStore = useAuthStore();

  // 模擬登入
  function login(email: string, password: string) {
    // 這裡是簡單模擬，實際應用需要透過 API 進行驗證
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // 模擬驗證成功，產生模擬 token
        const token = `mock_token_${Math.random()
          .toString(36)
          .substring(2, 15)}`;

        authStore.login(
          {
            id: "1",
            name: email.split("@")[0], // 取信箱前綴作為用戶名
            email,
          },
          token
        );

        resolve(true);
      }, 1000); // 模擬 API 延遲
    });
  }

  // 登出
  function logout() {
    authStore.logout();
  }

  // 檢查是否已登入
  function checkAuth() {
    authStore.checkAuth();
    return authStore.isAuthenticated;
  }

  return {
    isAuthenticated: computed(() => authStore.isAuthenticated),
    user: computed(() => authStore.user),
    username: computed(() => authStore.username),
    login,
    logout,
    checkAuth,
  };
}
