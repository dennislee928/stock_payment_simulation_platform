# Next.js 學習筆記

這份 `readme.md` 總結了與 Next.js 相關的學習資源，涵蓋了從核心概念、開發部署到進階優化和測試等各個方面。

## Next.js 主要內容與主題

### 核心概念與功能

- **路由 (Routing)**：Next.js 使用 **基於檔案系統的路由**，`app` 資料夾結構直接對應路由 [1]。
  - **佈局 (Layouts)**：使用 `layout.tsx` 在不同頁面間共享 UI 結構 [1, 2]。根佈局在 `app/layout.tsx` 定義 [2]。
  - **頁面 (Pages)**：使用 `page.tsx` 檔案建立可存取的路由 [1].
  - **動態路由 (Dynamic Routes)**：使用 `[id]` 建立動態路由，透過 `params` 存取參數 [2, 3]。
  - **連結與導航 (Linking and Navigating)**：使用 `<Link>` 組件進行客戶端導航。
  - **巢狀路由 (Nested Routes)**：在資料夾內建立子資料夾和 `page.tsx` 檔案。
  - **路由群組 (Route Groups)**：使用 `()` 包裹資料夾名稱組織路由，不影響 URL [4]。
- **組件 (Components)**：區分 **伺服器組件 (Server Components)** (預設) 和 **客戶端組件 (Client Components)** (`'use client'`) [2, 5]。伺服器組件在伺服器端渲染，可直接存取伺服器資源 [2]。客戶端組件用於需要瀏覽器互動的功能 [2, 5]。
- **資料獲取 (Data Fetching)**：
  - 可以使用 `fetch` API 獲取資料，App Router 中 `fetch` 的預設快取行為已變更 [6]。
  - `generateStaticParams` 用於 **靜態站點生成 (SSG)** [7]。
  - `unstable_cache` 可快取伺服器端資料。
  - App Router 支援 **伺服器組件中的資料獲取** [2, 8]。
  - 使用 Sanity CMS 進行資料管理和獲取 [8-12]。
  - 實時資料可以使用 `@sanity/client` 和 `next-sanity/live` [13]。
- **渲染策略 (Rendering Strategies)**：
  - **靜態站點生成 (SSG)**：建置時預先生成 HTML [7, 14]。
  - **伺服器端渲染 (SSR)**：每次請求時在伺服器端渲染 [14, 15]。
  - **客戶端渲染 (CSR)**。
  - **增量靜態再生 (ISR)**：在不重新部署的情況下更新靜態內容 [14, 15]。可以使用 `next: { revalidate: number }` 啟用 [14]。
  - **部分預先渲染 (Partial Prerendering, PPR)**：實驗性功能，結合靜態和動態渲染 [6, 15]。需在 `next.config.ts` 中啟用 (`experimental.ppr: 'incremental'`) 和在頁面中標記 (`export const experimentalPPR = true`) [6]。
- **快取 (Caching)**：App Router 提供更細緻的快取控制 [6]。
- **中介層 (Middleware)** [15]。
- **錯誤處理 (Error Handling)**：使用 `notFound()` 觸發 404 錯誤，建立自訂 `not-found.tsx` 頁面 [6, 7, 14, 16]。
- **載入 UI 與串流 (Loading UI and Streaming)**：使用 `loading.tsx` 建立載入狀態 UI。React 18 的 `Suspense` 可更細粒度顯示載入狀態 [15, 17]。串流逐步發送內容，改善使用者體驗 [15]。

### 開發與部署

- **開發環境設定 (Development Environment Setup)**：需要 Node.js 特定版本。使用 `npx create-next-app` 建立專案 [18]。使用 `npm run dev` 啟動開發伺服器 [1, 18]。
- **專案結構 (Project Structure)**：`app` 資料夾是 App Router 核心 [1]。`public` 存放靜態資源 [1]。「Route Groups」`(root)` 用於組織路由 [4]。
- **樣式 (Styling)**：內建支援 CSS Modules，可整合 Tailwind CSS [1, 19]。
- **部署 (Deployment)**：**Vercel 是 Next.js 的原生平台**，提供零配置部署和效能優化 [15, 20]。Vercel 為每個 Pull Request 產生預覽 URL。
- **測試 (Testing)**：可整合 Jest 和 React Testing Library [21-25]，或使用 Playwright 進行端對端測試 [26-31]。需要設定 Jest 相關配置 (`jest.config.js`) [21]。

### 優化與進階功能

