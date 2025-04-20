# Nuxt 3 資料獲取 (Data Fetching) 與渲染模式 (Rendering Modes)

本文將深入探討 Nuxt 3 中至關重要的兩個概念：資料獲取 (Data Fetching) 和渲染模式 (Rendering Modes)。理解這兩者對於開發高效能、易於 SEO 優化的 Nuxt 3 應用程式至關重要。我們將使用大量的圖表來輔助說明。

## 資料獲取 (Data Fetching)

在 Nuxt 3 中，有多種方式可以獲取資料。本節將重點介紹 `useFetch` 和 `useLazyFetch` 這兩個 composable。

### `useFetch`

`useFetch` 是一個在 Nuxt 3 中用於 **通用 (Universal)** 資料獲取的 composable [1]。**通用** 指的是它可以在伺服器端 (Server-Side) 或客戶端 (Client-Side) 執行資料獲取。`useFetch` 提供了一個便捷的封裝，基於 `useAsyncData` 和 `$fetch` [1]。

#### 基本用法

你可以像這樣在你的頁面 (Page)、組件 (Component) 或插件 (Plugin) 中使用 `useFetch` 來獲取資料 [1]：

```typescript
<script setup>
const { data: products, pending, error, refresh } = await useFetch('/api/products');

if (pending.value) {
  console.log('正在載入產品...');
}

if (error.value) {
  console.error('載入產品出錯：', error.value);
}

if (products.value) {
  console.log('成功載入產品：', products.value);
}
</script>

<template>
  <div>
    <h1>產品列表</h1>
    <div v-if="pending">載入中...</div>
    <div v-else-if="error">載入失敗：{{ error.message }}</div>
    <ul v-else-if="products">
      <li v-for="product in products" :key="product.id">{{ product.name }}</li>
    </ul>
  </div>
</template>

在這個例子中，useFetch('/api/products') 會非同步地向 /api/products 這個端點發出請求。它會回傳一個物件，其中包含：
•
data: 一個 ref 物件，包含獲取到的資料 。
•
pending: 一個 ref 布林值，指示請求是否正在進行中
。
•
error: 一個 ref 物件，包含請求期間發生的任何錯誤
。
•
refresh: 一個函數，可以手動重新觸發資料獲取
。
通用獲取 (Universal Fetching)
useFetch 的一個重要特性是它的通用性
。
•
伺服器端 (SSR)：當你的 Nuxt 應用程式進行伺服器端渲染時，useFetch 會在伺服器上執行，並將資料直接包含在伺服器渲染的 HTML 中。這有助於更快的首次載入和更好的 SEO
.
•
客戶端 (CSR)：如果你的應用程式在客戶端導航 (Client-Side Navigation) 或當渲染模式設定為僅客戶端渲染時，useFetch 會在瀏覽器中執行
.
Mermaid 圖表：useFetch 的通用資料獲取

sequenceDiagram
    participant Browser
    participant NuxtServer
    participant API

    Browser->>NuxtServer: 請求頁面 (首次載入)
    NuxtServer->>API: `useFetch` 請求資料
    API-->>NuxtServer: 回傳資料
    NuxtServer-->>Browser: 伺服器渲染的 HTML (包含資料)

    Browser->>Browser: 客戶端導航
    Browser->>API: `useFetch` 請求資料
    API-->>Browser: 回傳資料
    Browser->>Browser: 更新 DOM

在底層，useFetch 使用了 $fetch 這個全局暴露的函數
。$fetch 來自 ofetch 這個函式庫，它提供了一個改進的 fetch API，可以在 Node.js、瀏覽器和 Service Workers 等多個環境中使用
。
選項 (Options)
useFetch 接受一個可選的物件作為第二個參數，用於配置請求
。一些常用的選項包括：
•
method: HTTP 請求方法 (GET, POST, 等)。
•
query: 查詢參數。
•
headers: 自訂標頭。
•
transform: 一個函數，用於在接收到資料後對其進行轉換
。
•
lazy: 一個布林值，如果為 true，則資料獲取不會在組件掛載時立即執行 (參見 useLazyFetch)
.
•
immediate: 一個布林值，如果為 false，則阻止在 composable 建立後立即執行 fetch
.
•
watch: 一個 ref 或 ref 陣列，當這些 ref 的值改變時，會重新執行 fetch
.
Mermaid 圖表：useFetch 的選項

graph TD
    A[useFetch('/api/data', { ...options })] --> B{method};
    A --> C{query};
    A --> D{headers};
    A --> E{transform};
    A --> F{lazy};
    A --> G{immediate};
    A --> H{watch};

 狀態
pending ref 提供了一個方便的方式來顯示載入指示器
。當 useFetch 發出請求時，pending.value 會變為 true，請求完成後變為 false。
Mermaid 圖表：useFetch 的 pending 狀態

stateDiagram
    [*] --> Idle
    Idle --> Fetching: 發出請求
    Fetching --> Success: 請求成功 (pending = false)
    Fetching --> Error: 請求失敗 (pending = false)
    Success --> Idle
    Error --> Idle

 選項
transform 選項允許你在資料被 data ref 接收之前對其進行處理
。這在你需要重新塑造 API 回應的資料結構以適應你的前端需求時非常有用。
Mermaid 圖表：useFetch 的 transform 選項

graph TD
    A[API 回應資料] --> B(transform 函數);
    B --> C[轉換後的資料];
    C --> D(data ref);

useLazyFetch 與 useFetch 非常相似，但它預設是 延遲 (Lazy) 的
。這意味著它不會在組件掛載時立即執行資料獲取。你需要手動觸發它，例如透過呼叫 refresh() 函數
。這對於需要在使用者執行某些操作後才獲取資料的場景非常有用。
Mermaid 圖表：useLazyFetch

sequenceDiagram
    participant Component
    participant API

    Component->>Component: 組件掛載
    Component->>Component: 使用者觸發動作 (例如點擊按鈕)
    Component->>API: `useLazyFetch` (觸發後) 請求資料
    API-->>Component: 回傳資料
    Component->>Component: 更新 DOM

使用 useLazyFetch 時，你通常會結合 pending 狀態來顯示載入指示器，直到資料載入完成。這可以提供更好的使用者體驗，因為應用程式可以先呈現部分內容，然後再載入其餘資料。
Mermaid 圖表：useLazyFetch 與載入指示器

sequenceDiagram
    participant Component
    participant API

    Component->>Component: 組件掛載 (pending = true)
    Component->>Component: 顯示載入指示器
    Component->>Component: 使用者觸發動作
    Component->>API: `useLazyFetch` 請求資料
    API-->>Component: 回傳資料
    Component->>Component: 隱藏載入指示器 (pending = false)
    Component->>Component: 顯示資料

渲染模式 (Rendering Modes)
Nuxt 3 提供了多種渲染模式，讓你可以根據應用程式的需求和目標受眾來優化效能和 SEO。
渲染 (Rendering) 的概念
渲染 是指將你的 Vue.js 組件轉換為瀏覽器可以理解和顯示的 HTML 元素
。這個過程可以在 客戶端 (瀏覽器) 或 伺服器端 進行
。
Mermaid 圖表：渲染的概念

graph TD
    A[Vue.js 組件] --> B{在哪裡執行 JavaScript?};
    B -- 客戶端 (Client) --> C[瀏覽器渲染為 HTML];
    B -- 伺服器端 (Server) --> D[伺服器渲染為 HTML];

客戶端渲染 (Client-Side Rendering, CSR)
在 客戶端渲染 (CSR) 中，瀏覽器會下載一個空的 HTML 文件，然後下載並執行 JavaScript 程式碼，最終在瀏覽器中生成 HTML 元素
。
Mermaid 圖表：客戶端渲染 (CSR)

sequenceDiagram
    participant Browser
    participant Server

    Browser->>Server: 請求 HTML
    Server-->>Browser: 空的 HTML 文件
    Browser->>Server: 請求 JavaScript
    Server-->>Browser: JavaScript 程式碼
    Browser->>Browser: 執行 JavaScript
    Browser->>Browser: 渲染 HTML 和互動式介面

優點：
•
開發速度快：主要在客戶端工作，無需擔心伺服器環境的相容性
。
•
伺服器成本較低：不需要為每個請求動態生成 HTML
。
•
離線工作能力：如果應用程式的程式碼和必要的資料已經下載，某些功能可以在離線狀態下工作
。
缺點：
•
首次載入效能較差：使用者需要等待 JavaScript 下載、解析和執行後才能看到完整內容
。
•
SEO 較差：搜尋引擎爬蟲可能不會等待 JavaScript 完全執行後再索引頁面內容
。
•
需要較好的網路連線和客戶端效能：渲染工作在瀏覽器中進行，對客戶端的資源有一定要求
。
伺服器端渲染 (Server-Side Rendering, SSR) / 通用渲染 (Universal Rendering)
在 伺服器端渲染 (SSR) 或 通用渲染 (Universal Rendering) 中，伺服器會在每次使用者請求頁面時，預先將 Vue.js 組件渲染成完整的 HTML
。然後，這個完整的 HTML 會被發送到瀏覽器，使用者可以更快地看到內容。瀏覽器下載 JavaScript 後，會 水合 (Hydration) 這個靜態 HTML，使其具有互動性
。
Mermaid 圖表：伺服器端渲染 (SSR) / 通用渲染 (Universal Rendering)

sequenceDiagram
    participant Browser
    participant NuxtServer
    participant API

    Browser->>NuxtServer: 請求頁面
    NuxtServer->>API: (如果需要) 獲取資料
    API-->>NuxtServer: (如果需要) 回傳資料
    NuxtServer->>NuxtServer: 渲染 HTML
    NuxtServer-->>Browser: 完整的 HTML
    Browser->>Server: 請求 JavaScript
    Server-->>Browser: JavaScript 程式碼
    Browser->>Browser: 執行 JavaScript (水合作用)
    Browser->>Browser: 介面具有互動性

優點：
•
更好的首次載入效能：使用者可以更快地看到內容，提升使用者體驗
。
•
更好的 SEO：搜尋引擎爬蟲可以直接索引伺服器渲染的 HTML 內容
。
•
更好的無障礙性 (Accessibility)：對於依賴伺服器渲染內容的輔助技術更友好。
缺點：
•
開發複雜度較高：需要在伺服器和客戶端環境中都考慮程式碼的執行
。
•
伺服器成本較高：需要伺服器資源來動態渲染 HTML
。
•
可能的水合錯誤 (Hydration Mismatch)：如果伺服器端和客戶端渲染的 HTML 結構不一致，可能會導致錯誤
。
靜態站點生成 (Static Site Generation, SSG)
在 靜態站點生成 (SSG) 中，HTML 頁面會在 建置時 (Build Time) 預先生成
。這些預先生成的 HTML 檔案可以直接部署到 CDN (內容分發網路) 或任何靜態檔案伺服器，無需在每次請求時動態渲染。
Mermaid 圖表：靜態站點生成 (SSG)

sequenceDiagram
    participant Developer
    participant BuildProcess
    participant Server/CDN
    participant Browser

    Developer->>BuildProcess: 執行建置指令 (例如 `npm run build`)
    BuildProcess->>BuildProcess: 預先渲染 HTML 頁面
    BuildProcess-->>Server/CDN: 部署靜態 HTML 檔案
    Browser->>Server/CDN: 請求頁面
    Server/CDN-->>Browser: 靜態 HTML 檔案
    Browser->>Server/CDN: 請求 JavaScript (用於互動性)
    Server/CDN-->>Browser: JavaScript 程式碼
    Browser->>Browser: 執行 JavaScript (用於互動性)

優點：
•
最佳效能：直接提供預先生成的靜態 HTML，載入速度極快
。
•
優秀的 SEO：所有內容在建置時就已經存在於 HTML 中
。
•
無需伺服器 (對於純靜態內容)：可以直接部署到靜態主機服務
。
•
安全性高：由於沒有動態伺服器處理請求，減少了潛在的安全風險。
缺點：
•
不適用於完全動態的內容：如果內容頻繁變化或需要使用者特定的資料，SSG 可能不適合
。
•
建置時間可能較長：如果網站規模很大，需要生成大量靜態頁面，建置時間可能會很長
。
增量靜態再生 (Incremental Static Regeneration, ISR)
增量靜態再生 (ISR) 結合了 SSG 和 SSR 的優點
。你可以預先生成一部分靜態頁面 (像 SSG)，同時設定一個 過期時間 (Expiration Time)。當使用者在過期時間後請求這些頁面時，伺服器可能會先提供過期的靜態內容，然後在後台重新生成頁面，以供後續請求使用
。
Mermaid 圖表：增量靜態再生 (ISR)

sequenceDiagram
    participant Browser
    participant Server
    participant BuildProcess

    BuildProcess->>Server: 部署靜態 HTML 檔案 (設定過期時間)

    Browser->>Server: 首次請求頁面 (在過期時間內)
    Server-->>Browser: 靜態 HTML

    Browser->>Server: 後續請求頁面 (超過過期時間)
    Server-->>Browser: 過期的靜態 HTML (可能)
    Server->>BuildProcess: 後台重新生成 HTML
    BuildProcess-->>Server: 新的靜態 HTML

    Browser->>Server: 再次請求頁面
    Server-->>Browser: 新的靜態 HTML

優點：
•
快速的初始載入：提供預先生成的靜態內容
。
•
適用於半動態內容：可以定期更新靜態頁面，而無需重新建置整個網站
。
•
比完全 SSG 更快的建置時間：不需要在建置時生成所有可能的頁面
。
缺點：
•
需要伺服器：雖然初始請求可能是靜態的，但後台的重新生成需要伺服器資源
。
•
可能看到過期內容：在重新生成完成之前，使用者可能會看到舊版本的內容
。
Nuxt 3 中的混合渲染 (Hybrid Rendering)
Nuxt 3 透過 Nitro 這個新的伺服器引擎，實現了更強大的 混合渲染 (Hybrid Rendering) 能力，有時也被稱為 "e-breed rendering"
。這表示你可以為應用程式中的 每個路由 (Route) 設定不同的渲染策略和快取規則
。
你可以在 nuxt.config.ts 檔案中使用 routeRules 選項來配置這些規則
。
範例 nuxt.config.ts：

import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  routeRules: {
    '/': { ssr: true }, // 首頁使用伺服器端渲染
    '/about': { static: true }, // 關於頁面靜態生成
    '/dashboard/**': { ssr: false }, // /dashboard 下的所有頁面使用客戶端渲染
    '/blog/[id]': { isr: 60 }, // /blog/[id] 使用增量靜態再生，每 60 秒重新生成
    '/api/**': { cors: true }, // /api 下的所有路由啟用 CORS
  },
});

Mermaid 圖表：Nuxt 3 的混合渲染

graph TD
    A[使用者請求] --> B(Nuxt 3 應用程式);
    B -- 路由 '/' --> C{routeRules['/']};
    C -- ssr: true --> D[伺服器端渲染];
    B -- 路由 '/about' --> E{routeRules['/about']};
    E -- static: true --> F[靜態檔案服務];
    B -- 路由 '/dashboard/...' --> G{routeRules['/dashboard/**']};
    G -- ssr: false --> H[客戶端渲染];
    B -- 路由 '/blog/...' --> I{routeRules['/blog/[id]']};
    I -- isr: 60 --> J[增量靜態再生 (60秒)];

重點：
•
ssr: true: 對於需要 SEO 且內容不是高度動態的頁面，例如登陸頁、產品頁等
。
•
static: true: 對於內容不常變動的頁面，例如關於我們、聯絡我們等
。
•
ssr: false: 對於需要高度互動性且 SEO 要求不高的後台管理介面或儀表板等
。
•
isr: <秒數>: 對於內容會定期更新但不需要每次請求都重新渲染的頁面，例如部落格文章、新聞頁面等
。
Nitro 的角色： Nuxt 3 的混合渲染能力完全依賴於其新的伺服器引擎 Nitro
。Nitro 的跨平台支援和靈活的部署能力使得為不同的路由設定不同的渲染策略成為可能
。
總結
理解 Nuxt 3 中的資料獲取方式 (特別是 useFetch 和 useLazyFetch) 以及不同的渲染模式 (CSR, SSR/Universal, SSG, ISR, 以及 Nuxt 3 的混合渲染) 對於開發高效能和可維護的應用程式至關重要。透過明智地選擇和配置這些策略，你可以優化應用程式的首次載入速度、SEO 表現，並提供更好的使用者體驗。Nuxt 3 的 routeRules 功能更是讓你能夠以前所未有的精細度控制每個路由的渲染方式和快取行為，這一切都歸功於 Nitro 強大的底層支援。

```
