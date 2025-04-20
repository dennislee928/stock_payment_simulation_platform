Pinia (狀態管理解決方案)
Pinia 是一個為 Vue.js 應用程式設計的狀態管理解決方案
。它允許你創建稱為 stores (狀態儲存) 的實體，用於定義全域應用程式狀態 (global application state)
。
概念與用途
•
全域狀態管理: Pinia 提供了一個集中的地方來管理你的應用程式的狀態，這個狀態可以在應用程式的任何組件中讀取
。
•
簡化複雜性: 相較於直接在組件中定義狀態並透過 props 傳遞，使用 Pinia 可以大幅簡化跨多個組件共享和管理狀態的複雜性，使程式碼更清晰且易於維護
。
•
分離關注點: Pinia 鼓勵將全域狀態邏輯與組件邏輯分離，提高應用程式的可組織性和可測試性
。
•
直接更新狀態: Pinia 的 actions (動作) 允許你直接修改 store 中的狀態
。這與 Vuex 不同，Pinia 沒有 mutations 的概念
。
Pinia 的核心概念
一個 Pinia store 主要包含以下幾個部分：
•
State (狀態)：這是 store 中儲存的資料，代表應用程式的全域狀態。它可以是任何 JavaScript 資料類型，例如物件、陣列、基本類型等
。
•
Actions (動作)：這些是定義在 store 內部的函式，用於修改 state。Actions 可以包含同步和非同步邏輯
。在 Pinia 中，你可以直接在 actions 裡變更 state，而不需要像 Vuex 那樣透過 mutations
。
•
Getters (取值器)：雖然在提供的資料中沒有明確提及，但 Pinia 也支援 Getters，它們是 store 的計算屬性，可以根據 state 的值衍生出新的數值。
Pinia 相較於 Vuex 的優勢
•
更簡單的 API: Pinia 的 API 設計更加直觀和簡潔，學習曲線較低
。
•
更少的樣板程式碼 (Less Boilerplate): 相較於 Vuex，Pinia 需要編寫更少的重複程式碼
。
•
模組化設計 (Modular by Design): 在 Pinia 中，你可以為不同類型的全域狀態創建多個獨立的 stores，每個 store 都是一個獨立的 JavaScript 模組。這種模組化設計使得程式碼更易於組織和管理
。
•
內建 TypeScript 支援 (TypeScript Support Out of the Box): Pinia 從一開始就支援 TypeScript，並提供優秀的 JavaScript 自動完成功能
。
•
與 Vue Devtools 整合 (Hooks Right into Vue Devtools): Pinia 與 Vue 的開發者工具 (Vue Devtools) 深度整合，方便開發者追蹤狀態變化和除錯
。
專案設定 (Project Setup)
根據提供的資料
，創建一個新的 Vue 專案的步驟通常是使用 npm 或 yarn：

npm init vue@latest

# 或者

yarn create vue

在專案創建過程中，如果詢問是否要安裝 Pinia，你可以選擇「否」，以便從頭開始設定 Pinia
。之後，你需要進入專案目錄並安裝 Pinia：

cd <你的專案名稱>
npm install pinia

# 或者

yarn add pinia

安裝完成後，你需要在你的 Vue 應用程式中註冊 Pinia。通常在 main.js 或 main.ts 檔案中進行：

// main.js 或 main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')

創建和使用 Store (Creating and Using Stores)
雖然提供的資料沒有直接展示如何創建 Pinia store 的程式碼，但根據描述
，你會為不同類型的全域狀態創建不同的 store，它們是 JavaScript 模組。通常你會在專案中創建一個 stores 資料夾來存放這些 store 檔案。
一個 store 檔案可能看起來像這樣 (這是一個概念性的範例)：

// stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
state: () => ({
user: null,
isLoggedIn: false,
}),
actions: {
login(userData) {
this.user = userData;
this.isLoggedIn = true;
},
logout() {
this.user = null;
this.isLoggedIn = false;
},
},
// 可以在此處定義 getters
})

在組件中使用 store：

<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

function handleLogin() {
  // 假設有一些登入邏輯
  const userData = { username: 'exampleUser' };
  authStore.login(userData);
}

function handleLogout() {
  authStore.logout();
}
</script>

<template>
  <div>
    <p v-if="authStore.isLoggedIn">
      已登入：{{ authStore.user.username }}
      <button @click="handleLogout">登出</button>
    </p>
    <p v-else>
      未登入
      <button @click="handleLogin">登入</button>
    </p>
  </div>
</template>

Mermaid 圖表：Pinia 狀態管理流程

graph TD
A[Vue Component] --> B{需要狀態或更新狀態?};
B -- 需要狀態 --> C[從 Pinia Store 讀取 State];
C --> A;
B -- 需要更新狀態 --> D[呼叫 Pinia Store 的 Action];
D --> E[Action 修改 State];
E --> F[Pinia Store 發出 State 更新];
F --> G[通知所有使用該 State 的 Vue Components];
G --> A;

圖表說明：

1.  Vue 組件可能需要讀取全域狀態或更新全域狀態 [A]。
2.  如果組件需要狀態 [B -- 需要狀態 --> C]，它會從相應的 Pinia Store 中讀取 State [C]，然後將狀態用於組件的渲染或其他邏輯 [C --> A]。
3.  如果組件需要更新狀態 [B -- 需要更新狀態 --> D]，它會呼叫 Pinia Store 中定義的 Action [D]。
4.  Action 內部會包含修改 State 的邏輯 [E]。
5.  當 State 被修改後 [E --> F]，Pinia Store 會發出 State 更新的通知 [F]。
6.  所有使用到該 State 的 Vue 組件都會收到更新通知 [F --> G]，並相應地重新渲染 [G --> A]。
    總結
    Pinia 是一個現代、輕量級且易於使用的 Vue.js 狀態管理解決方案
    。它透過 stores 的概念，提供了一個清晰且模組化的方式來管理應用程式的全域狀態。相較於 Vuex，Pinia 具有更簡潔的 API、更少的樣板程式碼以及更好的 TypeScript 支援，使其成為開發大型 Vue.js 應用程式的理想選擇。
