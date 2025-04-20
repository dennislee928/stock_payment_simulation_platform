// 按需引入 Ant Design Vue 組件
import {
  Button,
  Input,
  Card,
  Table,
  List,
  Form,
  Steps,
  Radio,
  Result,
} from "ant-design-vue";

// 引入基礎樣式
import "ant-design-vue/es/style/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  // 使用類型斷言解決TypeScript類型問題
  const app = nuxtApp.vueApp as any;

  // 逐個註冊需要的組件
  app.component("a-button", Button);
  app.component("a-input", Input);
  app.component("a-input-search", Input.Search);
  app.component("a-card", Card);
  app.component("a-table", Table);
  app.component("a-list", List);
  app.component("a-list-item", List.Item);
  app.component("a-list-item-meta", List.Item.Meta);
  app.component("a-form", Form);
  app.component("a-form-item", Form.Item);
  app.component("a-steps", Steps);
  app.component("a-step", Steps.Step);
  app.component("a-radio", Radio);
  app.component("a-radio-group", Radio.Group);
  app.component("a-result", Result);
});
