## Nuxt 3 的組合式函數 (Composable)

### 概念與目的 [1]

**組合式函數 (Composable)** 在 Nuxt 3 中是一種重要的程式碼組織模式，它的概念與 React 的 **Hooks** 非常相似 [1]。在 Vue 3 引入了**組合式 API (Composition API)** 之後，Composable 的主要目的是將原本散落在不同地方的程式邏輯拆分到獨立的檔案中 [1]。

這樣做的主要目的是：

- **使程式碼更輕量 (lighter)**：透過將特定功能邏輯抽離出來，可以減少單一檔案的程式碼量，使其更易於閱讀和理解 [1]。
- **易於除錯 (easier to debug)**：當程式出現問題時，由於邏輯被劃分到不同的 Composable 中，可以更快地定位問題的來源 [1]。
- **程式碼更乾淨 (cleaner code)**：Composable 有助於保持程式碼的結構清晰，避免邏輯混雜在一起，提高程式碼的可維護性 [1]。

### 解決重複宣告的問題：`sayHello` 範例 [1]

假設在你的 Nuxt 3 專案中有兩個不同的頁面 (`index.view` 和 `profile.view`)，並且這兩個頁面都需要一個名為 `sayHello` 的函數，該函數的功能是簡單地在控制台輸出 "hello there" [1]。

