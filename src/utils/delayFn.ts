/**
 * 延迟执行函数
 * @param ms 延迟时间（毫秒）
 * @returns Promise<void>
 */
export const delayFn = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));