# 🧱 Nuxt 3 Layout 系統完整指南

Layout 是 Nuxt 提供的一種方式，用來為多個頁面提供一致的框架（如 Header、Footer、Sidebar 等），並透過 `<slot />` 插入個別頁面的內容。

---

## 🔹 Layout 使用情境

- 多頁面共用相同外框
- 登入/未登入版型切換（如 admin layout）
- 專案模組化維護 UI 架構

---

## 📁 預設 Layout 結構

```plaintext
layouts/
├── default.vue      # 預設套用
├── admin.vue        # 自訂 layout（需指定）
└── auth.vue         # 登入頁 layout
```

## 🔧 使用 layout 的方式

1. 建立自訂 layout

```vue
<!-- layouts/admin.vue -->
<template>
  <div class="admin-layout">
    <Navbar />
    <main><slot /></main>
  </div>
</template>
```

2. 在頁面中指定 layout

```vue
<!-- pages/admin/index.vue -->
<script setup>
definePageMeta({
  layout: "admin",
});
</script>

<template>
  <h1>管理後台</h1>
</template>
```

🔁 Mermaid：Layout 套用邏輯流程

```mermaid
flowchart TD
  A[用戶訪問某個頁面] --> B[Page
  component 被解析] B --> C{是否有指定 layout?} C -- Yes --> D[套用指定 layout，如
  admin.vue] C -- No --> E[使用 default.vue] D & E --> F[插入 slot 顯示該頁內容]
```

🎯 App 根層 layout（app.vue） Nuxt 3 引入 app.vue
作為整個應用的最上層佈局，會包住所有 layout 與
page。可用於加入全站功能元件，例如進度條、全局 Modal。

```vue
<!-- app.vue -->
<template>
  <NuxtLoadingIndicator />
  <NuxtLayout />
</template>
```

## 🧠 小技巧 用途 建議元件 共用 header/footer 放在 layout 中 使用多種 layout 使用

- definePageMeta 切換 全站 wrapper 使用 app.vue 🧩 Layout 與中介層結合範例
- 可以搭配 middleware 依據權限導向不同 layout，例如：

```ts
// middleware/auth.ts export
  default defineNuxtRouteMiddleware((to) => { const isLoggedIn =
  useCookie('auth_token') if (!isLoggedIn.value && to.path.startsWith('/admin')) {
  return navigateTo('/login') } })
```

### ✅ 總結 Layout 是 Nuxt 頁面 UI 結構的強大工具

- 使用 definePageMeta 可簡單切換版型 app.vue 是全域容器，可整合進階應用如
- preload、進度條、transition 等
