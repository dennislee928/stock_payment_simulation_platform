Nuxt 3 的 Components (組件)
在 Nuxt 3 中，組件 (Components) 是構成使用者介面的基本 building blocks。它們允許你將 UI 拆分成獨立且可重複使用的部分，使得應用程式的開發、維護和測試更加容易。
核心概念
•
可重複使用性 (Reusability)：組件可以被多次使用在應用程式的不同部分，減少重複程式碼。
•
關注點分離 (Separation of Concerns)：組件將 HTML 結構 (模板)、JavaScript 邏輯 (腳本) 和樣式 (樣式) 封裝在一起。
•
模組化 (Modularity)：將 UI 分解為小的、獨立的組件，有助於組織和管理大型應用程式。
•
自動匯入 (Auto-Import)：Nuxt 3 具有自動匯入組件的功能
。這表示你只需要在模板中使用組件的名稱，而無需手動 import 它們。
Components 目錄
在 Nuxt 3 專案中，你通常會在專案根目錄下建立一個 components 資料夾
. Nuxt 3 會自動掃描這個目錄及其子目錄中的 .vue 檔案，並將它們註冊為可全局使用的組件。
•
基本用法：直接放在 components 資料夾下的 .vue 檔案，可以直接在 pages、layouts 或其他組件的模板中使用，無需匯入。
•
命名慣例：建議使用帕斯卡命名法 (PascalCase) 來命名你的組件檔案和組件標籤 (例如 MyButton.vue 對應 <MyButton>)。
•
子目錄：你可以在 components 資料夾下建立子資料夾來更好地組織你的組件。例如，你可以創建 components/buttons/ 和 components/cards/ 資料夾。即使在子目錄中，組件仍然可以被自動匯入。例如，components/buttons/PrimaryButton.vue 可以直接在模板中使用 <PrimaryButton>。
使用 Components
在 Nuxt 3 中使用組件非常簡單，由於自動匯入的特性
，你只需要在你的 Vue 模板中直接使用組件的標籤即可。
範例：
假設你在 components 資料夾下有一個名為 MyGreeting.vue 的組件：

<template>
  <div>Hello from my custom component!</div>
</template>

<script setup>
  // 組件的 JavaScript 邏輯
</script>

<style scoped>
  /* 組件的私有樣式 */
</style>

你可以在你的 pages/index.vue 中直接使用 <MyGreeting>：

<template>
  <div>
    <h1>Welcome to my Nuxt 3 app</h1>
    <MyGreeting />
  </div>
</template>

<script setup>
  // 這個頁面的 JavaScript 邏輯
</script>

在這個例子中，你不需要在 <script setup> 中匯入 MyGreeting 組件，Nuxt 3 會自動完成這個步驟
。
特殊的 Nuxt Components
Nuxt 3 提供了一些內建的組件，用於處理特定的路由和佈局需求：
•
<NuxtPage> (或 <router-view> 放置在 <NuxtLayout>): 這個組件用於渲染當前路由對應的頁面組件
。當使用者導航到不同的 URL 時，<NuxtPage> 會動態地顯示 pages 目錄下相應的 .vue 檔案的內容。
•
<NuxtLayout>: 這個組件用於應用應用程式的佈局 (Layout)
。你可以創建不同的佈局檔案 (通常在 layouts 目錄下)，然後在頁面組件中指定要使用的佈局。<NuxtLayout> 會將頁面內容渲染到佈局中預定義的位置。
•
<NuxtLink>: 這個組件用於在應用程式中創建連結，它會自動處理客戶端導航，提供比標準 <a> 標籤更流暢的用戶體驗
。你可以使用 to 屬性指定連結的路徑。
範例：使用 <NuxtLink> 導航

<template>
  <nav>
    <NuxtLink to="/">首頁</NuxtLink>
    <NuxtLink to="/about">關於我們</NuxtLink>
    <NuxtLink to="/products">產品</NuxtLink>
  </nav>
  <NuxtPage />
</template>

與 Composables 的關係
雖然 Composables 本身不是組件，但它們與組件密切相關
。Composables 是一種將組件邏輯提取到可重複使用的函式中的模式。透過使用 Composables，你可以保持你的組件更簡潔，並將複雜的邏輯移動到獨立的檔案中。然後，你可以在多個組件中呼叫這些 Composables 來重用相同的邏輯。Nuxt 3 也自動匯入 composables 資料夾下的函式，慣例上這些函式以 use 開頭 (例如 useUtils.ts 中的 useMyFeature)
。
Mermaid 圖表：Nuxt 3 Components 的使用

graph TD
    subgraph 專案結構
        pages/ --> page1.vue;
        pages/ --> page2.vue;
        components/ --> componentA.vue;
        components/ --> componentB.vue;
        components/subfolder/ --> componentC.vue;
        layouts/ --> default.vue;
    end
    A[瀏覽器請求 URL] --> B{路由匹配?};
    B -- 是 --> C(對應的 page 組件);
    C -- 使用 --> componentA.vue;
    C -- 使用 --> componentB.vue;
    C -- 使用 --> layouts/default.vue;
    layouts/default.vue -- 包含 --> D(<NuxtPage>);
    D -- 渲染 --> C;
    A -- 導航至其他頁面 --> B;
    E(<NuxtLink>) --> F[觸發客戶端導航];
    F --> B;
    subgraph Composables
        composables/useMyFeature.ts -- 提供邏輯給 --> componentA.vue;
        composables/useAuth.ts -- 提供邏輯給 --> C;
    end

圖表說明：
1.
專案的 pages 目錄包含頁面組件，components 目錄包含可重複使用的組件，layouts 目錄包含佈局組件。
2.
當瀏覽器請求一個 URL 時，Nuxt 3 會將其匹配到 pages 目錄下的相應頁面組件。
3.
頁面組件可以在其模板中使用來自 components 目錄的組件 (透過自動匯入)。
4.
頁面組件通常會使用一個佈局 (layouts/default.vue 或其他自定義佈局)。
5.
佈局組件包含 <NuxtPage> 組件，用於渲染當前頁面組件的內容。
6.
<NuxtLink> 組件用於在不同頁面之間進行導航，觸發客戶端路由更新。
7.
composables 目錄下的函式 (以 use 開頭) 可以在組件中被呼叫，以重用邏輯並保持組件的簡潔性。
總結
Nuxt 3 的組件系統結合了 Vue.js 強大的組件模型和 Nuxt 3 的自動匯入等便利功能。透過合理地組織和使用組件，你可以構建出結構清晰、易於維護和高效的 Vue.js 應用程式。components 資料夾是存放可重複使用 UI 元素的中心，而 <NuxtPage> 和 <NuxtLayout> 則是用於處理頁面和佈局的關鍵 Nuxt 組件。利用自動匯入和 Composables，可以進一步提升開發效率和程式碼的可讀性。