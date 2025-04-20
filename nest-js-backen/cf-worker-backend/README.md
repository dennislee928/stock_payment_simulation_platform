# 股票付款模擬平台 - Cloudflare Worker 後端

這個專案是使用 NestJS 風格開發的 Cloudflare Worker 後端，用於支援股票付款模擬平台的功能。它使用 Cloudflare D1 資料庫存儲訂單和使用者數據，並與 TWSE API 整合獲取股票數據。

## 功能特點

- **NestJS 風格的架構**：使用 Controller、Service 層結構，但針對 Cloudflare Workers 運行時做了優化
- **D1 數據庫整合**：使用 Cloudflare D1 SQL 數據庫存儲訂單數據
- **股票資料 API**：與台灣證券交易所 (TWSE) API 整合獲取股票報價
- **RESTful API**：提供標準的 RESTful API 接口
- **快取機制**：實現股票數據快取，減少對 TWSE API 的請求量

## 專案結構

```
cf-worker-backend/
├── src/
│   ├── main.ts                # Cloudflare Worker 入口點
│   ├── app.module.ts          # 應用程式模組配置
│   ├── controllers/           # API 控制器
│   │   ├── stocks.controller.ts
│   │   └── orders.controller.ts
│   ├── services/              # 業務邏輯服務
│   │   ├── stocks.service.ts  # 股票服務
│   │   └── orders.service.ts  # 訂單服務
│   ├── d1/
│   │   └── d1.service.ts      # D1 資料庫服務
│   ├── interfaces/            # 型別定義
│   │   └── order.interface.ts
│   └── types/                 # 型別聲明檔案
│       ├── nestjs-common.d.ts
│       └── custom.d.ts
├── schema.sql                 # D1 資料庫結構
├── wrangler.toml              # Cloudflare Workers 配置
├── webpack.config.js          # 打包配置
└── package.json
```

## 安裝

1. 安裝依賴：

```bash
npm install
```

2. 配置 Cloudflare 帳戶：

```bash
npx wrangler login
```

3. 創建 D1 資料庫：

```bash
npx wrangler d1 create stock_orders
```

執行此命令會產生資料庫 ID，請將其添加到 `wrangler.toml` 中的 `database_id` 欄位。

4. 初始化資料庫架構：

```bash
npm run init-db
```

## 本地開發

啟動本地開發伺服器：

```bash
npm run dev
```

## 部署

部署到 Cloudflare Workers：

```bash
npm run deploy
```

## API 端點

### 股票 API

- `GET /api/stocks?q=搜尋關鍵字` - 搜尋股票
- `GET /api/stocks/:symbol` - 獲取特定股票數據

### 訂單 API

- `POST /api/orders` - 創建新訂單
- `GET /api/orders` - 獲取所有訂單
- `GET /api/orders/:id` - 獲取特定訂單
- `GET /api/orders/user/:userId` - 獲取用戶的所有訂單
- `PUT /api/orders/:id/status` - 更新訂單狀態
- `DELETE /api/orders/:id` - 刪除訂單

## 與前端的整合

前端可以通過以下方式與此 Worker 後端整合：

```javascript
// 提交訂單範例
const response = await fetch('https://your-worker.your-subdomain.workers.dev/api/orders', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		userId: 'user123',
		amount: 15000,
		items: [{ symbol: '2330', name: '台積電', price: 600, quantity: 25 }],
	}),
});

const result = await response.json();
```

## 環境變數

在 `wrangler.toml` 文件中可以配置以下環境變數：

- `TWSE_API_BASE` - 台灣證券交易所 API 基礎 URL
- `ENVIRONMENT` - 環境設置（development 或 production）

## 授權

MIT 授權
