import { Injectable } from '@nestjs/common';

export interface BaseEntity {
	id: string;
}

export interface OrderEntity extends BaseEntity {
	amount: number;
	status: string;
	created_at: string;
	items?: string; // JSON string of items
	user_id?: string;
}

@Injectable()
export class D1Service {
	private db: D1Database;

	constructor(db: D1Database) {
		this.db = db;
	}

	// 通用查詢方法
	async query(query: string, params?: any[]): Promise<any> {
		return await this.db
			.prepare(query)
			.bind(...(params || []))
			.all();
	}

	// 通用執行方法（插入、更新、刪除）
	async execute(query: string, params?: any[]): Promise<D1Result> {
		return await this.db
			.prepare(query)
			.bind(...(params || []))
			.run();
	}

	// 獲取單個訂單
	async getOrderById(id: string): Promise<OrderEntity | null> {
		const result = await this.db.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first<OrderEntity>();

		return result || null;
	}

	// 獲取所有訂單
	async getAllOrders(limit = 100, offset = 0): Promise<OrderEntity[]> {
		const { results } = await this.db
			.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?')
			.bind(limit, offset)
			.all<OrderEntity>();

		return results;
	}

	// 獲取用戶的訂單
	async getUserOrders(userId: string, limit = 100, offset = 0): Promise<OrderEntity[]> {
		const { results } = await this.db
			.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?')
			.bind(userId, limit, offset)
			.all<OrderEntity>();

		return results;
	}

	// 創建訂單
	async createOrder(order: Omit<OrderEntity, 'created_at'>): Promise<OrderEntity> {
		const now = new Date().toISOString();
		const itemsJson = order.items ? JSON.stringify(order.items) : null;

		await this.db
			.prepare('INSERT INTO orders (id, amount, status, created_at, items, user_id) VALUES (?, ?, ?, ?, ?, ?)')
			.bind(order.id, order.amount, order.status, now, itemsJson, order.user_id || null)
			.run();

		return {
			...order,
			created_at: now,
		};
	}

	// 更新訂單狀態
	async updateOrderStatus(id: string, status: string): Promise<boolean> {
		const result = await this.db.prepare('UPDATE orders SET status = ? WHERE id = ?').bind(status, id).run();

		return result.success && result.changes > 0;
	}

	// 刪除訂單（通常用於測試或管理員操作）
	async deleteOrder(id: string): Promise<boolean> {
		const result = await this.db.prepare('DELETE FROM orders WHERE id = ?').bind(id).run();

		return result.success && result.changes > 0;
	}
}
