import { H3Event } from "h3";
import crypto from "crypto";

// 模擬訂單資料庫
let orders: Record<string, any> = {};

export default defineEventHandler(async (event: H3Event) => {
  // 取得請求資料
  const body = await readBody(event);

  if (!body || !body.items || !body.totalAmount || !body.contact) {
    throw createError({
      statusCode: 400,
      statusMessage: "缺少必要的訂單資訊",
    });
  }

  // 生成訂單編號
  const orderId = `STOCK${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // 獲取設定
  const config = useRuntimeConfig();
  const merchantId = config.public.ecpayMerchantId;
  const hashKey = config.public.ecpayHashKey;
  const hashIv = config.public.ecpayHashIV;

  // 創建訂單資料
  const order = {
    orderId,
    items: body.items,
    totalAmount: body.totalAmount,
    contact: body.contact,
    paymentMethod: body.paymentMethod || "credit_card",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  // 儲存訂單
  orders[orderId] = order;

  // 準備 ECPay 參數
  let ecpayParams: Record<string, string> = {
    MerchantID: merchantId,
    MerchantTradeNo: orderId,
    MerchantTradeDate: new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .substring(0, 14),
    PaymentType: "aio",
    TotalAmount: body.totalAmount.toString(),
    TradeDesc: `股票模擬購買_${orderId}`,
    ItemName: body.items
      .map((item: any) => `${item.symbol}_${item.name}`)
      .join("#"),
    ReturnURL: `${getRequestProtocol(event)}://${getRequestHost(
      event
    )}/api/payment/callback`,
    ChoosePayment: mapPaymentMethod(body.paymentMethod),
    ClientBackURL: `${getRequestProtocol(event)}://${getRequestHost(
      event
    )}/result?orderId=${orderId}`,
    OrderResultURL: `${getRequestProtocol(event)}://${getRequestHost(
      event
    )}/result?orderId=${orderId}`,
    EncryptType: "1",
  };

  // 產生 CheckMacValue
  const encodedParams = genCheckMacValue(ecpayParams, hashKey, hashIv);

  // 返回 ECPay 的重定向 URL 和表單資料
  return {
    success: true,
    orderId,
    redirectUrl: "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5",
    formData: {
      ...ecpayParams,
      CheckMacValue: encodedParams.CheckMacValue,
    },
  };
});

// 產生 CheckMacValue
function genCheckMacValue(
  params: Record<string, string>,
  hashKey: string,
  hashIV: string
): Record<string, string> {
  // 按照 ECPay 規定的方式排序參數
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc: Record<string, string>, key) => {
      acc[key] = params[key];
      return acc;
    }, {});

  // 轉換成查詢字串
  const paramsString = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  // 加上 HashKey 和 HashIV
  const hashString = `HashKey=${hashKey}&${paramsString}&HashIV=${hashIV}`;

  // 使用 URL encode
  const encodedString = encodeURIComponent(hashString)
    .replace(/%20/g, "+")
    .toLowerCase();

  // 使用 SHA256 加密
  const hash = crypto
    .createHash("sha256")
    .update(encodedString)
    .digest("hex")
    .toUpperCase();

  return {
    ...sortedParams,
    CheckMacValue: hash,
  };
}

// 映射支付方式
function mapPaymentMethod(method: string): string {
  switch (method) {
    case "credit_card":
      return "Credit";
    case "atm":
      return "ATM";
    case "cvs":
      return "CVS";
    default:
      return "Credit";
  }
}

// 取得請求協議
function getRequestProtocol(event: H3Event): string {
  // 測試環境使用 http，生產環境使用 https
  return process.env.NODE_ENV === "production" ? "https" : "http";
}

// 取得請求 Host
function getRequestHost(event: H3Event): string {
  // 實際應用中應該從請求中獲取，這裡僅示範
  return process.env.NODE_ENV === "production"
    ? "your-production-domain.com"
    : "localhost:3000";
}
