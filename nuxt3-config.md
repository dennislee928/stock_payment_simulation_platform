Nuxt 3 的 檔案
在 Nuxt 3 應用程式的根目錄中，你會找到一個名為 nuxt.config.ts 的檔案
。這個檔案是 Nuxt 3 應用程式的核心配置中心，你可以在這裡配置整個專案的行為、新增模組、定義 CSS 檔案、設定路由規則等等。你可以將 nuxt.config.ts 視為你 Nuxt 3 專案的「控制面板」
。
基本結構
nuxt.config.ts 檔案通常導出一個使用 defineNuxtConfig 函數定義的物件
。defineNuxtConfig 是 Nuxt 3 提供的一個工具函數，它可以提供更好的類型提示和自動完成功能
。
程式碼範例：基本的 nuxt.config.ts 結構

import { defineNuxtConfig } from 'nuxt/config';
import { resolve } from 'path';

export default defineNuxtConfig({
// 你的配置選項將在這裡定義
alias: {
'@': resolve(\_\_dirname, './')
},
css: [
'@/assets/main.scss'
],
modules: [
// ...
]
// ...
});

Mermaid 圖表：nuxt.config.ts 的基本結構

graph TD
A[nuxt.config.ts] --> B(import { defineNuxtConfig } from 'nuxt/config');
B --> C(export default defineNuxtConfig({ ... }));
C --> D[配置物件];
D --> E{alias};
D --> F{css};
D --> G{modules};
D --> H{其他配置選項};

圖表說明：

1.  nuxt.config.ts 是 Nuxt 3 的主要設定檔
    。
2.  我們從 nuxt/config 匯入 defineNuxtConfig 函數
    。
3.  使用 export default defineNuxtConfig({ ... }) 導出一個配置物件
    。
4.  在這個配置物件中，你可以定義各種 Nuxt 3 應用程式的設定
    。
5.  常見的配置選項包括 alias（路徑別名）、css（全域 CSS 檔案）、modules（使用的模組）以及其他更進階的設定。
    主要配置選項
    nuxt.config.ts 提供了非常多的配置選項，以下是一些最常用且重要的選項：
    •
    alias: 這個選項允許你定義路徑別名，方便在專案中引用檔案
    。例如，你可以將 @ 別名指向專案的根目錄
    。
    •
    程式碼範例：定義路徑別名
    •
    Mermaid 圖表：alias 配置
    •
    css: 這個選項是一個字串陣列，用於指定需要在整個應用程式中引入的 CSS 或 SCSS 檔案
    。
    •
    程式碼範例：引入全域 CSS 檔案
    •
    Mermaid 圖表：css 配置
    •
    modules: 這是一個陣列，用於指定你的 Nuxt 3 應用程式需要使用的模組
    。模組可以擴展 Nuxt 3 的功能，例如整合 Tailwind CSS、Nuxt Content 等
    ।
    •
    程式碼範例：使用模組
    •
    Mermaid 圖表：modules 配置
    •
    app: 這個選項包含了一系列用於配置應用程式外觀和行為的子選項
    。
    ◦
    baseURL: 設定應用程式的基礎 URL。
    ◦
    buildAssetsDir: 設定建構後的靜態資源目錄名稱 (預設為 \_nuxt)。
    ◦
    cdnURL: 設定生產環境下靜態資源的 CDN URL。
    ◦
    head: 定義應用程式的全局 <head> 標籤內容，用於設定 SEO 元數據等
    ।
    ◦
    keepalive: 控制組件是否保持活躍狀態。
    ◦
    layoutTransition: 設定佈局切換的過場效果。
    ◦
    pageTransition: 設定頁面切換的過場效果。
    ◦
    rootId: 自訂應用程式根元素的 ID (預設為 \_\_nuxt)
    ।
    •
    Mermaid 圖表：app 配置
    •
    build: 這個選項用於配置應用程式的建構過程
    。你可以更改建構輸出的目錄 (.nuxt 預設為 .output)
    。
    •
    Mermaid 圖表：build 配置
    •
    debug: 設定為 true 時，Nuxt 會輸出更詳細的除錯資訊
    。
    •
    devServer: 這個選項允許你配置開發伺服器的行為，例如更改主機 (host)、埠號 (port) 等
    ।
    •
    Mermaid 圖表：devServer 配置
    •
    dir: 這個選項用於自訂 Nuxt 3 專案中特定目錄的名稱
    。例如，你可以更改 pages、components、layouts、middleware、plugins、assets、public 和 server 等目錄的名稱
    ।
    •
    Mermaid 圖表：dir 配置
    •
    extensions: 這個選項是一個字串陣列，用於指定 Nuxt 3 應該解析的檔案擴展名
    。
    •
    vite: 這個選項允許你直接配置 Vite 這個 Nuxt 3 預設使用的建構工具
    ।
    •
    webpack: 如果你選擇使用 Webpack 而不是 Vite（雖然 Nuxt 3 預設使用 Vite），你可以使用這個選項來配置 Webpack
    ।
    •
    postcss: 這個選項用於配置 PostCSS，這是一個轉換 CSS 的工具。例如，你可以使用它來配置 Tailwind CSS
    ।
    •
    程式碼範例：配置 PostCSS 和 Tailwind CSS
    •
    Mermaid 圖表：postcss 配置
    •
    ssr: 在 Nuxt 2 中，這個選項用於啟用或停用伺服器端渲染 (SSR)
    。在 Nuxt 3 中，渲染模式的配置更加細緻，通常會使用 routeRules 這個選項來針對不同的路由設定不同的渲染策略
    。
    •
    routeRules: 這是 Nuxt 3 中一個強大的新功能，允許你為特定的路由定義細緻的規則
    。你可以設定路由的渲染模式 (SSR, client-side rendering, static)、快取策略、標頭、重新導向等等。這使得你可以輕鬆實現混合渲染 (hybrid rendering)，即某些頁面在伺服器端渲染，而其他頁面在客戶端渲染
    ।
    •
    Mermaid 圖表：routeRules 配置
    模組的配置
    許多 Nuxt 3 模組允許你在 nuxt.config.ts 中進行額外的配置
    。通常，你會在 defineNuxtConfig 的物件中找到一個以模組名稱命名的屬性，你可以在這個屬性中設定模組的特定選項
    。
    程式碼範例：配置 @nuxtjs/tailwindcss 模組

import { defineNuxtConfig } from 'nuxt/config';
import { resolve } from 'path';

export default defineNuxtConfig({
modules: [
'@nuxtjs/tailwindcss'
],
tailwindcss: {
configPath: './tailwind.config.js', // 指定 Tailwind CSS 配置檔案路徑
exposeConfig: false, // 是否在全域暴露 Tailwind CSS 配置
config: {} // 直接在此處覆寫 Tailwind CSS 配置
},
// ...
});

Mermaid 圖表：模組配置

graph TD
A[nuxt.config.ts] --> B(defineNuxtConfig);
B --> C{modules: ['@nuxtjs/tailwindcss']};
B --> D{tailwindcss: { ... }};
D --> E{configPath: './tailwind.config.js'};
D --> F{exposeConfig: false};
D --> G{config: {}};
C --> H[啟用 Tailwind CSS 模組];
D --> I[Tailwind CSS 專用配置];

總結
nuxt.config.ts 是 Nuxt 3 應用程式中不可或缺的一部分。它提供了一個集中管理專案配置的強大方式，讓你能夠輕鬆地調整應用程式的各種行為和特性，包括模組整合、樣式設定、路由規則、建構選項等等
。深入理解並善用 nuxt.config.ts，將會大大提升你的 Nuxt 3 開發效率和專案的靈活性。
