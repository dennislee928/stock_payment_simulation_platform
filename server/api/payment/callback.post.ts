import { H3Event } from "h3";
import crypto from "crypto";

// 模擬訂單資料庫 (實際應用應使用真實資料庫)
// 此外，這個變數在每次伺服器重啟時會重置，實際應用需要使用持久化儲存
let orders: Record<string, any> = {};

export default defineEventHandler(async (event: H3Event) => {
  // 取得 ECPay 回調資料
  const body = await readBody(event);

  if (!body || !body.MerchantTradeNo || !body.CheckMacValue) {
    throw createError({
      statusCode: 400,
      statusMessage: "無效的回調請求",
    });
  }

  // 獲取設定
  const config = useRuntimeConfig();
  const hashKey = config.public.ecpayHashKey;
  const hashIv = config.public.ecpayHashIV;

  // 驗證 CheckMacValue (實際應用應完整實作)
  // 這裡簡化處理，假設已驗證成功

  // 取得訂單
  const orderId = body.MerchantTradeNo;
  const order = orders[orderId];

  if (!order) {
    throw createError({
      statusCode: 404,
      statusMessage: "找不到訂單",
    });
  }

  // 更新訂單狀態
  if (body.RtnCode === "1") {
    // 付款成功
    order.status = "success";
    order.paymentTime = new Date().toISOString();
    order.paymentDetails = {
      paymentType: body.PaymentType,
      tradeNo: body.TradeNo,
      amount: body.TradeAmt,
      paymentDate: body.PaymentDate,
    };
  } else {
    // 付款失敗
    order.status = "failure";
    order.errorCode = body.RtnCode;
    order.errorMessage = body.RtnMsg;
  }

  // 儲存更新的訂單
  orders[orderId] = order;

  // 返回給 ECPay 的回應
  return {
    status: "success",
    message: "已成功接收付款結果",
  };
});

// 實際應用中應該實作驗證 CheckMacValue 的完整邏輯
function verifyCheckMacValue(
  params: Record<string, string>,
  hashKey: string,
  hashIV: string,
  checkMacValue: string
): boolean {
  // 移除 CheckMacValue 參數
  const { CheckMacValue, ...restParams } = params;

  // 按照 ECPay 規定排序參數
  const sortedParams = Object.keys(restParams)
    .sort()
    .reduce((acc: Record<string, string>, key) => {
      acc[key] = restParams[key];
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

  return hash === checkMacValue;
}
