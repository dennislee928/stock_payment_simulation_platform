# 🔌 Nuxt 3 Plugins 插件系統完整指南

Plugin 是 Nuxt 提供的一種方式，用來在 App 初始化階段注入工具、執行邏輯，或擴充 Nuxt App context。

---

## 🧩 Plugin 特色

| 功能                    | 是否支援 |
| ----------------------- | -------- |
| 自動註冊                | ✅       |
| client/server only 限制 | ✅       |
| 注入 `$xxx` 到 context  | ✅       |
| 支援 TypeScript         | ✅       |

---

## 📁 plugins 資料夾建議結構

```plaintext
plugins/
├── axios.ts              # 自訂 API client
├── auth.client.ts        # client only plugin
├── logger.server.ts      # server only plugin

```

## 📝 建立基本 Plugin

```ts
// plugins/hello.ts
export default defineNuxtPlugin(() => {
  return {
    provide: {
      hello: () => "Hello from plugin!",
    },
  };
});
```

使用方式：

```vue
<script setup>
const msg = $hello(); // 自動註入的 plugin function
</script>
```

## 💻 Client-only Plugin

```ts
// plugins/gtag.client.ts
export default defineNuxtPlugin(() => {
  if (process.client) {
    window.gtag = () => console.log("tracking");
  }
});
```

## 🖥 Server-only Plugin

```ts
// plugins/serverlog.server.ts
export default defineNuxtPlugin(() => {
  console.log("🔐 伺服器端 Plugin 啟動");
});
```

## ⚙️ Mermaid：Plugin 註冊與提供流程

```mermaid
flowchart TD A[plugins/xxx.ts] -->

B[defineNuxtPlugin()] B --> C[return provide: $api, $hello] C --> D[Nuxt App
Context] D --> E[Component 使用 $xxx]
```

## 🧠 與 useAsyncData() 搭配

```ts
// plugins/api.ts
export default defineNuxtPlugin(() => { const api =
$fetch.create({ baseURL: '/api' }) return { provide: { api } } })
```

```vue
<script setup>
const { data } = await useAsyncData(() => $api("/posts"));
</script>
```

## 📊 Mermaid：Plugin vs Composable 功能比較

```mermaid
classDiagram class Plugin {
+defineNuxtPlugin() +注入 $xxx +client/server 限制 } class Composable { +純函式
+支援自動匯入 +在 script setup 中使用 } Plugin --> AppContext Composable -->
CompositionAPI
```

## 🔄 Plugin 與 Middleware 搭配

```ts
// plugins/auth.client.ts
export default defineNuxtPlugin(() => {
  const isLoggedIn = () => !!useCookie("token").value;
  return { provide: { isLoggedIn } };
});

// middleware/auth.ts
export default defineNuxtRouteMiddleware(() => {
  if (!$isLoggedIn()) return navigateTo("/login");
});
```

## 🧠 常見 Plugin 應用場景 功能

| 插件名稱       | 說明                                   |
| -------------- | -------------------------------------- |
| API client     | $api via plugins/api.ts                |
| i18n           | 國際化 $t from i18n                    |
| module/plugin  | 身分驗證驗證 auth.client.ts            |
| 日誌紀錄       | logger.server.ts                       |
| 第三方套件封裝 | 如 Chart.js、Google Maps, Vee-Validate |

## 🧠 建立自訂 Plugin

```ts
// plugins/my-custom-plugin.ts
export default defineNuxtPlugin(() => {
  const myData = ref("Hello from Plugin");
  return { provide: { myData } };
});
```

```vue
<script setup>
const { myData } = $myCustomPlugin();
</script>
```
