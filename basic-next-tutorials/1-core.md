# Next.js 核心概念與功能

## 路由 (Routing)

Next.js 使用 **基於檔案系統的路由 (File-system Routing)** [1]。在專案的 `app` 資料夾中建立的檔案和資料夾結構，會直接對應到應用程式的 URL 路由 [1-6].

```mermaid
graph LR
    subgraph app/
        index.tsx --> /
        about/page.tsx --> /about
        blog/[id]/page.tsx --> /blog/[id]
        dashboard/(users)/page.tsx --> /dashboard/users
    end

佈局 (Layouts)
佈局 (Layouts) 是在不同的頁面之間共享使用者介面結構的方式
. 你可以在 app 資料夾中的任何層級建立 layout.tsx 檔案來定義佈局. 根佈局通常在 app/layout.tsx 中定義，它會應用於整個應用程式. 子佈局會嵌套在根佈局或其他父佈局中
.

graph TD
    root_layout(app/layout.tsx) --> child_layout(app/dashboard/layout.tsx)
    child_layout --> page(app/dashboard/page.tsx)

頁面 (Pages)
頁面 (Pages) 是使用 page.tsx（或其他支援的檔案副檔名如 .js, .jsx）檔案在路由中建立可公開存取的頁面
. 每個 page.tsx 檔案都會定義一個唯一的路由路徑. 首頁通常是 app/page.tsx 對應到 /
.
動態路由 (Dynamic Routes)
動態路由 (Dynamic Routes) 允許你根據資料或使用者輸入建立具有動態區段的路由
. 你可以使用方括號 [paramName] 來定義動態路徑參數，例如 app/blog/[id]/page.tsx 會匹配 /blog/123 或 /blog/post-title 等路徑. 你可以透過頁面組件的 params prop 來存取這些動態參數
.

graph LR
    subgraph app/blog/[id]/
        page.tsx --> receives_params{params: { id: string }}
    end
    /blog/123 --> app/blog/[id]/page.tsx
    /blog/post-title --> app/blog/[id]/page.tsx

連結與導航 (Linking and Navigating)
在 Next.js 中進行客戶端導航，通常使用 <Link> 組件，該組件來自 next/link
. <Link> 組件會預先載入連結的資源，從而實現更快的導航. 避免使用標準的 <a> 標籤進行內部導航，因為這會導致完整的頁面重新載入
.

import Link from 'next/link';

function HomePage() {
  return (
    <Link href="/users">
      前往使用者頁面
    </Link>
  );
}

巢狀路由 (Nested Routes)
巢狀路由 (Nested Routes) 是透過在 app 資料夾內建立子資料夾和在這些子資料夾中建立 page.tsx 檔案來實現的
. 資料夾結構會反映出 URL 的層級. 例如，app/dashboard/users/page.tsx 會對應到 /dashboard/users 這個路由. 佈局也可以在這些巢狀路由中嵌套使用
.

graph TD
    subgraph app/dashboard/
        page.tsx --> /dashboard
        subgraph users/
            page.tsx --> /dashboard/users
        end
        subgraph analytics/
            page.tsx --> /dashboard/analytics
        end
    end

路由群組 (Route Groups)
路由群組 (Route Groups) 允許你使用 () 包裹資料夾名稱來組織路由，而不會影響最終的 URL 路徑
. 這對於組織相關的路由和應用不同的佈局非常有用. 例如，(dashboard)/users/page.tsx 和 (marketing)/about/page.tsx 分別對應到 /users 和 /about，並且可以擁有各自的佈局
.

graph TD
    subgraph app/(dashboard)/
        users/page.tsx --> /users
    end
    subgraph app/(marketing)/
        about/page.tsx --> /about
    end

組件 (Components)
Next.js 區分兩種主要的組件類型：伺服器組件 (Server Components) 和 客戶端組件 (Client Components)
. 預設情況下，app 資料夾內的所有組件都是 伺服器組件 (Server Components)
.
伺服器組件 (Server Components)
•
執行環境：伺服器組件在伺服器端執行
.
•
功能：
◦
可以直接存取伺服器資源，例如資料庫和檔案系統
.
◦
可以安全地保留敏感資訊，如 API 金鑰
.
◦
初始 HTML 是在伺服器端渲染的，有助於更快的首次載入和更好的 SEO
.
◦
可以執行伺服器端資料獲取
.
•
限制：伺服器組件無法直接使用瀏覽器特定的 API（例如 window、localStorage）或 React 的 Hook 來處理互動式事件（例如 useState、useEffect）
.
客戶端組件 (Client Components)
•
執行環境：客戶端組件在使用者的瀏覽器中執行
.
•
功能：
◦
用於需要瀏覽器互動的功能，例如處理事件、管理狀態和使用瀏覽器 API
.
◦
透過在組件檔案的頂部新增 'use client' 指令來將組件標記為客戶端組件
.
◦
可以在伺服器端預先渲染以產生靜態 HTML 外殼，然後在客戶端進行水合 (hydration) 以使其具有互動性
.
•
注意事項：客戶端組件會增加發送到瀏覽器的 JavaScript 程式碼量
.

graph TD
    ServerComponent -- runs on --> Server
    ClientComponent -- runs on --> Browser
    ClientComponent -- pre-rendered on --> Server
    Server -- can access --> ServerResources
    Browser -- handles --> UserInteraction

理解伺服器組件和客戶端組件之間的區別對於建構高效能的 Next.js 應用程式至關重要
. 預設使用伺服器組件，並僅在需要瀏覽器互動時才使用客戶端組件是一個常見的最佳實踐
```