- **Metadata 與 SEO (Search Engine Optimization)**：使用 `metadata` 物件 (`layout.tsx`, `page.tsx`) 定義靜態 metadata (title, description) [32-37]。使用 `generateMetadata` 處理動態 metadata (根據資料獲取) [32, 33, 38, 39]。支援檔案系統的 metadata (favicon, robots.txt, sitemap.xml, opengraph-image) [32, 40]。檔案系統 metadata 優先權較高 [9, 40]。可以使用 `sitemap.ts` 動態生成網站地圖 [41-43]。使用 `robots.ts` 控制爬蟲 [43-45]。
- **圖片優化 (Image Optimization)**：建議使用 `<Image>` 組件 (`next/image`) [15, 19, 46]。需在 `next.config.js` 中配置 `images.remotePatterns` 或 `images.domains` 允許的圖片來源 [46]。
- **字體優化 (Font Optimization)** [1, 15]。自託管字體 [1]。
- **指令碼優化 (Script Optimization)** [15]。
- **分析 (Analytics)**：Vercel 提供 Next.js 專用分析功能 [15]。
- **Open Graph 圖片 (Open Graph Images)**：可動態生成 [15, 32, 39, 47]。
- **草稿模式 (Draft Mode)**：預覽 Headless CMS 的草稿內容 [15, 48]。
- **服務整合 (Service Integrations)**：易於與 Sanity CMS [3, 6, 8-13, 17, 49-57], NextAuth.js (next-auth) [18], `@shadcn/ui` [5, 17], `@uiw/react-md-editor` [58] 等整合 [15]。
- **TypeScript 支援**：內建 TypeScript 支援 [11, 21, 49, 51, 52]。可以使用 Discriminated Unions [59-61] 和 Zod [62] 進行更精確的類型定義和驗證。
- **`vercel.json` 設定**：用於配置和覆寫 Vercel 的預設行為 [63, 64]。包括 `buildCommand`, `devCommand`, `installCommand`, `outputDirectory`, `public`, `rewrites`, `redirects`, `headers`, `crons`, `functions`, `images`, `regions`, `runtime`, `memory`, `maxDuration` 等 [64-71]。

### 其他相關技術與工具

- React [20]
- Tailwind CSS [1, 19]
- Jest [9, 21-25]
- React Testing Library [9, 21-25]
- Playwright [26-31]
- NextAuth.js (next-auth) [9, 18]
- Sanity CMS [3, 6, 8-13, 17, 49-57]
- Vercel [15, 20]
- `@shadcn/ui` [5, 17]
- `@uiw/react-md-editor` [58]
- TypeScript [11, 21, 49, 51, 52, 59-62]
- Zod [62]
- `markdown-it` [56]
- `server-only` [13]

## 閱讀主題順序建議

為了更好地理解 Next.js，建議按照以下順序閱讀相關主題：

1.  **核心概念**：
    - **路由 (Routing)**：理解基於檔案系統的路由是 Next.js 的基礎。
    - **組件 (Components)**：區分伺服器組件和客戶端組件對於優化應用程式至關重要。
    - **渲染策略 (Rendering Strategies)**：了解 SSG、SSR、CSR 和 ISR 的差異和應用場景。
    - **資料獲取 (Data Fetching)**：學習如何在伺服器和客戶端獲取資料。
    - **佈局 (Layouts)**：掌握如何使用佈局共享 UI。
2.  **開發基礎**：
    - **開發環境設定**：確保能夠成功建立和運行 Next.js 專案。
    - **專案結構**：熟悉 `app` 資料夾和其他重要檔案的用途。
    - **樣式**：了解如何在 Next.js 中使用 CSS 和整合 CSS 框架。
3.  **進階功能與優化**：
    - **Metadata 與 SEO**：學習如何設定網站的標題、描述和其他 SEO 相關的 metadata。
    - **圖片優化**：了解如何使用 `<Image>` 組件優化圖片載入。
    - **動態路由**：學習如何建立和處理動態路由。
    - **錯誤處理**：掌握如何處理 404 和其他錯誤。
    - **載入 UI 與串流**：改善使用者體驗。
4.  **資料管理與整合**：
    - **Sanity CMS 整合**：如果需要內容管理系統，學習如何與 Sanity CMS 整合。
    - **API 路由 (如果來源有提及)**：了解如何建立後端 API。
    - **驗證 (如果需要)**：學習如何使用 NextAuth.js 進行使用者驗證。
5.  **部署與配置**：
    - **部署 (Vercel)**：學習如何將 Next.js 應用程式部署到 Vercel。
    - **`vercel.json` 設定**：了解如何使用 `vercel.json` 檔案配置 Vercel 的行為，例如重定向、重寫和標頭設定。
6.  **測試**：
    - **測試 (Jest, React Testing Library, Playwright)**：學習如何使用測試工具確保應用程式的品質。
7.  **TypeScript 與驗證**：
    - **TypeScript 支援**：如果使用 TypeScript，了解其在 Next.js 中的應用。
    - **Discriminated Unions 和 Zod**：學習更進階的類型定義和資料驗證方法。
8.  **進階渲染策略**：
    - **增量靜態再生 (ISR)**：了解其優勢和使用方法。
    - **部分預先渲染 (PPR)**：理解實驗性的 PPR 功能及其潛在優勢。
