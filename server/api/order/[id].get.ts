import { H3Event } from "h3";

// 模擬訂單資料庫
// 這個變數在每次伺服器重啟時會重置，實際應用需要使用持久化儲存
const orders: Record<string, any> = {
  // 預先建立一些模擬訂單
  STOCK1683456789123: {
    orderId: "STOCK1683456789123",
    status: "success",
    paymentMethod: "credit_card",
    totalAmount: 16250,
    items: [{ symbol: "2330", name: "台積電", price: 650, quantity: 25 }],
    contact: {
      name: "王小明",
      email: "test@example.com",
      phone: "0912345678",
    },
    createdAt: "2023-05-07T12:34:56Z",
    paymentTime: "2023-05-07T12:40:23Z",
  },
  STOCK1683556789124: {
    orderId: "STOCK1683556789124",
    status: "pending",
    paymentMethod: "atm",
    totalAmount: 5760,
    items: [{ symbol: "2454", name: "聯發科", price: 720, quantity: 8 }],
    contact: {
      name: "李小華",
      email: "test2@example.com",
      phone: "0923456789",
    },
    createdAt: "2023-05-08T15:12:34Z",
    expireDate: "2023-05-11T15:12:34Z",
    paymentInfo: {
      BankCode: "812",
      VirtualAccount: "1234567890",
      ExpireDate: "2023/05/11",
    },
  },
  STOCK1683656789125: {
    orderId: "STOCK1683656789125",
    status: "failure",
    paymentMethod: "credit_card",
    totalAmount: 12400,
    items: [{ symbol: "2412", name: "中華電", price: 124, quantity: 100 }],
    contact: {
      name: "張小龍",
      email: "test3@example.com",
      phone: "0934567890",
    },
    createdAt: "2023-05-09T09:45:12Z",
    errorCode: "10002",
    errorMessage: "信用卡授權失敗",
  },
};

export default defineEventHandler((event: H3Event) => {
  const orderId = event.context.params!.id;

  if (!orderId) {
    throw createError({
      statusCode: 400,
      statusMessage: "缺少訂單編號",
    });
  }

  // 查找訂單
  const order = orders[orderId];

  if (!order) {
    throw createError({
      statusCode: 404,
      statusMessage: "找不到該訂單",
    });
  }

  // 返回訂單資訊
  return order;
});
