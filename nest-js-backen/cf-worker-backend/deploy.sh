#!/bin/bash

# 顯示顏色輸出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== 股票付款模擬平台 - Cloudflare Worker 後端部署腳本 =====${NC}"
echo -e "${YELLOW}本腳本將執行以下步驟:${NC}"
echo "1. 清理環境"
echo "2. 安裝依賴"
echo "3. 創建並初始化 D1 資料庫"
echo "4. 構建專案"
echo "5. 部署到 Cloudflare Workers"
echo ""

# 確認執行
read -p "是否繼續? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}部署已取消${NC}"
    exit 1
fi

# 切換到正確的目錄
cd "$(dirname "$0")"
CURRENT_DIR=$(pwd)
echo -e "${GREEN}當前目錄: $CURRENT_DIR${NC}"

# 1. 清理環境
echo -e "${YELLOW}1. 清理環境...${NC}"
rm -rf node_modules dist .wrangler 2>/dev/null || true
echo -e "${GREEN}✓ 環境已清理${NC}"

# 2. 安裝依賴
echo -e "${YELLOW}2. 安裝依賴...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}依賴安裝失敗，嘗試使用 --no-optional --no-fund --legacy-peer-deps${NC}"
    npm install --no-optional --no-fund --legacy-peer-deps
    if [ $? -ne 0 ]; then
        echo -e "${RED}依賴安裝失敗，請檢查錯誤訊息${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✓ 依賴已安裝${NC}"

# 3. 創建並初始化 D1 資料庫
echo -e "${YELLOW}3. 初始化 D1 資料庫...${NC}"

# 從 wrangler.toml 中提取數據庫設置
DB_NAME=$(grep -o 'database_name.*=.*"[^"]*"' wrangler.toml | cut -d'"' -f2)
DB_ID=$(grep -o 'database_id.*=.*"[^"]*"' wrangler.toml | cut -d'"' -f2)

if [ -z "$DB_NAME" ]; then
    echo -e "${RED}無法從 wrangler.toml 中提取數據庫名稱${NC}"
    exit 1
fi

# 檢查資料庫是否已存在，如果不存在則創建
echo -e "${YELLOW}檢查並創建資料庫 $DB_NAME...${NC}"
HAS_DB=$(npx wrangler d1 list 2>/dev/null | grep "$DB_NAME")

if [ -z "$HAS_DB" ]; then
    echo -e "${YELLOW}資料庫 $DB_NAME 不存在，正在創建...${NC}"
    DB_RESULT=$(npx wrangler d1 create "$DB_NAME" 2>&1)
    if [ $? -ne 0 ]; then
        echo -e "${RED}資料庫創建失敗:${NC}"
        echo "$DB_RESULT"
        exit 1
    fi

    # 從輸出中提取 database_id
    NEW_DB_ID=$(echo "$DB_RESULT" | grep -o 'database_id.*=.*"[^"]*"' | cut -d'"' -f2)
    if [ -n "$NEW_DB_ID" ]; then
        echo -e "${GREEN}資料庫已創建，ID: $NEW_DB_ID${NC}"

        # 更新 wrangler.toml 文件中的 database_id
        sed -i.bak "s/database_id = \"[^\"]*\"/database_id = \"$NEW_DB_ID\"/" wrangler.toml
        rm wrangler.toml.bak 2>/dev/null || true

        # 使用新的 DB_ID
        DB_ID=$NEW_DB_ID
    else
        echo -e "${YELLOW}警告: 無法提取新創建的資料庫 ID，請手動更新 wrangler.toml${NC}"
    fi
else
    echo -e "${GREEN}資料庫 $DB_NAME 已存在${NC}"
fi

# 執行資料庫初始化腳本
echo -e "${YELLOW}初始化資料庫架構...${NC}"
npx wrangler d1 execute "$DB_NAME" --file=./schema.sql
if [ $? -ne 0 ]; then
    echo -e "${RED}資料庫初始化失敗${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 資料庫已初始化${NC}"

# 4. 構建專案
echo -e "${YELLOW}4. 構建專案...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}構建失敗${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 專案已構建${NC}"

# 5. 部署到 Cloudflare Workers
echo -e "${YELLOW}5. 部署到 Cloudflare Workers...${NC}"
npx wrangler deploy
if [ $? -ne 0 ]; then
    echo -e "${RED}部署失敗${NC}"
    exit 1
fi

echo -e "${GREEN}✓✓✓ 部署完成! ✓✓✓${NC}"
echo ""
echo -e "${YELLOW}注意:${NC} 請確保您已設置好環境變數和 Cloudflare 帳號權限"
echo -e "您可以通過訪問以下網址查看您的 Worker: ${GREEN}https://$DB_NAME.your-subdomain.workers.dev${NC}"
echo ""
echo -e "${YELLOW}API 端點:${NC}"
echo -e "- GET /api/stocks?q=台積電 - 搜尋股票"
echo -e "- GET /api/stocks/2330 - 獲取特定股票數據"
echo -e "- POST /api/orders - 創建新訂單"
echo -e "- GET /api/orders - 獲取所有訂單"
