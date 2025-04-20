import { Controller, Get, Param, Query } from '@nestjs/common';
import { StocksService, StockData } from '../services/stocks.service';

@Controller('stocks')
export class StocksController {
	constructor(private readonly stocksService: StocksService) {}

	// 獲取股票日交易數據
	@Get(':symbol')
	async getStockInfo(@Param('symbol') symbol: string): Promise<{ success: boolean; data: StockData | null; message?: string }> {
		try {
			const stockData = await this.stocksService.getStockDaily(symbol);

			if (!stockData) {
				return {
					success: false,
					data: null,
					message: '無法獲取股票資料',
				};
			}

			return {
				success: true,
				data: stockData,
			};
		} catch (error) {
			return {
				success: false,
				data: null,
				message: `獲取股票資料失敗: ${error instanceof Error ? error.message : '未知錯誤'}`,
			};
		}
	}

	// 搜尋股票
	@Get()
	async searchStocks(@Query('q') query: string): Promise<{ success: boolean; data: StockData[]; message?: string }> {
		if (!query || query.trim().length < 2) {
			return {
				success: false,
				data: [],
				message: '搜尋關鍵字需至少2個字符',
			};
		}

		try {
			const stocks = await this.stocksService.searchStocks(query.trim());

			return {
				success: true,
				data: stocks,
			};
		} catch (error) {
			return {
				success: false,
				data: [],
				message: `搜尋股票失敗: ${error instanceof Error ? error.message : '未知錯誤'}`,
			};
		}
	}
}
