import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { OrdersService, CreateOrderDto, UpdateOrderStatusDto, OrderStatus } from '../services/orders.service';

@Controller('orders')
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	// 提交新訂單
	@Post()
	async createOrder(@Body() createOrderDto: CreateOrderDto) {
		return this.ordersService.createOrder(createOrderDto);
	}

	@Get()
	async getAllOrders(@Query('limit') limit: number = 100, @Query('offset') offset: number = 0) {
		return this.ordersService.getAllOrders(limit, offset);
	}

	// 獲取用戶所有訂單
	@Get('user/:userId')
	async getUserOrders(@Param('userId') userId: string, @Query('limit') limit: number = 100, @Query('offset') offset: number = 0) {
		return this.ordersService.getUserOrders(userId, limit, offset);
	}

	// 獲取單一訂單詳細資訊
	@Get(':id')
	async getOrderById(@Param('id') id: string) {
		return this.ordersService.getOrderById(id);
	}

	@Put(':id/status')
	async updateOrderStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateOrderStatusDto) {
		return this.ordersService.updateOrderStatus(id, updateStatusDto);
	}

	// 刪除訂單
	@Delete(':id')
	async deleteOrder(@Param('id') id: string) {
		await this.ordersService.deleteOrder(id);
		return { success: true, message: '訂單已刪除' };
	}
}
