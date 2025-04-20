/**
 * 這個文件在 Cloudflare Workers 上下文中是模擬 NestJS 模塊的結構，
 * 僅用於代碼結構參考，實際上在 Workers 環境中不會被 NestJS 運行時使用。
 */

// 控制器
import { StocksController } from './controllers/stocks.controller';
import { OrdersController } from './controllers/orders.controller';

// 服務
import { StocksService } from './services/stocks.service';
import { OrdersService } from './services/orders.service';
import { D1Service } from './d1/d1.service';

export class AppModule {
	static controllers = [StocksController, OrdersController];

	static providers = [StocksService, OrdersService, D1Service];
}
