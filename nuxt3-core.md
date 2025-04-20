# Nuxt 3 基礎與核心概念

Nuxt 3 是一個基於 Vue 3 的現代化 Web 開發框架，旨在提供更快速的開發體驗和更好的效能。[1] 受到 React 的 Next.js 的啟發，Nuxt 3 提供了許多內建功能，可以幫助開發者更有效率地構建全端 Web 應用程式。[1]

這段簡介說明了 Nuxt 3 的核心定位：它是一個基於 Vue 3 的現代化 Web 開發框架
。其主要目標是提供更快的開發速度和更好的應用程式效能。Nuxt 3 的設計理念受到了 React 的 Next.js 的啟發，這意味著它借鑒了 Next.js 在全端應用程式開發方面的成功經驗。透過內建的許多功能，Nuxt 3 旨在協助開發者更有效率地建構 全端 Web 應用程式
。

## 1. 簡介 [1, 2]

- Nuxt 3 是建構在 **Vue 3** 之上的框架。[1]
- 它提供了許多特性，旨在**加速開發**並**改善開發者體驗**。[1]
- 如果你有 React 或 Next.js 的開發經驗，你可能會熟悉 Nuxt 3 中的某些概念。[2]
- Nuxt 3 的目標是讓開發者能夠更輕鬆地處理路由、資料獲取、狀態管理、部署等常見的 Web 開發任務。

這個「簡介」部分更詳細地說明了 Nuxt 3 的一些關鍵點：
•
Nuxt 3 是基於 Vue 3 建立的
。這表示它繼承了 Vue 3 的所有優勢，例如更快的效能、更小的體積以及 Composition API 等新的開發模式
。
•
Nuxt 3 的設計目標是 加速 Web 應用程式的開發，並透過提供更好的工具和工作流程來 改善開發者的體驗
。
•
如果你曾經開發過 React 或 Next.js 應用程式，你會發現 Nuxt 3 中有很多相似的概念
。這有助於你更快地上手 Nuxt 3。
•
Nuxt 3 的最終目標是簡化常見的 Web 開發任務，例如 路由 (routing)、資料獲取 (data fetching)、狀態管理 (state management) 和 部署 (deployment) 等。透過 Nuxt 3，開發者可以更專注於應用程式的核心邏輯，而無需花費過多時間在基礎設施的設定上。

## 2. 專案建立 [1, 3]

- 要建立一個新的 Nuxt 3 專案，你可以使用以下命令（確保你已安裝 Node.js 和 npm 或 yarn）：
  - **npm:** `npx nuxi init <專案名稱>` [1]
  - **yarn:** `yarn create nuxt-app <專案名稱>` [3]
- 執行上述命令後，Nuxt CLI 會引導你完成專案的初始化設定。
- 專案建立完成後，你需要進入專案目錄並安裝相依套件：
  - **npm:** `npm install` [1]
  - **yarn:** `yarn install` [1]
- 安裝完成後，你可以使用以下命令啟動開發伺服器：
  - **npm:** `npm run dev` [1]
  - **yarn:** `yarn dev` [1, 4]
- 這會在你的本機啟動一個開發伺服器，通常會在 `http://localhost:3000` 運行。[1]

