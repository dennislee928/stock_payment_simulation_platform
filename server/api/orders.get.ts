import { H3Event } from "h3";

// 共用模擬訂單資料庫
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

export default defineEventHandler(async (event: H3Event) => {
  // 簡單模擬驗證
  const token = getRequestHeader(event, "Authorization");

  // 實際應用需要更嚴謹的驗證
  if (!token || !token.startsWith("Bearer mock_token_")) {
    throw createError({
      statusCode: 401,
      statusMessage: "未授權的請求",
    });
  }

  // 獲取查詢參數
  const query = getQuery(event);
  const limit = parseInt(query.limit as string) || 10;
  const status = query.status as string;

  // 將訂單轉為陣列並排序（根據建立時間，新的在前）
  let result = Object.values(orders).sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // 根據狀態過濾
  if (status) {
    result = result.filter((order) => order.status === status);
  }

  // 限制返回數量
  result = result.slice(0, limit);

  return result;
});
