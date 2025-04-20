// 這個腳本用於處理Vercel環境中的Rollup相關問題
// 在 Cloudflare Pages 部署中已不使用此腳本
const fs = require("fs");
const path = require("path");

// 不在 Cloudflare 部署時執行此腳本
if (!process.env.CF_PAGES) {
  // 確保使用WebAssembly版本的Rollup
  try {
    // 檢查是否在Vercel環境中
    if (process.env.VERCEL) {
      console.log(
        "Running in Vercel environment, preparing build environment..."
      );

      // 創建一個空的rollup-linux-x64-gnu目錄結構
      const rollupModulePath = path.join(
        process.cwd(),
        "node_modules",
        "@rollup",
        "rollup-linux-x64-gnu"
      );

      // 如果目錄不存在，創建它
      if (!fs.existsSync(path.dirname(rollupModulePath))) {
        fs.mkdirSync(path.dirname(rollupModulePath), { recursive: true });
        console.log("Created @rollup directory");
      }

      // 如果該路徑已存在且是一個文件，刪除它
      if (
        fs.existsSync(rollupModulePath) &&
        !fs.statSync(rollupModulePath).isDirectory()
      ) {
        fs.unlinkSync(rollupModulePath);
        console.log("Removed existing rollup-linux-x64-gnu file");
      }

      // 創建目錄
      if (!fs.existsSync(rollupModulePath)) {
        fs.mkdirSync(rollupModulePath, { recursive: true });
        console.log("Created rollup-linux-x64-gnu directory");
      }

      // 創建一個空的package.json
      const packageJsonPath = path.join(rollupModulePath, "package.json");
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(
          {
            name: "@rollup/rollup-linux-x64-gnu",
            version: "4.0.0",
            description: "Empty package to satisfy Rollup dependency on Vercel",
          },
          null,
          2
        )
      );
      console.log("Created empty package.json in rollup-linux-x64-gnu");

      console.log("Build environment preparation completed");
    }
  } catch (error) {
    console.error("Error preparing build environment:", error);
    // 不拋出錯誤，讓構建繼續進行
  }
} else {
  console.log(
    "Running in Cloudflare Pages environment, skipping Vercel preparation..."
  );
}