「專案建立」部分提供了建立 Nuxt 3 專案的步驟：
•
首先，你需要確保你的開發環境中已經安裝了 Node.js 和 npm 或 yarn
。這些是 JavaScript 開發的基礎工具。
•
建立新的 Nuxt 3 專案可以使用以下命令：
◦
如果你使用 npm，請執行 npx nuxi init <專案名稱>
。npx 是 npm 5.2+ 版本內建的套件執行工具，它可以讓你直接執行沒有全局安裝的 npm 套件。 nuxi 是 Nuxt 3 的 CLI 工具，init 命令用於初始化一個新的 Nuxt 3 專案
。你需要將 <專案名稱> 替換為你想要的專案名稱。
◦
如果你使用 yarn，請執行 yarn create nuxt-app <專案名稱>
。yarn create 是 yarn 用於初始化新專案的命令，nuxt-app 是 Nuxt 3 的專案範本。同樣地，你需要將 <專案名稱> 替換為你的專案名稱。值得注意的是，來源
中也提到了 yarn create next-app，但根據標題和上下文，這裡應該是 yarn create nuxt-app。
•
執行初始化命令後，Nuxt CLI (Command Line Interface) 會引導你完成一些專案的設定，例如是否使用 TypeScript、選擇 UI 框架等
。
•
專案建立完成後，你需要使用 cd <專案名稱> 命令進入到你的專案目錄中。
•
接下來，你需要安裝專案所需的 相依套件。這些套件在專案的 package.json 檔案中定義。你可以使用以下命令來安裝：
◦
如果你使用 npm，請執行 npm install
。這個命令會下載並安裝 package.json 中列出的所有開發和生產環境所需的套件。
◦
如果你使用 yarn，請執行 yarn install
。這個命令的作用與 npm install 相同，用於安裝專案的相依套件。
•
相依套件安裝完成後，你可以啟動 開發伺服器 來預覽你的應用程式。使用的命令如下：
◦
如果你使用 npm，請執行 npm run dev
。npm run 用於執行在 package.json 的 scripts 部分定義的腳本，dev 通常被設定為啟動開發伺服器的命令
。
◦
如果你使用 yarn，請執行 yarn dev
。這會執行與 npm run dev 相同的功能，啟動 Nuxt 3 的開發伺服器。來源
中也提到了 yarn create next-app 和 yarn dev，但根據標題和上下文，這裡應該指的是 Nuxt 3 的相關命令。
•
Nuxt 3 的開發伺服器預設會在你的本機的 http://localhost:3000 這個網址上運行
。你可以在瀏覽器中打開這個網址來查看你的 Nuxt 3 應用程式。在開發過程中，Nuxt 3 會監控你的程式碼變更並自動更新瀏覽器
。

## 3. 檔案系統路由 (File System Routing) [1, 8, 9]

- Nuxt 3 最重要的特性之一是其**檔案系統路由**。[8, 9]
- 在 `pages` 目錄下的每一個 `.vue` 檔案都會自動建立一個對應的 URL 路由。[1, 8, 9]
  - 例如，在 `pages` 目錄下建立 `about.vue`，將會自動生成 `/about` 這個路由。[10]
  - `pages/index.vue` 會對應到應用程式的根目錄 `/`。[8, 9]
- **巢狀路由 (Nested Routes)** 可以透過在 `pages` 目錄下建立子目錄來實現。[7, 11]
  - 例如，在 `pages` 目錄下建立 `blog` 目錄，並在其中建立 `index.vue` 和 `article.vue`，將會分別對應到 `/blog` 和 `/blog/article` 路由。[7]
- **動態路由 (Dynamic Routes)** 可以使用在檔案名稱中使用方括號 `[]` 包裹的參數來建立。[5, 12, 13]
  - 例如，`pages/events/[id].vue` 會建立一個如 `/events/123` 或 `/events/abc` 的動態路由。[12, 13]
  - 你可以在 `.vue` 檔案的 `<script>` 中使用 `useRoute()` composable 來存取路由參數。[6, 13]
  - 在 `<template>` 中，你可以透過 `$route.params` 來存取路由參數。[6, 13, 14]
- 在目錄中建立名為 `index.vue` 的檔案，會作為該目錄的預設路由。[7, 11] 例如，存取 `/events` 時，如果 `pages/events` 目錄下有 `index.vue`，則會顯示該頁面。[11, 12]
- 在 `app.vue` 中，你需要使用 `<NuxtLayout>` 組件來渲染頁面內容。[8, 9] 並且在 `<NuxtLayout>` 內，通常會使用 `<NuxtPage>` 組件，它相當於 Vue Router 的 `<router-view>`，用於顯示目前路由對應的頁面組件。[8, 9]

