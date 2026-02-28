import axios from 'axios';

/**
 * 创建一个配置好的axios实例
 * @param baseURL - API基础URL
 * @param timeout - 请求超时时间（毫秒），默认10s
 * @param headers - 自定义请求头，默认包含'Content-Type': 'text/plain', 'Accept': '*
 * @returns 一个配置好的axios实例
 */
export const createApiClient = ({
    baseURL,
    timeout = 10000,
    contentType,
    accept = '*/*',
}: {
    baseURL: string,
    timeout?: number,
    contentType?: string,
    accept?: string,
}) => {
    let headers = {};
    if (contentType) {
        (headers as any)['Content-Type'] = contentType;
    }
    if (accept) {
        (headers as any)['Accept'] = accept;
    }
    return axios.create({
        baseURL,
        timeout,
        headers
    })
};