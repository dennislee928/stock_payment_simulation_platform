import { Router } from 'itty-router';
import 'reflect-metadata';

// 引入控制器
import { StocksController } from './controllers/stocks.controller';
import { OrdersController } from './controllers/orders.controller';

// 引入服務
import { StocksService } from './services/stocks.service';
import { OrdersService } from './services/orders.service';
import { D1Service } from './d1/d1.service';

// 創建路由器
const router = Router();

// 環境變數類型
interface Env {
	DB: D1Database;
	CACHE: Cache;
	TWSE_API_BASE: string;
	ENVIRONMENT: string;
}

// 定義路由前綴
const API_PREFIX = '/api';

// 中間件: 添加 CORS 頭部
const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

// 實現 Worker 的 fetch 處理函數
export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// 解析請求的 URL
		const url = new URL(request.url);
		const path = url.pathname;

		// 處理預檢請求
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: corsHeaders,
			});
		}

		// 只處理 API 請求
		if (!path.startsWith(API_PREFIX)) {
			return new Response('Not Found', { status: 404 });
		}

		// 初始化服務
		const d1Service = new D1Service(env.DB);
		const ordersService = new OrdersService(d1Service);
		const stocksService = new StocksService(env);

		// 初始化控制器
		const stocksController = new StocksController(stocksService);
		const ordersController = new OrdersController(ordersService);

		// 定義路由
		// 股票相關
		router.get(`${API_PREFIX}/stocks/search`, async (req) => {
			const { query } = req.query;
			const result = await stocksController.searchStocks(query);
			return new Response(JSON.stringify(result), {
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		});

		router.get(`${API_PREFIX}/stocks/:symbol`, async (req) => {
			const { symbol } = req.params;
			const result = await stocksController.getStockInfo(symbol);
			return new Response(JSON.stringify(result), {
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		});

		// 訂單相關
		router.post(`${API_PREFIX}/orders`, async (req) => {
			try {
				const body = await req.json();
				const result = await ordersController.createOrder(body);
				return new Response(JSON.stringify(result), {
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				});
			} catch (error) {
				return new Response(JSON.stringify({ success: false, message: '請求處理失敗' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				});
			}
		});

		router.get(`${API_PREFIX}/orders`, async (req) => {
			const { limit, offset } = req.query;
			const result = await ordersController.getAllOrders(Number(limit) || 100, Number(offset) || 0);
			return new Response(JSON.stringify(result), {
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		});

		router.get(`${API_PREFIX}/orders/user/:userId`, async (req) => {
			const { userId } = req.params;
			const { limit, offset } = req.query;
			const result = await ordersController.getUserOrders(userId, Number(limit) || 100, Number(offset) || 0);
			return new Response(JSON.stringify(result), {
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		});

		router.get(`${API_PREFIX}/orders/:id`, async (req) => {
			const { id } = req.params;
			const result = await ordersController.getOrderById(id);
			return new Response(JSON.stringify(result), {
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		});

		router.put(`${API_PREFIX}/orders/:id/status`, async (req) => {
			try {
				const { id } = req.params;
				const body = await req.json();
				const result = await ordersController.updateOrderStatus(id, body);
				return new Response(JSON.stringify(result), {
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				});
			} catch (error) {
				return new Response(JSON.stringify({ success: false, message: '請求處理失敗' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				});
			}
		});

		router.delete(`${API_PREFIX}/orders/:id`, async (req) => {
			const { id } = req.params;
			const result = await ordersController.deleteOrder(id);
			return new Response(JSON.stringify(result), {
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		});

		// 嘗試處理請求
		try {
			return await router.handle(request);
		} catch (err) {
			console.error('請求處理錯誤:', err);
			return new Response(
				JSON.stringify({
					success: false,
					message: '伺服器錯誤',
					error: err instanceof Error ? err.message : '未知錯誤',
				}),
				{
					status: 500,
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				}
			);
		}
	},
};
