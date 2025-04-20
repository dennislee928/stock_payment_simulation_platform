# 🗂️ Nuxt 3 檔案導向路由（File-Based Routing）

Nuxt 採用檔案為基礎的路由機制（File-Based Routing），即建立 `.vue` 檔案即對應到 URL 路徑，無需手動設定 router。

---

## 📁 路由對應基本原則

```plaintext
pages/
├── index.vue             --> /
├── about.vue             --> /about
├── users/
│   └── index.vue         --> /users
│   └── [id].vue          --> /users/:id
│   └── [id]/
│       └── settings.vue  --> /users/:id/settings
```

## 🔁 Mermaid：File Routing 對應關係圖

```mermaid
graph TD
A[pages/index.vue] --> B[/]
A1[pages/about.vue] --> C[/about]
A2[pages/users/index.vue] --> D[/users]
A3[pages/users/[id].vue] --> E[/users/:id]
A4[pages/users/[id]/settings.vue] --> F[/users/:id/settings]
```

## 🔸 動態路由

動態路由以 [param].vue 命名，例如：

pages/post/[slug].vue → /post/hello-world

可在 setup() 使用 useRoute() 取得參數：

const route = useRoute()
console.log(route.params.slug)

## 🔄 可選參數（Optional Parameter）

檔名可加 [...] 定義選填參數：

pages/user/[id].vue → /user/123
pages/user/[id]/[tab].vue → /user/123/profile

pages/user/[[tab]].vue → /user or /user/profile

## 🧠 Mermaid：動態與選填參數判斷流程

```mermaid
flowchart TD
A[使用者訪問 URL] --> B[pages 資料夾對應]
B --> C{是否有對應動態 param?}
C -- yes --> D[匹配 [param].vue]
C -- no --> E[直接比對 static 路徑]
D --> F{參數為空?}
F -- 是 --> G[匹配 [[param]].vue]
F -- 否 --> H[傳入 route.params]
```

## 🧩 多層巢狀結構範例

```plaintext
pages/
├── product/
│ ├── [category]/
│ │ └── [id].vue → /product/shoes/123
│ └── settings.vue → /product/settings
└── settings.vue → /settings
```

const route = useRoute()
const category = route.params.category
const id = route.params.id

## 📦 特殊檔案

| 檔案                   | 作用                      |
| ---------------------- | ------------------------- |
| pages/index.vue        | 根路徑 /                  |
| pages/404.vue          | 自訂 404 Not Found 頁面   |
| pages/\*\*/\_error.vue | 錯誤處理頁面（SSR Error） |

## ✅ 總結

Nuxt 3 的檔案導向路由大大簡化了開發流程：

- 自動產生 URL 路徑
- 支援巢狀結構與動態參數
- 可選參數與 404 處理皆支援
- 可搭配 useRoute(), definePageMeta() 等進行進一步控制