「檔案系統路由」是 Nuxt 3 的核心特性之一，它極大地簡化了路由的設定：
•
檔案系統路由是 Nuxt 3 最重要的特性之一
。與傳統的 Vue 3 專案需要手動配置 Vue Router 不同，Nuxt 3 會根據 pages 目錄下的檔案結構自動生成應用程式的路由
。
•
在你的 Nuxt 3 專案根目錄下，你需要創建一個名為 pages 的目錄
。在這個目錄下的每一個 .vue 檔案 都會被 Nuxt 3 自動解析並建立一個對應的 URL 路由
。
◦
舉例來說，如果你在 pages 目錄下建立了一個名為 about.vue 的檔案，Nuxt 3 會自動為你生成一個對應的 /about 路由
。當使用者在瀏覽器中訪問 /about 這個網址時，about.vue 這個 Vue 組件就會被渲染出來
。
◦
特別地，在 pages 目錄下建立一個名為 index.vue 的檔案，它會自動對應到你應用程式的 根目錄 /
。當使用者訪問你的網站首頁時，index.vue 的內容將會顯示出來
。
•
你可以用以下的 Mermaid 圖表來視覺化這個概念：
•
巢狀路由 (Nested Routes) 可以讓你建立具有層次關係的 URL。在 Nuxt 3 中，你可以透過在 pages 目錄下 建立子目錄 來實現巢狀路由
。
◦
例如，假設你在 pages 目錄下建立了一個名為 blog 的目錄
。然後，你在 blog 目錄中建立了兩個檔案：index.vue 和 article.vue
。
▪
blog/index.vue 將會對應到 /blog 這個路由
。
▪
blog/article.vue 將會對應到 /blog/article 這個路由
。
◦
如果 blog 目錄下還有其他子目錄和 .vue 檔案，Nuxt 3 會根據這個結構遞迴地生成對應的路由
。例如，pages/blog/posts/1.vue 會對應到 /blog/posts/1。
•
以下的 Mermaid 圖表展示了巢狀路由的結構：
•
動態路由 (Dynamic Routes) 允許你建立可以匹配多個不同 URL 的路由，通常用於顯示具有唯一識別符（例如 ID）的資源
。在 Nuxt 3 中，你可以透過在 pages 目錄下的檔案名稱中使用 方括號 [] 包裹的參數 來建立動態路由
。
◦
例如，如果你建立一個名為 pages/events/[id].vue 的檔案，Nuxt 3 會為你建立一個可以匹配像 /events/123 或 /events/abc 這樣的 URL 的動態路由
。[id] 部分表示這是一個名為 id 的路由參數，它可以是任何值。
◦
在你的 [id].vue 組件的 <script> 部分，你可以使用 Nuxt 3 提供的 useRoute() composable 來存取當前路由的資訊，包括動態路由參數
。useRoute() 會返回一個包含路由資訊的物件，你可以從中獲取 params 屬性，它是一個包含所有路由參數的物件。例如，要獲取 id 參數，你可以使用 route.params.id
。
◦
在你的 <template> 部分，你也可以直接透過 $route 物件的 params 屬性 來存取路由參數
。例如，你可以使用雙花括號 {{ $route.params.id }} 來顯示 id 參數的值
。
•
以下是一個動態路由的 Mermaid 圖表示例：
•
如果在一個目錄下（例如 pages/events）只存在一個名為 index.vue 的檔案，那麼當使用者存取該目錄的 URL（例如 /events）時，index.vue 會作為該路由的 預設頁面 被顯示出來
。你不需要明確地訪問 /events/index。
•
為了讓你的 Nuxt 3 應用程式能夠正確地渲染基於 pages 目錄結構生成的頁面，你需要在你的 app.vue 檔案中使用 <NuxtLayout> 組件
。<NuxtLayout> 組件用於包裹你的頁面內容，並允許你應用不同的佈局 (layouts)。在 <NuxtLayout> 內部，你需要使用 <NuxtPage> 組件。<NuxtPage> 的作用類似於 Vue Router 的 <router-view> 組件，它是一個 佔位符，用於顯示當前 URL 路由所對應的頁面組件的內容
。
