/**
 * 缓存工具
 * 提供基于内存的键值缓存能力，支持过期时间控制。
 * 适用于基金数据、搜索结果、历史数据等高频访问但更新频率较低的数据场景。
 */

// 缓存项类型
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

// 缓存类
class Cache<T> {
  private cache: Map<string, CacheItem<T>> = new Map();
  private defaultExpiry: number;

  constructor(defaultExpiry: number = 5 * 60 * 1000) { // 默认5分钟
    this.defaultExpiry = defaultExpiry;
  }

  // 设置缓存
  set(key: string, data: T, expiry: number = this.defaultExpiry): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry,
    });
  }

  // 获取缓存
  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // 删除缓存
  delete(key: string): void {
    this.cache.delete(key);
  }

  // 清空缓存
  clear(): void {
    this.cache.clear();
  }

  // 检查缓存是否存在且有效
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

// 创建缓存实例
export const fundDataCache = new Cache<any>(5 * 60 * 1000); // 基金数据缓存5分钟
export const searchCache = new Cache<any>(30 * 60 * 1000); // 搜索结果缓存30分钟
export const historyCache = new Cache<any>(60 * 60 * 1000); // 历史数据缓存1小时

// 缓存键生成函数
export const generateCacheKey = (prefix: string, ...args: any[]): string => {
  return `${prefix}:${args.map(arg => JSON.stringify(arg)).join(':')}`;
};