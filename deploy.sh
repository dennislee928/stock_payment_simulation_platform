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

# 步驟 1: 構建專案
echo -e "${YELLOW}步驟 1: 開始構建專案...${NC}"
npm run build || handle_error "構建失敗"
echo -e "${GREEN}構建成功完成！${NC}"

# 步驟 2: 檢查輸出目錄
echo -e "${YELLOW}步驟 2: 檢查輸出目錄...${NC}"

# 檢查目錄結構
if [ -d ".output/public" ]; then
  DEPLOY_DIR=".output/public"
  echo -e "${GREEN}找到標準輸出目錄 .output/public${NC}"
elif [ -d ".output" ]; then
  # Cloudflare Pages 預設可能只需要 .output 目錄
  DEPLOY_DIR=".output"
  echo -e "${YELLOW}使用 .output 作為部署目錄${NC}"
else
  handle_error "未找到可部署的輸出目錄"
fi

# 步驟 3: 檢查是否需要生成額外檔案
echo -e "${YELLOW}步驟 3: 檢查必要的檔案...${NC}"

if [ "$DEPLOY_DIR" = ".output" ]; then
  # 確保有 index.html
  if [ ! -f ".output/public/index.html" ] && [ -f ".output/_worker.js" ]; then
    echo -e "${YELLOW}使用 Worker 模式進行部署${NC}"
  fi
fi

# 步驟 4: 部署到 Cloudflare Pages
echo -e "${YELLOW}步驟 4: 開始部署到 Cloudflare Pages...${NC}"

# 直接部署，不嘗試設定環境變數
# Cloudflare 會在網站儀表板中管理環境變數
echo -e "${YELLOW}部署目錄: $DEPLOY_DIR${NC}"
echo -e "${YELLOW}注意: 請在 Cloudflare Pages 儀表板中手動設定環境變數${NC}"
npx wrangler pages deploy "$DEPLOY_DIR" || handle_error "部署失敗"

# 步驟 5: 顯示專案列表
echo -e "${YELLOW}步驟 5: 顯示 Cloudflare Pages 專案列表...${NC}"
npx wrangler pages project list

echo -e "${GREEN}部署流程完成！您的網站已成功部署到 Cloudflare Pages。${NC}"
echo -e "${YELLOW}重要：請在 Cloudflare 儀表板設定以下環境變數：${NC}"
echo -e "${YELLOW}TWSE_API_BASE -> https://openapi.twse.com.tw${NC}"
echo -e "${YELLOW}ECPAY_MERCHANT_ID -> 2000132${NC}"
echo -e "${YELLOW}ECPAY_HASH_KEY -> 5294y06JbISpM5x9${NC}"
echo -e "${YELLOW}ECPAY_HASH_IV -> v77hoKGq4kWxNNIS${NC}"