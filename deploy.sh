#!/bin/bash

echo "開始部署流程..."

# 設定顏色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 錯誤處理函數
handle_error() {
  echo -e "${RED}錯誤：$1${NC}"
  exit 1
}

# 步驟 1: 強制清理構建環境 (使用 sudo 和 -rf 標誌強制刪除)
echo -e "${YELLOW}步驟 1: 強制清理構建環境...${NC}"
rm -rf .nuxt .output dist node_modules/.vite
echo -e "${GREEN}構建環境已清理！${NC}"

# 步驟 2: 構建專案
echo -e "${YELLOW}步驟 2: 開始構建專案...${NC}"
npm run build || handle_error "構建失敗"
echo -e "${GREEN}構建成功完成！${NC}"

# 步驟 3: 檢查輸出目錄
echo -e "${YELLOW}步驟 3: 檢查輸出目錄...${NC}"
if [ -d ".output/public" ]; then
  DEPLOY_DIR=".output/public"
  echo -e "${GREEN}找到標準輸出目錄 .output/public${NC}"
elif [ -d ".output" ]; then
  DEPLOY_DIR=".output"
  echo -e "${YELLOW}使用 .output 作為部署目錄${NC}"
else
  handle_error "未找到可部署的輸出目錄"
fi

# 步驟 4: 部署到 Cloudflare Pages (不嘗試設定環境變數)
echo -e "${YELLOW}步驟 4: 開始部署到 Cloudflare Pages...${NC}"
echo -e "${YELLOW}部署目錄: $DEPLOY_DIR${NC}"
npx wrangler pages deploy "$DEPLOY_DIR" || handle_error "部署失敗"

# 步驟 5: 部署完成提示
echo -e "${GREEN}部署流程完成！${NC}"
echo -e "${YELLOW}重要提示：請在 Cloudflare 儀表板設定環境變數${NC}"
echo -e "${YELLOW}設定位置：Cloudflare > Pages > 您的專案 > 設定 > 環境變數${NC}"
echo -e "${YELLOW}需設定以下變數：${NC}"
echo -e "${YELLOW}  TWSE_API_BASE = https://openapi.twse.com.tw${NC}"
echo -e "${YELLOW}  ECPAY_MERCHANT_ID = 2000132${NC}"
echo -e "${YELLOW}  ECPAY_HASH_KEY = 5294y06JbISpM5x9${NC}"
echo -e "${YELLOW}  ECPAY_HASH_IV = v77hoKGq4kWxNNIS${NC}"