```javascript
// index.view
<script setup>
function sayHello() {
  console.log('hello there');
}
onMounted(() => {
  sayHello();
});
</script>

// profile.view
<script setup>
function sayHello() {
  console.log('hello there');
}
onMounted(() => {
  sayHello();
});
</script>

在這個例子中，sayHello 函數在 index.view 和 profile.view 中被重複宣告了
。即使這兩個函數的名稱相同，它們仍然是獨立的，存在以下潛在問題
：
•
程式碼冗餘 (code redundancy)：相同的邏輯被寫在不同的地方，增加了程式碼的總量。
•
維護困難 (maintenance difficulty)：如果 sayHello 的邏輯需要修改，你必須同時修改所有宣告它的地方，容易遺漏。
•
潛在的不一致性 (potential inconsistencies)：有可能在修改時不小心只修改了一個地方，導致不同頁面上的 sayHello 行為不一致 (例如，一個輸出 "hello"，另一個輸出 "goodbye")
。
使用 Composable () 解決方案
為了解決上述問題，我們可以創建一個 Composable 來包含 sayHello 函數
。首先，在專案的根目錄下創建一個名為 composables 的資料夾
。
然後，在這個 composables 資料夾中創建一個名為 useUtils.ts 的檔案（命名慣例通常以 use 開頭）
。
composables/useUtils.ts 的內容可能如下：

// composables/useUtils.ts
export const useUtils = () => {
  const sayHello = () => {
    console.log('hello from use utils');
  };

  return {
    sayHello,
  };
};

在這個 useUtils.ts 檔案中，我們導出了一個名為 useUtils 的函數。這個函數內部定義了 sayHello 函數，並將其作為一個物件的屬性回傳
。
現在，在 index.view 和 profile.view 中，我們可以這樣使用這個 Composable：

// index.view
<script setup>
const { sayHello } = useUtils();
onMounted(() => {
  sayHello();
});
</script>

// profile.view
<script setup>
const { sayHello } = useUtils();
onMounted(() => {
  sayHello();
});
</script>

透過 useUtils() 呼叫 Composable，我們可以解構並取得 sayHello 函數，然後在頁面中使用它。這樣就避免了在不同頁面中重複宣告相同的邏輯
。
Nuxt 3 的自動導入 (Auto Import)
Nuxt 3 的一個核心特性是自動導入 (Auto Import)
。這表示任何放在 composables 資料夾中的函數（通常以 use 開頭）都會被 Nuxt 3 自動導入到你的組件中，你無需手動使用 import 語句
。
因此，在上面的例子中，你不需要在 <script setup> 中寫 import { useUtils } from '@/composables/useUtils'，Nuxt 3 會自動幫你處理
。
命名慣例 ( 前綴)
在 Vue 3 的 Composable 中，常見的命名慣例是讓函數名稱以 use 開頭
。例如：useUser、useFetchData、useTheme 等。這個慣例有助於區分 Composable 函數和一般的工具函數或組件方法，使程式碼更易於理解
。
優點總結
使用 Composable 的主要優點包括：
•
提高程式碼可讀性 (improved code readability)：邏輯被組織到獨立的檔案中，更容易理解每個 Composable 的職責。
•
易於除錯 (easier debugging)：當程式碼出現問題時，可以更快地定位到負責特定功能的 Composable。
•
減少程式碼冗餘 (reduced code redundancy)：相同的邏輯可以在多個組件中重複使用，避免重複編寫。
•
更好的程式碼組織 (better code organization)：有助於建立更清晰和模組化的專案結構。
•
提高程式碼可維護性 (improved code maintainability)：當需要修改或擴展功能時，更容易找到相關的程式碼並進行修改。
VueUse 函式庫
VueUse 是一個非常受歡迎的 Vue.js 和 Nuxt.js 開發者使用的函式庫
。它就像一個包含了大量實用 Composable 的集合，可以幫助你更快速地開發應用程式並改善開發者體驗
。
許多常見的功能，例如偵測在元素外部的點擊、追蹤滑鼠位置、處理鍵盤事件等等，VueUse 都提供了現成的 Composable。這意味著你不需要自己編寫這些常見的邏輯
。
VueUse 的優點
：
•
加速開發 (accelerates development)：提供了大量預先編寫好的 Composable，節省了開發時間。
•
改善開發者體驗 (improves developer experience)：簡化了許多常見任務的實作。
•
避免重複造輪子 (avoids reinventing the wheel)：鼓勵使用成熟且經過測試的開源函式庫，而不是自己從頭開始編寫
。
•
高品質的程式碼 (tremendous code quality)：VueUse 由 Vue 社區的知名開發者 (如 Anthony Fu) 和許多貢獻者共同維護，程式碼品質非常高
。
•
涵蓋廣泛的功能 (covers a wide range of functionalities)：提供了處理各種常見開發需求的 Composable
。
總之，Composable 是 Nuxt 3 中組織和重用程式碼邏輯的強大工具。透過將程式邏輯拆分到獨立的檔案中，可以使你的程式碼更清晰、更易於維護。同時，像 VueUse 這樣的函式庫則進一步擴展了 Composable 的能力，為開發者提供了豐富的現成工具，以提升開發效率和專案品質。

graph TD
    subgraph 頁面組件 (Pages/Components)
        A[index.view] --> C{使用 Composable};
        B[profile.view] --> C;
    end

    subgraph composables 資料夾
        D[useUtils.ts] --> E{導出 Composable 函數 (例如：sayHello)};
    end

    C -- 自動導入 --> E;

    subgraph VueUse 函式庫
        F[clickOutside] --> C;
        G[其他實用 Composable] --> C;
    end

    style A fill:#fff,stroke:#333,stroke-width:2px
    style B fill:#fff,stroke:#333,stroke-width:2px
    style D fill:#ccf,stroke:#333,stroke-width:2px
    style E fill:#ddf,stroke:#333,stroke-width:2px
    style F fill:#eef,stroke:#333,stroke-width:2px
    style G fill:#eef,stroke:#333,stroke-width:2px
    style C fill:#bbb,stroke:#333,stroke-width:2px,stroke-dasharray: 5 5

graph TD
    subgraph Composable 的工作流程
        A[定義 Composable 函數 (use 開頭) 在 `composables` 資料夾中] --> B(Nuxt 3 自動導入 Composable);
        B --> C{在頁面或組件中使用 Composable 函數};
        C --> D[Composable 函數提供特定功能邏輯];
    end

    style A fill:#ccf,stroke:#333,stroke-width:2px
    style B fill:#bbb,stroke:#333,stroke-width:2px,stroke-dasharray: 5 5
    style C fill:#fff,stroke:#333,stroke-width:2px
    style D fill:#ddf,stroke:#333,stroke-width:2px

graph TD
    subgraph VueUse 的優勢
        A[VueUse 函式庫] --> B{提供大量預先編寫好的 Composable};
        B --> C(加速開發);
        B --> D(改善開發者體驗);
        B --> E(避免重複造輪子);
        B --> F(提供高品質程式碼);
    end

    style A fill:#eef,stroke:#333,stroke-width:2px
    style B fill:#bbb,stroke:#333,stroke-width:2px,stroke-dasharray: 5 5
    style C fill:#fff,stroke:#333,stroke-width:2px
    style D fill:#fff,stroke:#333,stroke-width:2px
    style E fill:#fff,stroke:#333,stroke-width:2px
    style F fill:#fff,stroke:#333,stroke-width:2px
```
