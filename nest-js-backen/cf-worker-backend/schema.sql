-- 用戶資料表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  last_login TEXT
);

-- 股票資料表
CREATE TABLE IF NOT EXISTS stocks (
  symbol TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  last_updated TEXT
);

-- 股票價格歷史資料表
CREATE TABLE IF NOT EXISTS stock_prices (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  price REAL NOT NULL,
  date TEXT NOT NULL,
  open_price REAL,
  high_price REAL,
  low_price REAL,
  volume INTEGER,
  FOREIGN KEY (symbol) REFERENCES stocks(symbol)
);

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_stock_prices_symbol ON stock_prices(symbol);
CREATE INDEX IF NOT EXISTS idx_stock_prices_date ON stock_prices(date);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);