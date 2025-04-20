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

# 步驟 2: 檢查 .output/public 目錄是否存在
if [ ! -d ".output/public" ]; then
  handle_error ".output/public 目錄不存在，請檢查構建過程"
fi

# 步驟 3: 部署到 Cloudflare Pages
echo -e "${YELLOW}步驟 2: 開始部署到 Cloudflare Pages...${NC}"
npx wrangler pages deploy .output/public || handle_error "部署失敗"

# 步驟 4: 顯示專案列表
echo -e "${YELLOW}步驟 3: 顯示 Cloudflare Pages 專案列表...${NC}"
npx wrangler pages project list

echo -e "${GREEN}部署流程完成！您的網站已成功部署到 Cloudflare Pages。${NC}"
echo -e "${YELLOW}請查看上方部署輸出以獲取網站 URL。${NC}"