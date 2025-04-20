import type { H3Event } from "h3";

/**
 * 代理API，用於解決CORS問題
 * 從台灣證交所獲取上市公司資料
 */
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    // 提供預設值以防止環境變數未設定
    const twseBase = config.public.twseApiBase || "https://openapi.twse.com.tw";

    console.log(`嘗試從 ${twseBase}/opendata/t187ap03_L 獲取上市公司資料`);

    // 從台灣證交所API獲取上市公司資料，添加超時和頭部
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超時

    const response = await fetch(`${twseBase}/opendata/t187ap03_L`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      console.error(
        `證交所API回應錯誤: ${response.status} ${response.statusText}`
      );

      // 如果API不可用，使用模擬數據
      if (response.status === 404 || response.status >= 500) {
        console.log("使用模擬數據替代");

        return [
          {
            Code: "2330",
            Name: "台積電",
            Industry: "半導體",
            Chairman: "劉德音",
          },
          {
            Code: "2317",
            Name: "鴻海",
            Industry: "電子零組件",
            Chairman: "劉揚偉",
          },
          {
            Code: "2412",
            Name: "中華電",
            Industry: "電信",
            Chairman: "謝繼茂",
          },
          {
            Code: "2882",
            Name: "國泰金",
            Industry: "金融業",
            Chairman: "蔡宏圖",
          },
          { Code: "1303", Name: "南亞", Industry: "塑膠", Chairman: "吳嘉昭" },
        ];
      }

      throw createError({
        status: response.status,
        statusText: `證交所API回應錯誤: ${response.statusText}`,
      });
    }

    // 解析回應為JSON
    const data = await response.json();
    console.log(`成功獲取上市公司資料，共 ${data.length || 0} 筆記錄`);

    return data;
  } catch (error: any) {
    console.error("獲取上市公司資料時發生錯誤:", error);

    // 針對不同類型的錯誤提供不同的處理
    if (error.name === "AbortError") {
      console.log("請求超時，使用模擬數據替代");

      return [
        {
          Code: "2330",
          Name: "台積電",
          Industry: "半導體",
          Chairman: "劉德音",
        },
        {
          Code: "2317",
          Name: "鴻海",
          Industry: "電子零組件",
          Chairman: "劉揚偉",
        },
        { Code: "2412", Name: "中華電", Industry: "電信", Chairman: "謝繼茂" },
        {
          Code: "2882",
          Name: "國泰金",
          Industry: "金融業",
          Chairman: "蔡宏圖",
        },
        { Code: "1303", Name: "南亞", Industry: "塑膠", Chairman: "吳嘉昭" },
      ];
    }

    throw createError({
      status: 500,
      statusText: `無法取得上市公司資料: ${error.message || "未知錯誤"}`,
    });
  }
});
