## Nuxt 3 的中介層 (Middleware)

### 概念與用途

在 Nuxt 3 中，**中介層 (Middleware)** 是一種強大的機制，它允許你在 **路由切換之前觸發一些操作** [1]。你可以將中介層視為守衛，在使用者導航到特定頁面之前攔截請求，並執行你定義的邏輯。

中介層的主要用途包括處理需要在導航前執行的邏輯，例如：

- **身份驗證 (Authentication)**：檢查使用者是否已登入，如果沒有則將其導向登入頁面 [1].
- **權限驗證 (Authorization)**：檢查使用者是否有權限訪問請求的頁面。
- **資料獲取 (Data Fetching)**：在頁面載入前預先獲取某些必要的資料。
- **日誌記錄 (Logging)**：記錄使用者的導航行為。
- **路由重定向 (Redirection)**：根據特定條件將使用者導向不同的頁面 [1].

### 中介層的種類

Nuxt 3 提供了幾種不同類型的中介層，以適應不同的使用場景 [1]：

- **匿名或內聯路由中介層 (Anonymous or Inline Route Middleware)**：

  - 這些中介層是 **直接在需要使用的頁面組件中定義** 的 [1]。
  - 它們只對定義它們的特定頁面有效。

- **具名路由中介層 (Named Route Middleware)**：

  - 這些中介層是 **在專案根目錄下的 `middleware` 資料夾中定義** 的獨立檔案 [1]。
  - 你可以在多個頁面組件中重複使用這些具名中介層。
  - 檔案名會作為中介層的名稱 (例如，`middleware/auth.ts` 對應名為 `auth` 的中介層)。

- **全域路由中介層 (Global Route Middleware)**：
  - 全域中介層會在 **每個路由被觸發時執行** [1]。
  - 要將一個具名中介層設定為全域的，你需要在其檔案名中 **加上 `.global` 後綴** (例如：`middleware/auth.global.ts`) [1]。

### `defineNuxtRouteMiddleware`

Next.js 提供了一個實用的方法 `defineNuxtRouteMiddleware`，用於 **定義路由中介層函數** [1]。這個函數可以接收兩個主要的參數：

- **`to` (目標路由)**：一個路由物件，包含使用者 **即將導航到** 的路由資訊 [1]。
- **`from` (來源路由)**：一個路由物件，包含使用者 **來自** 的路由資訊 [1]。

中介層函數可以執行以下操作：

- **不返回任何值**：表示中介層通過，允許導航繼續。
- **返回 `navigateTo(path)`**：中斷當前導航並 **重定向** 到指定的路徑 [1]。
- **返回 `abortNavigation(error)`**：中斷當前導航並可選擇傳遞一個錯誤物件。

定義一個具名中介層的範例如下 (`middleware/auth.ts`)：

```typescript
import { defineNuxtRouteMiddleware, navigateTo } from '#app';

export default defineNuxtRouteMiddleware((to, from) => {
  const isLoggedIn = false; // 假設的登入狀態

  if (!isLoggedIn && to.path !== '/login') {
    return navigateTo('/login'); // 如果未登入且目標不是登入頁面，則重定向到登入頁面 [1]
  }
});

檢查使用者登入狀態並重導向
上述的範例展示了一個常見的用途：檢查使用者是否已登入，如果未登入且嘗試訪問非登入頁面的路由，則將其重定向到 /login 頁面
。
在頁面中指定中介層
你可以在特定的頁面組件中使用 definePageMeta 這個方法來 指定該頁面需要使用的中介層
。例如，在 pages/profile.vue 中使用名為 auth 的中介層：

<script setup>
definePageMeta({
  middleware: 'auth' // 使用名為 'auth' 的具名中介層 [1]
});
</script>

<template>
  <div>個人資料頁面</div>
</template>

你也可以在 middleware 屬性中使用一個匿名中介層函數：

<script setup>
import { definePageMeta, navigateTo } from '#app';

definePageMeta({
  middleware: [(to, from) => { // 定義一個匿名中介層 [1]
    const isAdmin = false;
    if (!isAdmin && to.path.startsWith('/admin')) {
      return navigateTo('/unauthorized');
    }
  }]
});
</script>

<template>
  <div>管理員專區</div>
</template>

在插件中使用中介層
你可以在 Nuxt 3 的 插件 (Plugins) 中使用 addRouteMiddleware 方法來 註冊中介層
。這對於需要跨多個模組或在應用程式初始化時設定中介層非常有用。你也可以在插件中註冊全域中介層
。
在你的插件檔案 (plugins/global-middleware.ts) 中：

import { defineNuxtPlugin, addRouteMiddleware } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  addRouteMiddleware('global-log', (to, from) => {
    console.log(`導航從 ${from.fullPath} 到 ${to.fullPath}`);
  }, { global: true }); // 註冊一個名為 'global-log' 的全域中介層 [1]
});

在這個例子中，我們創建了一個名為 global-log 的全域中介層，它會在每次路由切換時記錄來源路由和目標路由的路徑。{ global: true } 選項表示這個中介層是全域的
。

graph LR
    A[使用者請求頁面] --> B{是否有全域中介層?};
    B -- 是 --> C[執行全域中介層];
    C --> D{中介層是否重導向?};
    D -- 是 --> E[執行重導向];
    D -- 否 --> F{頁面是否有指定中介層?};
    B -- 否 --> F;
    F -- 是 --> G[執行頁面中介層];
    G --> H{中介層是否重導向?};
    H -- 是 --> E;
    H -- 否 --> I[載入頁面];
    F -- 否 --> I;
```

這個 Mermaid 圖表簡要地說明了中介層的執行流程：

1.  當使用者請求一個頁面時，首先檢查是否存在 **全域中介層**。
2.  如果存在全域中介層，則執行這些中介層。
3.  在全域中介層執行後，檢查這些中介層是否進行了 **重導向**。如果進行了重導向，則執行重導向。
4.  如果沒有重導向，則檢查請求的 **頁面是否指定了任何中介層**。
5.  如果頁面指定了中介層，則執行這些中介層。
6.  再次檢查頁面中介層是否進行了重導向。如果進行了重導向，則執行重導向。
7.  如果沒有重導向，則最終 **載入請求的頁面**。
