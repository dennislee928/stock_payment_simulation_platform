# 📘 Nuxt 3 核心概念筆記大綱

本筆記涵蓋 Nuxt 3 的核心主題與最佳實踐，適合初學者與進階使用者快速查閱。

---

## 🧭 推薦閱讀順序

```mermaid
graph LR
    A[1. Nuxt 3 簡介與專案建立] --> B[2. 檔案系統路由]
    B --> C[3. Layout 系統]
    C --> D[4. 組件與自動匯入]
    D --> E[5. Composables 函數設計]
    E --> F[6. Middleware 中介層]
    F --> G[7. Plugins 插件機制]
    G --> H[8. Modules 模組擴充]
    H --> I[9. Pinia 狀態管理]
    I --> J[10. Nitro Server Engine]
    J --> K[11. 資料獲取與渲染模式]
    K --> L[12. Nuxt 配置與進階功能]
```

---

## 🔍 主題對照與來源標記

| 主題                       | 章節編號 | 文件中標記來源  |
| -------------------------- | -------- | --------------- |
| Nuxt 3 簡介與建立專案      | 1        | [1], [3]        |
| 檔案系統路由（Pages）      | 2        | [5], [6], [7]   |
| Layout 系統                | 3        | [15]            |
| Components 自動匯入        | 4        | [1]             |
| Composables 設計           | 5        | [1], [2]        |
| Middleware 中介層          | 6        | [2], [17-19]    |
| Plugins 插件系統           | 7        | [16]            |
| Modules 模組擴充點         | 8        | [20], [21]      |
| Pinia 狀態管理             | 9        | [pinia section] |
| Nitro Engine (後端架構)    | 10       | [23]            |
| 資料獲取與渲染方式         | 11       | [24], [25-27]   |
| Nuxt 配置 (nuxt.config.ts) | 12       | [21]            |

---

## 📚 推薦補充資源

```mermaid
graph TD
    A[官方文件 (docs.nuxt.com)] --> B[Nuxt 3 Guide]
    A --> C[Nuxt Modules Directory]
    A --> D[Nuxt Examples GitHub]
    C --> E[pinia.nuxt.org]
    B --> F[SSR / Hybrid 詳解]
```

- [Nuxt 3 官方文件](https://nuxt.com/docs)
- [Pinia 官方網站](https://pinia.vuejs.org/)
- [Nuxt 模組大全](https://modules.nuxtjs.org/)
- [Mermaid 圖表語法](https://mermaid.js.org/intro/)
- [VueUse 函式庫](https://vueuse.org/)

---

✅ 若你正在整理教學、轉換為 PDF、生成技術簡報或 AI 學習資料，建議使用以上順序進行學習與展示。

# 歡迎擴充章節！你可以加入如 i18n、Image 模組、Nitro 手動路由、Vite Plugin 擴充等進階主題。
