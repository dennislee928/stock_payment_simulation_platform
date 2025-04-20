Nuxt 3 的版面配置 (Layouts)
在 Nuxt 3 中，版面配置 (Layouts) 提供了一種在多個頁面之間共享相同 UI 結構的方法
。這使得你可以定義應用程式的通用框架，例如頁首、頁尾、側邊欄等，然後將不同的頁面內容插入到這些框架中。
核心概念
•
共享 UI 結構: Layouts 讓你避免在每個頁面中重複編寫相同的 HTML 結構
。
•
可重複使用: 你可以創建多個不同的版面配置，並根據需要應用於不同的頁面
。
•
<NuxtLayout> 組件: Nuxt 3 提供了一個內建的 <NuxtLayout> 組件，用於指定和渲染當前頁面所使用的版面配置
。頁面的實際內容將會渲染在這個組件內
。
•
layouts 目錄: 按照慣例，你的版面配置檔案會放在專案根目錄下的 layouts 資料夾中
.
目錄
你需要在你的 Nuxt 3 專案根目錄下創建一個名為 layouts 的資料夾
。這個資料夾將會存放你的所有版面配置檔案。每個 .vue 檔案在這個目錄下都會被自動註冊為一個可用的版面配置。
•
命名慣例: 版面配置檔案的名稱將會對應到你在頁面中使用的版面配置名稱。例如，layouts/default.vue 對應到 default 這個版面配置，而 layouts/blog.vue 則對應到 blog。
•
default.vue: 如果你的 layouts 目錄下有一個名為 default.vue 的檔案，那麼它將會作為所有頁面的預設版面配置
。除非你在特定的頁面中指定了其他的版面配置。
組件
在你的主要應用程式組件 (通常是 app.vue) 中，你需要使用 <NuxtLayout> 組件來渲染當前路由所使用的版面配置
。頁面組件 (pages 目錄下的 .vue 檔案) 的內容將會被插入到 <NuxtLayout> 組件所在的位置
。
app.vue 範例：

<template>
  <div>
    <header>
      <!-- 全局頁首內容 -->
    </header>
    <NuxtLayout>
      <!-- 頁面內容將會渲染在這裡 -->
    </NuxtLayout>
    <footer>
      <!-- 全局頁尾內容 -->
    </footer>
  </div>
</template>

建立版面配置
在 layouts 資料夾下創建 .vue 檔案來定義你的版面配置。
範例：layouts/blog.vue

<template>
  <div>
    <header>
      <h1>部落格</h1>
      <!-- 部落格專用的導航或其他頁首元素 -->
    </header>
    <div class="content" style="display: flex; height: 100vh;">
      <div style="flex: 8; background-color: #f0f0f0; padding: 20px;">
        <NuxtPage /> <!-- 頁面內容將會渲染在這裡 -->
      </div>
      <div style="flex: 4; background-color: orange; padding: 20px;">
        <!-- 部落格側邊欄 -->
        側邊欄內容
      </div>
    </div>
    <footer>
      <!-- 部落格專用頁尾 -->
    </footer>
  </div>
</template>

<script setup>
  // 版面配置的 JavaScript 邏輯
</script>

<style scoped>
  /* 版面配置的私有樣式 */
</style>

在這個範例中，<NuxtPage /> 組件標記了頁面內容將要被渲染的位置
。
使用版面配置
你可以在你的頁面組件中指定要使用的版面配置。這可以透過在 <script setup> 標籤中使用 definePageMeta 函數來完成
。
範例：在 pages/blog/[id].vue 中使用 blog 版面配置

<template>
  <div>
    <h2>部落格文章：{{ $route.params.id }}</h2>
    <!-- 文章內容 -->
  </div>
</template>

<script setup>
  definePageMeta({
    layout: 'blog' // 指定使用 'blog' 版面配置
  });

  // 頁面組件的 JavaScript 邏輯
  const route = useRoute();
  console.log('文章 ID:', route.params.id);
</script>

如果你沒有在頁面中指定 layout，Nuxt 3 將會自動使用 layouts/default.vue 作為預設版面配置
。
Mermaid 圖表：Nuxt 3 版面配置

graph TD
A[瀏覽器請求頁面] --> B(Nuxt 3 路由);
B --> C{是否有指定版面配置?};
C -- 是 --> D[載入指定的版面配置 (例如 layouts/blog.vue)];
C -- 否 --> E[載入預設版面配置 (layouts/default.vue)];
D --> F(<NuxtLayout>);
E --> F;
F --> G(<NuxtPage>);
G --> H[載入對應的頁面組件 (例如 pages/blog/[id].vue)];
H --> I[頁面內容渲染到 <NuxtPage> 中];
I --> J[最終 HTML 回傳給瀏覽器];

圖表說明：

1.  當瀏覽器請求一個頁面時，Nuxt 3 的路由系統會處理這個請求
    .
2.  Nuxt 3 會檢查請求的頁面是否在 definePageMeta 中指定了特定的版面配置
    。
3.  如果指定了版面配置，Nuxt 3 會載入對應的版面配置檔案 (layouts 目錄下)
    。
4.  如果沒有指定，則會載入預設的版面配置 default.vue (如果存在)
    。
5.  載入的版面配置中包含了 <NuxtLayout> 組件
    。
6.  <NuxtPage> 組件存在於 <NuxtLayout> 內部，用於標記頁面內容的渲染位置
    。
7.  Nuxt 3 會載入與當前路由匹配的頁面組件 (pages 目錄下)
    。
8.  頁面組件的模板內容會被渲染到 <NuxtPage> 組件所在的位置。
9.  最終結合了版面配置和頁面內容的 HTML 會被回傳給瀏覽器顯示。
    總之，Nuxt 3 的版面配置系統透過 <NuxtLayout> 和 layouts 目錄提供了一個簡潔而強大的方式來管理應用程式的 UI 結構
    。你可以輕鬆地創建和應用不同的版面配置，提高程式碼的可維護性和可重用性
    。
