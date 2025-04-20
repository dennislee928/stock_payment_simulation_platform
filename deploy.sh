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

# 從 .env 檔案中讀取環境變數
if [ -f ".env" ]; then
  echo -e "${YELLOW}從 .env 檔案讀取環境變數${NC}"
  # 儲存環境變數到臨時檔案
  ENV_FILE=$(mktemp)
  grep -v '^#' .env | grep -v '^$' > "$ENV_FILE"
  
  # 讀取環境變數並建立命令字串
  ENV_VARS=""
  while IFS= read -r line; do
    KEY=$(echo "$line" | cut -d= -f1)
    VALUE=$(echo "$line" | cut -d= -f2-)
    ENV_VARS="$ENV_VARS --env $KEY=\"$VALUE\""
  done < "$ENV_FILE"
  
  rm "$ENV_FILE"
  
  echo -e "${YELLOW}部署目錄: $DEPLOY_DIR 並設定環境變數${NC}"
  eval "npx wrangler pages deploy \"$DEPLOY_DIR\" $ENV_VARS" || handle_error "部署失敗"
else
  echo -e "${YELLOW}部署目錄: $DEPLOY_DIR (未找到 .env 檔案)${NC}"
  npx wrangler pages deploy "$DEPLOY_DIR" || handle_error "部署失敗"
fi

# 步驟 5: 顯示專案列表
echo -e "${YELLOW}步驟 5: 顯示 Cloudflare Pages 專案列表...${NC}"
npx wrangler pages project list

echo -e "${GREEN}部署流程完成！您的網站已成功部署到 Cloudflare Pages。${NC}"
echo -e "${YELLOW}請查看上方部署輸出以獲取網站 URL。${NC}"