# 🧩 Nuxt 3 Modules 模組系統全攻略

Nuxt Modules 是 Nuxt 提供的一種擴充機制，可用來封裝功能、設定、組件、插件與自訂邏輯等，支援開發中與公開 NPM 套件模組使用。

---

## 📦 模組使用方式

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "~/modules/my-custom-module", // 本地模組
  ],
});
```

Nuxt Modules 是一個 function，接收 Nuxt 的 context 與 options：

```ts
// modules/my-custom-module.ts
export default defineNuxtModule({
  meta: {
    name: "my-custom-module",
    configKey: "myModule",
  },
  defaults: {
    enableFeatureX: true,
  },
  setup(options, nuxt) {
    console.log("✅ Module loaded with options:", options);
  },
});
```

🔁 Mermaid：Module 套用流程圖

````mermaid
flowchart TD
A[nuxt.config.ts] --> B[modules 欄位載入模組]
B --> C[套用模組 options]
C --> D[執行 setup(context)]
D --> E[修改 Nuxt App 結構（如 plugins, routes, hooks）]
```

## 📚 常見社群模組一覽

| 模組名稱 | 功能 |
| --- | --- |
| @nuxtjs/tailwindcss | TailwindCSS 自動整合 |
| @pinia/nuxt | 狀態管理 |
| @vueuse/nuxt | 提供 VueUse 套件 |
| @nuxtjs/i18n | 多語系國際化處理 |
| @nuxt/image | 圖片優化與自動處理 |

## 🔨 自訂模組結構建議

```plaintext
modules/
└── my-custom/
├── index.ts # Nuxt module 定義
├── runtime/
│ ├── composables/ # 可被 auto-import 的 composables
│ └── plugins/ # plugins 可供 Nuxt 注入
```

## 🌟 Mermaid：自訂模組整合流程圖

```mermaid
graph LR
A[modules/my-custom/index.ts] --> B[setup(options, nuxt)]
B --> C[新增 composables 到 runtime]
B --> D[新增 plugins 到 Nuxt plugins]
B --> E[使用 nuxt.hook 註冊生命周期]
E --> F[onBuildDone / onDevStart 等]
```

## 🧠 實用模組 Hook 範例

```ts
nuxt.hook('pages:extend', (pages) => {
pages.push({
name: 'custom-route',
path: '/custom',
file: resolve(\_\_dirname, './runtime/pages/custom.vue')
})
})
```

## 📎 NuxtModule API 重點

| 方法 / 參數 | 說明 |
| --- | --- |
| defineNuxtModule() | 定義一個模組入口 |
| nuxt.hook() | 綁定 Nuxt lifecycle |
| addPlugin() | 動態新增 plugin |
| addComponentsDir() | 匯入元件目錄 |
addImportsDir() 自動匯入 composables / utils

## ✅ 總結

Nuxt 3 Modules 提供了彈性強、架構清晰的功能擴充點，你可以：

- 匯入社群模組快速整合 Tailwind、Pinia、i18n 等
- 撰寫自己的模組並修改 Nuxt 運作流程
- 透過 runtime/ 提供 plugin、middleware、hook 等功能

搭配 Mermaid 流程圖與自動註冊機制，可以打造高度可擴充的 Nuxt 架構。



````
