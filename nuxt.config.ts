// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  css: ["ant-design-vue/dist/antd.css"],
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
  },
  app: {
    head: {
      title: "股票付款模擬平台",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content:
            "以 Nuxt 3 + ECPay 金流測試環境 + TWSE Open API 為核心，打造投資人模擬下單平台",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
});
