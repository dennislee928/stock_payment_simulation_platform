export interface CartItem {
	symbol: string;
	name: string;
	price: number;
	quantity: number;
}

export interface Order {
	id: string;
	userId: string;
	items: CartItem[];
	totalAmount: number;
	orderDate: Date;
	status: OrderStatus;
}

export enum OrderStatus {
	PENDING = 'pending',
	COMPLETED = 'completed',
	CANCELED = 'canceled',
}
