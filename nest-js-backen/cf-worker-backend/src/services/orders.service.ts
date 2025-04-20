import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { D1Service, OrderEntity } from '../d1/d1.service';

export enum OrderStatus {
	PENDING = 'pending',
	PROCESSING = 'processing',
	COMPLETED = 'completed',
	CANCELLED = 'cancelled',
	FAILED = 'failed',
}

export interface CreateOrderDto {
	amount: number;
	userId?: string;
	items: {
		symbol: string;
		name: string;
		price: number;
		quantity: number;
	}[];
}

export interface UpdateOrderStatusDto {
	status: OrderStatus;
}

@Injectable()
export class OrdersService {
	private orders: OrderEntity[] = [];

	constructor(private readonly d1Service: D1Service) {}

	async createOrder(orderData: CreateOrderDto): Promise<OrderEntity> {
		const id = crypto.randomUUID();

		const order: Omit<OrderEntity, 'created_at'> = {
			id,
			amount: orderData.amount,
			status: OrderStatus.PENDING,
			items: JSON.stringify(orderData.items),
			user_id: orderData.userId,
		};

		// 儲存到 D1 資料庫
		try {
			return await this.d1Service.createOrder(order);
		} catch (error) {
			throw new BadRequestException('建立訂單失敗');
		}
	}

	async getOrderById(id: string): Promise<OrderEntity> {
		const order = await this.d1Service.getOrderById(id);

		if (!order) {
			throw new NotFoundException(`訂單 ID ${id} 不存在`);
		}

		return order;
	}

	async getAllOrders(limit = 100, offset = 0): Promise<OrderEntity[]> {
		return this.d1Service.getAllOrders(limit, offset);
	}

	async getUserOrders(userId: string, limit = 100, offset = 0): Promise<OrderEntity[]> {
		return this.d1Service.getUserOrders(userId, limit, offset);
	}

	async updateOrderStatus(id: string, updateData: UpdateOrderStatusDto): Promise<OrderEntity> {
		const order = await this.getOrderById(id);

		// 檢查訂單狀態是否有效
		if (!Object.values(OrderStatus).includes(updateData.status)) {
			throw new BadRequestException('無效的訂單狀態');
		}

		// 在這裡可以增加狀態轉換的業務規則檢查
		// 例如: 已取消的訂單不能改為處理中
		if (
			order.status === OrderStatus.CANCELLED &&
			(updateData.status === OrderStatus.PROCESSING || updateData.status === OrderStatus.COMPLETED)
		) {
			throw new BadRequestException('已取消的訂單不能改為處理中或已完成');
		}

		// 更新資料庫中的訂單狀態
		// 注意: 這裡應該實作 D1Service 的 updateOrder 方法
		// 由於目前模擬實作，我們直接返回更新後的訂單
		const updatedOrder: OrderEntity = {
			...order,
			status: updateData.status,
		};

		return updatedOrder;
	}

	async deleteOrder(id: string): Promise<void> {
		const order = await this.getOrderById(id);

		// 在實際應用中，通常不會真正刪除訂單，而是標記為已刪除
		// 這裡需要實作 D1Service 的 deleteOrder 或 markOrderAsDeleted 方法
		// 由於目前是模擬實作，我們只檢查訂單是否存在
	}
}
