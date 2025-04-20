import { Injectable } from '@nestjs/common';

export interface StockData {
	symbol: string;
	name: string;
	price: number;
	change?: number;
	changePercent?: number;
	volume?: number;
	date?: string;
}

interface TWApiResponse {
	data?: any[];
	title?: string;
}

interface TWCompany {
	公司代號: string;
	公司簡稱: string;
}

@Injectable()
export class StocksService {
	private readonly apiBase: string;
	private readonly cache: Cache;

	constructor(env: any) {
		this.apiBase = env.TWSE_API_BASE || 'https://openapi.twse.com.tw';
		this.cache = env.CACHE || caches.default;
	}

	// 取得股票日交易資料
	async getStockDaily(symbol: string): Promise<StockData | null> {
		try {
			// 檢查快取
			const cacheKey = `stock:daily:${symbol}`;
			const cachedResponse = await this.getFromCache(cacheKey);
			if (cachedResponse) {
				return JSON.parse(cachedResponse);
			}

			// 從 TWSE API 取得資料
			const url = `${this.apiBase}/v1/exchangeReport/STOCK_DAY?stockNo=${symbol}`;
			const response = await fetch(url);

			if (!response.ok) {
				console.error(`TWSE API 錯誤: ${response.status} ${response.statusText}`);
				return null;
			}

			const data = (await response.json()) as TWApiResponse;

			// 處理資料
			if (data && data.data && data.data.length > 0) {
				const latestData = data.data[0];
				// TWSE API 返回格式: [日期, 成交股數, 成交金額, 開盤價, 最高價, 最低價, 收盤價, 漲跌價差, 成交筆數]
				const stockData: StockData = {
					symbol,
					name: data.title ? data.title.replace(/日成交資訊.*/, '') : symbol,
					price: parseFloat(latestData[6]),
					change: parseFloat(latestData[7]),
					changePercent: (parseFloat(latestData[7]) / parseFloat(latestData[6])) * 100,
					volume: parseInt(latestData[1].replace(/,/g, '')),
					date: latestData[0],
				};

				// 存入快取，有效期 30 分鐘
				await this.setCache(cacheKey, JSON.stringify(stockData), 30 * 60);

				return stockData;
			}

			return null;
		} catch (error) {
			console.error(`取得股票日交易資料錯誤: ${error instanceof Error ? error.message : String(error)}`);
			return null;
		}
	}

	// 搜尋股票
	async searchStocks(query: string): Promise<StockData[]> {
		try {
			const cacheKey = `stock:search:${query}`;
			const cachedResponse = await this.getFromCache(cacheKey);

			if (cachedResponse) {
				return JSON.parse(cachedResponse);
			}

			// 使用公司名稱查詢 API
			const url = `${this.apiBase}/v1/opendata/t187ap03_L`;
			const response = await fetch(url);

			if (!response.ok) {
				return [];
			}

			const companies = (await response.json()) as TWCompany[];

			// 過濾符合查詢條件的公司
			const results = companies
				.filter((company: TWCompany) => {
					return company.公司簡稱.includes(query) || company.公司代號.includes(query);
				})
				.slice(0, 10)
				.map((company: TWCompany) => ({
					symbol: company.公司代號,
					name: company.公司簡稱,
					price: 0, // 需要另外呼叫 API 獲取價格
				}));

			// 快取搜尋結果，有效期 1 小時
			await this.setCache(cacheKey, JSON.stringify(results), 60 * 60);

			return results;
		} catch (error) {
			console.error(`搜尋股票錯誤: ${error instanceof Error ? error.message : String(error)}`);
			return [];
		}
	}

	// 從快取中取得資料
	private async getFromCache(key: string): Promise<string | null> {
		try {
			const cacheResponse = await this.cache.match(key);
			if (cacheResponse) {
				return await cacheResponse.text();
			}
			return null;
		} catch (error) {
			console.error(`從快取取得資料錯誤: ${error instanceof Error ? error.message : String(error)}`);
			return null;
		}
	}

	// 設置快取
	private async setCache(key: string, value: string, ttl: number): Promise<boolean> {
		try {
			const cacheReq = new Request(key);
			const cacheRes = new Response(value, {
				headers: {
					'Cache-Control': `public, max-age=${ttl}`,
					'Content-Type': 'application/json',
				},
			});

			await this.cache.put(cacheReq, cacheRes);
			return true;
		} catch (error) {
			console.error(`設置快取錯誤: ${error instanceof Error ? error.message : String(error)}`);
			return false;
		}
	}
}
