Nuxt 3 的插件 (Plugins)
在 Nuxt 3 中，插件 (Plugins) 允許你在應用程式啟動時執行特定的 JavaScript 程式碼
。它們常用於以下情境：
•
在 Vue 應用程式實例創建時掛載功能
。
•
使函數或指令在整個應用程式中全局可用，而無需每次都 import
。
•
整合第三方函式庫，例如 Firebase 或 Google Analytics
。
•
修改 Vue 的內建指令行為
。
目錄
如同版面配置，按照慣例，你的插件檔案會放在專案根目錄下的 plugins 資料夾 中
。Nuxt 3 會自動讀取這個目錄下的所有 .js、.ts 或 .vue 檔案並載入它們
。
•
命名慣例: 插件檔案的名稱可以是任何你喜歡的，例如 my-plugin.js 或 auth.plugin.ts
。
函數
每個插件檔案都應該匯出一個使用 defineNuxtPlugin 包裹的函數
。這個函數會在 Nuxt 應用程式初始化時被調用，並接收一個 nuxtApp 參數，它代表了你的 Nuxt 應用程式實例
。
範例：plugins/my-plugin.ts

import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
// 在應用程式啟動時執行的程式碼
console.log('My custom plugin is running!');

// 你可以在這裡存取 nuxtApp 的內容，例如 Vue 應用程式實例
console.log('Nuxt App Instance:', nuxtApp);
});

全局提供 (Provide)
插件的一個強大功能是透過 provide 鍵返回一個物件，將函數或指令註冊為全局可用
。在你的應用程式中，你可以透過 $加上你的鍵名 的方式來存取這些提供的內容
。
範例：plugins/say-hello.ts

import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {
return {
provide: {
sayHello: (message: string) => console.log(`Hello, ${message}!`)
}
};
});

在這個範例中，我們提供了一個名為 sayHello 的函數。你可以在你的 Vue 組件中這樣使用它：

<template>
  <button @click="$sayHello('Nuxt 3')">Say Hello</button>
</template>

<script setup>
  // 你可以直接使用 $sayHello，無需 import
</script>

Nuxt 3 會自動將 sayHello 注入到你的組件上下文 (context) 中
。你可以透過 useNuxtApp().$sayHello() 的方式在 setup 函數中存取它
。
插件的使用案例
•
整合函式庫: 你可以使用插件來初始化和配置第三方函式庫，例如設定 Firebase 連線或配置分析工具
。
•
自定義指令: 插件可以用來註冊全局自定義 Vue 指令，擴展 HTML 的功能
。
•
全局函數: 如同 sayHello 範例，你可以建立在整個應用程式中方便調用的實用函數
。
•
路由中介層 (Middleware) 的註冊: 雖然中介層有專門的檔案夾，但你也可以在插件中透過 addRouteMiddleware 方法註冊全局或具名的路由中介層
。
Mermaid 圖表：Nuxt 3 插件的載入流程

graph TD
A[應用程式啟動] --> B(讀取 plugins 目錄);
B --> C{發現插件檔案?};
C -- 是 --> D[執行 defineNuxtPlugin 函數];
D --> E{返回 provide 物件?};
E -- 是 --> F[將提供的函數/指令註冊為全局可用 ($key)];
E -- 否 --> G[繼續下一個插件或應用程式初始化];
C -- 否 --> G;
F --> G;
G --> H[應用程式準備就緒];

圖表說明：

1.  當 Nuxt 3 應用程式啟動時，它會開始初始化過程
    .
2.  Nuxt 會掃描專案根目錄下的 plugins 資料夾
    .
3.  對於每個找到的插件檔案，Nuxt 會檢查它是否匯出了一個使用 defineNuxtPlugin 包裹的函數
    .
4.  如果是，Nuxt 會執行這個插件函數，並將 nuxtApp 實例傳遞給它
    .
5.  插件函數可以選擇性地返回一個包含 provide 鍵的物件
    .
6.  如果返回了 provide 物件，Nuxt 會將該物件中的每個鍵值對註冊為全局可用的 $propertyName
    .
7.  無論插件是否提供全局內容，Nuxt 都會繼續處理下一個插件或完成應用程式的初始化
    .
8.  最終，應用程式準備就緒並開始處理使用者的請求
    .
    總而言之，Nuxt 3 的插件系統提供了一個強大的機制，用於在應用程式的生命週期中執行程式碼並擴展 Nuxt 的功能。它們有助於保持程式碼的組織性，並促進不同功能之間的良好分離
    。透過 provide 功能，你可以輕鬆地在整個應用程式中共享實用工具和服務，提高開發效率。
