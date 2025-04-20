import { H3Event } from "h3";

export default defineEventHandler((event: H3Event) => {
  // 獲取請求路徑
  const path = event.path || event.req.url || "";

  // 檢查是否是需要認證的路徑
  if (path.startsWith("/admin") || path.includes("/api/admin")) {
    // 獲取 token
    const token = getRequestHeader(event, "Authorization");

    // 簡單的模擬驗證，實際應用需更嚴謹的 token 驗證機制
    if (!token || !token.startsWith("Bearer ")) {
      // 如果是 API 請求，返回錯誤代碼
      if (path.includes("/api/")) {
        throw createError({
          statusCode: 401,
          statusMessage: "未授權的請求",
        });
      }

      // 如果是頁面請求，重定向到登入頁面
      return sendRedirect(event, "/login");
    }

    // 簡單模擬驗證 token，實際應用需要更複雜的驗證
    const tokenValue = token.replace("Bearer ", "");

    // 假設有效 token 都是以 mock_token_ 開頭
    if (!tokenValue.startsWith("mock_token_")) {
      if (path.includes("/api/")) {
        throw createError({
          statusCode: 401,
          statusMessage: "無效的 token",
        });
      }

      return sendRedirect(event, "/login");
    }
  }
});
