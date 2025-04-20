declare module "nuxt/app" {
  export function useRuntimeConfig(): {
    public: {
      ecpayMerchantId: string;
      ecpayHashKey: string;
      ecpayHashIV: string;
      twseApiBase: string;
    };
  };

  export function useFetch<T = any>(
    url: string,
    options?: any
  ): Promise<{
    data: Ref<T | null>;
    error: Ref<Error | null>;
  }>;

  export function useRoute(): {
    query: Record<string, string | string[]>;
    params: Record<string, string>;
    path: string;
    fullPath: string;
  };

  export function defineNuxtPlugin(plugin: (nuxtApp: any) => void): any;
  export function definePageMeta(meta: Record<string, any>): void;
}

declare module "h3" {
  export interface H3Event {
    path?: string;
    req: {
      url?: string;
    };
    context: {
      params?: Record<string, string>;
    };
  }

  export function defineEventHandler(handler: (event: H3Event) => any): any;
  export function readBody(event: H3Event): Promise<any>;
  export function createError(options: {
    statusCode: number;
    statusMessage: string;
  }): Error;
  export function getRequestHeader(
    event: H3Event,
    name: string
  ): string | undefined;
  export function sendRedirect(event: H3Event, location: string): any;
  export function getQuery(event: H3Event): Record<string, string | string[]>;
}

declare namespace NodeJS {
  interface Process {
    client: boolean;
  }
  export interface Timeout {}
}
