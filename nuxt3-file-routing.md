Nuxt 3 的檔案系統路由
Nuxt 3 採用了一種強大且方便的路由系統，稱為檔案系統路由 (File System Routing)
。這個系統會根據你的專案中 pages 目錄下的檔案和資料夾結構，自動產生對應的網頁路由
。這大幅簡化了傳統手動設定路由的過程，讓你更專注於開發頁面本身。
核心概念
•
基於 pages 目錄: Nuxt 3 會自動掃描你專案根目錄下的 pages 資料夾
。
•
自動路由生成: 任何直接放在 pages 目錄下的 .vue 檔案都會自動轉換成一個對應的路由
。例如，pages/index.vue 會對應到根路徑 /，而 pages/about.vue 會對應到 /about
。
•
資料夾結構即路由結構: 在 pages 目錄下建立子資料夾會自動創建巢狀路由
。例如，在 pages 資料夾下建立一個 blog 資料夾，然後在 blog 資料夾中建立 index.vue 和 post.vue，那麼你的應用程式就會有 /blog 和 /blog/post 這兩個路由
。
•
index.vue 作為預設路由: 如果一個資料夾下包含名為 index.vue 的檔案，那麼當你導航到該資料夾的路徑時，index.vue 的內容會被渲染
。例如，訪問 /blog 會渲染 pages/blog/index.vue 的內容
。
•
動態路由: 你可以使用帶有方括號 [] 的檔案或資料夾名稱來創建動態路由
。例如，pages/events/[id].vue 會匹配所有以 /events/ 開頭的路徑，後面的部分會作為 id 路由參數傳遞給你的 Vue 組件
。
建立不同類型的路由

1.  基本路由:
    ◦
    在 pages 目錄下建立一個 .vue 檔案。
    ◦
    檔案名稱會直接對應到 URL 路徑。
    ◦
    例如：
    ▪
    pages/index.vue -> /
    ▪
    pages/contact.vue -> /contact
    ▪
    pages/products.vue -> /products
2.  巢狀路由 (Nested Routes):
    ◦
    在 pages 目錄下建立資料夾。
    ◦
    在資料夾中建立 .vue 檔案，包括 index.vue 作為該路徑的預設頁面。
    ◦
    例如：
    ▪
    pages/blog/index.vue -> /blog
    ▪
    pages/blog/post.vue -> /blog/post
    ▪
    pages/dashboard/settings.vue -> /dashboard/settings
    ▪
    pages/dashboard/index.vue -> /dashboard
3.  動態路由 (Dynamic Routes):
    ◦
    在 pages 目錄下建立一個名稱帶有方括號的檔案或資料夾。
    ◦
    方括號內的部分會成為路由參數的名稱。
    ◦
    例如：
    ▪
    pages/events/[id].vue -> /events/123, /events/abc 等。在 .vue 檔案中可以使用 useRouter 或 useRoute 來存取 id 參數
    。
    ▪
    pages/users/[username]/profile.vue -> /users/john/profile, /users/jane/profile 等。可以在組件中存取 username 參數。
    ▪
    在 pages/blog/[slug].vue 中，可以使用 $route.params.slug (在 Vue 2 或選項式 API 中) 或 useRoute().params.slug (在 Vue 3 的組合式 API 中) 來取得 slug 的值
    。Nuxt 3 中可以使用 useRoute().params.id
    。
    程式化導航
    Nuxt 3 提供了 <NuxtLink> 組件用於在模板中創建連結，它會自動進行客戶端導航，提升使用者體驗
    。你只需要將 to 屬性設定為對應的路徑即可
    。

<template>
  <header>
    <nav>
      <NuxtLink to="/">首頁</NuxtLink>
      <NuxtLink to="/products">產品</NuxtLink>
      <NuxtLink to="/blog">部落格</NuxtLink>
      <NuxtLink to="/events/123">活動詳情</NuxtLink>
    </nav>
  </header>
</template>

Mermaid 圖表：Nuxt 3 檔案系統路由

graph TD
subgraph pages/
index.vue --> /
about.vue --> /about
subgraph blog/
index.vue --> /blog
post.vue --> /blog/post
end
subgraph users/
[username].vue --> /users/:username
subgraph [username]/
profile.vue --> /users/:username/profile
end
end
subgraph events/
[id].vue --> /events/:id
end
end
A[瀏覽器] --> B{請求 URL};
B -- / --> C(pages/index.vue);
B -- /about --> D(pages/about.vue);
B -- /blog --> E(pages/blog/index.vue);
B -- /blog/post --> F(pages/blog/post.vue);
B -- /users/john --> G(pages/users/[username].vue);
G -- /profile --> H(pages/users/[username]/profile.vue);
B -- /events/456 --> I(pages/events/[id].vue);

圖表說明：
•
pages/ 子圖表示 pages 目錄的結構。
•
箭頭 --> 表示檔案或資料夾對應的路由路徑。
•
方括號 [] 表示動態路由參數。
•
底部的流程展示了瀏覽器根據請求的 URL，Nuxt 3 如何匹配到 pages 目錄下對應的 .vue 檔案進行渲染。
總結，Nuxt 3 的檔案系統路由是一個簡潔且強大的功能，它通過約定優於配置的方式，極大地提升了開發效率，並使得路由結構與你的專案目錄結構自然對應，易於理解和維護
。
