import dayjs from 'dayjs';

/**
 * 格式化工具函数
 */

/**
 * 格式化日期时间
 * @param date 日期字符串或Date对象
 * @param format 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export const formatDateTime = (date: string | Date, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  if (!date) return '-';
  return dayjs(date).format(format);
};

/**
 * 格式化日期（不含时间）
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: string | Date): string => {
  return formatDateTime(date, 'YYYY-MM-DD');
};

/**
 * 格式化时间（不含日期）
 * @param date 日期字符串或Date对象
 * @returns 格式化后的时间字符串
 */
export const formatTime = (date: string | Date): string => {
  return formatDateTime(date, 'HH:mm:ss');
};

/**
 * 格式化相对时间（多久之前）
 * @param date 日期字符串或Date对象
 * @returns 相对时间字符串
 */
export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return '-';

  const now = dayjs();
  const target = dayjs(date);
  const diffMinutes = now.diff(target, 'minute');
  const diffHours = now.diff(target, 'hour');
  const diffDays = now.diff(target, 'day');

  if (diffMinutes < 1) {
    return '刚刚';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return formatDateTime(date, 'YYYY-MM-DD');
  }
};

/**
 * 格式化数字（千分位）
 * @param num 数字
 * @param decimals 小数位数，默认0
 * @returns 格式化后的数字字符串
 */
export const formatNumber = (num: number, decimals = 0): string => {
  if (num === null || num === undefined) return '-';
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

/**
 * 格式化百分比
 * @param value 数值（0-1 或 0-100）
 * @param isDecimal 是否为小数形式（0-1），默认true
 * @param decimals 小数位数，默认2
 * @returns 格式化后的百分比字符串
 */
export const formatPercent = (value: number, isDecimal = true, decimals = 2): string => {
  if (value === null || value === undefined) return '-';
  const percent = isDecimal ? value * 100 : value;
  return `${percent.toFixed(decimals)}%`;
};
