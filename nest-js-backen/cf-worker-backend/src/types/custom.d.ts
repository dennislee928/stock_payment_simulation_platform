/**
 * 自定義類型定義，包含 Cloudflare Workers 的 D1 和其他相關類型。
 */

interface D1Result<T = Record<string, unknown>> {
	success: boolean;
	error?: string;
	meta?: Record<string, unknown>;
	results?: T[];
	changes?: number; // 添加 changes 屬性，解決錯誤
}

// 添加 @cloudflare/d1 相關類型
declare module '@cloudflare/d1' {
	export interface D1Database {
		prepare(query: string): D1PreparedStatement;
		batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
		dump(): Promise<ArrayBuffer>;
		exec<T = unknown>(query: string): Promise<D1Result<T>>;
	}

	export interface D1PreparedStatement {
		bind(...values: any[]): D1PreparedStatement;
		first<T = unknown>(colName?: string): Promise<T | null>;
		run<T = unknown>(): Promise<D1Result<T>>;
		all<T = unknown>(): Promise<D1Result<T>>;
		raw<T = unknown>(): Promise<T[]>;
	}
}

// itty-router 類型
declare module 'itty-router' {
	export function Router(options?: { base?: string }): {
		handle: (request: Request, ...extra: any[]) => Promise<Response>;
		get: (path: string, handler: RouteHandler, ...handlers: RouteHandler[]) => void;
		post: (path: string, handler: RouteHandler, ...handlers: RouteHandler[]) => void;
		put: (path: string, handler: RouteHandler, ...handlers: RouteHandler[]) => void;
		patch: (path: string, handler: RouteHandler, ...handlers: RouteHandler[]) => void;
		delete: (path: string, handler: RouteHandler, ...handlers: RouteHandler[]) => void;
		all: (path: string, handler: RouteHandler, ...handlers: RouteHandler[]) => void;
		options: (path: string, handler: RouteHandler, ...handlers: RouteHandler[]) => void;
	};

	type RouteHandler = (
		request: Request & {
			params?: Record<string, string>;
			query?: Record<string, string>;
		},
		...extra: any[]
	) => Response | Promise<Response>;
}
