/**
 * 处理 API 错误
 * @param error - 从 Axios 或其他 HTTP 客户端库返回的错误对象
 * @returns 错误信息字符串
 */

export const handleApiError = (error: any): string => {
    if (error.response) {
        // 服务器返回错误状态码
        switch (error.response.status) {
            case 400:
                return '请求参数错误';
            case 401:
                return '未授权访问';
            case 403:
                return '访问被拒绝';
            case 404:
                return '请求的资源不存在';
            case 500:
                return '服务器内部错误';
            case 502:
                return '网关错误';
            case 503:
                return '服务暂时不可用';
            case 504:
                return '请求超时';
            default:
                return `服务器返回错误 (${error.response.status})`;
        }
    } else if (error.request) {
        // 请求已发送但没有收到响应
        return '网络连接失败，请检查网络设置';
    } else if (error.code === 'ECONNABORTED') {
        // 请求超时
        return '请求超时，请稍后重试';
    } else if (error.code === 'ENOTFOUND') {
        // 域名解析失败
        return '无法连接到服务器，请检查网络连接';
    } else {
        // 其他错误
        return error.message || '请求失败，请稍后重试';
    }
};