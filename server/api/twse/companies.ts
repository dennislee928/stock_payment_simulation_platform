import type { H3Event } from "h3";

/**
 * 代理API，用於解決CORS問題
 * 從台灣證交所獲取上市公司資料
 */
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const twseBase = config.public.twseApiBase;

    // 從台灣證交所API獲取上市公司資料
    const response = await fetch(`${twseBase}/opendata/t187ap03_L`);

    if (!response.ok) {
      throw createError({
        status: response.status,
        statusText: `證交所API回應錯誤: ${response.statusText}`,
      });
    }

    // 解析回應為JSON
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("獲取上市公司資料時發生錯誤:", error);

    throw createError({
      status: 500,
      statusText: "無法取得上市公司資料，請稍後再試",
    });
  }
});
