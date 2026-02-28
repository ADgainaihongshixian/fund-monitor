/**
 * 为axios实例添加通用的请求拦截器和响应拦截器
 * @param client - axios实例
 * @returns 响应数据(可以直接使用，不再需要再解析一层data)
 */
export const requestInterceptor = (client: any) => {
    client.interceptors.request.use(
        (config: any) => {
            // 可以在这里添加认证信息等
            return config;
        },
        (error: any) => {
            return Promise.reject(error);
        }
    );

    client.interceptors.response.use(
        (response: any) => {
            return response.data;
        },
        (error: any) => {
            return Promise.reject(error);
        }
    );
};