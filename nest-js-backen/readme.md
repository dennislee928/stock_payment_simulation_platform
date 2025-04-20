├── src/
│ ├── main.ts # NestJS bootstrap
│ ├── app.module.ts
│ ├── app.controller.ts # 可接受來自 Nuxt 的 API 呼叫
│ ├── services/
│ │ ├── order.service.ts # 專責處理下單、查詢等邏輯
│ │ └── stocks.service.ts # 與 TWSE 互動、快取股價
│ └── d1/
│ └── d1.service.ts # 封裝 D1 DB 操作
├── wrangler.toml # Cloudflare Workers 設定
├── package.json
├── tsconfig.json
└── README.md

---

🧠 功能規劃建議
模組 說明
/orders 接收來自 Nuxt 的付款完成資料，記錄入 D1，查詢歷史訂單
/stocks 透過 Cron or 定時 Cache 保存 TWSE 個股報價
/users（可選） 對應模擬帳戶系統，可擴展為多使用者平台

---

🌐 API 與前端互動（範例）

// POST /api/workers/order
{
orderId: "STOCK123456789",
status: "PAID",
items: [...],
totalAmount: 35000
}

    Nuxt 可透過 $fetch('/api/workers/order', { method: 'POST', body }) 發送付款完成訊息。

⚙️ 部署與整合策略

    使用 wrangler.toml 配置 d1_database_binding 與 workers_dev 子網域

    可將此目錄獨立為 GitHub 子 Repo，設定 GitHub Actions 推送部署到 Cloudflare Workers

    在 Nuxt 3 中設 runtimeConfig.public.workerApiBase（或 middleware）存取

---

📚 延伸學習資源

    NestJS 官方文檔

    Cloudflare D1 資料庫官方

    使用 NestJS with Cloudflare Workers

    wrangler deploy 教學

---

### 3️⃣ 安裝 Cloudflare D1 相依與 SDK

```bash
yarn add @cloudflare/d1
```

---

### 4️⃣ 專案結構草圖

```
cf-worker-backend/
├── src/
│   ├── main.ts              # bootstrap Workers handler
│   ├── app.module.ts
│   ├── app.controller.ts
│   └── d1/
│       └── d1.service.ts
├── wrangler.toml           # Workers 設定
├── package.json
├── tsconfig.json
└── README.md
```

---

### 5️⃣ `wrangler.toml` 範例設定

```toml
name = "cf-worker-backend"
type = "javascript"
compatibility_date = "2024-04-20"

[[d1_databases]]
binding = "DB"
database_name = "stock_orders"
database_id = "your-d1-id"
```

取得 `database_id` 請先建立 D1：

```bash
wrangler d1 create stock_orders
```

---

### 6️⃣ 建立 D1 schema.sql 並初始化

```sql
-- schema.sql
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  amount INTEGER,
  status TEXT,
  created_at TEXT
);
```

```bash
wrangler d1 execute stock_orders --file=./schema.sql
```

---

### 7️⃣ 部署至 Cloudflare Workers

```bash
wrangler deploy
```

---
