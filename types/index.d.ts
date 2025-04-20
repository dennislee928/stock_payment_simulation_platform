/// <reference path="./nuxt.d.ts" />

declare module "vue" {
  export interface Ref<T = any> {
    value: T;
  }
  export function ref<T>(value: T): Ref<T>;
  export function computed<T>(getter: () => T): Ref<T>;
}

declare module "~/stores/auth" {
  export function useAuthStore(): any;
}

declare module "~/stores/cart" {
  export function useCartStore(): any;
}

declare module "~/stores/stocks" {
  export function useStocksStore(): any;
}

declare module "~/composables/useAuth" {
  export function useAuth(): any;
}

declare module "~/composables/useCart" {
  export function useCart(): any;
}

declare module "~/composables/useStocks" {
  export function useStocks(): any;
}
