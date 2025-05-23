// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  css: [
    "~/assets/css/main.css",
    "~/stores/assets/styles/base.scss",
    "~/stores/assets/styles/theme-dark.scss",
  ],
  runtimeConfig: {
    public: {
      ecpayMerchantId: process.env.ECPAY_MERCHANT_ID,
      ecpayHashKey: process.env.ECPAY_HASH_KEY,
      ecpayHashIV: process.env.ECPAY_HASH_IV,
      twseApiBase: process.env.TWSE_API_BASE,
    },
  },
  vite: {
    define: {
      "process.env": {},
    },
    ssr: {
      noExternal: ["ant-design-vue"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "~/stores/assets/styles/variables.scss";',
        },
      },
    },
  },
  nitro: {
    preset: "cloudflare-pages",
    esbuild: {
      options: {
        target: "es2019",
      },
    },
    output: {
      dir: ".output",
      publicDir: ".output/public",
    },
    routeRules: {
      "/**": { prerender: true },
    },
    prerender: {
      crawlLinks: true,
      routes: ["/"],
    },
  },
  ssr: true,
  experimental: {
    payloadExtraction: false,
  },
  app: {
    head: {
      title: "股票付款模擬平台",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "以 Nuxt 3 + ECPay 金流測試環境 + TWSE Open API 為核心，打造投資人模擬下單平台",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "stylesheet",
          href: "https://unpkg.com/ant-design-vue@3.2.20/dist/antd.min.css",
        },
      ],
    },
    buildAssetsDir: "/_nuxt/",
  },
  buildDir: ".nuxt",
});
