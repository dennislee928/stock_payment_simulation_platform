/**
 * 台幣格式化工具
 */
export function useFormat() {
  // 將數字格式化為新台幣格式 (NT$1,234)
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // 格式化百分比
  function formatPercent(value: number): string {
    return new Intl.NumberFormat("zh-TW", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  }

  // 格式化日期
  function formatDate(dateStr: string): string {
    if (!dateStr) return "-";

    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  // 股票漲跌格式化
  function formatStockChange(change: number, withSign = true): string {
    if (change === 0) return "0.00";

    const sign = change > 0 ? "+" : "";
    return withSign ? `${sign}${change.toFixed(2)}` : change.toFixed(2);
  }

  return {
    formatCurrency,
    formatPercent,
    formatDate,
    formatStockChange,
  };
}
