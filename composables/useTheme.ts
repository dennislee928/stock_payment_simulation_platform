import { ref } from "vue";

// 建立全域狀態
const isDarkMode = ref(false);

export function useTheme() {
  // 切換主題
  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value;
    applyTheme();
  }

  // 根據系統偏好設置主題
  function initTheme() {
    // 從localStorage讀取主題
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      isDarkMode.value = savedTheme === "dark";
    } else {
      // 根據系統主題
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      isDarkMode.value = prefersDark;
    }

    applyTheme();

    // 監聽系統主題變化
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (localStorage.getItem("theme") === null) {
          isDarkMode.value = e.matches;
          applyTheme();
        }
      });
  }

  // 應用主題到HTML元素
  function applyTheme() {
    if (isDarkMode.value) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }

    // 保存到localStorage
    localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
  }

  return {
    isDarkMode,
    toggleDarkMode,
    initTheme,
  };
}
