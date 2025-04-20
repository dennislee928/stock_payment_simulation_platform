#!/bin/bash

# 顯示顏色輸出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== 股票付款模擬平台 - Cloudflare Worker 後端部署腳本 =====${NC}"
echo -e "${YELLOW}本腳本將執行以下步驟:${NC}"
echo "1. 找到正確的工作目錄"
echo "2. 清理環境"
echo "3. 修正依賴版本"
echo "4. 安裝依賴"
echo "5. 檢查和初始化 D1 資料庫"
echo "6. 驗證並創建資料表"
echo "7. 構建專案"
echo "8. 部署到 Cloudflare Workers"
echo ""

# 確認執行
read -p "是否繼續? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}部署已取消${NC}"
    exit 1
fi

# 找到正確的工作目錄
# 首先確定腳本所在的目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo -e "${YELLOW}腳本所在目錄: $SCRIPT_DIR${NC}"

# 嘗試找到 cf-worker-backend 目錄
CF_WORKER_DIR=""

# 檢查當前目錄是否包含 wrangler.toml
if [ -f "./wrangler.toml" ]; then
    CF_WORKER_DIR="$(pwd)"
# 檢查當前目錄下的 cf-worker-backend 目錄
elif [ -f "./cf-worker-backend/wrangler.toml" ]; then
    CF_WORKER_DIR="$(pwd)/cf-worker-backend"
# 檢查父目錄下的 cf-worker-backend 目錄
elif [ -f "../cf-worker-backend/wrangler.toml" ]; then
    CF_WORKER_DIR="$(cd .. && pwd)/cf-worker-backend"
# 檢查 nest-js-backen 目錄下的 cf-worker-backend 目錄
elif [ -f "../nest-js-backen/cf-worker-backend/wrangler.toml" ]; then
    CF_WORKER_DIR="$(cd ../nest-js-backen && pwd)/cf-worker-backend"
else
    echo -e "${RED}無法找到 wrangler.toml 文件，請確認您在正確的目錄中運行此腳本${NC}"
    echo -e "${YELLOW}請嘗試：cd nest-js-backen/cf-worker-backend && ../utils/deploy.sh${NC}"
    exit 1
fi

echo -e "${GREEN}已找到工作目錄: $CF_WORKER_DIR${NC}"
# 切換到正確的目錄
cd "$CF_WORKER_DIR"

# 1. 清理環境
echo -e "${YELLOW}1. 清理環境...${NC}"
rm -rf node_modules dist .wrangler 2>/dev/null || true
echo -e "${GREEN}✓ 環境已清理${NC}"

# 2. 修正 package.json 中的依賴版本
echo -e "${YELLOW}2. 修正依賴版本...${NC}"

# 檢查 package.json 是否存在
if [ ! -f "./package.json" ]; then
    echo -e "${RED}找不到 package.json 文件${NC}"
    exit 1
fi

# 備份 package.json
cp package.json package.json.bak

# 修正 @cloudflare/d1 版本 - 使用確定存在的版本 1.4.1
if grep -q '@cloudflare/d1' package.json; then
    echo -e "${YELLOW}修正 @cloudflare/d1 版本為 1.4.1...${NC}"
    # 將版本更新為確定可用的版本 1.4.1
    sed -i.tmp 's/"@cloudflare\/d1": "\^[0-9]*\.[0-9]*\.[0-9]*"/"@cloudflare\/d1": "1.4.1"/' package.json
    rm package.json.tmp 2>/dev/null || true
fi

# 修正 wrangler 版本
if grep -q 'wrangler' package.json; then
    echo -e "${YELLOW}修正 wrangler 版本...${NC}"
    # 更新 wrangler 版本到指定版本
    sed -i.tmp 's/"wrangler": "\^[0-9]*\.[0-9]*\.[0-9]*"/"wrangler": "3.12.0"/' package.json
    rm package.json.tmp 2>/dev/null || true
fi

echo -e "${GREEN}✓ 依賴版本已修正${NC}"
echo -e "${YELLOW}修正後的 package.json:${NC}"
cat package.json

# 3. 安裝依賴
echo -e "${YELLOW}3. 安裝依賴...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}依賴安裝失敗，嘗試使用 --no-optional --no-fund --legacy-peer-deps${NC}"
    npm install --no-optional --no-fund --legacy-peer-deps
    if [ $? -ne 0 ]; then
        echo -e "${RED}依賴安裝失敗，嘗試不使用 @cloudflare/d1 套件...${NC}"
        
        # 移除 @cloudflare/d1 依賴
        sed -i.tmp '/"@cloudflare\/d1":/d' package.json
        rm package.json.tmp 2>/dev/null || true
        echo -e "${YELLOW}已移除 @cloudflare/d1 依賴，再次嘗試安裝...${NC}"
        
        npm install --legacy-peer-deps
        if [ $? -ne 0 ]; then
            echo -e "${RED}依賴安裝失敗，請手動檢查 package.json 中的依賴版本${NC}"
            echo -e "${YELLOW}可用的 @cloudflare/d1 版本: 1.1.0, 1.2.0, 1.3.0, 1.4.0, 1.4.1${NC}"
            mv package.json.bak package.json
            exit 1
        fi
    fi
fi
echo -e "${GREEN}✓ 依賴已安裝${NC}"
# 刪除備份文件
rm package.json.bak 2>/dev/null || true

