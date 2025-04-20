import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const symbol = event.context.params!.symbol;

  if (!symbol) {
    throw createError({
      statusCode: 400,
      statusMessage: "缺少股票代碼",
    });
  }

  try {
    const config = useRuntimeConfig();

    // 取得個股的每日收盤資訊
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    // 使用 TWSE 開放 API 取得股票價格
    const response = await fetch(
      `${config.public.twseApiBase}/exchangeReport/STOCK_DAY?stockNo=${symbol}&date=${year}${month}01`
    );

    if (!response.ok) {
      throw new Error(`無法獲取股票資料：${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("無效的股票資料回應");
    }

    // 取得最新的收盤價
    const latestData = data[data.length - 1];
    const price = parseFloat(latestData.Close);

    // 計算漲跌幅
    let change = 0;
    let changePercent = 0;

    if (data.length > 1) {
      const previousPrice = parseFloat(data[data.length - 2].Close);
      change = price - previousPrice;
      changePercent = (change / previousPrice) * 100;
    }

    return {
      symbol,
      price,
      change,
      changePercent,
      date: latestData.Date,
      volume: parseInt(latestData.Volume.replace(/,/g, ""), 10),
    };
  } catch (error) {
    console.error(`擷取股票 ${symbol} 資料時發生錯誤:`, error);

    // 返回模擬資料（僅為示範，實際應用需要更好的錯誤處理）
    return {
      symbol,
      price: Math.floor(Math.random() * 500) + 50,
      change: Math.random() * 10 - 5,
      changePercent: Math.random() * 5 - 2.5,
      date: new Date().toISOString().split("T")[0],
      volume: Math.floor(Math.random() * 10000000),
    };
  }
});
