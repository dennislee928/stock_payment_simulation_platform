# 📈 股票付款模擬平台 — x96xu04vu6

> 以 Nuxt 3 + ECPay 金流測試環境 + TWSE Open API 為核心，打造投資人模擬下單平台，具備搜尋個股、模擬付款、報酬檢視與登入權限邏輯。

---

## 🎯 專案目標

本專案為金融科技類型 Side Project，結合開放證交所資料與金流介接，模擬一個「虛擬購股平台」：

- 使用者可搜尋個股並加入購物清單
- 完成模擬付款流程（整合 ECPay 測試金流）
- 查看已購股票報酬走勢
- 登入後進入後台帳冊，檢視個人買入記錄與法人動態分析

---

## 🔧 技術架構

| 技術面向     | 說明 |
|--------------|------|
| **Frontend** | Nuxt 3 + `useFetch()` 撈取 TWSE 開放資料 |
| **狀態管理** | 使用 Pinia 管理「購股清單」、「登入狀態」與「用戶資訊」 |
| **金流整合** | ECPay 測試 API（信用卡／超商付款模擬） |
| **後端處理** | `server/api/` 處理 callback 與訂單儲存邏輯 |
| **部署**     | Vercel / Netlify（SSR 支援） |
| **安全性**   | `middleware` 搭配 `definePageMeta()` 控制權限頁面 |

---

## 🔗 使用 API 資源

| 功能 | TWSE API Endpoint | 描述 |
|------|--------------------|------|
| 個股收盤價 | [`/v1/exchangeReport/STOCK_DAY`](https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY) | 搜尋個股代碼顯示近月走勢 |
| 公司資料 | [`/v1/opendata/t187ap03_L`](https://openapi.twse.com.tw/v1/opendata/t187ap03_L) | 顯示股票基本資料與產業分類 |
| 法人分析 | [`/v1/exchangeReport/BWIBBU_d`](https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_d) | 判斷三大法人買超與建議持有 |

---

## 🖥️ 展示功能 Demo

- [x] 🔍 搜尋股票 + 顯示即時資料
- [x] 💼 加入「模擬購物車」
- [x] 💳 ECPay 測試付款流程
- [x] 📈 已購股票回測報酬畫面
- [ ] 🛠️ 後台帳冊管理（登入保護）
- [ ] 🔐 Middleware 模擬登入機制

---

## 📦 Project Setup

```bash
# 安裝依賴
yarn install

# 開發模式啟動
yarn dev

# Nuxt SSR 預設使用 http://localhost:3000
```

---

## 🔒 ECPay 金流測試資訊

請使用 [ECPay 開發者平台](https://developer.ecpay.com.tw/) 的「測試商店帳號」：
- MerchantID: `2000132`
- HashKey/IV 與 API URL 可在登入後查看

---

## 📁 專案架構

```
.
├── app.vue
├── nuxt.config.ts
├── .env                 # 金鑰等敏感資訊（.gitignore 中排除）
├── package.json
├── tsconfig.json
├── server/
│   ├── api/
│   │   ├── order/submit.post.ts        # 虛擬下單，呼叫綠界 API
│   │   ├── payment/callback.post.ts    # 綠界金流 callback 處理
│   │   └── stocks/[symbol].get.ts      # 快取 TWSE 個股報價
│   └── middleware/
│       └── auth.global.ts              # 模擬登入驗證
├── composables/
│   ├── useStocks.ts                    # 包裝 fetch + TWSE 處理
│   ├── useCart.ts                      # 操作購物車用 Composable
│   └── useAuth.ts                      # 模擬登入行為
├── plugins/
│   └── ecpay.client.ts                 # 客製化封裝前端綠界 SDK
├── pages/
│   ├── index.vue                       # 首頁（搜尋股票）
│   ├── cart.vue                        # 模擬購物車頁
│   ├── checkout.vue                    # 結帳介面
│   ├── result.vue                      # 成交紀錄與狀態顯示
│   └── admin/
│       └── orders.vue                  # 模擬後台：已付款訂單顯示
├── layouts/
│   └── default.vue                     # 主視覺框架與導航列
├── stores/
│   ├── auth.ts                         # Pinia 登入狀態與 token 儲存
│   ├── cart.ts                         # Pinia 虛擬購物車模組
│   └── stocks.ts                       # Pinia 股票快取與展示資訊
├── assets/
│   ├── styles/
│   │   └── main.scss
│   └── icons/
│       └── ecpay.svg
└── public/
    └── ecpay-redirect.html             # 綠界 redirect return 頁面（必要）

```

---

## 📎 相關連結

- 🔗 [TWSE OpenAPI 文件](https://openapi.twse.com.tw/)
- 🔗 [ECPay 測試介接說明](https://developer.ecpay.com.tw/ServiceIntro/Detail?id=57)
- 🔗 [Vercel Nuxt 3 部署指南](https://nuxt.com/docs/guide/deploy/vercel)
- 📦 [我的 DockerHub 範例映像](https://hub.docker.com/u/dennisleetw)
- 💼 [Dennis GitHub 主頁](https://github.com/dennislee928)

---

## 🧠 作者資訊

Dennis Lee — Fullstack Developer  
喜歡整合資料流與雲端金流應用，擁有多項實務專案與資安部署經驗。

📫 Email: pcleegood@gmail.com  
📎 GitHub: [@dennislee928](https://github.com/dennislee928)

---

> Made with 💻 + 📊 + ☕ in Taipei.
