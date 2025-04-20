/**
 * 這是一個簡化版的 NestJS 共通裝飾器和工具的類型定義，
 * 用於在 Cloudflare Workers 環境中模擬 NestJS API。
 * 實際開發中，我們並不依賴這些裝飾器的運行時行為，只是保持代碼結構。
 */

declare module '@nestjs/common' {
	// 控制器裝飾器
	export function Controller(prefix?: string): ClassDecorator;

	// HTTP 方法裝飾器
	export function Get(path?: string): MethodDecorator;
	export function Post(path?: string): MethodDecorator;
	export function Put(path?: string): MethodDecorator;
	export function Delete(path?: string): MethodDecorator;
	export function Patch(path?: string): MethodDecorator;
	export function Options(path?: string): MethodDecorator;
	export function Head(path?: string): MethodDecorator;

	// 參數裝飾器
	export function Param(property?: string): ParameterDecorator;
	export function Body(): ParameterDecorator;
	export function Query(property?: string): ParameterDecorator;
	export function Headers(property?: string): ParameterDecorator;

	// 其他裝飾器
	export function Injectable(): ClassDecorator;
	export function UseGuards(...guards: any[]): MethodDecorator & ClassDecorator;

	// 常用的異常類
	export class HttpException extends Error {
		constructor(response: string | object, status: number);
	}

	export class BadRequestException extends HttpException {
		constructor(message?: string | object);
	}

	export class UnauthorizedException extends HttpException {
		constructor(message?: string | object);
	}

	export class NotFoundException extends HttpException {
		constructor(message?: string | object);
	}

	export class ForbiddenException extends HttpException {
		constructor(message?: string | object);
	}

	export class InternalServerErrorException extends HttpException {
		constructor(message?: string | object);
	}
}