# 4. 檢查和初始化 D1 資料庫
echo -e "${YELLOW}4. 檢查和初始化 D1 資料庫...${NC}"

# 確認 wrangler.toml 存在
if [ ! -f "./wrangler.toml" ]; then
    echo -e "${RED}找不到 wrangler.toml 文件${NC}"
    exit 1
fi

# 從 wrangler.toml 中提取數據庫設置
DB_NAME=$(grep -o 'database_name.*=.*"[^"]*"' wrangler.toml | cut -d'"' -f2)
DB_ID=$(grep -o 'database_id.*=.*"[^"]*"' wrangler.toml | cut -d'"' -f2)

if [ -z "$DB_NAME" ]; then
    echo -e "${RED}無法從 wrangler.toml 中提取數據庫名稱${NC}"
    exit 1
fi

# 檢查資料庫是否已存在
echo -e "${YELLOW}檢查資料庫 $DB_NAME...${NC}"
HAS_DB=$(npx wrangler d1 list 2>/dev/null | grep "$DB_NAME")

if [ -z "$HAS_DB" ]; then
    echo -e "${YELLOW}資料庫 $DB_NAME 不存在，正在創建...${NC}"
    DB_RESULT=$(npx wrangler d1 create "$DB_NAME" 2>&1)
    if [ $? -ne 0 ]; then
        # 檢查是否是因為資料庫已存在而失敗
        if [[ "$DB_RESULT" == *"A database with that name already exists"* ]]; then
            echo -e "${YELLOW}資料庫 $DB_NAME 已經存在，但未在列表中找到${NC}"
            
            # 嘗試重新獲取資料庫列表
            DB_LIST=$(npx wrangler d1 list --json 2>/dev/null)
            if [ $? -eq 0 ]; then
                # 使用 grep 和 sed 從 JSON 中提取 database_id
                NEW_DB_ID=$(echo "$DB_LIST" | grep -o '"uuid":"[^"]*"' | grep -o '[^"]*$' | grep -m1 "")
                if [ -n "$NEW_DB_ID" ]; then
                    echo -e "${GREEN}找到資料庫 ID: $NEW_DB_ID${NC}"
                    
                    # 更新 wrangler.toml 文件中的 database_id
                    sed -i.bak "s/database_id = \"[^\"]*\"/database_id = \"$NEW_DB_ID\"/" wrangler.toml
                    rm wrangler.toml.bak 2>/dev/null || true
                    
                    # 使用新的 DB_ID
                    DB_ID=$NEW_DB_ID
                else
                    echo -e "${YELLOW}無法從列表中提取資料庫 ID，使用當前配置繼續${NC}"
                fi
            else
                echo -e "${YELLOW}無法獲取資料庫列表，使用當前配置繼續${NC}"
            fi
        else
            echo -e "${RED}資料庫創建失敗:${NC}"
            echo "$DB_RESULT"
            exit 1
        fi
    else
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
    fi
else
    echo -e "${GREEN}資料庫 $DB_NAME 已存在${NC}"
    
    # 從輸出中提取現有的 database_id
    EXISTING_DB_ID=$(echo "$HAS_DB" | awk '{print $1}')
    if [ -n "$EXISTING_DB_ID" ] && [ "$EXISTING_DB_ID" != "$DB_ID" ]; then
        echo -e "${YELLOW}更新 wrangler.toml 中的資料庫 ID: $EXISTING_DB_ID${NC}"
        sed -i.bak "s/database_id = \"[^\"]*\"/database_id = \"$EXISTING_DB_ID\"/" wrangler.toml
        rm wrangler.toml.bak 2>/dev/null || true
        DB_ID=$EXISTING_DB_ID
    fi
fi

echo -e "${GREEN}✓ 資料庫檢查完成${NC}"

# 5. 驗證並創建資料表
echo -e "${YELLOW}5. 驗證並創建資料表...${NC}"

# 確認 schema.sql 文件存在
if [ ! -f "./schema.sql" ]; then
    echo -e "${YELLOW}找不到 schema.sql 文件，創建預設資料表結構...${NC}"
    
    # 創建基本的 schema.sql 文件
    cat > schema.sql << EOL
-- Cloudflare D1 數據庫結構定義

-- 訂單資料表
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  items TEXT,
  user_id TEXT
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
EOL
    
    echo -e "${GREEN}已創建預設 schema.sql 文件${NC}"
fi

# 檢查資料表是否存在
echo -e "${YELLOW}檢查資料表是否存在...${NC}"
TABLE_CHECK=$(npx wrangler d1 execute "$DB_NAME" --command="SELECT name FROM sqlite_master WHERE type='table' AND name='orders';" 2>/dev/null)

if [[ "$TABLE_CHECK" == *"orders"* ]]; then
    echo -e "${GREEN}資料表 'orders' 已存在${NC}"
else
    echo -e "${YELLOW}資料表不存在，將創建資料表...${NC}"
fi

# 執行資料庫初始化腳本
echo -e "${YELLOW}執行資料庫初始化腳本...${NC}"
npx wrangler d1 execute "$DB_NAME" --file=./schema.sql
if [ $? -ne 0 ]; then
    echo -e "${RED}資料庫初始化失敗${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 資料庫已初始化${NC}"

# 6. 構建專案
echo -e "${YELLOW}6. 構建專案...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}構建失敗${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 專案已構建${NC}"

# 7. 部署到 Cloudflare Workers
echo -e "${YELLOW}7. 部署到 Cloudflare Workers...${NC}"
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