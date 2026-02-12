// 格式化数字，保留指定小数位
export const formatNumber = (num: number, decimal: number = 4): string => {
  return num.toFixed(decimal);
};

// 格式化百分比
export const formatPercentage = (num: number, decimal: number = 2): string => {
  return `${num.toFixed(decimal)}%`;
};

// 格式化日期
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 格式化时间
export const formatTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// 格式化日期时间
export const formatDateTime = (date: string | Date): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

// 格式化基金代码，确保为6位数字
export const formatFundCode = (code: string): string => {
  return String(code).padStart(6, '0');
};

// 格式化大数字
export const formatLargeNumber = (num: number): string => {
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(2)}亿`;
  } else if (num >= 10000) {
    return `${(num / 10000).toFixed(2)}万`;
  }
  return num.toString();
};